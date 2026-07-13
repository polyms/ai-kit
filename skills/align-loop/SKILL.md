---
name: align-loop
description: Relentless grill of a plan or design — walk the design tree one decision at a time, lettered options with a recommended pick, codebase-first when possible. Use when user stress-tests a plan before building, clarifies decision branches, aligns before PRD, or mentions grill, làm rõ, chốt hướng, thống nhất hiểu biết.
---

# Align Loop

Interview relentlessly about every aspect of the plan until shared understanding.

The mental model is a **design tree**: decisions branch and depend on each other. Descend one node at a time — settle the parent before the choices hanging off it. A firehose of parallel questions loses the structure that makes the interview converge.

The point is **not** to reach agreement quickly. Make every implicit call explicit so nothing important stays silently assumed.

## Discipline

- **One question per turn** — batches are bewildering; wait for feedback before the next
- **Proposal, not blank prompt** — **2–4 lettered options** (only real forks — never pad to four), one **(Recommended)** and a one-line rationale; user picks, refines ("B but…"), or proposes another option
- **Codebase-first** — if the codebase or `CONTEXT.md` can answer, read it, report what you found briefly, then offer grounded options; never ask what files already show
- **Implicit → explicit** — surface assumptions, contradictions with `CONTEXT.md`, and gaps between code and stated intent as grill questions

Question shape and examples: [GRILL-FORMAT.md](GRILL-FORMAT.md).

Chat tone: ambient IDE/user rules. If `.cursor/rules/agent-voice.mdc` exists (opt-in `/setup`), follow it.
Match the user's language; grill shape stays in [GRILL-FORMAT.md](GRILL-FORMAT.md).

## Calibration

Before deep grilling, set two dials — **knowledge** and **pressure** — with **one calibration turn** (shape
in [GRILL-FORMAT.md](GRILL-FORMAT.md)). Skip it when both are already obvious from context (e.g. a detailed
ADR, or "grill me hard, I know this domain"). Free-text or skipped answers map to the dials below.
Default: **Working** + **Standard**.

| Dial          | Levels                                                                                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Knowledge** | **New** — lacks core vocabulary; **Working** — basics + tradeoffs; **Expert** — deep domain, wants sharp critique                                       |
| **Pressure**  | **Light** — clarify goals and constraints; **Standard** — challenge assumptions and path; **Hard** — failure modes, reversibility, second-order effects |

Mid-session adjustments — honor immediately: "softer", "harder", "teach more", "skip basics".

### Adaptation

**By knowledge**

- **New** — define one missing concept in 2–4 sentences before the next **Q:**; avoid jargon unless defined; recommended options model good reasoning
- **Working** — normal tradeoff questions; surface alternatives; challenge vague words ("simple", "scalable", "clean", "fast")
- **Expert** — skip basics; counterfactuals, hidden costs, migration paths, maintenance; ask what evidence would change their mind

**By pressure**

- **Light** — clarifying questions; stop after top ambiguities resolve
- **Standard** — challenge assumptions until the implementation path is concrete
- **Hard** — name weak reasoning; unpleasant edge cases; demand observable validation — still one question per turn

## Session

1. Read `CONTEXT.md` if present — use canonical terms in questions
2. **Frame** — if the problem statement is unclear, restate in one paragraph and confirm (lettered options when multiple valid framings); if clear, summarize the target in 3–6 bullets and ask for correction
3. **Calibrate** — unless knowledge and pressure are obvious, one calibration turn; then enter the **highest unresolved dependency** on the tree
4. Grill until every branch in scope is visited or explicitly deferred — dependencies before dependents; adapt depth to calibration dials
5. Name remaining risks and assumptions
6. **Open-questions audit** — before the decision summary, list every unsettled detail an implementer would
   need (thresholds, failure behavior, permission edges, scope boundaries); overloaded terms resolved or
   logged via **domain-modeling**. Each item is answered in one more grill turn or **explicitly deferred** by
   the user to land in the PRD as `[NEEDS CLARIFICATION]` — never left unnamed.
7. Summarize decisions as bullets — include confirmed open questions — user confirms before handoff

**Completion criterion:** User confirms the decision summary; every audit item resolved or explicitly
deferred; no silent assumptions on visited branches.
