# Vercel deploy — TanStack Start + Nitro

**Runbook (symptom → fix):** [docs/runbooks/vercel-tanstack-start-monorepo.md](../../docs/runbooks/vercel-tanstack-start-monorepo.md) (RB-001)

## Quick deploy

1. Import the repo at [vercel.com](https://vercel.com)
2. **Root Directory:** repo root (`./`) — `vercel.json` lives here
3. Framework preset: **TanStack Start** (from `vercel.json`)
4. Add env vars:
   - `GITHUB_TOKEN` — GitHub PAT with `read:packages` (required for `@polyms/core-ui`)
   - `VITE_UMAMI_SCRIPT_URL` (optional)
   - `VITE_UMAMI_WEBSITE_ID` (optional)
5. Deploy

Build: `scripts/vercel-install.sh` → `nx build landing --skip-nx-cache` → Build Output API at `.vercel/output/`.

Do **not** set `outputDirectory` in `vercel.json` — that wraps Nitro output as static files and breaks SSR routing (`config.json` loses `dest: /__server`).

Nitro uses the `vercel` preset when `VERCEL=1` during build.

## Local

```bash
pnpm dev          # from repo root
pnpm build        # produces apps/landing/.output/
cd apps/landing && pnpm preview
```

## Stack notes

- `@tanstack/react-start` + `nitro` — Start replaces `@tanstack/router-plugin`
- `@tanstack/react-router` must match Start (≥ 1.168) for SSR `./ssr/server` export
- Vite 7+ required (Nitro 3 uses `this.meta` in config hooks)
- No `index.html` / `main.tsx` — entry is `src/router.tsx` + document shell in `__root.tsx`

## Vercel install failures

See [RB-001-01](../../docs/runbooks/vercel-tanstack-start-monorepo.md#rb-001-01-github-packages-auth) in the runbook.

Vercel does **not** expand `${GITHUB_TOKEN}` in committed `.npmrc`. `vercel.json` runs `scripts/vercel-install.sh`, which exports `GITHUB_TOKEN` (or `NPM_TOKEN`) and sets GitHub Packages auth in the ephemeral user `.npmrc` before `pnpm install`.

Add `GITHUB_TOKEN` in Vercel → Project → Settings → Environment Variables (Production + Preview). Use a PAT with `read:packages`, not the auto-generated repo token unless it has package access.

## GitHub Pages

`.github/workflows/landing-pages.yml` still uploads `apps/landing/dist/` — incompatible with Start (output is `.output/`). Use Vercel for production, or update that workflow separately.
