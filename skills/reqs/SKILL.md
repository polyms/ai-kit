---
name: reqs
description: Requirements — discovery interview, enterprise PRD, user stories, acceptance criteria, scope,
  MVP, MoSCoW, RICE. Invoke with /reqs, requirements, user stories, PRD generator, FRD, functional
  requirements, đặc tả chức năng, ưu tiên backlog, or stakeholder alignment.
  After align to publish lean PRD → /to-prd. Plan grill → /align.
disable-model-invocation: true
---

# Reqs — Requirements

Turn ideas into engineering-ready artifacts. Read this skill fully before producing output.

Read `docs/agents/language.md` when present — write PRDs and stories in that language (**one prose language**;
**English thrift** — prefer confirmed language for ordinary words; only pure-tech / specialty tokens stay
English — no mid-sentence EN/VI mix; VI SSOT `skills/setup/language.md`). No file: match the issue tracker's
existing language; same prose-vs-token bar.

Read `docs/agents/requirements.md` when present — follow its **Confirmed default** (Standard, MVP, or
AI-optimized). No file: Standard, the enterprise template; the kit copy of that catalog is
`skills/setup/requirements.md`.

## When `/reqs` vs `/to-prd` vs `/align`

Same decision tree in `/align` handoff and `/to-prd` — keep in sync:

```
Decisions / problem statement clear?
├─ Yes, aligned chat ready to ship a PRD → user invokes `/to-prd`
│     (lean template, publish to tracker — this skill does NOT publish)
├─ No — need design-tree grill (tech forks, domain terms) → user invokes `/align`
└─ No — need requirements discovery, enterprise PRD, stories, or prioritization → `/reqs` (this skill)
      (draft in chat or docs/prd/; does NOT create tracker issues)
```

Do **not** treat "viết PRD" / "write a PRD" after `/align` as this skill — that path is `/to-prd`.

## Document types

One requirements artifact: the enterprise PRD. A request for a BRD, FRD, SRS, QRD, MRD, or TRD lands in a
section of that PRD or outside this skill — the **Other families** table in the requirements catalog (see
top) names which. Do not open a second document.

## Quick Router

