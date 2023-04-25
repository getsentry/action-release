# Sentry Release GitHub Action

**NOTE**: Currently only available for Linux runners. See [this issue](https://github.com/getsentry/action-release/issues/58) for more details.

Automatically create a Sentry release in a workflow.

A release is a version of your code that can be deployed to an environment. When you give Sentry information about your releases, you unlock a number of new features:

- Determine the issues and regressions introduced in a new release
- Predict which commit caused an issue and who is likely responsible
- Resolve issues by including the issue number in your commit message
- Receive email notifications when your code gets deployed

Additionally, releases are used for applying source maps to minified JavaScript to view original, untransformed source code. You can learn more about releases in the [releases documentation](https://docs.sentry.io/workflow/releases).

## Prerequisites

### Create a Sentry Internal Integration

NOTE: You have to be an admin in your Sentry org to create this.

For this action to communicate securely with Sentry, you'll need to create a new internal integration. In Sentry, navigate to: _Settings > Developer Settings > New Internal Integration_.

Give your new integration a name (for example, "GitHub Action Release Integration”) and specify the necessary permissions. In this case, we need Admin access for “Release” and Read access for “Organization”.

![View of internal integration permissions.](images/internal-integration-permissions.png)

Click “Save” at the bottom of the page and grab your token, which you’ll use as your `SENTRY_AUTH_TOKEN`. We recommend you store this as an [encrypted secret](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets).

## Usage

Adding the following to your workflow will create a new Sentry release and tell Sentry that you are deploying to the `production` environment.
  
```yaml
- uses: actions/checkout@v3
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

|name|description|default|
|---|---|---|
|`environment`|Set the environment for this release. E.g. "production" or "staging". Omit to skip adding deploy to release.|-|
|`finalize`|When false, omit marking the release as finalized and released.|`true`|
|`ignore_missing`|When the flag is set and the previous release commit was not found in the repository, will create a release with the default commits count instead of failing the command.|`false`|
|`ignore_empty`|When the flag is set, command will not fail and just exit silently if no new commits for a given release have been found.|`false`|
|`sourcemaps`|Space-separated list of paths to JavaScript sourcemaps. Omit to skip uploading sourcemaps.|-|
|`dist`|Unique identifier for the distribution, used to further segment your release. Usually your build number.|-|
|`started_at`|Unix timestamp of the release start date. Omit for current time.|-|
|`version`|Identifier that uniquely identifies the releases. _Note: the `refs/tags/` prefix is automatically stripped when `version` is `github.ref`._|<code>${{&nbsp;github.sha&nbsp;}}</code>|
|`version_prefix`|Value prepended to auto-generated version. For example "v".|-|
|`set_commits`|Specify whether to set commits for the release. Either "auto" or "skip".|"auto"|
|`projects`|Space-separated list of paths of projects. When omitted, falls back to the environment variable `SENTRY_PROJECT` to determine the project.|-|
|`url_prefix`|Adds a prefix to source map urls after stripping them.|-|
|`strip_common_prefix`|Will remove a common prefix from uploaded filenames. Useful for removing a path that is build-machine-specific.|`false`|
|`working_directory`|Directory to collect sentry release information from. Useful when collecting information from a non-standard checkout directory.|-|

### Examples

- Create a new Sentry release for the `production` environment and upload JavaScript source maps from the `./lib` directory.

    ```yaml
    - uses: getsentry/action-release@v1
      with:
        environment: 'production'
        sourcemaps: './lib'
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

## Development

If your change impacts the options used for the action, you need to update the README.md with the new options.

### Manual testing

This section is if you want to fully test the action since we lack integration tests.

NOTE: Since you need to create an internal integration in your Sentry org you will need to be an admin.


#### Remotely on Github

When you open a PR `test.yml`.

This repo has `SENTRY_AUTH_TOKEN` and `SENTRY_ORG` defined as secrets
https://sentry-ecosystem.sentry.io/settings/developer-settings/end-to-end-action-release-integration-416eb2/

#### Local Action Execution via act

NOTE: You should really test out this whole section to see if it still makes sense to use this testing approach and-or if it even works

NOTE: You should not run this on the action-release repo but your own repo that uses action-release.

[Here's a repo](https://github.com/scefali/github-actions-react/blob/master/.github/workflows/deploy.yml) you can clone to test out this action against.

You can use [act](https://github.com/nektos/act) to run the action locally.

Step 1 - Install in Mac with:
```bash
brew install act
```

Step 2 - Force the action to run in local mode by running this command:

```bash
sed -i .backup 's|docker://ghcr.io/getsentry/action-release-image:latest|Dockerfile|' action.yml
```

NOTE: Make sure you commit your changes in your branch before running `act`.

Step 3 - Create an integration and set the SENTRY_AUTH_TOKEN

NOTE: If you have `direnv` installed, you can define the variable within your repo with `.env`.

Step 4 - Run the action

```bash
act -s SENTRY_ORG={your_org_slug} -s SENTRY_PROJECT={your_project_slug}
```

NOTE: Make sure that `SENTRY_AUTH_TOKEN` is loaded as an env variable.
NOTE: If you're running and M1 chipset instead of Intel you can ignore the following message:
```
WARN  ⚠ You are using Apple M1 chip and you have not specified container architecture, you might encounter issues while running act. If so, try running it with '--container-architecture linux/amd64'
```

Step 5 - Choose Medium Docker builds

NOTE: The "Build & publish Docker images" will fail


## Releases

When you are ready to make a release, epen a [new release checklist issue](https://github.com/getsentry/action-release/issues/new?assignees=&labels=&template=release-checklist.md&title=New+release+checklist+for+%5Bversion+number%5D) and follow the steps in there.

## Contributing

See the [Contributing Guide](https://github.com/getsentry/action-release/blob/master/CONTRIBUTING).

## License

See the [License File](https://github.com/getsentry/action-release/blob/master/LICENSE).

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


