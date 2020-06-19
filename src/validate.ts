import * as core from '@actions/core';
import {getCLI} from './cli';

/**
 * Get the release version string from parameter or propose one.
 * @throws
 * @returns Promise<string>
 */
export const getVersion = async (): Promise<string> => {
  let version: string;

  const versionOption: string = core.getInput('version');
  if (versionOption) {
    version = versionOption;
  } else {
    core.debug('Version not provided, proposing one...');
    version = await getCLI().proposeVersion();
  }

  core.debug(`Version is ${version}`);
  return version;
};

/**
 * Environment is required.
 * @throws
 * @returns string
 */
export const getEnvironment = (): string => {
  return core.getInput('environment', {required: true});
};

/**
 * TODO I don't want to duplicate logic here. How should I validate the timestamp?
 * TODO must be a UNIX timestamp
 * TODO what if this is in the future?
 * TODO FIRST it could also be a datetime.
 * @throws
 * @returns string
 */
export const getStartedAt = (): number | undefined => {
  const startedAtOption: string = core.getInput('started_at');
  if (!startedAtOption) {
    return undefined;
  }

  const startedAt = parseInt(startedAtOption);
  if (isNaN(startedAt)) {
    throw new Error('started_at is not a number');
  }
  return startedAt;
};

/**
 * TODO EXPLAIN FORMAT IN THE README
 * TODO handle failure
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
 * TODO
 * @returns boolean
 */
export const getShouldFinalize = (): boolean => {
  const skipFinalizeOption = core.getInput('skip_finalize');
  if (!skipFinalizeOption) {
    return true;
  }

  const skipFinalize = skipFinalizeOption.trim().toLowerCase();
  switch (skipFinalize) {
    case 'true':
    case '1':
      return false;

    case 'false':
    case '0':
      return true;
  }

  throw Error('skip_finalize is not a boolean');
};

/**
 * TODO should I check for these environment variables or let the CLI break when
 * they're missing?
 */
export const checkEnvironmentVariables = (): void => {
  process.env['SENTRY_ORG'];
  process.env['SENTRY_PROJECT'];
  process.env['SENTRY_AUTH_TOKEN'];
};
