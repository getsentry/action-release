module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(131);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 87:
/***/ (function(module) {

module.exports = require("os");

/***/ }),

/***/ 129:
/***/ (function(module) {

module.exports = require("child_process");

/***/ }),

/***/ 131:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(__webpack_require__(470));
const cli_1 = __webpack_require__(750);
const validate = __importStar(__webpack_require__(196));
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate parameters first so we can fail early.
        validate.checkEnvironmentVariables();
        const environment = validate.getEnvironment();
        const sourcemaps = validate.getSourcemaps();
        const shouldFinalize = validate.getShouldFinalize();
        const deployStartedAtOption = validate.getStartedAt();
        const version = yield validate.getVersion();
        core.debug(`Version is ${version}`);
        yield cli_1.getCLI().new(version);
        core.debug(`Setting commits`);
        yield cli_1.getCLI().setCommits(version, { auto: true });
        if (sourcemaps) {
            core.debug(`Adding sourcemaps`);
            yield cli_1.getCLI().uploadSourceMaps(version, { include: sourcemaps });
        }
        core.debug(`Adding deploy to release`);
        yield cli_1.getCLI().newDeploy(version, Object.assign({ env: environment }, (deployStartedAtOption && { started: deployStartedAtOption })));
        core.debug(`Finalizing the release`);
        if (shouldFinalize) {
            yield cli_1.getCLI().finalize(version);
        }
        core.debug(`Done`);
        core.setOutput('version', version);
    }
    catch (error) {
        core.setFailed(error.message);
    }
}))();


/***/ }),

/***/ 196:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEnvironmentVariables = exports.getShouldFinalize = exports.getSourcemaps = exports.getStartedAt = exports.getEnvironment = exports.getVersion = void 0;
const core = __importStar(__webpack_require__(470));
const cli_1 = __webpack_require__(750);
/**
 * Get the release version string from parameter or propose one.
 * @throws
 * @returns Promise<string>
 */
exports.getVersion = () => __awaiter(void 0, void 0, void 0, function* () {
    const versionOption = core.getInput('version');
    if (versionOption) {
        return versionOption;
    }
    core.debug('Version not provided, proposing one...');
    return cli_1.getCLI().proposeVersion();
});
/**
 * Environment is required.
 * @throws
 * @returns string
 */
exports.getEnvironment = () => {
    return core.getInput('environment', { required: true });
};
/**
 * TODO I don't want to duplicate logic here. How should I validate the timestamp?
 * TODO must be a UNIX timestamp
 * TODO what if this is in the future?
 * TODO FIRST it could also be a datetime.
 * @throws
 * @returns number
 */
exports.getStartedAt = () => {
    const startedAtOption = core.getInput('started_at');
    if (!startedAtOption) {
        return null;
    }
    const startedAt = parseInt(startedAtOption);
    if (isNaN(startedAt)) {
        throw new Error('started_at is not a number');
    }
    return startedAt;
};
/**
 * TODO EXPLAIN FORMAT IN THE README
 * TODO handle failure
 * @returns string[]
 */
exports.getSourcemaps = () => {
    const sourcemapsOption = core.getInput('sourcemaps');
    if (!sourcemapsOption) {
        return [];
    }
    return sourcemapsOption.split(' ');
};
/**
 * Find out from input if we should finalize the release.
 * @returns boolean
 */
exports.getShouldFinalize = () => {
    const finalizeOption = core.getInput('finalize');
    if (!finalizeOption) {
        return true;
    }
    const finalize = finalizeOption.trim().toLowerCase();
    switch (finalize) {
        case 'true':
        case '1':
            return true;
        case 'false':
        case '0':
            return false;
    }
    throw Error('finalize is not a boolean');
};
/**
 * Check for required environment variables.
 */
exports.checkEnvironmentVariables = () => {
    if (!process.env['SENTRY_ORG']) {
        throw Error('Environment variable SENTRY_ORG is missing an organization slug');
    }
    if (!process.env['SENTRY_PROJECT']) {
        throw Error('Environment variable SENTRY_PROJECT is missing a project slug');
    }
    if (!process.env['SENTRY_AUTH_TOKEN']) {
        throw Error('Environment variable SENTRY_AUTH_TOKEN is missing an auth token');
    }
};


/***/ }),

/***/ 246:
/***/ (function(module) {

module.exports = {
  env: {
    param: '--env',
    type: 'string',
  },
  started: {
    param: '--started',
    type: 'number',
  },
  finished: {
    param: '--finished',
    type: 'number',
  },
  time: {
    param: '--time',
    type: 'number',
  },
  name: {
    param: '--name',
    type: 'string',
  },
  url: {
    param: '--url',
    type: 'string',
  },
};


/***/ }),

