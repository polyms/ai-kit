# Ops CMS MCP (agents)

How agents retrieve **Runbooks** and **Stack guides** via MCP on the kit site. Pointer only — content lives in **Ops CMS** (Postgres).

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

## Tools (per catalog feature module)

MCP tools map to **catalog feature modules** in `apps/landing/src/lib/<feature>/` — each imports the feature **service** in-process on the kit site.

| Tool                  | Feature module  | Use                                                       |
| --------------------- | --------------- | --------------------------------------------------------- |
| `search_runbooks`     | `lib/runbooks/` | Symptom/trigger search; filter by **Stack manifest** axes |
| `get_runbook`         | `lib/runbooks/` | Full runbook by id or slug                                |
| `get_runbook_issue`   | `lib/runbooks/` | Known issue + parent runbook by issue id                  |
| `search_stack_guides` | `lib/guides/`   | Design-topic search; filter by manifest axes              |
| `get_stack_guide`     | `lib/guides/`   | Full guide by id or slug                                  |

There is **no** public REST catalog API (`/api/runbooks/*`, `/api/guides/*`). Agents use MCP or browse the kit site.

## Retrieval workflow

1. Read **`docs/agents/stack-profile.md`** when present — pass manifest axes to search tools.
2. Call the appropriate search tool with symptom, topic, or trigger phrase.
3. Open detail via `get_*` — confirm content matches before applying fixes or design patterns.
4. **Runbook** for deploy/CI incidents; **Stack guide** for design seams — see [runbooks.md](./runbooks.md) and [stack-guides.md](./stack-guides.md) for intent split.

## Related

- **Runbooks:** [runbooks.md](./runbooks.md)
- **Stack guides:** [stack-guides.md](./stack-guides.md)
- **Design spec:** [docs/design/ops-cms-runbooks.md](../design/ops-cms-runbooks.md)
- **Glossary:** **Catalog feature module** in [CONTEXT.md](../../CONTEXT.md)
