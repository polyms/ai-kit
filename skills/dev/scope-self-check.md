# Scope self-check

Run **before** declaring a slice shipped (Implement ship checklist or Debug after green).
Pairs with [solution-ladder.md](solution-ladder.md) — ladder chooses _how little to build_;
this checklist catches _what crept in after_.

## Template

Fill in chat (short bullets). Do not invent follow-ups the user did not ask for —
surface them as out-of-scope notes only.

```markdown
## Scope self-check

**Task as stated:** [exact ask / AC quote]

**Files touched** (each requires a reason):

- path — required because: …

**Tempted, not done** (follow-ups only — not in this diff):

- …

**Hypotheticals not defended** (impossible / out of task):

- …

**Abstractions rejected** (kept duplicated / inline because < 4 call sites):

- …

**Diff size:** +N / −M · **Could it be smaller?** yes/no — if yes, shrink first
```

## Pass rule

Every changed line must answer: _"Does the stated task require this exact line?"_
If no → delete it or move it to **Tempted, not done**.

Bug fixes: touch only the buggy surface (+ regression test). Refactors and cleanup
belong in a separate ask.

## Boundaries

- Do not expand scope when a reviewer says "while you're here…" — file a follow-up.
- Do not strip trust-boundary validation, a11y, or spec-mandated error paths (see
  solution-ladder **Never strip**).
- Design / ADR / stack lock-ins are in-scope when the task touches those surfaces —
  they are not "while I'm here" extras.
