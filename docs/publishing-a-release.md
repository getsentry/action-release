# Publishing a release

The [build.yml](../.github/workflows/build.yml) workflow will build a Docker image every time a pull request merges to `master` and upload it to [the GitHub registry](https://github.com/orgs/getsentry/packages?repo_name=action-release).

> [!WARNING]
> Merging pull requests into `master` means changes are live for anyone who uses the action regardless of bumping the version.
> Be extremely careful and intentional with changes and ensure properly testing them before merging, see [#Testing](development.md#testing) for more info.

> [!NOTE]
> Unfortunately, we only use the `latest` tag for the Docker image, thus, making use of a version with the action ineffective (e.g. `v1` vs `v1.3.0`).
> See #129 on how to fix this.

> [!NOTE]
> At the moment our Docker image publishing is decoupled from `tag` creation in the repository.
> We should only publish a specific Docker tag when we create a tag (you can make GitHub workflows listen to this). See #102 for details.
> Once this is fixed, merges to `master` will not make the Docker image live.

When you are ready to make a release, open a [new release checklist issue](https://github.com/getsentry/action-release/issues/new?assignees=&labels=&template=release-checklist.md&title=New+release+checklist+for+%5Bversion+number%5D) and follow the steps in there.

> [!NOTE]
> At the moment releases are only used to inform users of changes.

The Docker build is [multi-staged](https://github.com/getsentry/action-release/blob/master/Dockerfile) in order to make the final image used by the action as small as possible to reduce network transfer (use `docker images` to see the sizes of the images).
