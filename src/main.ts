import * as Sentry from '@sentry/node';
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
      const workingDirectory = options.getWorkingDirectory();
      const currentWorkingDirectory = process.cwd();

      if (workingDirectory) {
        process.chdir(workingDirectory);
      }

      // Validate options first so we can fail early.
      options.checkEnvironmentVariables();

      const environment = options.getEnvironment();
      const inject = options.getBooleanOption('inject', false);
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

      if (projects.length === 1) {
        Sentry.setTag('project', projects[0]);
      } else {
        Sentry.setTag('projects', projects.join(','));
      }

      core.debug(`Version is ${version}`);
      await getCLI().new(version, {projects});

      Sentry.setTag('set-commits', setCommitsOption);

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

      Sentry.setTag('sourcemaps', sourcemaps.length > 0);
      Sentry.setTag('inject', inject);

      if (sourcemaps.length) {
        if (inject) {
          await traceStep('inject-debug-ids', async () => {
            core.debug(`Injecting Debug IDs`);
            // Unfortunately, @sentry/cli does not yet have an alias for inject
            await getCLI().execute(
              ['sourcemaps', 'inject', ...sourcemaps],
              true
            );
          });
        }

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

          Sentry.setTag('sourcemaps-uploaded', true);
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

      Sentry.setTag('finalize', shouldFinalize);

      if (shouldFinalize) {
        await traceStep('finalizing-release', async () => {
          core.debug(`Finalizing the release`);
          await getCLI().finalize(version);

          Sentry.setTag('finalized', true);
        });
      }

      if (workingDirectory) {
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
