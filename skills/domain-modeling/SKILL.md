---
name: domain-modeling
description: Build and sharpen a project's domain model. Use when the user wants to pin down domain terminology, thống nhất thuật ngữ, maintain CONTEXT.md, record an ADR, or when another skill needs to update the domain model.
---

# Domain Modeling

Actively build and sharpen the project's domain model as you design. This is the active discipline: challenge terms, probe edge-case scenarios, and write glossary entries or decisions down the moment they crystallize.

Merely reading `CONTEXT.md` for vocabulary is not this skill. This skill is for changing the model.

## File Structure

Per-repo layout: `docs/agents/domain.md`. Scaffold template: [domain.md](../setup/domain.md).

Create files lazily. If no `CONTEXT.md` exists, create it when the first term is resolved. If no `docs/adr/` exists, create it when the first ADR is needed.

Read `docs/agents/language.md` when present — write glossary entries and ADRs in that language. No file: match `CONTEXT.md`'s existing language, or ask once when creating it fresh.

## During The Session

### Challenge glossary

When the user uses a term that conflicts with `CONTEXT.md`, call it out immediately:

> Your glossary defines "Customer" as X, but here you seem to mean Y — which one is canonical?

### Sharpen fuzzy language

When the user uses vague or overloaded terms, propose a precise canonical term:

> You're saying "account" — do you mean Customer or User? Those are different things.

### Probe edge-case scenarios

When domain relationships are discussed, invent concrete scenarios that force precision at the boundary.

### Cross-reference code

When the user states how something works, check whether code agrees. If code contradicts the stated model, surface it rather than silently choosing one.

## Update CONTEXT.md Inline

When a term resolves, update `CONTEXT.md` immediately — don't batch. Use [context-format.md](../setup/context-format.md).

`CONTEXT.md` is glossary only: no implementation details, no specs, no scratch notes.

## Offer ADRs Sparingly

Offer an ADR only when all three are true:

1. **Hard to reverse** — changing later is costly
2. **Surprising without context** — future readers will ask "why?"
3. **Real trade-off** — genuine alternatives existed

If any condition is missing, skip the ADR. Use [adr-format.md](../setup/adr-format.md).

## During align-loop

When `/align`, `/triage`, or `/arch-refactor` runs align-loop, stay active for the **whole session** — not only when the user says "domain":

- Challenge overloaded terms **in the grill question itself** before offering A–D
- Invent concrete edge-case scenarios as lettered options when domain boundaries are fuzzy (see [GRILL-FORMAT.md](../align-loop/GRILL-FORMAT.md))
- After the user picks, update `CONTEXT.md` **immediately** and show the new or edited glossary line in chat
- Cross-reference code when a pick implies behavior — surface contradictions as the next grill question

**Completion criterion:** Every overloaded term is resolved or logged as Open Question; `CONTEXT.md` is updated inline for each resolution; ADRs are created only for decisions that pass the three-part test.