/***/ 308:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const os = __webpack_require__(87);
const path = __webpack_require__(622);
const childProcess = __webpack_require__(129);

/**
 * Absolute path to the sentry-cli binary (platform dependent).
 * @type {string}
 */
// istanbul ignore next
let binaryPath = __webpack_require__.ab + "sentry-cli";
/**
 * Overrides the default binary path with a mock value, useful for testing.
 *
 * @param {string} mockPath The new path to the mock sentry-cli binary
 */
function mockBinaryPath(mockPath) {
  binaryPath = mockPath;
}

/**
 * The javascript type of a command line option.
 * @typedef {'array'|'string'|'boolean'|'inverted-boolean'} OptionType
 */

/**
 * Schema definition of a command line option.
 * @typedef {object} OptionSchema
 * @prop {string} param The flag of the command line option including dashes.
 * @prop {OptionType} type The value type of the command line option.
 */

/**
 * Schema definition for a command.
 * @typedef {Object.<string, OptionSchema>} OptionsSchema
 */

/**
 * Serializes command line options into an arguments array.
 *
 * @param {OptionsSchema} schema An options schema required by the command.
 * @param {object} options An options object according to the schema.
 * @returns {string[]} An arguments array that can be passed via command line.
 */
function serializeOptions(schema, options) {
  return Object.keys(schema).reduce((newOptions, option) => {
    const paramValue = options[option];
    if (paramValue === undefined) {
      return newOptions;
    }

    const paramType = schema[option].type;
    const paramName = schema[option].param;

    if (paramType === 'array') {
      if (!Array.isArray(paramValue)) {
        throw new Error(`${option} should be an array`);
      }

      return newOptions.concat(
        paramValue.reduce((acc, value) => acc.concat([paramName, String(value)]), [])
      );
    }

    if (paramType === 'boolean') {
      if (typeof paramValue !== 'boolean') {
        throw new Error(`${option} should be a bool`);
      }

      const invertedParamName = schema[option].invertedParam;

      if (paramValue && paramName !== undefined) {
        return newOptions.concat([paramName]);
      }

      if (!paramValue && invertedParamName !== undefined) {
        return newOptions.concat([invertedParamName]);
      }

      return newOptions;
    }

    return newOptions.concat(paramName, paramValue);
  }, []);
}

/**
 * Serializes the command and its options into an arguments array.
 *
 * @param {string} command The literal name of the command.
 * @param {OptionsSchema} [schema] An options schema required by the command.
 * @param {object} [options] An options object according to the schema.
 * @returns {string[]} An arguments array that can be passed via command line.
 */
function prepareCommand(command, schema, options) {
  return command.concat(serializeOptions(schema || {}, options || {}));
}

/**
 * Returns the absolute path to the `sentry-cli` binary.
 * @returns {string}
 */
function getPath() {
  return __webpack_require__.ab + "sentry-cli";
}

/**
 * Runs `sentry-cli` with the given command line arguments.
 *
 * Use {@link prepareCommand} to specify the command and add arguments for command-
 * specific options. For top-level options, use {@link serializeOptions} directly.
 *
 * The returned promise resolves with the standard output of the command invocation
 * including all newlines. In order to parse this output, be sure to trim the output
 * first.
 *
 * If the command failed to execute, the Promise rejects with the error returned by the
 * CLI. This error includes a `code` property with the process exit status.
 *
 * @example
 * const output = await execute(['--version']);
 * expect(output.trim()).toBe('sentry-cli x.y.z');
 *
 * @param {string[]} args Command line arguments passed to `sentry-cli`.
 * @param {boolean} live We inherit stdio to display `sentry-cli` output directly.
 * @param {boolean} silent Disable stdout for silents build (CI/Webpack Stats, ...)
 * @param {string} [configFile] Relative or absolute path to the configuration file.
 * @returns {Promise.<string>} A promise that resolves to the standard output.
 */
function execute(args, live, silent, configFile) {
  const env = { ...process.env };
  if (configFile) {
    env.SENTRY_PROPERTIES = configFile;
  }
  return new Promise((resolve, reject) => {
    if (live === true) {
      const pid = childProcess.spawn(getPath(), args, {
        env,
        stdio: ['inherit', silent ? 'pipe' : 'inherit', 'inherit'],
      });
      pid.on('exit', () => {
        resolve();
      });
    } else {
      childProcess.execFile(getPath(), args, { env }, (err, stdout) => {
        if (err) {
          reject(err);
        } else {
          resolve(stdout);
        }
      });
    }
  });
}

