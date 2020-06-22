import * as cp from 'child_process';
import * as path from 'path';
import * as process from 'process';
import {getShouldFinalize} from '../src/validate';

describe('validate', () => {
  describe('getShouldFinalize', () => {
    afterEach(() => {
      delete process.env['INPUT_SKIP_FINALIZE'];
    });

    test('should throw an error when skip_finalize is invalid', async () => {
      process.env['INPUT_SKIP_FINALIZE'] = 'error';
      expect(() => getShouldFinalize()).toThrow(
        'skip_finalize is not a boolean'
      );
    });

    test('should return true when skip_finalize is omitted', async () => {
      expect(getShouldFinalize()).toBe(true);
    });

    test('should return false when skip_finalize is true', () => {
      process.env['INPUT_SKIP_FINALIZE'] = 'true';
      expect(getShouldFinalize()).toBe(false);
    });
  });
});

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_ENVIRONMENT'] = 'production';
  process.env['MOCK'] = 'true';
  const ip = path.join(__dirname, '..', 'lib', 'main.js');
  const options: cp.ExecSyncOptions = {
    env: process.env,
  };
  console.log(cp.spawnSync('node', [ip], options).toString());
});
