import * as core from '@actions/core';
import * as Sentry from '@sentry/node';

import {getCLI} from './cli';
import * as options from './options';
import * as process from 'process';

Sentry.init({
  dsn: 'https://156a0eddcf407521a39833be862fc0e6@o1.ingest.sentry.io/4506112609943552',
  // Performance Monitoring
  tracesSampleRate: 1.0,
});

(async () => {
  try {
    const cli = getCLI();

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
    await cli.new(version, {projects});

    const currentWorkingDirectory = process.cwd();
    if (workingDirectory !== null && workingDirectory.length > 0) {
      process.chdir(workingDirectory);
    }

    if (setCommitsOption !== 'skip') {
      core.debug(`Setting commits with option '${setCommitsOption}'`);
      await cli.setCommits(version, {
        auto: true,
        ignoreMissing,
        ignoreEmpty,
      });
    }

    if (sourcemaps.length) {
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
          return cli.uploadSourceMaps(version, sourceMapOptions);
        })
      );
    }

    if (environment) {
      core.debug(`Adding deploy to release`);
      await cli.newDeploy(version, {
        env: environment,
        ...(deployStartedAtOption && {started: deployStartedAtOption}),
      });
    }

    core.debug(`Finalizing the release`);
    if (shouldFinalize) {
      await cli.finalize(version);
    }

    if (workingDirectory !== null && workingDirectory.length > 0) {
      process.chdir(currentWorkingDirectory);
    }

    core.debug(`Done`);
    core.setOutput('version', version);
  } catch (error) {
    core.setFailed((error as Error).message);
    Sentry.captureException(error);
  }
})();
