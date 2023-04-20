// eslint-disable-next-line @typescript-eslint/no-unused-vars
import SentryCli, {SentryCliReleases} from '@sentry/cli';
// @ts-ignore
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
      // Set environment variables if they aren't already
      for (const variable of [
        'SENTRY_AUTH_TOKEN',
        'SENTRY_ORG',
        'SENTRY_PROJECT',
      ])
        !(variable in process.env) && (process.env[variable] = variable);

      cli.execute = async (
        args: string[],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        live: boolean
      ): Promise<string> => {
        return Promise.resolve(args.join(' '));
      };
    }
  }
  return cli;
};
