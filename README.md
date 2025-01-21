<p align="center">
  <a href="https://sentry.io/?utm_source=github&utm_medium=logo" target="_blank">
    <picture>
      <source srcset="https://sentry-brand.storage.googleapis.com/sentry-logo-white.png" media="(prefers-color-scheme: dark)" />
      <source srcset="https://sentry-brand.storage.googleapis.com/sentry-logo-black.png" media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)" />
      <img src="https://sentry-brand.storage.googleapis.com/sentry-logo-black.png" alt="Sentry" width="280">
    </picture>
  </a>
</p>

# Sentry Release GitHub Action

> [!IMPORTANT]
> This action is currently only available for Linux runners. 
> See [this issue](https://github.com/getsentry/action-release/issues/58) for more details.

Automatically create a Sentry release in a workflow.

A release is a version of your code that can be deployed to an environment. When you give Sentry information about your releases, you unlock a number of new features:

- Determine the issues and regressions introduced in a new release
- Predict which commit caused an issue and who is likely responsible
- Resolve issues by including the issue number in your commit message
- Receive email notifications when your code gets deployed

Additionally, releases are used for applying [source maps](https://docs.sentry.io/platforms/javascript/sourcemaps/) to minified JavaScript to view original, untransformed source code. You can learn more about releases in the [releases documentation](https://docs.sentry.io/workflow/releases).

## What's new

* **feat(sourcemaps): Add inject option to inject debug ids into source files and sourcemaps**

A new option to inject Debug IDs into source files and sourcemaps was added to the action to ensure proper un-minifaction of your stacktraces. We **strongly recommend enabling** this by setting `inject: true` in your action alongside providing a path to sourcemaps.

[Learn more about debug ids](https://docs.sentry.io/platforms/javascript/sourcemaps/troubleshooting_js/artifact-bundles/)

Please refer to the [release page](https://github.com/getsentry/action-release/releases) for the latest release notes.

## Prerequisites

### Create an Organization Auth Token

For this action to communicate securely with Sentry, you'll need to [create an organization auth token](https://docs.sentry.io/account/auth-tokens/#organization-auth-tokens).

Alternatively, you can also use a [User Auth Token](https://docs.sentry.io/account/auth-tokens/#user-auth-tokens), with the "Project: Read & Write" and "Release: Admin" permissions.

You also need to set your Organization and Project slugs and if you're using a self-hosted Sentry instance, provide the URL used to connect to Sentry via SENTRY_URL.

```bash
SENTRY_AUTH_TOKEN=sntrys_YOUR_TOKEN_HERE
SENTRY_ORG=example-org
SENTRY_PROJECT=example-project
# For self-hosted
# SENTRY_URL=https://my-sentry-url
```

We recommend storing these as [encrypted secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions) on your repository.

## Usage

Adding the following to your workflow will create a new Sentry release and tell Sentry that you are deploying to the `production` environment.

> [!IMPORTANT]
> Make sure you are using at least v3 of [actions/checkout](https://github.com/actions/checkout) with `fetch-depth: 0`, issues commonly occur with older versions.
 
```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0

- name: Create Sentry release
  uses: getsentry/action-release@v1
  env:
    SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
    SENTRY_ORG: ${{ secrets.SENTRY_ORG }}
    SENTRY_PROJECT: ${{ secrets.SENTRY_PROJECT }}
    # SENTRY_URL: https://sentry.io/
  with:
    environment: production
```

### Inputs

#### Environment Variables

|name|description|default|
|---|---|---|
|`SENTRY_AUTH_TOKEN`|**[Required]** Authentication token for Sentry. See [installation](#create-a-sentry-internal-integration).|-|
|`SENTRY_ORG`|**[Required]** The slug of the organization name in Sentry.|-|
|`SENTRY_PROJECT`|The slug of the project name in Sentry. One of `SENTRY_PROJECT` or `projects` is required.|-|
|`SENTRY_URL`|The URL used to connect to Sentry. (Only required for [Self-Hosted Sentry](https://develop.sentry.dev/self-hosted/))|`https://sentry.io/`|

#### Parameters

|name| description                                                                                                                                                                |default|
|---|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---|
|`environment`| Set the environment for this release. E.g. "production" or "staging". Omit to skip adding deploy to release.                                                               |-|
|`inject`| Injects Debug IDs into source files and sourcemaps. We **strongly recommend enabling** this to ensure proper un-minifaction of your stacktraces.                           |`false`|
|`sourcemaps`| Space-separated list of paths to JavaScript sourcemaps. Omit to skip uploading sourcemaps.                                                                                 |-|
|`finalize`| When false, omit marking the release as finalized and released.                                                                                                            |`true`|
|`ignore_missing`| When the flag is set and the previous release commit was not found in the repository, will create a release with the default commits count instead of failing the command. |`false`|
|`ignore_empty`| When the flag is set, command will not fail and just exit silently if no new commits for a given release have been found.                                                  |`false`|
|`dist`| Unique identifier for the distribution, used to further segment your release. Usually your build number.                                                                   |-|
|`started_at`| Unix timestamp of the release start date. Omit for current time.                                                                                                           |-|
|`version`| Identifier that uniquely identifies the releases. _Note: the `refs/tags/` prefix is automatically stripped when `version` is `github.ref`._                                |<code>${{&nbsp;github.sha&nbsp;}}</code>|
|`version_prefix`| Value prepended to auto-generated version. For example "v".                                                                                                                |-|
|`set_commits`| Specify whether to set commits for the release. Either "auto" or "skip".                                                                                                   |"auto"|
|`projects`| Space-separated list of paths of projects. When omitted, falls back to the environment variable `SENTRY_PROJECT` to determine the project.                                 |-|
|`url_prefix`| Adds a prefix to source map urls after stripping them.                                                                                                                     |-|
|`strip_common_prefix`| Will remove a common prefix from uploaded filenames. Useful for removing a path that is build-machine-specific.                                                            |`false`|
|`working_directory`| Directory to collect sentry release information from. Useful when collecting information from a non-standard checkout directory.                                           |-|
|`disable_telemetry`| The action sends telemetry data and crash reports to Sentry. This helps us improve the action. You can turn this off by setting this flag.                                 |`false`|

### Examples

- Create a new Sentry release for the `production` environment, inject Debug IDs into JavaScript source files and sourcemaps and upload them from the `./dist` directory.

    ```yaml
    - uses: getsentry/action-release@v1
      with:
        environment: 'production'
        inject: true
        sourcemaps: './dist'
    ```

- Create a new Sentry release for the `production` environment of your project at version `v1.0.1`.

    ```yaml
    - uses: getsentry/action-release@v1
      with:
        environment: 'production'
        version: 'v1.0.1'
    ```

- Create a new Sentry release for [Self-Hosted Sentry](https://develop.sentry.dev/self-hosted/)

    ```yaml
    - uses: getsentry/action-release@v1
      env:
        SENTRY_URL: https://sentry.example.com/
    ```


## Contributing

See the [Contributing Guide](./CONTRIBUTING.md).

## License

See the [License File](./LICENSE)

## Troubleshooting

Suggestions and issues can be posted on the repository's
[issues page](https://github.com/getsentry/action-release/issues).

- Forgetting to include the required environment variables
  (`SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT`), yields an error that looks like:

    ```text
    Environment variable SENTRY_ORG is missing an organization slug
    ```

- Building and running this action locally on an unsupported environment yields an error that looks like:

    ```text
    Syntax error: end of file unexpected (expecting ")")
    ```

- When adding the action, make sure to first checkout your repo with `actions/checkout@v3`.
Otherwise it could fail at the `propose-version` step with the message:

    ```text
    error: Could not automatically determine release name
    ```

- In `actions/checkout@v3` the default fetch depth is 1. If you're getting the error message:

    ```text
    error: Could not find the SHA of the previous release in the git history. Increase your git clone depth.
    ```

    you can fetch all history for all branches and tags by setting the `fetch-depth` to zero like so:

    ```text
    - uses: actions/checkout@v3
      with:
        fetch-depth: 0
    ```
