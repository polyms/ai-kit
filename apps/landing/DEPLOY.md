# Vercel deploy — TanStack Start + Nitro

## Quick deploy

1. Import the repo at [vercel.com](https://vercel.com)
2. **Root Directory:** repo root (`./`) — `vercel.json` lives here
3. Framework preset: **TanStack Start** (from `vercel.json`)
4. Add env vars:
   - `GITHUB_TOKEN` — GitHub PAT with `read:packages` (required for `@polyms/core-ui`)
   - `VITE_UMAMI_SCRIPT_URL` (optional)
   - `VITE_UMAMI_WEBSITE_ID` (optional)
5. Deploy

Build: `scripts/vercel-install.sh` → `pnpm exec nx build landing` → output in `apps/landing/.output/`

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

Vercel does **not** expand `${GITHUB_TOKEN}` in committed `.npmrc`. `vercel.json` runs `scripts/vercel-install.sh`, which appends the token from `GITHUB_TOKEN` (or `NPM_TOKEN`) before `pnpm install`.

Add `GITHUB_TOKEN` in Vercel → Project → Settings → Environment Variables (Production + Preview). Use a PAT with `read:packages`, not the auto-generated repo token unless it has package access.

## GitHub Pages

`.github/workflows/landing-pages.yml` still uploads `apps/landing/dist/` — incompatible with Start (output is `.output/`). Use Vercel for production, or update that workflow separately.
