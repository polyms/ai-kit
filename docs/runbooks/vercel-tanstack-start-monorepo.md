---
id: RB-001
title: Vercel + TanStack Start + Nitro (pnpm Nx monorepo)
tags:
  - vercel
  - tanstack-start
  - nitro
  - pnpm
  - nx
  - monorepo
  - github-packages
  - ssr
  - build-output-api
triggers:
  - vercel build fails
  - No Output Directory named dist
  - No Output Directory named .output
  - pnpm install @polyms
  - GITHUB_TOKEN
  - vercelignore skills
  - TypeScript route /skills/$slug
  - config.json dest __server
  - SSR 404 on Vercel
  - nested static/static
related_files:
  - vercel.json
  - .vercelignore
  - .npmrc
  - scripts/vercel-install.sh
  - apps/landing/vite.config.ts
  - apps/landing/project.json
  - apps/landing/DEPLOY.md
audience: devops-agent
---

> **Git snapshot** — live canonical content: [RB-001 on kit site](https://ai-kit.polyms.dev/knowledge/RB-001). Agents retrieve via [docs/agents/runbooks.md](../agents/runbooks.md), not this file.

# RB-001: Vercel + TanStack Start + Nitro (pnpm Nx monorepo)

Reference implementation: **ai-kit** landing app (`apps/landing/`), repo root = Vercel project root.

## Symptom index

| Symptom                                                                   | Issue ID                                                 |
| ------------------------------------------------------------------------- | -------------------------------------------------------- |
| `pnpm install` fails on `@polyms/core-ui` (401/404)                       | [RB-001-01](#rb-001-01-github-packages-auth)             |
| `vercel build` → `No Output Directory named "dist"`                       | [RB-001-02](#rb-001-02-nx-cache-vs-vercel-output)        |
| `vercel build` → `No Output Directory named ".output"`                    | [RB-001-03](#rb-001-03-wrong-outputdirectory)            |
| `.vercel/output/static/static/…` or `functions/` inside `static/`         | [RB-001-03](#rb-001-03-wrong-outputdirectory)            |
| `.vercel/output/config.json` only 404 → `/404.html`, no `dest: /__server` | [RB-001-03](#rb-001-03-wrong-outputdirectory)            |
| TS: `"/skills/$slug"` not assignable to route union                       | [RB-001-04](#rb-001-04-vercelignore-excludes-app-routes) |
| Build OK locally, routes missing on Vercel                                | [RB-001-04](#rb-001-04-vercelignore-excludes-app-routes) |

---

## Stack profile (correct state)

### Outputs (two modes)

| Command                    | `VERCEL`                | Output path                     | Purpose                        |
| -------------------------- | ----------------------- | ------------------------------- | ------------------------------ |
| `pnpm build` (local)       | unset                   | `apps/landing/.output/`         | Local preview (`pnpm preview`) |
| `vercel build` / Vercel CI | `1` (set by Vercel CLI) | **repo root** `.vercel/output/` | Build Output API v3 for deploy |

Nitro **vercel** preset must be active when `VERCEL=1`. In a monorepo with Vercel root = repo root, Nitro `output.dir` must point to **`../../.vercel/output`** from `apps/landing/` (see `apps/landing/vite.config.ts`).

### Build Output API layout (expected)

```text
.vercel/output/
├── config.json          # routes include "dest": "/__server"
├── static/
│   └── assets/          # NOT static/static/
└── functions/
    └── __server.func/   # SSR handler — NOT under static/
```

### `config.json` (minimal SSR check)

Must contain a catch-all route to the server function:

```json
{ "src": "/(.*)", "dest": "/__server" }
```

Also expect `handle: filesystem` and asset cache headers for `/assets/(.*)`.

### Repo files (ai-kit)

| File                          | Role                                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------ |
| `vercel.json`                 | `framework: tanstack-start`, custom install/build commands, **no** `outputDirectory` |
| `scripts/vercel-install.sh`   | GitHub Packages auth before `pnpm install`                                           |
| `.vercelignore`               | Shrink upload; **root-anchored** patterns only                                       |
| `.npmrc`                      | Scope registry only — **no** committed auth token                                    |
| `apps/landing/vite.config.ts` | `nitro({ preset: 'vercel', output.dir: '../../.vercel/output' })` when `VERCEL=1`    |

---

## Greenfield checklist

Use when setting up another **pnpm Nx monorepo + TanStack Start + private `@polyms/*` on Vercel**:

- [ ] Vercel **Root Directory** = repo root (or adjust Nitro `output.dir` relative to app package)
- [ ] `vercel.json`: `framework: "tanstack-start"`, **omit** `outputDirectory`
- [ ] `buildCommand` runs Nx/app build with **`--skip-nx-cache`** (or separate cache key for Vercel builds)
- [ ] `installCommand` sets GitHub Packages auth without mutating committed `.npmrc`
- [ ] Vercel env: `GITHUB_TOKEN` (PAT, `read:packages`) on Production + Preview
- [ ] `.npmrc`: `@polyms:registry=https://npm.pkg.github.com` + `registry=https://registry.npmjs.org` — no token in git
- [ ] `.vercelignore`: `/skills/`, `/docs/`, `/agents/` — **leading `/`** so `apps/*/src/routes/skills/` is not excluded
- [ ] `vite.config.ts`: Nitro vercel preset + monorepo `output.dir` when `VERCEL=1`
- [ ] Commit generated `routeTree.gen.ts` (or ensure route files are not stripped by ignore rules)
- [ ] Verify: `rm -rf .vercel/output && vercel build` → success; `config.json` has `/__server`

Optional env (app): `VITE_UMAMI_SCRIPT_URL`, `VITE_UMAMI_WEBSITE_ID`.

---

## Known issues

### RB-001-01: GitHub Packages auth

**Symptom:** `pnpm install` fails on Vercel for `@polyms/core-ui`; 401/404 from `npm.pkg.github.com`.

**Cause:**

- Vercel does **not** expand `${GITHUB_TOKEN}` in a **committed** project `.npmrc` (pnpm 11+ ignores it for security).
- Appending tokens to `.npmrc` during install pollutes git and duplicates lines on retry.

**Fix:**

1. Vercel project env: `GITHUB_TOKEN` = GitHub PAT with `read:packages` (Production + Preview).
2. `installCommand`: `bash scripts/vercel-install.sh` — exports token, runs `pnpm config set "//npm.pkg.github.com/:_authToken" "$GITHUB_TOKEN" --location user`, then `pnpm install --frozen-lockfile`.
3. Committed `.npmrc`: registry + scope only.

**Verify:**

```bash
bash scripts/vercel-install.sh
# install completes; no token lines added to ./.npmrc
```

**Local dev:** `export GITHUB_TOKEN=$(gh auth token)` then run install script, or set token in `~/.npmrc`.

---

### RB-001-02: Nx cache vs Vercel output

**Symptom:** `vercel build` succeeds once, then fails with `No Output Directory named "dist"` (or empty/wrong `.vercel/output/config.json`).

**Cause:** Nx **cache hit** from a prior local `pnpm build` where `VERCEL` was unset. That run restores `apps/landing/.output/` but **not** repo root `.vercel/output/`. Vercel CLI then falls back to looking for `dist`.

**Fix:**

- `vercel.json` `buildCommand` must include **`--skip-nx-cache`** on the Nx build, **or**
- Use a dedicated Nx target for Vercel whose inputs include `VERCEL=1`, **or**
- Run `pnpm exec nx reset` before debugging locally.

**Verify:**

```bash
rm -rf .vercel/output
vercel build
test -f .vercel/output/config.json
grep -q '__server' .vercel/output/config.json
```

Second consecutive `vercel build` should also pass (not `[local cache]` without output).

---

### RB-001-03: Wrong `outputDirectory`

**Symptom:**

- `No Output Directory named ".output"` after build, **or**
- `.vercel/output/static/static/assets/…`, `functions/` nested under `static/`, **or**
- `config.json` routes everything to `/404.html` without `dest: /__server`.

**Cause:** Setting `outputDirectory` in `vercel.json` (e.g. `"apps/landing/.vercel/output"` or `".output"`) makes Vercel CLI treat Nitro’s **Build Output API** tree as a **static folder** and wrap/copy it incorrectly.

**Fix:**

- **Remove** `outputDirectory` from `vercel.json`.
- Let Nitro emit Build Output API directly to **repo root** `.vercel/output/` (configure `output.dir` in `vite.config.ts` for monorepo).
- Keep `framework: "tanstack-start"`.

**Verify:**

```bash
rm -rf .vercel/output && vercel build
find .vercel/output/static -maxdepth 2 -type d   # expect static/assets, NOT static/static
grep '"dest": "/__server"' .vercel/output/config.json
```

---

### RB-001-04: `.vercelignore` excludes app routes

**Symptom:**

- TypeScript: `"/skills/$slug"` not in route union (only `/`, `/quick-start`).
- Or Vercel build passes but skill pages 404 / router tree missing routes.

**Cause:** Pattern `skills/` in `.vercelignore` matches **any** directory named `skills`, including `apps/landing/src/routes/skills/`. TanStack Router regenerates a reduced route tree without those files.

**Fix:** Anchor ignore patterns to **repo root** only:

```gitignore
/skills/
/agents/
/docs/
/demo/
```

Not `skills/` (matches everywhere).

**Verify:**

- `apps/landing/src/routes/skills/` present in deployment upload.
- `apps/landing/src/routeTree.gen.ts` includes `/skills/$slug`.
- `pnpm exec tsc --noEmit` in `apps/landing/` passes.

---

## Debug commands

```bash
# Full local Vercel build (from repo root)
rm -rf .vercel/output
vercel pull    # optional: sync project env
vercel build

# Inspect Build Output API
cat .vercel/output/config.json
ls -la .vercel/output/static/assets
ls .vercel/output/functions/

# Confirm Nitro used Vercel preset (in build log)
# [info] [nitro:vercel] Using `nodejs24.x` runtime.

# Nx cache reset when output looks stale
pnpm exec nx reset
```

---

## Anti-patterns

| Do not                                                 | Why                                             |
| ------------------------------------------------------ | ----------------------------------------------- |
| Set `outputDirectory` for TanStack Start + Nitro       | Breaks Build Output API / SSR routing           |
| Use `skills/` in `.vercelignore` without `/` prefix    | Drops app route files under `routes/skills/`    |
| Commit PAT / append `_authToken` to project `.npmrc`   | Security leak; pnpm ignores `${VAR}` anyway     |
| Rely on Nx cache for Vercel builds without BOA outputs | Missing `.vercel/output` → `dist` error         |
| Point deploy at `apps/landing/.output/` on Vercel      | Local Nitro output; not Vercel Build Output API |

---

## References

- App quick start: [apps/landing/DEPLOY.md](../../apps/landing/DEPLOY.md)
- Vercel: [TanStack Start on Vercel](https://vercel.com/docs/frameworks/full-stack/tanstack-start)
- Architecture (legacy static decision): [ADR-0002](../adr/0002-kit-site-static-vite-core-ui.md) — partially superseded by Start + Vercel; prefer this runbook for deploy ops.
