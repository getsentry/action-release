import SentryCli, {Releases} from '@sentry/cli';

/**
 * CLI Singleton
 *
 * When the `MOCK` environment variable is set, stub out network calls.
 */
let cli: Releases;
export const getCLI = (): Releases => {
  if (!cli) {
    cli = new SentryCli().releases;
    if (process.env['MOCK']) {
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
