# Stack guide pointer (agents)

> **Canonical retrieval:** [knowledge.md](./knowledge.md) with `intent: design`.

How agents retrieve stack-combo **design seams** (routing, state, module boundaries). Pointer only; body lives in **Ops CMS** (Knowledge articles + chunks), not in this file.

## Retrieval (`/arch`, deploy-aware `/dev`)

1. Read **`docs/agents/stack-profile.md`** when present — pass manifest `axes` to search.
2. Search by topic or seam keyword:
   - **MCP:** `search_knowledge` with `q` and `intent: "design"` — see [ops-cms-mcp.md](./ops-cms-mcp.md)
   - **Kit site:** `/knowledge?q=…&intent=design`
3. Open seam chunks in article `sortOrder` — routing before state before modules when authored that way.
4. For deploy incidents, use [runbooks.md](./runbooks.md) (`intent: incident`) — design docs do not host symptom→fix.

Example: [SG-001](https://ai-kit.polyms.dev/knowledge/SG-001) — TanStack Start design seams.

## Boundaries

| Owns                     | Does not own                                       |
| ------------------------ | -------------------------------------------------- |
| Stack-combo design seams | Deploy incidents → [runbooks.md](./runbooks.md)    |
| Seam chunks + checklist  | Timeless defaults → `skills/dev/stack-defaults.md` |

## Related

- **Knowledge:** [knowledge.md](./knowledge.md)
- **Incidents:** [runbooks.md](./runbooks.md)
- **MCP setup:** [ops-cms-mcp.md](./ops-cms-mcp.md)
