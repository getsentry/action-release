import * as core from '@actions/core';
import {getCLI} from './cli';
import * as validate from './validate';
import {CommitsOptions} from './validate';

(async () => {
  try {
    const cli = getCLI();

    // Validate parameters first so we can fail early.
    validate.checkEnvironmentVariables();
    const environment = validate.getEnvironment();
    const sourcemaps = validate.getSourcemaps();
    const shouldFinalize = validate.getShouldFinalize();
    const deployStartedAtOption = validate.getStartedAt();
    const setCommitsOption = validate.getSetCommitsOption();
    const commitOptions = validate.getCommitOptions();
    const projects = validate.getProjects();
    const urlPrefix = validate.getUrlPrefixOption();

    const version = await validate.getVersion();

    core.debug(`Version is ${version}`);
    await cli.new(version, {projects});

    switch (setCommitsOption) {
      case CommitsOptions.auto: {
        core.debug(`Setting commits with option '${setCommitsOption}'`);
        await cli.setCommits(version, {auto: true});
        break;
      }
      case CommitsOptions.options: {
        core.debug(`Setting commits with option '${setCommitsOption}'`);
        await cli.setCommits(version, {auto: false, ...commitOptions});
        break;
      }
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
            urlPrefix,
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

    core.debug(`Done`);
    core.setOutput('version', version);
  } catch (error) {
    core.setFailed(error.message);
  }
})();
