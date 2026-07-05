# Stack guide pointer (agents)

How agents retrieve **Stack guides** — stack-combo **design knowledge** (greenfield checklist + seam conventions for routing, state, module boundaries). Pointer only; guide body lives in **Ops CMS** (Postgres), not in this file.

## Canonical source

| Store                          | Role                                                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| **Ops CMS / Postgres**         | Live stack guide content — canonical                                                                          |
| Kit site                       | Public read at `/guides/*`                                                                                    |
| **MCP**                        | [Ops CMS MCP](./ops-cms-mcp.md) at `https://ai-kit.polyms.dev/mcp` — `search_stack_guides`, `get_stack_guide` |
| `skills/dev/stack-defaults.md` | Timeless Polyms greenfield defaults — **not** stack-combo-specific CMS content                                |
| `docs/adr/`                    | Irreversible **why** — read for constraints, not design recipes                                               |

## Retrieval (`/arch`, deploy-aware `/dev`)

1. Read **`docs/agents/stack-profile.md`** when present — filter by repo axis tags (**Stack manifest**).
2. Search stack guides by axis combo or topic:
   - **MCP (preferred):** `search_stack_guides` with `q` and manifest `axes` — see [ops-cms-mcp.md](./ops-cms-mcp.md)
   - **Kit site (browse):** `/guides?q=…`
3. Read **design checklist** and **seam sections** — apply to module boundaries in the current slice.
4. For deploy/CI incidents, use [runbooks.md](./runbooks.md) — **Stack guide** does not host symptom→fix.

## Intent split (Runbook vs Stack guide)

Same axis tags may link sibling **Runbook** + **Stack guide** for one stack combo:

| Content type    | Intent                   | Example (RB-001 / SG-001)                         |
| --------------- | ------------------------ | ------------------------------------------------- |
| **Runbook**     | Deploy/build correctness | `vercel.json`, Nitro output paths, CI env         |
| **Stack guide** | App design correctness   | Route loaders, Zustand vs URL state, module seams |

Do not duplicate the same checklist item across both — author one intent per item.

## Boundaries

| Owns                        | Does not own                                       |
| --------------------------- | -------------------------------------------------- |
| Stack-combo design patterns | Deploy incidents → [runbooks.md](./runbooks.md)    |
| Seam conventions per stack  | Irreversible why → ADR                             |
| Design greenfield checklist | Timeless defaults → `skills/dev/stack-defaults.md` |

## Related

- **MCP setup:** [ops-cms-mcp.md](./ops-cms-mcp.md)
- **Runbooks** (incident): [runbooks.md](./runbooks.md) — `/devops`
- **Design spec:** [docs/design/ops-cms-runbooks.md](../design/ops-cms-runbooks.md)
