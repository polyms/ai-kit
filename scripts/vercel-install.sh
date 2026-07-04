#!/usr/bin/env bash
set -euo pipefail

token="${GITHUB_TOKEN:-${NPM_TOKEN:-}}"
if [ -z "$token" ]; then
  echo 'Missing GITHUB_TOKEN (or NPM_TOKEN) for @polyms packages from GitHub Packages' >&2
  exit 1
fi

# Vercel does not expand ${GITHUB_TOKEN} in committed .npmrc during install.
printf '\n//npm.pkg.github.com/:_authToken=%s\n' "$token" >> .npmrc
exec pnpm install --frozen-lockfile
