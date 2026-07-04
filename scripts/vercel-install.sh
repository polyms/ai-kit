#!/usr/bin/env bash
set -euo pipefail

token="${GITHUB_TOKEN:-${NPM_TOKEN:-}}"
if [ -z "$token" ]; then
  echo 'Missing GITHUB_TOKEN (or NPM_TOKEN) for @polyms packages from GitHub Packages' >&2
  exit 1
fi

export GITHUB_TOKEN="$token"

# pnpm ignores ${GITHUB_TOKEN} in committed .npmrc — inject auth via user config instead.
pnpm config set "//npm.pkg.github.com/:_authToken" "$GITHUB_TOKEN" --location user

exec pnpm install --frozen-lockfile
