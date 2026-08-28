#!/bin/bash
set -eux

# Extract the branch name from git and replace all non-alphanumerical characters with `-`
BRANCH=$(git rev-parse --abbrev-ref HEAD | sed 's/[^a-zA-Z0-9-]/-/g')

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $SCRIPT_DIR

./set-docker-tag.sh $BRANCH
