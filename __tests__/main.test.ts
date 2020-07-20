import {execSync} from 'child_process';
import * as path from 'path';
import * as process from 'process';
import {
  getShouldFinalize,
  getSourcemaps,
  getStartedAt,
  getVersion,
} from '../src/validate'

describe('validate', () => {
  describe('getShouldFinalize', () => {
    const errorMessage = 'finalize is not a boolean';
    afterEach(() => {
      delete process.env['INPUT_FINALIZE'];
    });

    test('should throw an error when finalize is invalid', async () => {
      process.env['INPUT_FINALIZE'] = 'error';
      expect(() => getShouldFinalize()).toThrow(errorMessage);
    });

    test('should return true when finalize is omitted', async () => {
      expect(getShouldFinalize()).toBe(true);
    });

    test('should return false when finalize is false', () => {
      process.env['INPUT_FINALIZE'] = 'false';
      expect(getShouldFinalize()).toBe(false);
    });
  });

  describe('getSourcemaps', () => {
    afterEach(() => {
      delete process.env['INPUT_SOURCEMAPS'];
    });

    test('should return empty list when sourcemaps is omitted', async () => {
      expect(getSourcemaps()).toEqual([]);
    });

    test('should return array when sourcemaps is false', () => {
      process.env['INPUT_SOURCEMAPS'] = './lib';
      expect(getSourcemaps()).toEqual(['./lib']);
    });
  });

  describe('getStartedAt', () => {
    const errorMessage = 'started_at not in valid format. Unix timestamp or ISO 8601 date expected';
    afterEach(() => {
      delete process.env['INPUT_STARTED_AT'];
    });

    test('should throw an error when started_at is negative', async () => {
      process.env['INPUT_STARTED_AT'] = '-1';
      expect(() => getStartedAt()).toThrow(errorMessage);
    });

    test('should throw an error when started_at is invalid', async () => {
      process.env['INPUT_STARTED_AT'] = 'error';
      expect(() => getStartedAt()).toThrow(errorMessage);
    });

    test('should return null when started_at is omitted', async () => {
      expect(getStartedAt()).toBeNull();
    });

    test('should return an integer when started_at is an ISO8601 string.', async () => {
      process.env['INPUT_STARTED_AT'] = '2017-07-13T19:40:00';
      expect(getStartedAt()).toEqual(1500000000);
    });

    test('should return an integer when started_at is an truncated ISO8601 string.', async () => {
      process.env['INPUT_STARTED_AT'] = '2017-07-13';
      expect(getStartedAt()).toEqual(1499904000);
    });

    test('should return an integer when started_at is an integer.', async () => {
      process.env['INPUT_STARTED_AT'] = '1500000000';
      expect(getStartedAt()).toEqual(1500000000);
    });
  });

  describe('getVersion', () => {
    afterEach(() => {
      delete process.env['INPUT_VERSION'];
    });

    test('should strip refs from version', async () => {
      process.env['INPUT_VERSION'] = 'refs/tags/v1.0.0';
      expect(getVersion()).toBe('v1.0.0')
    });

    test('should get version from inputs', async () => {
      process.env['INPUT_VERSION'] = 'v1.0.0';
      expect(getVersion()).toBe('v1.0.0')
    });

    test('should propose-version when version is omitted', async () => {
      expect(getVersion()).toBe('propose-version')
    });
  });
});

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  const output = execSync(
    `node ${path.join(__dirname, '..', 'dist', 'index.js')}`,
    {
      env: {
        ...process.env,
        INPUT_ENVIRONMENT: 'production',
        MOCK: 'true',
        SENTRY_AUTH_TOKEN: 'test_token',
        SENTRY_ORG: 'test_org',
        SENTRY_PROJECT: 'test_project',
      },
    }
  );

  console.log(output.toString());
});
