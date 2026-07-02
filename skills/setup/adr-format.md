# ADR Format

Create ADRs only when all three are true:

1. **Hard to reverse** — changing later is costly
2. **Surprising without context** — future readers will ask "why?"
3. **Real trade-off** — genuine alternatives existed

## Template

```md
# ADR-NNNN: {Title}

## Status

Accepted | Superseded by ADR-XXXX

## Context

What forces are at play?

## Decision

What we decided.

## Consequences

What becomes easier or harder.
```

## Naming

`docs/adr/0001-event-sourced-orders.md` — zero-padded, kebab-case slug.
