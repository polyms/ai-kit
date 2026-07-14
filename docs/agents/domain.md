# Domain Docs

How `/align`, `/reqs`, and `/dev` consume domain documentation.

## Before exploring, read

- **`CONTEXT.md`** at repo root
- **`docs/adr/`** — ADRs touching the work area
- **`docs/agents/knowledge.md`** — how to retrieve **Knowledge** (`/knowledge/*`, MCP `search_knowledge`); unified incident · design · toolchain retrieval for `/dev`, `/devops`, `/arch`
- **`docs/agents/runbooks.md`** — incident workflow pointer (`intent: incident`)
- **`docs/agents/stack-guides.md`** — design workflow pointer (`intent: design`)
- **`docs/agents/ops-cms-mcp.md`** — MCP endpoint, Cursor setup, catalog tool names
- **`docs/runbooks/`** — git **snapshot** of runbooks for contributors — not live agent retrieval

If files don't exist, proceed silently. `/align` creates them lazily when terms resolve.

## File structure

```
/
├── CONTEXT.md
├── docs/adr/
├── skills/
└── agents/
```

## Rules

- Use glossary vocabulary in issues, test names, and specs
- If output contradicts an ADR, surface it: _Contradicts ADR-0007 — worth reopening because…_
- `CONTEXT.md` is glossary only — no implementation details

See `skills/setup/context-format.md` and `skills/setup/adr-format.md`.
