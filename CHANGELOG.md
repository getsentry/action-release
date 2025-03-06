# Changelog

## 3.1.0

- feat: Add `release` and `release_prefix` in favor of `version` and `version_prefix` (#273) by @andreiborza

Input parameter `version` has been deprecated and will be removed in a future version in favor of a newly introduced `release` parameter.

Input parameter `version_prefix` has been deprecated and will be removed in a future version in favor of a newly introduced `release_prefix` parameter.

## 3.0.0

Version `3.0.0` contains breaking changes:

- feat(sourcemaps)!: Enable injecting debug ids by default (#272) by @andreiborza

The action now automatically injects Debug IDs into your JavaScript source files and source maps to ensure your stacktraces can be
properly un-minified.

This is a **breaking change as it modifies your source files**. You can disable this behavior by setting `inject: false`:

```yaml
- uses: getsentry/action-release@v3
  with:
    environment: 'production'
    sourcemaps: './dist'
    inject: false
```

Read more about [Artifact Bundles and Debug IDs here](https://docs.sentry.io/platforms/javascript/sourcemaps/troubleshooting_js/artifact-bundles/).

## 1.11.0

- feat: Use hybrid docker/composite action approach (#265) by @andreiborza

After receiving user feedback both on runtime and compatibility issues for `1.10.0`
the action has been reworked to use a Docker based approach on Linux runners, mimicking
`< 1.9.0` versions, while Mac OS and Windows runners will follow the `1.10.0` approach
of installing `@sentry/cli` in the run step.

## 1.10.5

### Various fixes & improvements

- fix: Mark `GITHUB_WORKSPACE` a safe git directory (#260) by @andreiborza

## 2.0.0

> [!NOTE]
> This release contains no changes over `v1.10.4` and is just meant to unblock users that have upgraded to `v2` before.
>
> We **recommend** pinning to `v1`.

Last week we pushed a `v2` branch that triggered dependabot which treated it as a release.
This was not meant to be a release, but many users have upgraded to `v2`.

This release will help unblock users that have upgraded to `v2`.

Please see: #209

## 1.10.4

### Various fixes & improvements

- fix(action): Use `action/setup-node` instead of unofficial volta action (#256) by @andreiborza

## 1.10.3

### Various fixes & improvements

- fix(ci): Use volta to ensure node and npm are available (#255) by @andreiborza

## 1.10.2

- fix(action): Ensure working directory always starts out at repo root (#250)
- fix(action): Use `npm` instead of `yarn` to install `sentry-cli` (#251)

## 1.10.1

This release contains changes concerning maintainers of the repo and has no user-facing changes.

## 1.10.0

- **feat(action): Support macos and windows runners**
We now publish a composite action that runs on all runners. Actions can now be properly versioned, allowing pinning versions from here on out.

## 1.9.0

**Important Changes**

- **feat(sourcemaps): Add inject option to inject debug ids into source files and sourcemaps (#229)**
A new option to inject Debug IDs into source files and sourcemaps was added to the action to ensure proper un-minifaction of your stacktraces. We strongly recommend enabling this by setting inject: true in your action alongside providing a path to sourcemaps.

**Other Changes**
- feat(telemetry): Collect project specific tags (#228)

## Previous Releases

For previous releases, check the [Github Releases](https://github.com/getsentry/action-release/releases) page.
