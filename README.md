# Sentry Release GitHub Action
Automatically create a Sentry Release in a workflow.

## Why Releases?
A release is a version of your code that is deployed to an environment. 
When you give Sentry information about your releases, you unlock a number of new features:
 - Determine the issues and regressions introduced in a new release
 - Predict which commit caused an issue and who is likely responsible
 - Resolve issues by including the issue number in your commit message
 - Receive email notifications when your code gets deployed

Additionally, releases are used for applying source maps to minified JavaScript to view original, untransformed source code.

## Usage
Adding the following to your workflow will create a new Sentry release for the 
`production` environment of your project and upload JavaScript source maps from
the `./lib` directory. 
  
```yaml
uses: getsentry/action-release@v1
with:
  environment: 'production'
  sourcemaps: './lib'
```

Don’t forget to include the following environment variables:
```yaml
env:
  SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
  SENTRY_ORG: ${{ secrets.SENTRY_ORG }}
  SENTRY_PROJECT: ${{ secrets.SENTRY_PROJECT }}
```

See [action.yml](https://github.com/getsentry/action-release/blob/master/action.yml) for more workflow options.

## Troubleshooting
Building and running this action locally on an unsupported environment yields an error that looks like:
```
Syntax error: end of file unexpected (expecting ")")
```

Suggestions and issues can be posted on the repository's [issues page](https://github.com/getsentry/action-release/issues).

## Contributing
See the [Contributing Guide](https://github.com/getsentry/action-release/blob/master/CONTRIBUTING).

## License
See the [License File](https://github.com/getsentry/action-release/blob/master/LICENSE).
