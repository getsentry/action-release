# Sentry Release GitHub Action
Automatically create a Sentry release in a workflow. 
You can learn more about releases in [releases documentation](https://docs.sentry.io/workflow/releases).

## Usage
Adding the following to your workflow will create a new Sentry release for the 
`production` environment of your project with an automatically generated `version` name.
  
```yaml
jobs:
  release:
    runs-on: ubuntu-latest
    env:
      SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
      SENTRY_ORG: ${{ secrets.SENTRY_ORG }}
      SENTRY_PROJECT: ${{ secrets.SENTRY_PROJECT }}
    steps:
    - uses: actions/checkout@v2
    - uses: getsentry/action-release@v1.0.0
      with:
        environment: production
```

### Inputs
#### Parameters
|Name|Description|
|---|---|
|`environment`|_Required_. Set the environment for this release. E.g. "production" or "staging".|
|`finalize`|When false, omit marking the release as finalized and released.|
|`sourcemaps`|Space-separated list of paths to JavaScript sourcemaps. Omit to skip uploading sourcemaps.|
|`started_at`|Unix timestamp of the release start date. Omit for current time.|
|`version`|Identifier that uniquely identifies the releases. Omit to auto-generate one.|

#### Environment Variables
The following are all _required_.

|Name|Description|
|---|---|
|`SENTRY_AUTH_TOKEN`|See [authentication documentation](https://docs.sentry.io/api/auth). |
|`SENTRY_ORG`|Your organization slug on your Sentry instance.|
|`SENTRY_PROJECT`|The name of your project on Sentry.|

### Examples
- Create a new Sentry release for the `production` environment and upload 
  JavaScript source maps from the `./lib` directory.

    ```yaml
    - uses: getsentry/action-release@v1
      with:
        environment: 'production'
        sourcemaps: '.lib'
    ```

- Create a new Sentry release for the `production` environment of your project at version `v1.0.1`.
    ```yaml
    - uses: getsentry/action-release@v1
      with:
        environment: 'production'
        version: 'v1.0.1'
    ```

## Troubleshooting
Suggestions and issues can be posted on the repository's 
[issues page](https://github.com/getsentry/action-release/issues).
- Forgetting to include the required environment variables 
  (`SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT`), yields an error that looks like: 
    ```
    Environment variable SENTRY_ORG is missing an organization slug
    ```
- Building and running this action locally on an unsupported environment yields an error that looks like:
    ```
    Syntax error: end of file unexpected (expecting ")")
    ```

## Contributing
See the [Contributing Guide](https://github.com/getsentry/action-release/blob/master/CONTRIBUTING).

## License
See the [License File](https://github.com/getsentry/action-release/blob/master/LICENSE).
