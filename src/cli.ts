import SentryCli, {Releases} from '@sentry/cli';

/** CLI Singleton */
let cli: Releases;
export const getCLI = (): Releases => {
  if (!cli) {
    cli = new SentryCli().releases;
  }
  return cli;
};
