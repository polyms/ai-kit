# Vercel deploy — TanStack Start + Nitro

**Incident article (RB-001):** [RB-001 on kit site](https://ai-kit.polyms.dev/knowledge/RB-001) — live Knowledge in Ops CMS.

## Quick deploy

1. Import the repo at [vercel.com](https://vercel.com)
2. **Root Directory:** repo root (`./`) — `vercel.json` lives here
3. Framework preset: **TanStack Start** (from `vercel.json`)
4. Add env vars:
   - `GITHUB_TOKEN` — GitHub PAT with `read:packages` (required for `@polyms/ui-kit`)
   - `DATABASE_URL` — Supabase Postgres URI (required for `/knowledge/*` CMS read)
   - `VITE_UMAMI_SCRIPT_URL` (optional)
   - `VITE_UMAMI_WEBSITE_ID` (optional)
5. Deploy

Build: `scripts/vercel-install.sh` → `nx build landing --skip-nx-cache` → Build Output API at `.vercel/output/`.

Do **not** set `outputDirectory` in `vercel.json` — that wraps Nitro output as static files and breaks SSR routing (`config.json` loses `dest: /__server`).

Nitro uses the `vercel` preset when `VERCEL=1` during build.

## Local

```bash
cp apps/landing/.env.example apps/landing/.env.local
# Set DATABASE_URL to your Supabase Postgres URI

pnpm install
cd apps/landing && pnpm db:generate && pnpm db:migrate && pnpm db:seed

pnpm dev            # from repo root
pnpm landing:dev    # same as pnpm dev
# from apps/landing: pnpm dev  (or pnpm -w landing:dev from repo root)
pnpm build        # produces apps/landing/.output/
cd apps/landing && pnpm preview
```

Knowledge articles read from Postgres at runtime — `DATABASE_URL` must be set for `/knowledge/*`.

## Stack notes

- `@tanstack/react-start` + `nitro` — Start replaces `@tanstack/router-plugin`
- `@tanstack/react-router` must match Start (≥ 1.168) for SSR `./ssr/server` export
- Vite 7+ required (Nitro 3 uses `this.meta` in config hooks)
- No `index.html` / `main.tsx` — entry is `src/router.tsx` + document shell in `__root.tsx`

## Vercel install failures

See [RB-001-01](https://ai-kit.polyms.dev/knowledge/RB-001#rb-001-01-github-packages-auth) on the kit site.

Vercel does **not** expand `${GITHUB_TOKEN}` in committed `.npmrc`. `vercel.json` runs `scripts/vercel-install.sh`, which exports `GITHUB_TOKEN` (or `NPM_TOKEN`) and sets GitHub Packages auth in the ephemeral user `.npmrc` before `pnpm install`.

Add `GITHUB_TOKEN` in Vercel → Project → Settings → Environment Variables (Production + Preview). Use a PAT with `read:packages`, not the auto-generated repo token unless it has package access.

## GitHub Pages

`.github/workflows/landing-pages.yml` still uploads `apps/landing/dist/` — incompatible with Start (output is `.output/`). Use Vercel for production, or update that workflow separately.
