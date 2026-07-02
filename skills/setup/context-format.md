# CONTEXT.md Format

```md
# {Context Name}

{One or two sentences: what this context is.}

## Language

**Order**:
{A one or two sentence definition.}
_Avoid_: Purchase, transaction

**Customer**:
A person or organization that places orders.
_Avoid_: Client, buyer, account
```

## Rules

- **Opinionated** — pick one term; list alternatives under `_Avoid_`
- **Tight** — one or two sentences per term; define what it IS
- **Domain-specific only** — no general programming concepts
- **Group** under subheadings when clusters emerge

## Multi-context

`CONTEXT-MAP.md` at root lists contexts and relationships:

```md
# Context Map

## Contexts

- [Ordering](./src/ordering/CONTEXT.md) — receives and tracks customer orders
- [Billing](./src/billing/CONTEXT.md) — generates invoices

## Relationships

- **Ordering → Billing**: `OrderPlaced` events trigger invoice generation
```

Create files lazily — only when a term is resolved.
