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

> [!NOTE]  
> Contributors will need to create an internal integration in their Sentry org and need to be an admin.
> See [#Prerequisites](../README.md#prerequisites).

Members of this repo will not have to set anything up since [the integration](https://sentry-ecosystem.sentry.io/settings/developer-settings/end-to-end-action-release-integration-416eb2/) is already set-up. Just open the PR and you will see [a release created](https://sentry-ecosystem.sentry.io/releases/?project=4505075304693760) for your PR.

### Test your own repo against an action-release PR

> [!NOTE]
> This assumes that you have gone through the [#Usage](../README.md#usage) section and have managed to get your GitHub repository to have worked with this action.

**Step 1**

- Create a branch, make changes
- If possible, add unit and E2E tests (inside `.github/workflows/build.yml`)
- Run `yarn install` to install deps
- Run `yarn build` to build the action
- Commit the changes and the build inside `dist/`

**Step 2**  
Create a new Sentry project under your existing Sentry org (only this one time).

**Step 3**  
Create an environment variable in GitHub for the branch you release from (e.g. `master`) and define the same variable as a repository variable which all other branches will use (i.e. your PR's branch)

**Step 4**  
Push to GitHub and the CI will do E2E runs!

### Troubleshooting

- If the `verify-dist` action fails for your PR, you likely forgot to commit the build output.
  Run `yarn install` and `yarn build` and commit the `dist/` folder.
