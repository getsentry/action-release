# Sentry Release GitHub Action
A release is a version of your code that is deployed to an environment. When you give Sentry information about your releases, you unlock a number of new features:

 - Determine the issues and regressions introduced in a new release
 - Predict which commit caused an issue and who is likely responsible
 - Resolve issues by including the issue number in your commit message
 - Receive email notifications when your code gets deployed

Additionally, releases are used for applying source maps to minified JavaScript to view original, untransformed source code.

## Usage

```yaml
steps:
...
- name: Sentry Release
  uses: getsentry/github-action-release@v0.0.1
  with:
    environment: 'production'
    sourcemaps: './lib'
```

## Troubleshooting


## Contributing
See the [Contributing Guide](https://github.com/getsentry/github-action-release/blob/master/CONTRIBUTING).

## License
See the [License File](https://github.com/getsentry/github-action-release/blob/master/LICENSE).