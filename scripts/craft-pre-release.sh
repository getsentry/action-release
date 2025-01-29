#!/bin/bash
set -eux

OLD_VERSION="${1}"
NEW_VERSION="${2}"
DOCKER_REGISTRY_IMAGE="docker://ghcr.io/getsentry/action-release-image"

# Move to the project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $SCRIPT_DIR/..

# Bump the npm package version
export npm_config_git_tag_version=false
npm version "${NEW_VERSION}"

# Update the docker image tag in the action
sed -i "s|\($DOCKER_REGISTRY_IMAGE:\)[^']*|\1$NEW_VERSION|" action.yml
