# Stack profile

Per-repo **Stack manifest** — axes that filter Knowledge search (`search_knowledge`
`axes`). Written by `/setup`; consumed by `/dev`, `/devops`, `/arch`. Pointer only; live recipes
stay in Ops CMS — see [knowledge.md](./knowledge.md).

## Axes

```yaml
axes:
  - vercel
  - tanstack-start
  - tanstack-router
  - nitro
  - zustand
  - pnpm
  - nx
  - monorepo
  - biome
  - prisma
  - postgres
```

## Detected from

- `apps/landing` — TanStack Start + Nitro + Prisma + Zustand; kit site on Vercel
- Repo root — pnpm + Nx monorepo; `vercel.json`; Biome/Prettier at repo root
- User intent — ai-kit companion apps share this stack combo for Knowledge filtering

## Notes

SSR kit site. Axes align with current Ops CMS catalog tags — re-run `/setup` if the stack changes.
Seed fixtures in `apps/landing/prisma/` are samples for kit tests, not fixed retrieval targets.
