# Development of `getsentry/action-release`

This document aims to provide guidelines for maintainers and contains information on how to develop and test this action.
For info on how to release changes, follow [publishing-a-release](publishing-a-release.md).

## Development

The action is using `@sentry/cli` under the hood and is written in TypeScript. See `src/main.ts` to get started.

Options to the action are exposed via `action.yml`, changes that impact options need to be documented in the `README.md`.

Telemetry for internal development is collected using `@sentry/node`, see `src/telemetry.ts` for utilities.

## Testing

You can run unit tests with `yarn test`.

### E2E testing on GitHub's CI

The first job in [test.yml](../.github/workflows/test.yml) has instructions on how to tweak a job in order to execute your changes as part of the PR.

> [!NOTE]  
> Contributors will need to create an internal integration in their Sentry org and need to be an admin.
> See [#Prerequisites](../README.md#prerequisites).

Members of this repo will not have to set anything up since [the integration](https://sentry-ecosystem.sentry.io/settings/developer-settings/end-to-end-action-release-integration-416eb2/) is already set-up. Just open the PR and you will see [a release created](https://sentry-ecosystem.sentry.io/releases/?project=4505075304693760) for your PR.

### Test your own repo against an action-release PR

> [!NOTE]
> This assumes that you have gone through the [#Usage](../README.md#usage) section and have managed to get your GitHub repository to have worked with this action.

> [!NOTE]
> Once we start producing Docker images for PRs we can get rid of the need of using the `sed` command below.

**Step 1**

- Create a branch, make changes and push it
- Run this command, commit the changes and push it
  - This will cause the action-release to be built using the `Dockerfile`
  - You will need to revert this change once your changes are approved and ready to be merged

```shell
sed -i .backup 's|docker://ghcr.io/getsentry/action-release-image:latest|Dockerfile|' action.yml
```

**Step 2**  
Test out your action-release changes on your own repo.

- Get the sha for the latest commit on **Step 1**
- Modify your usage of action-release to point to that commit (if you're using a fork, edit the `getsentry` org in the string below)

Example:

```yml
- name: Sentry Release
  uses: getsentry/action-release@<latest commit sha>
  env:
    # You will remove this in the next steps when ready
    MOCK: true
    SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
    SENTRY_ORG: ${{ vars.SENTRY_ORG }}
    # If you specify a GitHub environment for the branch from where you create
    # releases from (e.g. master), you can then specify a repository-level variable
    # for all other branches. This allows using a second project for end-to-end testing
    SENTRY_PROJECT: ${{ vars.SENTRY_PROJECT }}
```

> [!NOTE]
> If you want to locally test the action, read the next section, otherwise, keep reading.

> [!NOTE]
> Only remove `MOCK: true` once you follow the steps below that will allow you to use two different projects. This will avoid polluting your Sentry releases for your existing Sentry project.

**Step 3**  
Create a new Sentry project under your existing Sentry org (only this one time).

**Step 4**  
Create an environment variable in GitHub for the branch you release from (e.g. `master`) and define the same variable as a repository variable which all other branches will use (i.e. your PR's branch)

**Step 5**  
Comment out the MOCK env variable from **Step 2**.

**Step 6**  
Push to GitHub and the CI will do an end-to-end run!

### Local testing via act

Alternatively, you can test the action locally using [act](https://github.com/nektos/act).

To get started, you can clone [this sample repo](https://github.com/scefali/github-actions-react/blob/master/.github/workflows/deploy.yml) to test locally.

**Step 1**  
Install `act`.

```bash
brew install act
```

> [!NOTE]
> Make sure you commit your changes in your branch before running `act`.

**Step 3**  
Create an integration and set the SENTRY_AUTH_TOKEN (see [#Usage](../README.md#usage)).

> [!NOTE]
> If you have `direnv` installed, you can define the variable within your repo in an `.env` file.

**Step 4**  
Run the action.

```bash
act -s SENTRY_ORG={your_org_slug} -s SENTRY_PROJECT={your_project_slug}
```

> [!NOTE]
> Make sure that `SENTRY_AUTH_TOKEN` is loaded as an env variable.

**Step 5**  
Choose Medium Docker builds.
