# Ops CMS MCP (agents)

How agents retrieve **Knowledge** via MCP on the kit site. Pointer only — content lives in **Ops CMS** (Postgres).

**Primary pointer:** [knowledge.md](./knowledge.md) — unified retrieval workflow.

## Endpoint

| Setting    | Value                                         |
| ---------- | --------------------------------------------- |
| **URL**    | `https://ai-kit.polyms.dev/mcp`               |
| Transport  | MCP SDK default (Streamable HTTP on `/mcp`)   |
| Rate limit | Same edge rule as the kit site (shared quota) |

Local dev: `http://localhost:6300/mcp` when `pnpm dev` is running in `apps/landing/`.

## Cursor setup (manual)

Add to Cursor MCP config (e.g. **Settings → MCP** or `.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "ai-kit-ops-cms": {
      "url": "https://ai-kit.polyms.dev/mcp"
    }
  }
}
```

Restart Cursor or reload MCP after saving. No change to `bootstrap.sh` — kit-site MCP is configured separately from skill symlinks.

## Tools

| Tool                  | Module           | Use                                                                  |
| --------------------- | ---------------- | -------------------------------------------------------------------- |
| `search_knowledge`    | `lib/knowledge/` | Topic/symptom/config search; filter by `intent` + **Stack manifest** |
| `get_knowledge`       | `lib/knowledge/` | Full article — chunks in `sortOrder` (reading order)                 |
| `get_knowledge_chunk` | `lib/knowledge/` | Single chunk + parent article — verbatim config copy                 |

There is **no** public REST catalog API. Agents use MCP or browse `/knowledge/*` on the kit site.

## Retrieval workflow

1. Read **`docs/agents/stack-profile.md`** when present — pass manifest axes to search tools.
2. Call `search_knowledge` with `q`, optional `intent` (`incident` | `design` | `toolchain`), and `axes`.
3. Open `get_knowledge` or `get_knowledge_chunk` — confirm verbatim body before apply; follow chunk `sortOrder`.
4. **Hybrid rank:** when `OPENROUTER_API_KEY` is set and chunks are embedded, search combines keyword match + pgvector cosine similarity; otherwise keyword-only.

## Related

- **Knowledge pointer:** [knowledge.md](./knowledge.md)
- **Incidents:** [runbooks.md](./runbooks.md)
- **Design seams:** [stack-guides.md](./stack-guides.md)
- **Design spec:** [docs/design/ops-cms-runbooks.md](../design/ops-cms-runbooks.md)
- **Glossary:** **Catalog feature module** in [CONTEXT.md](../../CONTEXT.md)
