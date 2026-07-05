# Runbook pointer (agents)

> **Canonical retrieval:** [knowledge.md](./knowledge.md) with `intent: incident`.

How agents handle deploy/CI/infra **symptom → cause → fix → verify**. Pointer only; body lives in **Ops CMS** (Knowledge articles + chunks), not in this file.

## Retrieval (`/devops`, deploy-aware `/dev`)

1. Read **`docs/agents/stack-profile.md`** when present — filter by manifest axis tags.
2. Search by symptom or trigger phrase:
   - **MCP:** `search_knowledge` with `q` and `intent: "incident"` — see [ops-cms-mcp.md](./ops-cms-mcp.md)
   - **Kit site:** `/knowledge?q=…&intent=incident`
3. Open incident chunks (`chunkType: incident`) — confirm **symptom** and **cause** before **fix**.
4. Run **verify** steps; do not guess config.

Example: [RB-001](https://ai-kit.polyms.dev/knowledge/RB-001) — Vercel + TanStack Start deploy.

## Boundaries

| Owns                        | Does not own                                                            |
| --------------------------- | ----------------------------------------------------------------------- |
| Symptom → fix for deploy/CI | Architecture **why** → `docs/adr/`                                      |
| Incident chunks + checklist | Design seams → `intent: design` in [stack-guides.md](./stack-guides.md) |

## Related

- **Knowledge:** [knowledge.md](./knowledge.md)
- **MCP setup:** [ops-cms-mcp.md](./ops-cms-mcp.md)
- **Deploy guide** (per-app): `apps/*/DEPLOY.md`
- **Design seams:** [stack-guides.md](./stack-guides.md)
