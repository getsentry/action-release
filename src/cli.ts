import { getTraceData } from '@sentry/node';
import SentryCli from '@sentry/cli';
// @ts-ignore
import { version } from '../package.json';

/**
 * CLI Singleton
 *
 * When the `MOCK` environment variable is set, stub out network calls.
 */
export const getCLI = (): SentryCli['releases'] => {
  // Set the User-Agent string.
  process.env['SENTRY_PIPELINE'] = `github-action-release/${version}`;

  const cli = new SentryCli(null, {
    headers: {
      // Propagate sentry trace if we have one
      ...getTraceData(),
    },
  }).releases;

  if (process.env['MOCK']) {
    cli.execute = async (
      args: string[],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      live: boolean
    ): Promise<string> => {
      return Promise.resolve(args.join(' '));
    };
  }

  return cli;
};
