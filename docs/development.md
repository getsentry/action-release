# Development of `getsentry/action-release`

This document aims to provide guidelines for maintainers and contains information on how to develop and test this action.
For info on how to release changes, follow [publishing-a-release](publishing-a-release.md).

The action is a composite GitHub Action.

On Linux runners, the action executes the underlying JavaScript script
via a Docker image we publish.

For Mac OS and Windows runners, the action cannot run the Docker image and instead installs
the `@sentry/cli` dependency corresponding to the architecture of the runner and then executes the underlying JavaScript
distribution.

This split in architecture is done to optimize the run-time of the action but at the same time support non-Linux runners.

This action runs fastest on Linux runners.

## Development

The action is using `@sentry/cli` under the hood and is written in TypeScript. See `src/main.ts` to get started.

Options to the action are exposed via `action.yml`, changes that impact options need to be documented in the `README.md`.

> [!NOTE]
> Actions have to be exposed in 3 places in `action.yml`
>
> 1. Under the `inputs` field - These are the actual inputs exposed to users
> 2. Under the `env` field inside the `Run docker image` step. All inputs have to be mapped from inputs to `INPUT_X` env variables.
> 3. Under the `env` field inside the `Run Release Action

Telemetry for internal development is collected using `@sentry/node`, see `src/telemetry.ts` for utilities.

## Development steps

> [!NOTE]  
> Contributors will need to create an internal integration in their Sentry org and need to be an admin.
> See [#Prerequisites](../README.md#prerequisites).

Members of this repo will not have to set anything up since [the integration](https://sentry-ecosystem.sentry.io/settings/developer-settings/end-to-end-action-release-integration-416eb2/) is already set-up. Just open the PR and you will see [a release created](https://sentry-ecosystem.sentry.io/releases/?project=4505075304693760) for your PR.

> [!WARNING]  
> After you create a branch ALWAYS run yarn set-docker-tag-from-branch.
> This is very important. You should avoid publishing changes to an already existing docker image.
>
> Tags matching MAJOR.MINOR.PATCH (e.g. `1.10.2`) will be automatically rejected.

1. Create a branch
2. Run `yarn set-docker-tag-from-branch` to set a docker tag based on your github branch name. This is important so that the action gets its own Docker image, allowing you to test the action in a different repo.
3. Make changes
4. If possible, add unit and E2E tests (inside `.github/workflows/build.yml`)
5. Run `yarn install` to install deps
6. Run `yarn build` to build the action
7. Commit the changes and the build inside `dist/`

## Testing

You can run unit tests with `yarn test`.

### Troubleshooting

- If the `verify-dist` action fails for your PR, you likely forgot to commit the build output.
  Run `yarn install` and `yarn build` and commit the `dist/` folder.
