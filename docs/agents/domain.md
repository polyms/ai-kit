# Domain Docs

How `/align`, `/reqs`, and `/dev` consume domain documentation.

## Before exploring, read

- **`CONTEXT.md`** at repo root
- **`docs/adr/`** — ADRs touching the work area
- **`docs/agents/knowledge.md`** — how to retrieve **Knowledge** (`/knowledge/*`, MCP
  `search_knowledge`); unified incident · design · toolchain retrieval for `/dev`, `/devops`,
  `/arch`
- **`docs/agents/stack-profile.md`** — per-repo stack axes for Knowledge search (written by
  `/setup`)
- **`docs/agents/ops-cms-mcp.md`** — MCP endpoint, Cursor setup, catalog tool names

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
