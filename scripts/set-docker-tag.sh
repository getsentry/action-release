#!/bin/bash
set -euo pipefail
set -x

TAG="${1:?Provide the image tag}"
if [[ ! "$TAG" =~ ^[a-zA-Z0-9][a-zA-Z0-9_.-]*$ ]]; then
  echo "Invalid Docker image tag: $TAG" >&2
  exit 1
fi

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/.."

# Marker is metadata for the image-publishing workflow, not an action step.
MARKER='# ci-docker-image: ghcr.io/getsentry/action-release-image:'
if ! grep -Eq '^# ci-docker-image: ghcr.io/getsentry/action-release-image:[a-zA-Z0-9][a-zA-Z0-9_.-]*$' action.yml; then
  echo "Missing or invalid CI image marker in action.yml" >&2
  exit 1
fi

# GNU and BSD/macOS sed accept -i.bak.
sed -i.bak -E "s|^(${MARKER})[a-zA-Z0-9][a-zA-Z0-9_.-]*$|\\1${TAG}|" action.yml
rm -f action.yml.bak
