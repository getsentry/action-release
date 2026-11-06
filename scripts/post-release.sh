#!/bin/bash
set -eux

# Craft runs this after it merges the release branch into the merge target.
# The release commit sets the docker tag in action.yml to the released version.
# Set it back to `master`, so `@master` uses the image that CI publishes for master.

# Move to the project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $SCRIPT_DIR/..

# Only change master. Do nothing if Craft did not merge into master.
if [[ "$(git rev-parse --abbrev-ref HEAD)" != "master" ]]; then
  echo "Not on master, skipping docker tag reset."
  exit 0
fi

# Call the script directly. The publish runner may not have yarn.
./scripts/set-docker-tag.sh master

if git diff --quiet action.yml; then
  echo "Docker tag is already master."
  exit 0
fi

git add action.yml
git commit -m "chore: Set docker tag for master [skip ci]"
git push origin master
