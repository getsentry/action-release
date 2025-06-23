import * as Sentry from '@sentry/node';
import * as core from '@actions/core';
import { SentryCliUploadSourceMapsOptions } from '@sentry/cli';
import { getCLI } from './cli';
import * as options from './options';
import * as process from 'process';
import { isTelemetryEnabled, traceStep, withTelemetry } from './telemetry';

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
      const inject = options.getBooleanOption('inject', true);
      const sourcemaps = options.getSourcemaps();
      const dist = options.getDist();
      const shouldFinalize = options.getBooleanOption('finalize', true);
      const ignoreMissing = options.getBooleanOption('ignore_missing', false);
      const ignoreEmpty = options.getBooleanOption('ignore_empty', false);
      const deployStartedAtOption = options.getStartedAt();
      const setCommitsOption = options.getSetCommitsOption();
      const commitRange = options.getCommitRange();
      const projects = options.getProjects();
      const urlPrefix = options.getUrlPrefixOption();
      const stripCommonPrefix = options.getBooleanOption('strip_common_prefix', false);
      const release = await options.getRelease();

      if (projects.length === 1) {
        Sentry.setTag('project', projects[0]);
      } else {
        Sentry.setTag('projects', projects.join(','));
      }

      core.debug(`Release version is ${release}`);
      await getCLI().new(release, { projects });

      Sentry.setTag('set-commits', setCommitsOption);

      if (setCommitsOption === 'manual') {
        await traceStep('set-commits', async () => {
          core.debug(`Setting commits with option '${setCommitsOption}'`);
          await getCLI().setCommits(release, {
            auto: false,
            repo: commitRange.get('repo'),
            commit: commitRange.get('currentCommit'),
            previousCommit: commitRange.get('previousCommit'),
          });
        });
      } else if (setCommitsOption !== 'skip') {
        await traceStep('set-commits', async () => {
          core.debug(`Setting commits with option '${setCommitsOption}'`);
          await getCLI().setCommits(release, {
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
            await getCLI().execute(['sourcemaps', 'inject', ...sourcemaps], true);
          });
        }

        await traceStep('upload-sourcemaps', async () => {
          core.debug(`Adding sourcemaps`);
          const sourceMapsOptions: SentryCliUploadSourceMapsOptions = {
            include: sourcemaps,
            dist,
            stripCommonPrefix,
          };

          // only set the urlPrefix if it's not empty
          if (urlPrefix) {
            sourceMapsOptions.urlPrefix = urlPrefix;
          }

          // sentry-cli supports multiple projects, but only uploads sourcemaps for the
          // first project so we need to upload sourcemaps for each project individually
          await Promise.all(
            projects.map(async (project: string) =>
              getCLI().uploadSourceMaps(release, {
                ...sourceMapsOptions,
                projects: [project],
              } as SentryCliUploadSourceMapsOptions & { projects: string[] })
            )
          );

          Sentry.setTag('sourcemaps-uploaded', true);
        });
      }

      if (environment) {
        await traceStep('add-environment', async () => {
          core.debug(`Adding deploy to release`);
          await getCLI().newDeploy(release, {
            env: environment,
            ...(deployStartedAtOption && { started: deployStartedAtOption }),
          });
        });
      }

      Sentry.setTag('finalize', shouldFinalize);

      if (shouldFinalize) {
        await traceStep('finalizing-release', async () => {
          core.debug(`Finalizing the release`);
          await getCLI().finalize(release);

          Sentry.setTag('finalized', true);
        });
      }

      if (workingDirectory) {
        process.chdir(currentWorkingDirectory);
      }

      core.debug(`Done`);
      // TODO(v4): Remove `version`
      core.setOutput('version', release);
      core.setOutput('release', release);
    } catch (error) {
      core.setFailed((error as Error).message);
      throw error;
    }
  }
);