module.exports = {
  mockBinaryPath,
  serializeOptions,
  prepareCommand,
  getPath,
  execute,
};


/***/ }),

/***/ 431:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = __importStar(__webpack_require__(87));
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
function escapeData(s) {
    return toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 439:
/***/ (function(module) {

module.exports = {"name":"@sentry/cli","version":"1.55.0","description":"A command line utility to work with Sentry. https://docs.sentry.io/hosted/learn/cli/","homepage":"https://docs.sentry.io/hosted/learn/cli/","license":"BSD-3-Clause","keywords":["sentry","sentry-cli","cli"],"repository":{"type":"git","url":"https://github.com/getsentry/sentry-cli"},"bugs":{"url":"https://github.com/getsentry/sentry-cli/issues"},"engines":{"node":">= 8"},"main":"js/index.js","bin":{"sentry-cli":"bin/sentry-cli"},"scripts":{"install":"node scripts/install.js","fix":"npm-run-all fix:eslint fix:prettier","fix:eslint":"eslint --fix bin/* scripts/**/*.js js/**/*.js","fix:prettier":"prettier --write bin/* scripts/**/*.js js/**/*.js","test":"npm-run-all test:jest test:eslint test:prettier","test:jest":"jest","test:watch":"jest --watch --notify","test:eslint":"eslint bin/* scripts/**/*.js js/**/*.js","test:prettier":"prettier --check  bin/* scripts/**/*.js js/**/*.js"},"dependencies":{"https-proxy-agent":"^5.0.0","mkdirp":"^0.5.5","node-fetch":"^2.6.0","progress":"^2.0.3","proxy-from-env":"^1.1.0"},"devDependencies":{"eslint":"^6.8.0","eslint-config-airbnb-base":"^14.1.0","eslint-config-prettier":"^6.10.1","eslint-plugin-import":"^2.20.2","jest":"^25.3.0","npm-run-all":"^4.1.5","prettier":"^1.19.1"},"jest":{"collectCoverage":true,"testEnvironment":"node","testPathIgnorePatterns":["src/utils"]}};

/***/ }),

/***/ 470:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __webpack_require__(431);
const os = __importStar(__webpack_require__(87));
const path = __importStar(__webpack_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = command_1.toCommandValue(val);
    process.env[name] = convertedVal;
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    command_1.issueCommand('add-path', {}, inputPath);
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 489:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const helper = __webpack_require__(308);

/**
 * Default arguments for the `--ignore` option.
 * @type {string[]}
 */
const DEFAULT_IGNORE = ['node_modules'];

/**
 * Schema for the `upload-sourcemaps` command.
 * @type {OptionsSchema}
 */
const SOURCEMAPS_SCHEMA = __webpack_require__(938);

/**
 * Schema for the `deploys new` command.
 * @type {OptionsSchema}
 */
const DEPLOYS_SCHEMA = __webpack_require__(246);

/**
 * Manages releases and release artifacts on Sentry.
 * @namespace SentryReleases
 */
class Releases {
  /**
   * Creates a new `Releases` instance.
   *
   * @param {Object} [options] More options to pass to the CLI
   */
  constructor(options) {
    this.options = options || {};
    if (typeof this.options.configFile === 'string') {
      this.configFile = this.options.configFile;
    }
    delete this.options.configFile;
  }

  /**
   * Registers a new release with sentry.
   *
   * The given release name should be unique and deterministic. It can later be used to
   * upload artifacts, such as source maps.
   *
   * @param {string} release Unique name of the new release.
   * @returns {Promise} A promise that resolves when the release has been created.
   * @memberof SentryReleases
   */
  new(release) {
    return this.execute(['releases', 'new', release], null);
  }

  /**
   * Specifies the set of commits covered in this release.
   *
   * @param {string} release Unique name of the release
   * @param {object} options A set of options to configure the commits to include
   * @param {string} options.repo The full repo name as defined in Sentry
   * @param {boolean} options.auto Automatically choose the associated commit (uses
   * the current commit). Overrides other options.
   * @param {string} options.commit The current (last) commit in the release.
   * @param {string} options.previousCommit The commit before the beginning of this
   * release (in other words, the last commit of the previous release). If omitted,
   * this will default to the last commit of the previous release in Sentry. If there
   * was no previous release, the last 10 commits will be used.
   * @returns {Promise} A promise that resolves when the commits have been associated
   * @memberof SentryReleases
   */
  setCommits(release, options) {
    if (!options || (!options.auto && (!options.repo || !options.commit))) {
      throw new Error('options.auto, or options.repo and options.commit must be specified');
    }

    let commitFlags = [];

    if (options.auto) {
      commitFlags = ['--auto'];
    } else if (options.previousCommit) {
      commitFlags = ['--commit', `${options.repo}@${options.previousCommit}..${options.commit}`];
    } else {
      commitFlags = ['--commit', `${options.repo}@${options.commit}`];
    }

    return this.execute(['releases', 'set-commits', release].concat(commitFlags));
  }

  /**
   * Marks this release as complete. This should be called once all artifacts has been
   * uploaded.
   *
   * @param {string} release Unique name of the release.
   * @returns {Promise} A promise that resolves when the release has been finalized.
   * @memberof SentryReleases
   */
  finalize(release) {
    return this.execute(['releases', 'finalize', release], null);
  }

  /**
   * Creates a unique, deterministic version identifier based on the project type and
   * source files. This identifier can be used as release name.
   *
   * @returns {Promise.<string>} A promise that resolves to the version string.
   * @memberof SentryReleases
   */
  proposeVersion() {
    return this.execute(['releases', 'propose-version'], null).then(
      version => version && version.trim()
    );
  }

  /**
   * Scans the given include folders for JavaScript source maps and uploads them to the
   * specified release for processing.
   *
   * The options require an `include` array, which is a list of directories to scan.
   * Additionally, it supports to ignore certain files, validate and preprocess source
   * maps and define a URL prefix.
   *
   * @example
   * await cli.releases.uploadSourceMaps(cli.releases.proposeVersion(), {
   *   // required options:
   *   include: ['build'],
   *
   *   // default options:
   *   ignore: ['node_modules'],  // globs for files to ignore
   *   ignoreFile: null,          // path to a file with ignore rules
   *   rewrite: false,            // preprocess sourcemaps before uploading
   *   sourceMapReference: true,  // add a source map reference to source files
   *   stripPrefix: [],           // remove certain prefices from filenames
   *   stripCommonPrefix: false,  // guess common prefices to remove from filenames
   *   validate: false,           // validate source maps and cancel the upload on error
   *   urlPrefix: '',             // add a prefix source map urls after stripping them
   *   urlSuffix: '',             // add a suffix source map urls after stripping them
   *   ext: ['js', 'map', 'jsbundle', 'bundle'],  // override file extensions to scan for
   * });
   *
   * @param {string} release Unique name of the release.
   * @param {object} options Options to configure the source map upload.
   * @returns {Promise} A promise that resolves when the upload has completed successfully.
   * @memberof SentryReleases
   */
  uploadSourceMaps(release, options) {
    if (!options || !options.include) {
      throw new Error('options.include must be a vaild path(s)');
    }

    const uploads = options.include.map(sourcemapPath => {
      const newOptions = { ...options };
      if (!newOptions.ignoreFile && !newOptions.ignore) {
        newOptions.ignore = DEFAULT_IGNORE;
      }

      const args = ['releases', 'files', release, 'upload-sourcemaps', sourcemapPath];
      return this.execute(helper.prepareCommand(args, SOURCEMAPS_SCHEMA, newOptions), true);
    });

    return Promise.all(uploads);
  }

  /**
   * List all deploys for a given release.
   *
   * @param {string} release Unique name of the release.
   * @returns {Promise} A promise that resolves when the list comes back from the server.
   * @memberof SentryReleases
   */
  listDeploys(release) {
    return this.execute(['releases', 'deploys', release, 'list'], null);
  }

  /**
   * Creates a new release deployment. This should be called after the release has been
   * finalized, while deploying on a given environment.
   *
   * @example
   * await cli.releases.newDeploy(cli.releases.proposeVersion(), {
   *   // required options:
   *   env: 'production',          // environment for this release. Values that make sense here would be 'production' or 'staging'
   *
   *   // optional options:
   *   started: 42,                // unix timestamp when the deployment started
   *   finished: 1337,             // unix timestamp when the deployment finished
   *   time: 1295,                 // deployment duration in seconds. This can be specified alternatively to `started` and `finished`
   *   name: 'PickleRick',         // human readable name for this deployment
   *   url: 'https://example.com', // URL that points to the deployment
   * });
   *
   * @param {string} release Unique name of the release.
   * @param {object} options Options to configure the new release deploy.
   * @returns {Promise} A promise that resolves when the deploy has been created.
   * @memberof SentryReleases
   */
  newDeploy(release, options) {
    if (!options || !options.env) {
      throw new Error('options.env must be a vaild name');
    }
    const args = ['releases', 'deploys', release, 'new'];
    return this.execute(helper.prepareCommand(args, DEPLOYS_SCHEMA, options), null);
  }

  /**
   * See {helper.execute} docs.
   * @param {string[]} args Command line arguments passed to `sentry-cli`.
   * @param {boolean} live We inherit stdio to display `sentry-cli` output directly.
   * @returns {Promise.<string>} A promise that resolves to the standard output.
   */
  execute(args, live) {
    return helper.execute(args, live, this.options.silent, this.configFile);
  }
}

module.exports = Releases;


/***/ }),

