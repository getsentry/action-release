### Suggested Fix

Complexity: <trivial|moderate|complex>

To apply this fix, run the following prompt in Claude Code:

```
Fix GitHub issue #<number> (<title>).

Root cause: <brief explanation>

Changes needed:
- In `src/<file>.ts`: <what to change>
- In `__tests__/<file>.test.ts`: <test updates if needed>
- In `action.yml` / `README.md`: <input or doc updates if needed>

After making changes, run:
1. yarn lint
2. yarn build      # regenerates dist/index.js — commit the diff
3. yarn test
```
