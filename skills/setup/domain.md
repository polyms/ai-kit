# Domain Docs

How `/align`, `/reqs`, and `/dev` consume domain documentation.

## Before exploring, read

- **`CONTEXT.md`** at repo root, or
- **`CONTEXT-MAP.md`** if multi-context — read each relevant `CONTEXT.md`
- **`docs/adr/`** — ADRs touching the work area

If files don't exist, proceed silently. `domain-modeling` creates them lazily when terms resolve.

## File structure

**Single-context** (most repos):

```
/
├── CONTEXT.md
├── docs/adr/
└── src/
```

**Multi-context** (`CONTEXT-MAP.md` at root):

```
/
├── CONTEXT-MAP.md
├── docs/adr/              ← system-wide
└── src/<context>/
    ├── CONTEXT.md
    └── docs/adr/          ← context-specific
```

## Rules

- Use glossary vocabulary in issues, test names, and specs
- If output contradicts an ADR, surface it: _Contradicts ADR-0007 — worth reopening because…_
- `CONTEXT.md` is glossary only — no implementation details

See [context-format.md](context-format.md) and [adr-format.md](adr-format.md).
