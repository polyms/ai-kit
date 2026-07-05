# Runbook pointer (agents)

How agents retrieve **Runbooks** — deploy/CI/infra **symptom → cause → fix → verify**. Pointer only; runbook body lives in **Ops CMS** (Postgres), not in this file.

## Canonical source

| Store                  | Role                                                                                                                       |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Ops CMS / Postgres** | Live runbook content — canonical                                                                                           |
| Kit site               | Public read at `/runbooks/*` (e.g. [RB-001](https://ai-kit.polyms.dev/runbooks/RB-001))                                    |
| **MCP**                | [Ops CMS MCP](./ops-cms-mcp.md) at `https://ai-kit.polyms.dev/mcp` — `search_runbooks`, `get_runbook`, `get_runbook_issue` |
| `docs/runbooks/*.md`   | Import snapshot + contributor reference — **not** agent retrieval target                                                   |

## Retrieval (`/devops`, deploy-aware `/dev`)

1. Read **`docs/agents/stack-profile.md`** when present — filter search by repo axis tags (**Stack manifest**).
2. Search by symptom or trigger phrase:
   - **MCP (preferred):** `search_runbooks` with `q` and manifest `axes` — see [ops-cms-mcp.md](./ops-cms-mcp.md)
   - **Kit site (browse):** `/runbooks?q=…`
   - Prefer issue rows (known issues) over runbook title matches when symptoms match logs.
3. Open the runbook or issue detail — confirm **symptom** and **cause** match before applying **fix**.
4. Run **verify** steps from the runbook; do not guess config.

## Boundaries

| Owns                                                | Does not own                                                                    |
| --------------------------------------------------- | ------------------------------------------------------------------------------- |
| Symptom → fix for deploy/CI/infra                   | Architecture **why** → `docs/adr/`                                              |
| Runbook stack profile + deploy greenfield checklist | Stack **design** seams → **Stack guide** ([stack-guides.md](./stack-guides.md)) |
| Config fixes per runbook                            | Timeless Polyms defaults → `skills/dev/stack-defaults.md`                       |

## DevOps agent

When acting as deploy/infra owner:

- Prefer runbook **verify** steps over guessing config
- Do not set `outputDirectory` for TanStack Start + Nitro unless the runbook says otherwise
- Do not append secrets to committed `.npmrc` — use install scripts + env vars (see RB-001)
- Escalate to ADR if the fix requires reversing an accepted architecture decision (`docs/adr/`)

## Related

- **MCP setup:** [ops-cms-mcp.md](./ops-cms-mcp.md)
- **Deploy guide** (per-app): `apps/*/DEPLOY.md` — env vars, local commands
- **Stack guides** (design): [stack-guides.md](./stack-guides.md) — `/arch`, deploy-aware `/dev`
- **Design spec:** [docs/design/ops-cms-runbooks.md](../design/ops-cms-runbooks.md)
