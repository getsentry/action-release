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

For this action to communicate securely with Sentry, you'll need to create a new internal integration. In Sentry, navigate to: _Settings > Developer Settings > New Internal Integration_.

Give your new integration a name (for example, "GitHub Action Release Integration”) and specify the necessary permissions. In this case, we need Admin access for “Release” and Read access for “Organization”.

![View of internal integration permissions.](images/internal-integration-permissions.png)

Click “Save” at the bottom of the page and grab your token, which you’ll use as your `SENTRY_AUTH_TOKEN`. We recommend you store this as an [encrypted secret](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets).

## Usage

Adding the following to your workflow will create a new Sentry release and tell Sentry that you are deploying to the `production` environment.
  
```yaml
- uses: actions/checkout@v2
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

### Testing
#### Test your own repo against an action-release PR

NOTE: This section has not been fully tested but it should work with a bit of investment.

NOTE: This assumes that you have gone through the `Usage` section and have managed to get your Github repository to have worked with this action.

NOTE: Once we start producing Docker images for PRs we can get rid of the need of using the `sed` command below.

Step 1 - action-release changes (This is your PR with your code changes):
* Make changes to your action-release branch and push it
* Run this command, commit the changes and push it
  * This will cause the action-release to be built using the `Dockerfile`
  * You will need to revert this change once your changes are approved and ready to be merged

```shell
sed -i .backup 's|docker://ghcr.io/getsentry/action-release-image:latest|Dockerfile|' action.yml`
```

Step 2 - Test out your action-release changes on your own repo
* Get the sha for the latest commit on Step 1
* Modify your usage of action-release to point to that commit
  * If you're using a fork, edit the getsentry org in the string below

```yml
  - name: Sentry Release
    uses: getsentry/action-release@<github_action_commit>
    env:
      # You will remove this in the next steps when ready
      MOCK: true
      SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
      SENTRY_ORG: ${{ vars.SENTRY_ORG }}
      # If you specify a Github environment for the branch from where you create
      # releases from (e.g. master), you can then specify a repository-level variable
      # for all other branches. This allows using a second project for end-to-end testing
      SENTRY_PROJECT: ${{ vars.SENTRY_PROJECT }}
```

NOTE: If you want to do local testing read the next section, otherwise, keep reading.

NOTE: Only remove `MOCK: true` once you follow the steps below that will allow you to use two different projects. This will avoid polutting your Sentry releases for your existing Sentry project.

<!-- Add link to test.yml after PR 153 merges -->

Step 3 - Create a new Sentry project under your existing Sentry org (only this one time)
Step 4 - Create an environment variable in Github for the branch you release from (e.g. `master`) and define the same variable as a repository variable which all other branches will use (read: your PRs)

<!-- <TODO add screenshot here> -->
Step 5 - Comment out the MOCK env variable from step 2
Step 6 - Push to Github and the CI will do an end-to-end run!

NOTE: As mentioned, this section not been tested. Please try it out and let me know if it works for you.

#### Local testing via act

NOTE: You should test out this whole section to see if it still makes sense to use this testing approach and/or if to only use the one above.

[Here's a repo](https://github.com/scefali/github-actions-react/blob/master/.github/workflows/deploy.yml) you can clone to test out this section.

Step 1 - Install `act` in Mac with:
```bash
brew install act
```

NOTE: Make sure you commit your changes in your branch before running `act`.

Step 3 - Create an integration and set the SENTRY_AUTH_TOKEN (see `Usage` section in this doc)

NOTE: If you have `direnv` installed, you can define the variable within your repo in an `.env` file.

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

- When adding the action, make sure to first checkout your repo with `actions/checkout@v2`.
Otherwise it could fail at the `propose-version` step with the message:

    ```text
    error: Could not automatically determine release name
    ```

- In `actions/checkout@v2` the default fetch depth is 1. If you're getting the error message:

    ```text
    error: Could not find the SHA of the previous release in the git history. Increase your git clone depth.
    ```

    you can fetch all history for all branches and tags by setting the `fetch-depth` to zero like so:

    ```text
    - uses: actions/checkout@v2
      with:
        fetch-depth: 0
    ```

## Releases

Open a [new release checklist issue](https://github.com/getsentry/action-release/issues/new?assignees=&labels=&template=release-checklist.md&title=New+release+checklist+for+%5Bversion+number%5D) and follow the steps in there.

## Contributing

See the [Contributing Guide](https://github.com/getsentry/action-release/blob/master/CONTRIBUTING).

## License

See the [License File](https://github.com/getsentry/action-release/blob/master/LICENSE).
