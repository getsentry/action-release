import * as fs from 'fs';
import * as os from 'os';
import { spawnSync } from 'child_process';
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

describe('CI image publishing tag is independent of runner execution', () => {
  const repo = path.join(__dirname, '..');
  const ciMarker = '# ci-docker-image: ghcr.io/getsentry/action-release-image:';

  test('workflow consumes a CI-only tag without scheduling a container action', () => {
    const metadata = fs.readFileSync(path.join(repo, 'action.yml'), 'utf8');
    const workflow = fs.readFileSync(path.join(repo, '.github/workflows/build.yml'), 'utf8');
    expect(
      metadata.match(/^# ci-docker-image: ghcr.io\/getsentry\/action-release-image:([a-zA-Z0-9][a-zA-Z0-9_.-]*)$/gm)
    ).toHaveLength(1);
    expect(workflow).toContain('TAG=$(sed -nE');
    expect(workflow).toContain('# ci-docker-image: ghcr.io/getsentry/action-release-image:');
    expect(workflow).toContain('Missing or invalid CI Docker image tag');
    expect(workflow).toContain('docker_tag=$TAG');
    expect(action.runs.steps.some(item => String(item.uses ?? '').startsWith('docker://'))).toBe(false);
  });

  test('release script rewrites CI marker, rejects invalid input and missing marker', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sentry-ci-tag-'));
    try {
      const scriptsDir = path.join(dir, 'scripts');
      fs.mkdirSync(scriptsDir);
      const script = path.join(scriptsDir, 'set-docker-tag.sh');
      const metadata = path.join(dir, 'action.yml');
      fs.copyFileSync(path.join(repo, 'scripts/set-docker-tag.sh'), script);
      fs.copyFileSync(path.join(repo, 'action.yml'), metadata);

      const run = (tag: string) => spawnSync('bash', [script, tag], { encoding: 'utf8' });
      expect(run('3.7.2').status).toBe(0);
      expect(fs.readFileSync(metadata, 'utf8')).toContain(ciMarker + '3.7.2');
      expect(run('../invalid').status).not.toBe(0);

      fs.writeFileSync(metadata, fs.readFileSync(metadata, 'utf8').replace(/^# ci-docker-image:.*\n/m, ''));
      expect(run('3.7.3').status).not.toBe(0);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