/***/ 622:
/***/ (function(module) {

module.exports = require("path");

/***/ }),

/***/ 750:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCLI = void 0;
const cli_1 = __importDefault(__webpack_require__(928));
/**
 * CLI Singleton
 *
 * When the `MOCK` environment variable is set, stub out network calls.
 */
let cli;
exports.getCLI = () => {
    if (!cli) {
        cli = new cli_1.default().releases;
        if (process.env['MOCK']) {
            cli.execute = (args, 
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            live) => __awaiter(void 0, void 0, void 0, function* () {
                return Promise.resolve(args.join(' '));
            });
        }
    }
    return cli;
};


/***/ }),

/***/ 928:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const pkgInfo = __webpack_require__(439);
const helper = __webpack_require__(308);
const Releases = __webpack_require__(489);

/**
 * Interface to and wrapper around the `sentry-cli` executable.
 *
 * Commands are grouped into namespaces. See the respective namespaces for more
 * documentation. To use this wrapper, simply create an instance and call methods:
 *
 * @example
 * const cli = new SentryCli();
 * console.log(cli.getVersion());
 *
 * @example
 * const cli = new SentryCli('path/to/custom/sentry.properties');
 * console.log(cli.getVersion());
 */
class SentryCli {
  /**
   * Creates a new `SentryCli` instance.
   *
   * If the `configFile` parameter is specified, configuration located in the default
   * location and the value specified in the `SENTRY_PROPERTIES` environment variable is
   * overridden.
   *
   * @param {string} [configFile] Relative or absolute path to the configuration file.
   * @param {Object} [options] More options to pass to the CLI
   */
  constructor(configFile, options) {
    if (typeof configFile === 'string') {
      this.configFile = configFile;
    }
    this.options = options || { silent: false };
    this.releases = new Releases({ ...this.options, configFile });
  }

