import * as core from '@actions/core';
import {getCLI} from './cli';

/**
 * Get the release version string from parameter or propose one.
 * @throws
 * @returns Promise<string>
 */
export const getVersion = async (): Promise<string> => {
  const versionOption: string = core.getInput('version');
  const versionPrefixOption: string = core.getInput('version_prefix');
  let version = '';
  if (versionOption) {
    // If the users passes in `${{github.ref}}, then it will have an unwanted prefix.
    version = versionOption.replace(/^(refs\/tags\/)/, '');
  } else {
    core.debug('Version not provided, proposing one...');
    version = await getCLI().proposeVersion();
  }

  if (versionPrefixOption) {
    version = `${versionPrefixOption}${version}`;
  }

  return version;
};

/**
 * Get `environment`, a required parameter.
 * @throws
 * @returns string
 */
export const getEnvironment = (): string => {
  return core.getInput('environment');
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
  const isStartedAtAnInteger = /^-?[\d]+$/.test(startedAtOption);
  const startedAtTimestamp = parseInt(startedAtOption);
  const startedAt8601 = Math.floor(Date.parse(startedAtOption) / 1000);

  let outputTimestamp;
  if (isStartedAtAnInteger && !isNaN(startedAtTimestamp)) {
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
 * Dist is optional, but should be a string when provided.
 * @returns string
 */
export const getDist = (): string | undefined => {
  const distOption: string = core.getInput('dist');
  if (!distOption) {
    return undefined;
  }

  return distOption;
};

/**
 * Fetch boolean option from input. Throws error if option value is not a boolean.
 * @param input string
 * @param defaultValue boolean
 * @returns boolean
 */
export const getBooleanOption = (
  input: string,
  defaultValue: boolean
): boolean => {
  const option = core.getInput(input);
  if (!option) {
    return defaultValue;
  }

  const value = option.trim().toLowerCase();
  switch (value) {
    case 'true':
    case '1':
      return true;

    case 'false':
    case '0':
      return false;
  }

  throw Error(`${input} is not a boolean`);
};

export const getSetCommitsOption = (): 'auto' | 'skip' => {
  let setCommitOption = core.getInput('set_commits');
  // default to auto
  if (!setCommitOption) {
    return 'auto';
  }
  // convert to lower case
  setCommitOption = setCommitOption.toLowerCase();
  switch (setCommitOption) {
    case 'auto':
      return 'auto';
    case 'skip':
      return 'skip';
    default:
      throw Error('set_commits must be "auto" or "skip"');
  }
};

/**
 * Check for required environment variables.
 */
export const checkEnvironmentVariables = (): void => {
  if (process.env['MOCK']) {
    // Set environment variables for mock runs if they aren't already
    for (const variable of [
      'SENTRY_AUTH_TOKEN',
      'SENTRY_ORG',
      'SENTRY_PROJECT',
    ]) {
      if (!(variable in process.env)) {
        process.env[variable] = variable;
      }
    }
  }

  if (!process.env['SENTRY_ORG']) {
    throw Error(
      'Environment variable SENTRY_ORG is missing an organization slug'
    );
  }
  if (!process.env['SENTRY_AUTH_TOKEN']) {
    throw Error(
      'Environment variable SENTRY_AUTH_TOKEN is missing an auth token'
    );
  }
};

export const getProjects = (): string[] => {
  const projectsOption = core.getInput('projects') || '';
  const projects = projectsOption
    .split(' ')
    .map(proj => proj.trim())
    .filter(proj => !!proj);
  if (projects.length > 0) {
    return projects;
  }
  const project = process.env['SENTRY_PROJECT'];
  if (!project) {
    throw Error(
      'Environment variable SENTRY_PROJECT is missing a project slug and no projects are specified with the "projects" option'
    );
  }
  return [project];
};

export const getUrlPrefixOption = (): string => {
  return core.getInput('url_prefix');
};

export const getWorkingDirectory = (): string => {
  return core.getInput('working_directory');
};
