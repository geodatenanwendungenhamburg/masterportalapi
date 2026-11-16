#!/bin/sh
set -eu

if [ -z "${CI_COMMIT_TAG:-}" ]; then
  echo "ERROR: CI_COMMIT_TAG is required"
  exit 1
fi

# Works for both changelog styles:
#   "## 2026-11-06 v3.28.1"  (tag with "v")
#   "## 2.66.0 - 2026-10-29" (version without "v")
VERSION="${CI_COMMIT_TAG#v}"

awk -v tag="$CI_COMMIT_TAG" -v version="$VERSION" '
  BEGIN {
    found = 0
  }

  /^## / {
    if (found) {
      exit
    }
    for (i = 2; i <= NF; i++) {
      if ($i == tag || $i == version) {
        found = 1
      }
    }
  }

  found {
    print
  }
' CHANGELOG.md > release-description.md

if [ ! -s release-description.md ]; then
  echo "ERROR: Could not find changelog entry for $CI_COMMIT_TAG"
  exit 1
fi

sed -i ':a;N;$!ba;s/[[:space:]]*---[[:space:]]*$//' release-description.md
