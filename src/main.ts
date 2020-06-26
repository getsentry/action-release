import * as core from '@actions/core';
import {getCLI} from './cli';
import * as validate from './validate';

(async () => {
  try {
    // Validate parameters first so we can fail early.
    validate.checkEnvironmentVariables();
    const environment = validate.getEnvironment();
    const sourcemaps = validate.getSourcemaps();
    const shouldFinalize = validate.getShouldFinalize();
    const deployStartedAtOption = validate.getStartedAt();

    const version = await validate.getVersion();

    core.debug(`Version is ${version}`);
    await getCLI().new(version);

    core.debug(`Setting commits`);
    await getCLI().setCommits(version, {auto: true});

    if (sourcemaps) {
      core.debug(`Adding sourcemaps`);
      await getCLI().uploadSourceMaps(version, {include: sourcemaps});
    }

    core.debug(`Adding deploy to release`);
    await getCLI().newDeploy(version, {
      env: environment,
      started: deployStartedAtOption,
    });

    core.debug(`Finalizing the release`);
    if (shouldFinalize) {
      await getCLI().finalize(version);
    }

    core.debug(`Done`);
    core.setOutput('version', version);
  } catch (error) {
    core.setFailed(error.message);
  }
})();
