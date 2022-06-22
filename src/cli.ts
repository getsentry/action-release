import SentryCli, {SentryCliReleases} from '@sentry/cli';
import {version} from '../package.json';

/**
 * CLI Singleton
 *
 * When the `MOCK` environment variable is set, stub out network calls.
 */
let cli: SentryCliReleases;
export const getCLI = (): SentryCliReleases => {
  // Set the User-Agent string.
  process.env['SENTRY_PIPELINE'] = `github-action-release/${version}`;

  if (!cli) {
    cli = new SentryCli().releases;
    if (process.env['MOCK']) {
      process.env['SENTRY_ORG'] = `acme`;
      process.env['SENTRY_PROJECT'] = `project1`;
      process.env['SENTRY_AUTH_TOKEN'] = `abc123`;
      cli.execute = async (args: string[], live: boolean): Promise<string> => {
        return Promise.resolve(args.join(' '));
      };
    }
  }
  return cli;
};
