import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { spawnSync } from 'child_process';

const yaml = require('js-yaml');

const action = yaml.load(fs.readFileSync(path.join(__dirname, '..', 'action.yml'), 'utf8')) as {
  runs: { using: string; steps: Array<Record<string, any>> };
};
const step = (name: string) => {
  const found = action.runs.steps.find(item => item.name === name);
  if (!found) throw new Error(`missing step: ${name}`);
  return found;
};
const fallback = "runner.os != 'Linux' || steps.docker.outputs.available != 'true'";

describe('Docker-less Linux runners (#321)', () => {
  test('probes Docker only on Linux and uses the image only when available', () => {
    expect(action.runs.using).toBe('composite');
    expect(step('Detect Docker support')).toMatchObject({ id: 'docker', if: "runner.os == 'Linux'", shell: 'bash' });
    expect(step('Run docker image').if).toBe("runner.os == 'Linux' && steps.docker.outputs.available == 'true'");
  });

  test('uses the same native fallback steps for Docker-less Linux, macOS and Windows', () => {
    for (const name of ['Save current Node version', 'Setup node', 'Install Sentry CLI v2', 'Run Release Action']) {
      expect(step(name).if).toBe(fallback);
    }
    expect(step('Restore original Node version').if).toBe(
      `(${fallback}) && steps.node_version.outputs.NODE_VERSION != ''`
    );
    expect(step('Mark GitHub workspace a safe directory in git').if).toBe(
      `\${{ (${fallback}) && inputs.disable_safe_directory != 'true' }}`
    );
  });

  test.each([true, false])('Docker probe writes the correct output when Docker succeeds=%s', succeeds => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sentry-action-docker-'));
    try {
      const bin = path.join(dir, 'bin');
      fs.mkdirSync(bin);
      const fakeDocker = path.join(bin, 'docker');
      fs.writeFileSync(fakeDocker, `#!/bin/sh\nexit ${succeeds ? 0 : 1}\n`, { mode: 0o755 });
      const output = path.join(dir, 'output');
      const result = spawnSync('bash', ['-c', step('Detect Docker support').run], {
        encoding: 'utf8',
        env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, GITHUB_OUTPUT: output },
      });
      expect(result.status).toBe(0);
      expect(fs.readFileSync(output, 'utf8').trim()).toBe(`available=${succeeds}`);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
