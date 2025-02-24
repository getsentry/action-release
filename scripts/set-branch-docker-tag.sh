#!/bin/bash
set -eux

BRANCH=$(git rev-parse --abbrev-ref HEAD)

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $SCRIPT_DIR

./set-docker-tag.sh $BRANCH