  /**
   * Returns the version of the installed `sentry-cli` binary.
   * @returns {string}
   */
  static getVersion() {
    return pkgInfo.version;
  }

  /**
   * Returns an absolute path to the `sentry-cli` binary.
   * @returns {string}
   */
  static getPath() {
    return helper.getPath();
  }

  /**
   * See {helper.execute} docs.
   * @param {string[]} args Command line arguments passed to `sentry-cli`.
   * @param {boolean} live We inherit stdio to display `sentry-cli` output directly.
   * @returns {Promise.<string>} A promise that resolves to the standard output.
   */
  execute(args, live) {
    return helper.execute(args, live, this.options.silent, this.configFile);
  }
}

module.exports = SentryCli;


/***/ }),

/***/ 938:
/***/ (function(module) {

module.exports = {
  ignore: {
    param: '--ignore',
    type: 'array',
  },
  ignoreFile: {
    param: '--ignore-file',
    type: 'string',
  },
  dist: {
    param: '--dist',
    type: 'string',
  },
  rewrite: {
    param: '--rewrite',
    invertedParam: '--no-rewrite',
    type: 'boolean',
  },
  sourceMapReference: {
    invertedParam: '--no-sourcemap-reference',
    type: 'boolean',
  },
  stripPrefix: {
    param: '--strip-prefix',
    type: 'array',
  },
  stripCommonPrefix: {
    param: '--strip-common-prefix',
    type: 'boolean',
  },
  validate: {
    param: '--validate',
    type: 'boolean',
  },
  urlPrefix: {
    param: '--url-prefix',
    type: 'string',
  },
  urlSuffix: {
    param: '--url-suffix',
    type: 'string',
  },
  ext: {
    param: '--ext',
    type: 'array',
  },
};


/***/ })

/******/ });