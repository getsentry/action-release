#!/bin/bash
set -eux

OLD_VERSION="${1}"
NEW_VERSION="${2}"

# Move to the project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $SCRIPT_DIR/..

# Bump the npm version without creating a git tag for it
# as craft/publish will take care of that
export npm_config_git_tag_version=false
npm version "${NEW_VERSION}"

# The build output contains the package.json so we need to
# rebuild to ensure it's reflected after bumping the version
yarn install && yarn build

# Update the docker tag in action.yml
yarn bump-docker-tag "${NEW_VERSION}"