| User intent                       | Workflow                                            | Reference                                                |
| --------------------------------- | --------------------------------------------------- | -------------------------------------------------------- |
| Discovery + formal enterprise PRD | [PRD workflow](#prd-workflow)                       | [enterprise-prd-template.md](enterprise-prd-template.md) |
| User stories / backlog            | [User story workflow](#user-story-workflow)         | [user-story-guide.md](user-story-guide.md)               |
| Làm rõ req / clarify              | [Discovery workflow](#discovery-workflow)           | [prd-interview.md](prd-interview.md)                     |
| Ưu tiên / prioritize              | [Prioritization workflow](#prioritization-workflow) | —                                                        |
| Review req hiện có                | [Refinement workflow](#refinement-workflow)         | —                                                        |

## Discovery Workflow

**Goal:** Problem statement + scope boundary before any spec.

When either is missing, run questions 1–9 and the confirmation in [prd-interview.md](prd-interview.md).

**Completion criterion:** User confirms problem statement and scope boundary (in scope and out of scope,
including who is not a user).

## PRD Workflow

**Goal:** Complete enterprise PRD ready for engineering + design review — delivered in chat (and optionally
`docs/prd/`), **not** published to the issue tracker.

1. Run the [Discovery Workflow](#discovery-workflow) if the problem statement or scope boundary is missing
2. Run the behavior pass in [prd-interview.md](prd-interview.md) when its gate applies
3. Fill [enterprise-prd-template.md](enterprise-prd-template.md), shaped by the confirmed default in
   `docs/agents/requirements.md` — no empty headers: fill a section with real thinking or delete it and note
   the deletion in Appendix
4. Mark unresolved details inline with `[NEEDS CLARIFICATION: …]` — never invent a threshold, method,
   recovery behavior, market size, or capacity number the user didn't settle
5. End with open questions (collected markers) and `## Next Step` (see [Handoff](#handoff))
6. Re-read as an outsider / non-builder (any role, no repo knowledge) and run the
   [quality checklist](#quality-checklist). When prose language is Vietnamese, also run the English-thrift
   read-aloud test in `skills/setup/language.md`.

**Completion criterion:** Every checklist row passes; no tracker issue created by this skill.

## User Story Workflow

**Goal:** Epic → stories → acceptance criteria, ready for sprint planning.

1. Identify epics from PRD or feature description
2. Break into INVEST stories per [user-story-guide.md](user-story-guide.md)
3. Write acceptance criteria (Gherkin for complex flows, checklist for simple)
4. Tag priority (P0/P1/P2) and estimate hint (S/M/L) if context allows
5. Flag dependencies between stories

**Completion criterion:** Every story has testable acceptance criteria; no story spans multiple user goals.

## Prioritization Workflow

**Goal:** Ranked backlog with MVP cut line.

Choose framework based on context:

- **MoSCoW** — fast scope negotiation, good for fixed deadlines
- **RICE** — data-driven when reach/impact/confidence are estimable

Output table:

| Item | Score/Priority | Rationale |
| ---- | -------------- | --------- |
| ...  | ...            | ...       |

Mark **MVP line** clearly. List items deferred with reason.

**Completion criterion:** User can identify what ships in v1 vs later.

## Refinement Workflow

**Goal:** Improve existing requirements document.

1. Read provided material completely
2. Produce **gap analysis**:
   - Ambiguous language (quote + suggested rewrite)
   - Missing edge cases
   - Missing NFRs
   - Untestable acceptance criteria
   - Hidden dependencies
3. Provide revised sections, not just criticism

**Completion criterion:** Every gap has a concrete fix or open question.

## Quality Checklist

Before delivering any artifact, verify:

- [ ] Problem statement answers "why" before "what"
- [ ] Success metrics are measurable (number, threshold, or binary outcome)
- [ ] Scope has explicit out-of-scope section
- [ ] Stories are prioritized (P0/P1/P2) and each is independently testable — P0 set alone is a shippable
      slice; every P0 story has Given/When/Then; story titles name the outcome (not `US#n` alone)
- [ ] Acceptance criteria are testable (no "user-friendly", "fast", "easy" without definition)
- [ ] Each functional requirement names how it is verified; a row too broad for one check is split
- [ ] Functional requirements and user flows state behavior. Colors, layout, and visual design are not there
      — that is `/design`
- [ ] Each primary workflow has an error behavior, or a `[NEEDS CLARIFICATION]` marker
- [ ] **Model behavior** is filled only when output can be wrong on the same input — otherwise the subsection
      is deleted and noted in the Appendix
- [ ] Kept NFR rows have a measurable target or a marker, and a blocking or advisory ship gate
- [ ] Accessibility and security considered where applicable
- [ ] Who is not a user is named, or marked `[NEEDS CLARIFICATION]`
- [ ] Assumptions and constraints sit in their own section when any exist — separate from facts
- [ ] Out of scope is a list of specific exclusions
- [ ] Priority cut, drafted stories, and any proposed metric targets are labeled as a proposal pending user
      review
- [ ] No silent guesses — unresolved details carry `[NEEDS CLARIFICATION]` markers, collected under open
      questions
- [ ] **Human + AI readable** — any role understands scope from the body alone; plain language (define domain
      terms once); no wave-rollup or agent-only shorthand; no repo-path banner; cut scope deleted or under Out
      of scope (no strikethrough) — see Audience on [enterprise-prd-template.md](enterprise-prd-template.md)
- [ ] **Prose language** — native in `docs/agents/language.md`; **English thrift** when Vietnamese (prefer VI
      for ordinary words; only pure-tech / specialty tokens stay English — no flavor English / mid-clause
      mix; SSOT `skills/setup/language.md`)
- [ ] **No internal repo links** — no repo paths, blob URLs, or `docs/…` / `CONTEXT.md` links in body or
      Appendix unless the user asked; tracker issue keys/URLs and opaque ids (`FR-01`, open-question markers)
      are fine
- [ ] **No publish** — this skill did not create a tracker issue; publish path is `/to-prd`

## Handoff

End with `## Next Step` — CONTEXT.md **Handoff** (one preferred; two max). Cue defaults:

| Next step | When                                                              |
| --------- | ----------------------------------------------------------------- |
| `/to-prd` | Enterprise draft ready to publish as a lean tracker PRD (default) |
| `/design` | UI flows / design specs are the clear next work                   |
| `/align`  | Plan or domain still fuzzy — need grill before publish            |

```
## Open Questions
- [list unresolved items]

## Next Step
→ /to-prd
```

**Completion criterion:** `## Next Step` names one preferred skill (two max with when/why).

## Anti-Patterns

| Avoid                                          | Do instead                                         |
| ---------------------------------------------- | -------------------------------------------------- |
| Feature list without problem                   | Lead with user problem + outcome                   |
| Vague AC: "works well"                         | "Loads in <2s on 3G; shows skeleton while loading" |
| One giant story                                | Split by user goal (INVEST)                        |
| Solution in req before validation              | Problem + options + recommendation                 |
| Missing error flows                            | Include failure/empty/loading states               |
| A second BRD, FRD, MRD, TRD, QRD               | One PRD — [Document types](#document-types)        |
| Publishing PRD via `gh` here                   | Tell user to invoke `/to-prd`                      |
| Repo/code links in body or Appendix by default | Write the requirement; omit paths unless asked     |
| Flavor English in a Vietnamese body            | Prefer VI; keep only tech specialty tokens         |

Human-readable PRD anti-patterns (repo-path banner, `US#n`-only titles, strikethrough cut scope, English
thrift) live in [enterprise-prd-template.md](enterprise-prd-template.md) — single source of truth; do not
restate the full tables here.

## Agent

For deep PM work in an isolated context, delegate to the **pm**:

```
Use the pm to [task]
```

The agent reads this skill when invoked (`skills/reqs/`).
