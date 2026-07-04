# Vercel deploy — TanStack Start + Nitro

## Quick deploy

1. Import the repo at [vercel.com](https://vercel.com)
2. **Root Directory:** repo root (`./`) — `vercel.json` lives here
3. Framework preset: **TanStack Start** (from `vercel.json`)
4. Add env vars:
   - `NPM_TOKEN` or `GITHUB_TOKEN` — required for `@polyms/core-ui` from GitHub Packages
   - `VITE_UMAMI_SCRIPT_URL` (optional)
   - `VITE_UMAMI_WEBSITE_ID` (optional)
5. Deploy

Build: `pnpm install` → `pnpm exec nx build landing` → output in `apps/landing/.output/`

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

If `pnpm install` fails on Vercel, add a project env var `NPM_TOKEN` with a GitHub PAT that has `read:packages`. Vercel injects it into `.npmrc` for `@polyms` scope.

## GitHub Pages

`.github/workflows/landing-pages.yml` still uploads `apps/landing/dist/` — incompatible with Start (output is `.output/`). Use Vercel for production, or update that workflow separately.
