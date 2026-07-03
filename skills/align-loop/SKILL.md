---
name: align-loop
description: Relentless grill of a plan or design — walk the design tree one decision at a time, lettered options A–D with a recommended pick, codebase-first when possible. Use when user stress-tests a plan before building, clarifies decision branches, aligns before PRD, or mentions grill, làm rõ, chốt hướng, thống nhất hiểu biết.
---

# Align Loop

Interview relentlessly about every aspect of the plan until shared understanding.

The mental model is a **design tree**: decisions branch and depend on each other. Descend one node at a time — settle the parent before the choices hanging off it. A firehose of parallel questions loses the structure that makes the interview converge.

The point is **not** to reach agreement quickly. Make every implicit call explicit so nothing important stays silently assumed.

## Discipline

- **One question per turn** — batches are bewildering; wait for feedback before the next
- **Proposal, not blank prompt** — lettered **A–D** with one **(Recommended)** and a one-line rationale; user picks, refines ("B but…"), or proposes **E**
- **Codebase-first** — if the codebase or `CONTEXT.md` can answer, read it, report what you found briefly, then offer grounded A–D; never ask what files already show
- **Implicit → explicit** — surface assumptions, contradictions with `CONTEXT.md`, and gaps between code and stated intent as grill questions

Question shape and examples: [GRILL-FORMAT.md](GRILL-FORMAT.md).

Voice: [docs/agents/voice.md](../../docs/agents/voice.md) — natural assistant, plain language; Vietnamese em/anh when the user writes Vietnamese.

## Session

1. Read `CONTEXT.md` if present — use canonical terms in questions
2. If the problem statement is unclear, restate in one paragraph and confirm (use A–D when multiple valid framings); otherwise enter the **highest unresolved dependency** on the tree
3. Grill until every branch in scope is visited or explicitly deferred — dependencies before dependents
4. Name remaining risks and assumptions
5. Summarize decisions as bullets — user confirms before handoff

**Completion criterion:** User confirms the decision summary; no silent assumptions on visited branches.
