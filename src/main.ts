import * as core from '@actions/core';
import {getCLI} from './cli';
import * as options from './options';
import * as process from 'process';
import {isTelemetryEnabled, traceStep, withTelemetry} from './telemetry';

withTelemetry(
  {
    enabled: isTelemetryEnabled(),
  },
  async () => {
    try {
      // Validate options first so we can fail early.
      options.checkEnvironmentVariables();

      const environment = options.getEnvironment();
      const sourcemaps = options.getSourcemaps();
      const dist = options.getDist();
      const shouldFinalize = options.getBooleanOption('finalize', true);
      const ignoreMissing = options.getBooleanOption('ignore_missing', false);
      const ignoreEmpty = options.getBooleanOption('ignore_empty', false);
      const deployStartedAtOption = options.getStartedAt();
      const setCommitsOption = options.getSetCommitsOption();
      const projects = options.getProjects();
      const urlPrefix = options.getUrlPrefixOption();
      const stripCommonPrefix = options.getBooleanOption(
        'strip_common_prefix',
        false
      );
      const version = await options.getVersion();
      const workingDirectory = options.getWorkingDirectory();

      core.debug(`Version is ${version}`);
      await getCLI().new(version, {projects});

      const currentWorkingDirectory = process.cwd();
      if (workingDirectory !== null && workingDirectory.length > 0) {
        process.chdir(workingDirectory);
      }

      if (setCommitsOption !== 'skip') {
        await traceStep('set-commits', async () => {
          core.debug(`Setting commits with option '${setCommitsOption}'`);
          await getCLI().setCommits(version, {
            auto: true,
            ignoreMissing,
            ignoreEmpty,
          });
        });
      }

      if (sourcemaps.length) {
        await traceStep('upload-sourcemaps', async () => {
          core.debug(`Adding sourcemaps`);
          await Promise.all(
            projects.map(async project => {
              // upload source maps can only do one project at a time
              const localProjects: [string] = [project];
              const sourceMapOptions = {
                include: sourcemaps,
                projects: localProjects,
                dist,
                urlPrefix,
                stripCommonPrefix,
              };
              return getCLI().uploadSourceMaps(version, sourceMapOptions);
            })
          );
        });
      }

      if (environment) {
        await traceStep('add-environment', async () => {
          core.debug(`Adding deploy to release`);
          await getCLI().newDeploy(version, {
            env: environment,
            ...(deployStartedAtOption && {started: deployStartedAtOption}),
          });
        });
      }

      if (shouldFinalize) {
        await traceStep('finalizing-release', async () => {
          core.debug(`Finalizing the release`);
          await getCLI().finalize(version);
        });
      }

      if (workingDirectory !== null && workingDirectory.length > 0) {
        process.chdir(currentWorkingDirectory);
      }

      core.debug(`Done`);
      core.setOutput('version', version);
    } catch (error) {
      core.setFailed((error as Error).message);
      throw error;
    }
  }
);
