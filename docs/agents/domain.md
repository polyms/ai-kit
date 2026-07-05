# Domain Docs

How `/align`, `/pm`, and `/dev` consume domain documentation.

## Before exploring, read

- **`CONTEXT.md`** at repo root
- **`docs/adr/`** — ADRs touching the work area
- **`docs/agents/runbooks.md`** — how to retrieve **Runbooks** (Ops CMS / `/runbooks/*`, MCP); deploy/CI symptom → fix
- **`docs/agents/stack-guides.md`** — how to retrieve **Stack guides** (`/guides/*`, MCP); stack-combo design knowledge for `/arch` and deploy-aware `/dev`
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
