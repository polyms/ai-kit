# Runbooks (contributor reference)

Operational playbooks for deploy, CI, and infra. **Symptom → cause → fix → verify.**

## Live content (canonical)

Runbooks are **CMS-authored** in Ops CMS (Postgres). Agents and humans retrieve live content from:

- Kit site: `/knowledge/*` — e.g. [RB-001 on ai-kit.polyms.dev](https://ai-kit.polyms.dev/knowledge/RB-001)
- MCP: [docs/agents/ops-cms-mcp.md](../agents/ops-cms-mcp.md) — `https://ai-kit.polyms.dev/mcp`
- Agent pointer: [docs/agents/runbooks.md](../agents/runbooks.md)

**Do not** treat git markdown below as the live source — it is an **import snapshot** and authoring reference only.

## Snapshot index (git)

| ID     | Snapshot                                                                 | When to use                                                                                                                                                     |
| ------ | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RB-001 | [vercel-tanstack-start-monorepo.md](./vercel-tanstack-start-monorepo.md) | Vercel deploy/build for TanStack Start + Nitro in a pnpm Nx monorepo; GitHub Packages for `@polyms/*`; `vercel build` / `dist` / `.output` / SSR routing errors |

## Conventions

Each runbook includes:

- **Metadata** — tags and trigger phrases for search/retrieval
- **Stack profile** — deploy-correct config for this stack combo
- **Greenfield checklist** — deploy/build setup traps (design checklist lives in **Stack guide** when shipped)
- **Known issues** — stable IDs (`RB-001-NN`), symptom, cause, fix, verify

App-specific quick start lives under `apps/*/DEPLOY.md` (**Deploy guide**). Runbooks here are **cross-cutting** and reusable.

## Adding or updating a runbook

**Production (Ops CMS):** author at `/ops/knowledge` on the kit site; publish-on-save to Postgres.

**Git snapshot (contributors):**

1. Edit `docs/runbooks/<slug>.md` for reviewable diffs and import reference
2. Register in this README snapshot table
3. Run CMS seed/migrate when importing to Postgres (see `apps/landing/prisma/`)
4. Keep [docs/agents/runbooks.md](../agents/runbooks.md) retrieval contract aligned — no duplicate body in agent docs

## Related

- **Stack guides** (design knowledge): [docs/agents/stack-guides.md](../agents/stack-guides.md) — planned `/guides/*`
- **Design spec:** [docs/design/ops-cms-runbooks.md](../design/ops-cms-runbooks.md)
