---
name: verify-dist
description: Regenerate and commit dist/index.js when source files or runtime deps change
argument-hint: [--check | --fix]
---

# Verify Dist Skill

`action-release` ships a bundled `dist/index.js` built by `ncc`. The `verify-dist` CI workflow (`.github/workflows/verify-dist.yml`) fails any PR where the committed bundle does not match the source. This skill keeps them in sync locally.

## When to invoke

- You changed anything under `src/`.
- You bumped a **runtime** dep in `package.json` (anything under `dependencies`, not `devDependencies`).
- CI posted "Detected uncommitted changes after build" on a PR.

## Modes

### `--check` (default)

Report whether `dist/` is in sync with the current source tree. Do not modify anything.

```bash
yarn install --frozen-lockfile
yarn build
git diff --ignore-space-at-eol --stat dist/
```

- If the diff is empty → `dist/` is in sync. Done.
- If the diff is non-empty → report the changed files and line counts, then ask the user whether to switch to `--fix`.

### `--fix`

Rebuild and stage `dist/`.

```bash
yarn install
yarn build
git add dist/
git status --short dist/
```

Do **not** commit automatically — let the user review the bundle diff first. A reasonable follow-up commit message:

```
build: regenerate dist/index.js
```

Or, if tied to a source change:

```
<type>(<scope>): <summary>

Regenerates dist/index.js.
```

### Before the user commits: pre-commit hook reminder

Whoever runs the follow-up commit needs the repo's pre-commit hooks installed. Verify with `ls .git/hooks/pre-commit`; if missing, run `make` (installs yarn deps + `pre-commit install`) or `pre-commit install`.

The `set-docker-tag-from-branch` hook will rewrite `action.yml` on the first commit of a branch and fail the commit. Recover by staging `action.yml` and committing again (**never `--amend`** — the hook-failed commit never landed):

```bash
git add action.yml
git commit -m "<same message>"
```

CI does **not** run pre-commit. CI's `prepare-docker` job rejects PRs where `action.yml`'s Docker tag still matches a semver like `3.6.0`, so keeping the tag in sync via the local hook is what prevents the CI failure.

## Notes

- The CI check runs `git diff --ignore-space-at-eol dist/` — whitespace-only diffs pass, anything else fails. Match that locally.
- `yarn build` shells out to `ncc build src/main.ts -e @sentry/cli`. `@sentry/cli` is deliberately excluded from the bundle because it ships its own native binaries at runtime.
- The bundle diff can be large even for small source changes (minifier + bundler reshuffles). That is expected; just verify the intended symbols are present.
- Never hand-edit `dist/index.js`. Always regenerate.

## Related files

- `.github/workflows/verify-dist.yml` — the CI check this skill satisfies.
- `package.json` → `scripts.build` — the canonical build command.
- `src/main.ts` — the ncc entry point.
