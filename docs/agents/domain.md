# Domain Docs

How `/align`, `/pm`, and `/dev` consume domain documentation.

## Before exploring, read

- **`CONTEXT.md`** at repo root
- **`docs/adr/`** — ADRs touching the work area

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
