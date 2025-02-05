# Changelog

## Unreleased

- **chore(release): Update release workflow**  
This release is purely there to test our new craft release workflow and has no functionality change.
With this release, we now publish a composite action that runs on all runners. Actions can now be properly versioned, allowing users to pin versions from here on out.

## 1.9.0

**Important Changes**

- **feat(sourcemaps): Add inject option to inject debug ids into source files and sourcemaps (#229)**
A new option to inject Debug IDs into source files and sourcemaps was added to the action to ensure proper un-minifaction of your stacktraces. We strongly recommend enabling this by setting inject: true in your action alongside providing a path to sourcemaps.

**Other Changes**
- feat(telemetry): Collect project specific tags (#228)

## Previous Releases

For previous releases, check the [Github Releases](https://github.com/getsentry/action-release/releases) page.
