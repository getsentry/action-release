import * as ciOptions from './options';
import * as Sentry from '@sentry/node';
import packageJson from '../package.json';

const SENTRY_SAAS_HOSTNAME = 'sentry.io';

/**
 * Initializes Sentry and wraps the given callback
 * in a span.
 */
export async function withTelemetry<F>(options: { enabled: boolean }, callback: () => F | Promise<F>): Promise<F> {
  Sentry.initWithoutDefaultIntegrations({
    dsn: 'https://2172f0c14072ba401de59317df8ded93@o1.ingest.us.sentry.io/4508608809533441',
    enabled: options.enabled,
    environment: `production-sentry-github-action`,
    tracesSampleRate: 1,
    sampleRate: 1,
    release: packageJson.version,
    integrations: [Sentry.httpIntegration()],
    tracePropagationTargets: ['sentry.io/api'],
  });

  const session = Sentry.startSession();

  const org = process.env['SENTRY_ORG'];

  Sentry.setUser({ id: org });
  Sentry.setTag('organization', org);
  Sentry.setTag('node', process.version);
  Sentry.setTag('platform', process.platform);

  try {
    return await Sentry.startSpan(
      {
        name: 'sentry-github-action-execution',
        op: 'action.flow',
      },
      async () => {
        updateProgress('start');
        const res = await callback();
        updateProgress('finished');

        return res;
      }
    );
  } catch (e) {
    session.status = 'crashed';
    Sentry.captureException('Error during sentry-github-action execution.');
    throw e;
  } finally {
    Sentry.endSession();
    await safeFlush();
  }
}

/**
 * Sets the `progress` tag to a given step.
 */
export function updateProgress(step: string): void {
  Sentry.setTag('progress', step);
}

/**
 * Wraps the given callback in a span.
 */
export function traceStep<T>(step: string, callback: () => T): T {
  updateProgress(step);
  return Sentry.startSpan({ name: step, op: 'action.step' }, () => callback());
}

/**
 * Flushing can fail, we never want to crash because of telemetry.
 */
export async function safeFlush(): Promise<void> {
  try {
    await Sentry.flush(3000);
  } catch {
    // Noop when flushing fails.
    // We don't even need to log anything because there's likely nothing the user can do and they likely will not care.
  }
}

/**
 * Check whether the user is self-hosting Sentry.
 */
export function isSelfHosted(): boolean {
  const url = new URL(process.env['SENTRY_URL'] || `https://${SENTRY_SAAS_HOSTNAME}`);

  return url.hostname !== SENTRY_SAAS_HOSTNAME;
}

/**
 * Determine if telemetry should be enabled.
 */
export function isTelemetryEnabled(): boolean {
  return !ciOptions.getBooleanOption('disable_telemetry', false) && !isSelfHosted();
}
