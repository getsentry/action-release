import * as core from '@actions/core';
import {getCLI} from './cli';
import * as validate from './validate';

(async () => {
  try {
    const cli = getCLI();

    // Validate parameters first so we can fail early.
    validate.checkEnvironmentVariables();
    const environment = validate.getEnvironment();
    const sourcemaps = validate.getSourcemaps();
    const shouldFinalize = validate.getShouldFinalize();
    const deployStartedAtOption = validate.getStartedAt();

    const version = await validate.getVersion();

    core.debug(`Version is ${version}`);
    await cli.new(version);

    core.debug(`Setting commits`);
    await cli.setCommits(version, {auto: true});

    if (sourcemaps) {
      core.debug(`Adding sourcemaps`);
      await cli.uploadSourceMaps(version, {include: sourcemaps});
    }

    core.debug(`Adding deploy to release`);
    await cli.newDeploy(version, {
      env: environment,
      ...(deployStartedAtOption && {started: deployStartedAtOption}),
    });

    if (shouldFinalize) {
      core.debug(`Finalizing the release`);
      await cli.finalize(version);
    }

    core.debug(`Done`);
    core.setOutput('version', version);
  } catch (error) {
    core.setFailed(error.message);
  }
})();
