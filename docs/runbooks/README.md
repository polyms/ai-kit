# Runbooks

Operational playbooks for deploy, CI, and infra. **Symptom → cause → fix → verify.**

Agents (including future **devops-agent**) should read this index first, then open the matching runbook.

| ID     | Runbook                                                                  | When to use                                                                                                                                                     |
| ------ | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RB-001 | [vercel-tanstack-start-monorepo.md](./vercel-tanstack-start-monorepo.md) | Vercel deploy/build for TanStack Start + Nitro in a pnpm Nx monorepo; GitHub Packages for `@polyms/*`; `vercel build` / `dist` / `.output` / SSR routing errors |

## Conventions

Each runbook includes:

- **Metadata** — tags and trigger phrases for search/retrieval
- **Stack profile** — what “correct” looks like
- **Greenfield checklist** — setup a similar project without re-learning traps
- **Known issues** — stable IDs (`RB-001-NN`), symptom, cause, fix, verify

App-specific quick start may live under `apps/*/DEPLOY.md`; runbooks here are **cross-cutting** and reusable.

## Adding a runbook

1. Add `docs/runbooks/<slug>.md` with metadata block + symptom index
2. Register in this README
3. Link from `docs/agents/runbooks.md` if agents should auto-discover it
