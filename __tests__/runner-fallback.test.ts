import * as fs from 'fs';
import * as path from 'path';

const yaml = require('js-yaml');

const action = yaml.load(fs.readFileSync(path.join(__dirname, '..', 'action.yml'), 'utf8')) as {
  inputs: Record<string, unknown>;
  runs: { using: string; steps: Array<Record<string, any>> };
};
const step = (name: string) => {
  const found = action.runs.steps.find(item => item.name === name);
  if (!found) throw new Error('missing step: ' + name);
  return found;
};

describe('Docker-less Linux runners (#321)', () => {
  test('never schedules a Docker image that the runner might pre-pull', () => {
    expect(action.runs.using).toBe('composite');
    expect(action.runs.steps.some(item => String(item.uses ?? '').startsWith('docker://'))).toBe(false);
    expect(action.runs.steps.some(item => item.name === 'Detect Docker support')).toBe(false);
  });

  test('uses the same native Node/npm path on every OS without runner conditions', () => {
    for (const name of ['Save current Node version', 'Setup node', 'Install Sentry CLI v2', 'Run Release Action']) {
      expect(step(name).if).toBeUndefined();
    }
    expect(step('Setup node').with['node-version']).toBe('24.14.1');
    expect(step('Install Sentry CLI v2').run).toContain('@sentry/cli@^2.58.6');
    expect(step('Run Release Action')).toMatchObject({ run: 'npm run start', shell: 'bash' });
  });

  test('still honors safe-directory opt-out and restores Node only when saved', () => {
    expect(step('Mark GitHub workspace a safe directory in git').if).toBe(
      "${{ inputs.disable_safe_directory != 'true' }}"
    );
    expect(step('Restore original Node version').if).toBe("steps.node_version.outputs.NODE_VERSION != ''");
    expect(step('Restore original Node version').with['node-version']).toBe(
      '${{ steps.node_version.outputs.NODE_VERSION }}'
    );
  });

  test('forwards every documented action input to the native release entrypoint', () => {
    const expected = Object.keys(action.inputs)
      .map(key => 'INPUT_' + key.toUpperCase())
      .sort();
    expect(Object.keys(step('Run Release Action').env).sort()).toEqual(expected);
  });
});
