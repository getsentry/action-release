import { execSync } from 'child_process';
import * as path from 'path';
import * as process from 'process';
import {
  getBooleanOption,
  getDist,
  getSourcemaps,
  getStartedAt,
  getRelease,
  getSetCommitsOption,
  getProjects,
  getUrlPrefixOption,
  getWorkingDirectory,
  getSetCommitsManualOptions,
} from '../src/options';

describe('options', () => {
  beforeAll(() => {
    process.env['MOCK'] = 'true';
  });

  describe('getBooleanOption', () => {
    const option = 'finalize';
    const defaultValue = true;
    const errorMessage = `${option} is not a boolean`;

    afterEach(() => {
      delete process.env['INPUT_FINALIZE'];
    });

    test('should throw an error when option type is not a boolean', () => {
      process.env['INPUT_FINALIZE'] = 'error';
      expect(() => getBooleanOption(option, defaultValue)).toThrow(errorMessage);
    });

    test('should return defaultValue if option is omitted', () => {
      expect(getBooleanOption(option, defaultValue)).toBe(true);
    });

    test('should return true when option is true or 1', () => {
      process.env['INPUT_FINALIZE'] = 'true';
      expect(getBooleanOption(option, defaultValue)).toBe(true);
      process.env['INPUT_FINALIZE'] = '1';
      expect(getBooleanOption(option, defaultValue)).toBe(true);
    });

    test('should return false when option is false or 0', () => {
      process.env['INPUT_FINALIZE'] = 'false';
      expect(getBooleanOption(option, defaultValue)).toBe(false);
      process.env['INPUT_FINALIZE'] = '0';
      expect(getBooleanOption(option, defaultValue)).toBe(false);
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

  describe('getDist', () => {
    afterEach(() => {
      delete process.env['INPUT_DIST'];
    });

    test('should return undefined when dist is omitted', async () => {
      expect(getDist()).toBeUndefined();
    });

    test('should return a string when dist is provided', () => {
      process.env['INPUT_DIST'] = 'foo-dist';
      expect(getDist()).toEqual('foo-dist');
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
      process.env['INPUT_STARTED_AT'] = '2017-07-13T19:40:00-07:00';
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

  describe.each([
    { release: 'INPUT_RELEASE', prefix: 'INPUT_RELEASE_PREFIX' },
    { release: 'INPUT_VERSION', prefix: 'INPUT_VERSION_PREFIX' },
    { release: 'INPUT_RELEASE', prefix: 'INPUT_VERSION_PREFIX' },
    { release: 'INPUT_VERSION', prefix: 'INPUT_RELEASE_PREFIX' },
  ])(`getRelease`, params => {
    const MOCK_VERSION = 'releases propose-version';

    afterEach(() => {
      delete process.env['INPUT_RELEASE'];
      delete process.env['INPUT_VERSION'];
      delete process.env['INPUT_RELEASE_PREFIX'];
      delete process.env['INPUT_VERSION_PREFIX'];
    });

    test(`should strip refs from ${params.release}`, async () => {
      process.env[params.release] = 'refs/tags/v1.0.0';
      expect(await getRelease()).toBe('v1.0.0');
    });

    test(`should get release version from ${params.release}`, async () => {
      process.env[params.release] = 'v1.0.0';
      expect(await getRelease()).toBe('v1.0.0');
    });

    test(`should propose-version when release version ${params.release} is omitted`, async () => {
      expect(await getRelease()).toBe(MOCK_VERSION);
    });

    test(`should include ${params.prefix} prefix`, async () => {
      process.env[params.prefix] = 'prefix-';
      expect(await getRelease()).toBe(`prefix-${MOCK_VERSION}`);
    });

    test(`should include ${params.prefix} prefix with user provided release version ${params.release}`, async () => {
      process.env[params.release] = 'v1.0.0';
      process.env[params.prefix] = 'prefix-';
      expect(await getRelease()).toBe(`prefix-v1.0.0`);
    });
  });

  describe('getRelease', () => {
    afterEach(() => {
      delete process.env['INPUT_RELEASE'];
      delete process.env['INPUT_VERSION'];
      delete process.env['INPUT_RELEASE_PREFIX'];
      delete process.env['INPUT_VERSION_PREFIX'];
    });

    test('should prefer INPUT_RELEASE over deprecated INPUT_VERSION', async () => {
      process.env['INPUT_VERSION'] = 'v0.0.1';
      process.env['INPUT_RELEASE'] = 'v1.2.3';
      expect(await getRelease()).toBe('v1.2.3');
    });

    test('should prefer INPUT_RELEASE_PREFIX over deprecated INPUT_VERSION_PREFIX', async () => {
      process.env['INPUT_VERSION_PREFIX'] = 'version-prefix-';
      process.env['INPUT_RELEASE_PREFIX'] = 'release-prefix-';
      process.env['INPUT_RELEASE'] = 'v1.2.3';
      expect(await getRelease()).toBe('release-prefix-v1.2.3');
    });
  });

  describe('getSetCommitsOption', () => {
    afterEach(() => {
      delete process.env['INPUT_SET_COMMITS'];
    });

    it('no option', () => {
      expect(getSetCommitsOption()).toBe('auto');
    });
    it('auto', () => {
      process.env['INPUT_SET_COMMITS'] = 'auto';
      expect(getSetCommitsOption()).toBe('auto');
    });
    it('skip', () => {
      process.env['INPUT_SET_COMMITS'] = 'skip';
      expect(getSetCommitsOption()).toBe('skip');
    });
    it('manual', () => {
      process.env['INPUT_SET_COMMITS'] = 'manual';
      expect(getSetCommitsOption()).toBe('manual');
    });
    it('bad option', () => {
      const errorMessage = 'set_commits must be "auto", "skip" or "manual"';
      process.env['INPUT_SET_COMMITS'] = 'bad';
      expect(() => getSetCommitsOption()).toThrow(errorMessage);
    });
  });

  describe('getSetCommitsManualOptions', () => {
    afterEach(() => {
      delete process.env['INPUT_SET_COMMITS'];
      delete process.env['INPUT_REPO'];
      delete process.env['INPUT_COMMIT'];
      delete process.env['INPUT_PREVIOUS_COMMIT'];
    });
    it('manual', () => {
      process.env['INPUT_SET_COMMITS'] = 'manual';
      process.env['INPUT_REPO'] = 'repo';
      process.env['INPUT_COMMIT'] = 'commit';
      process.env['INPUT_PREVIOUS_COMMIT'] = 'previous-commit';
      expect(getSetCommitsManualOptions()).toEqual({
        repo: 'repo',
        commit: 'commit',
        previousCommit: 'previous-commit',
      });
    });
  });

  describe('getProjects', () => {
    afterEach(() => {
      delete process.env['SENTRY_PROJECT'];
      delete process.env['INPUT_PROJECTS'];
    });
    it('read from env variable', () => {
      process.env['SENTRY_PROJECT'] = 'my-proj';
      expect(getProjects()).toEqual(['my-proj']);
    });
    it('read from option', () => {
      process.env['INPUT_PROJECTS'] = 'my-proj1 my-proj2';
      expect(getProjects()).toEqual(['my-proj1', 'my-proj2']);
    });
    it('option overwites env variable', () => {
      process.env['SENTRY_PROJECT'] = 'my-proj';
      process.env['INPUT_PROJECTS'] = 'my-proj1 my-proj2';
      expect(getProjects()).toEqual(['my-proj1', 'my-proj2']);
    });
    it('throws error if no project', () => {
      expect(() => getProjects()).toThrowError(
        'Environment variable SENTRY_PROJECT is missing a project slug and no projects are specified with the "projects" option'
      );
    });
  });

  describe('getUrlPrefixOption', () => {
    afterEach(() => {
      delete process.env['INPUT_URL_PREFIX'];
    });
    it('get url prefix', () => {
      process.env['INPUT_URL_PREFIX'] = 'build';
      expect(getUrlPrefixOption()).toEqual('build');
    });
  });

  describe('getWorkingDirectory', () => {
    afterEach(() => {
      delete process.env['GITHUB_WORKSPACE'];
      delete process.env['INPUT_WORKING_DIRECTORY'];
    });

    it('gets the working directory url and prefixes it with the `GITHUB_WORKSPACE`', () => {
      process.env['GITHUB_WORKSPACE'] = '/repo/root';
      process.env['INPUT_WORKING_DIRECTORY'] = '/some/working/directory';
      expect(getWorkingDirectory()).toEqual('/repo/root/some/working/directory');
    });

    it('should default to `GITHUB_WORKSPACE` even if no direcotry is passed', () => {
      process.env['GITHUB_WORKSPACE'] = '/repo/root';
      expect(getWorkingDirectory()).toEqual('/repo/root');
    });
  });
});

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  const output = execSync(`node ${path.join(__dirname, '..', 'dist', 'index.js')}`, {
    env: {
      ...process.env,
      INPUT_ENVIRONMENT: 'production',
      MOCK: 'true',
      SENTRY_AUTH_TOKEN: 'test_token',
      SENTRY_ORG: 'test_org',
      SENTRY_PROJECT: 'test_project',
    },
  });

  console.log(output.toString());
});
