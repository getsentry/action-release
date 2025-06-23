import * as core from '@actions/core';
import path from 'path';
import { getCLI } from './cli';

/**
 * Get the release version string from parameter or propose one.
 * @throws
 * @returns Promise<string>
 */
export const getRelease = async (): Promise<string> => {
  // TODO(v4): Remove `version` and `version_prefix`, they were deprecated in v3
  const releaseOption: string = core.getInput('release');
  const versionOption: string = core.getInput('version');
  const releasePrefixOption: string = core.getInput('release_prefix');
  const versionPrefixOption: string = core.getInput('version_prefix');

  let release = '';
  if (releaseOption || versionOption) {
    // Prefer `release` over the deprecated `version`
    release = releaseOption ? releaseOption : versionOption;
    // If users pass `${{ github.ref }}, strip the unwanted `refs/tags` prefix
    release = release.replace(/^(refs\/tags\/)/, '');
  } else {
    core.debug('Release version not provided, proposing one...');
    release = await getCLI().proposeVersion();
  }

  if (releasePrefixOption) {
    release = `${releasePrefixOption}${release}`;
  } else if (versionPrefixOption) {
    release = `${versionPrefixOption}${release}`;
  }

  return release;
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
    throw new Error('started_at not in valid format. Unix timestamp or ISO 8601 date expected');
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
export const getBooleanOption = (input: string, defaultValue: boolean): boolean => {
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

export const getSetCommitsOption = (): 'auto' | 'skip' | 'manual' => {
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
    case 'manual':
      return 'manual';
    case 'skip':
      return 'skip';
    default:
      throw Error('set_commits must be "auto" or "skip" or "manual"');
  }
};

export const getCommitRange = (): Map<string, string> => {
  const commitRange = core.getInput('commit_range');

  // Split the input by a common comma delimiter
  const [repo, currentCommit, previousCommit] = commitRange.split(',');

  // Create a map and update with the provided values
  const commitRangeDetails = new Map();
  commitRangeDetails.set('repo', repo.trim());
  commitRangeDetails.set('currentCommit', currentCommit.trim());
  commitRangeDetails.set('previousCommit', previousCommit.trim());

  return commitRangeDetails;
};

/**
 * Check for required environment variables.
 */
export const checkEnvironmentVariables = (): void => {
  if (process.env['MOCK']) {
    // Set environment variables for mock runs if they aren't already
    for (const variable of ['SENTRY_AUTH_TOKEN', 'SENTRY_ORG', 'SENTRY_PROJECT']) {
      if (!(variable in process.env)) {
        process.env[variable] = variable;
      }
    }
  }

  if (!process.env['SENTRY_ORG']) {
    throw Error('Environment variable SENTRY_ORG is missing an organization slug');
  }
  if (!process.env['SENTRY_AUTH_TOKEN']) {
    throw Error('Environment variable SENTRY_AUTH_TOKEN is missing an auth token');
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
  // The action runs inside `github.action_path` and as such
  // doesn't automatically have access to the user's git
  // We prefix all paths with `GITHUB_WORKSPACE` which is at the top of the repo.
  return path.join(process.env.GITHUB_WORKSPACE || '', core.getInput('working_directory'));
};
