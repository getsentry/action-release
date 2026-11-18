#!/bin/bash
set -eux

DOCKER_REGISTRY_IMAGE="docker://ghcr.io/getsentry/action-release-image"
TAG="${1}"

# Move to the project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $SCRIPT_DIR/..

# We don't want the backup but this is the only way to make this
# work on macos as well
sed -i.bak -e "s|\($DOCKER_REGISTRY_IMAGE:\)[^']*|\1$TAG|" action.yml && rm -f action.yml.bak
