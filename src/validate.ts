import * as core from '@actions/core';
import {getCLI} from './cli';

/**
 * Get the release version string from parameter or propose one.
 * @throws
 * @returns Promise<string>
 */
export const getVersion = async (): Promise<string> => {
  const versionOption: string = core.getInput('version');
  if (versionOption) {
    // If the users passes in `${{github.ref}}, then it will have an unwanted prefix.
    return versionOption.replace(/^(refs\/tags\/)/, '');
  }

  core.debug('Version not provided, proposing one...');
  return getCLI().proposeVersion();
};

/**
 * Get `environment`, a required parameter.
 * @throws
 * @returns string
 */
export const getEnvironment = (): string => {
  return core.getInput('environment', {required: true});
};

/**
 * Optionally get a UNIX timestamp of when the deployment started.
 * Input timestamp may also be ISO 8601.
 *
 * @throws
 * @returns number
 */
export const getStartedAt = (): number | null => {
  const startedAtOption: string = core.getInput('started_at');
  if (!startedAtOption) {
    return null;
  }

  // In sentry-cli, we parse integer first.
  const startedAtTimestamp = parseInt(startedAtOption);
  const startedAt8601 = Math.floor(Date.parse(startedAtOption) / 1000);

  let outputTimestamp;
  if (!isNaN(startedAtTimestamp)) {
    outputTimestamp = startedAtTimestamp;
  } else if (!isNaN(startedAt8601)) {
    outputTimestamp = startedAt8601;
  }

  if (!outputTimestamp || outputTimestamp < 0) {
    throw new Error(
      'started_at not in valid format. Unix timestamp or ISO 8601 date expected'
    );
  }

  return outputTimestamp;
};

/**
 * Source maps are optional, but there may be several as a space-separated list.
 * @returns string[]
 */
export const getSourcemaps = (): string[] => {
  const sourcemapsOption: string = core.getInput('sourcemaps');
  if (!sourcemapsOption) {
    return [];
  }

  return sourcemapsOption.split(' ');
};

/**
 * Find out from input if we should finalize the release.
 * @returns boolean
 */
export const getShouldFinalize = (): boolean => {
  const finalizeOption = core.getInput('finalize');
  if (!finalizeOption) {
    return true;
  }

  const finalize = finalizeOption.trim().toLowerCase();
  switch (finalize) {
    case 'true':
    case '1':
      return true;

    case 'false':
    case '0':
      return false;
  }

  throw Error('finalize is not a boolean');
};

/**
 * Check for required environment variables.
 */
export const checkEnvironmentVariables = (): void => {
  if (!process.env['SENTRY_ORG']) {
    throw Error(
      'Environment variable SENTRY_ORG is missing an organization slug'
    );
  }
  if (!process.env['SENTRY_PROJECT']) {
    throw Error(
      'Environment variable SENTRY_PROJECT is missing a project slug'
    );
  }
  if (!process.env['SENTRY_AUTH_TOKEN']) {
    throw Error(
      'Environment variable SENTRY_AUTH_TOKEN is missing an auth token'
    );
  }
};
