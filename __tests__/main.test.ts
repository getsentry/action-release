import {execSync} from 'child_process';
import * as path from 'path';
import * as process from 'process';
import {getShouldFinalize} from '../src/validate';

describe('validate', () => {
  describe('getShouldFinalize', () => {
    afterEach(() => {
      delete process.env['INPUT_FINALIZE'];
    });

    test('should throw an error when finalize is invalid', async () => {
      process.env['INPUT_FINALIZE'] = 'error';
      expect(() => getShouldFinalize()).toThrow(
        'finalize is not a boolean'
      );
    });

    test('should return true when finalize is omitted', async () => {
      expect(getShouldFinalize()).toBe(true);
    });

    test('should return false when finalize is false', () => {
      process.env['INPUT_FINALIZE'] = 'false';
      expect(getShouldFinalize()).toBe(false);
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
