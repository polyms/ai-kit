---
name: reqs
description: Requirements — discovery, enterprise PRD, user stories, acceptance criteria, scope, MVP,
  MoSCoW, RICE. Invoke with /reqs, requirements, user stories, ưu tiên backlog, or stakeholder alignment.
  After align to publish lean PRD → /to-prd. Plan grill → /align.
disable-model-invocation: true
---

# Reqs — Requirements

Turn ideas into engineering-ready artifacts. Read this skill fully before producing output.

Read `docs/agents/language.md` when present — write PRDs and stories in that language. No file: match the issue
tracker's existing language.

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

## Quick Router

| User intent                                | Workflow                                            | Reference                                                |
| ------------------------------------------ | --------------------------------------------------- | -------------------------------------------------------- |
| Chốt / publish PRD from aligned chat       | User invokes `/to-prd` — not this skill             | —                                                        |
| Plan still fuzzy / stress-test before spec | User invokes `/align` — not this skill              | —                                                        |
| Discovery + formal enterprise PRD          | [PRD workflow](#prd-workflow)                       | [enterprise-prd-template.md](enterprise-prd-template.md) |
| User stories / backlog                     | [User story workflow](#user-story-workflow)         | [user-story-guide.md](user-story-guide.md)               |
| Làm rõ req / clarify                       | [Discovery workflow](#discovery-workflow)           | —                                                        |
| Ưu tiên / prioritize                       | [Prioritization workflow](#prioritization-workflow) | —                                                        |
| Review req hiện có                         | [Refinement workflow](#refinement-workflow)         | —                                                        |

## Discovery Workflow

**Goal:** Problem statement + scope boundary before any spec.

1. Capture **who** (persona), **what problem**, **why now**, **success metric**
2. List **constraints** (timeline, tech, compliance, budget)
3. State **assumptions** explicitly
4. Propose **in scope** / **out of scope**
5. Ask user to confirm before proceeding to PRD or stories

**Completion criterion:** User confirms problem statement and scope boundary.

## PRD Workflow

**Goal:** Complete enterprise PRD ready for engineering + design review — delivered in chat (and optionally
`docs/prd/`), **not** published to the issue tracker.

**Does not publish.** Creating a tracker issue with a lean PRD body is `/to-prd` only. After `/align` when
the conversation is ready to ship, tell the user to invoke `/to-prd`.

**Boundary:** Aligned-chat synthesize/publish → `/to-prd`. Plan still fuzzy or needs design-tree grill →
`/align`. Below is discovery + enterprise PRD only — not align-loop.

**Audience:** Follow [enterprise-prd-template.md](enterprise-prd-template.md). Do **not** ship
executive-summary rollups or agent-only shorthand (e.g. `"W1 P0 #1–9: tenancy..."`). Prefer tracker issue links
when referring to published work; keep repo paths in Appendix. No `docs/…` / `CONTEXT.md` banner under the
title.

1. Run discovery if problem statement is missing
2. Fill [enterprise-prd-template.md](enterprise-prd-template.md) — no empty headers: fill a section with
   real thinking or delete it and note the deletion in Appendix
3. Mark unresolved details inline with `[NEEDS CLARIFICATION: …]` — never invent a threshold, method, or
   behavior the user didn't settle
4. Include wireframe notes or flow description where UI is involved
5. Add **non-functional requirements** (performance, security, accessibility, i18n) — only rows that apply
6. End with open questions (collected markers) and `## Next Step` (see [Handoff](#handoff))
7. **Human-readable check:** re-read as a PM unfamiliar with the codebase — every kept section filled; no
   one-line wave summaries; Given/When/Then per P0 story; story titles name the outcome (not `US#n` alone);
   body stands alone without opening the repo; repo paths only in Appendix; cut scope deleted or listed under
   Out of scope (no strikethrough leftovers)

**Completion criterion:** PRD passes the [quality checklist](#quality-checklist); human-readable check
passed; no tracker issue created by this skill.

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
      slice
- [ ] Acceptance criteria are testable (no "user-friendly", "fast", "easy" without definition)
- [ ] Edge cases and error states addressed
- [ ] Accessibility and security considered where applicable
- [ ] Assumptions listed separately from facts
- [ ] No silent guesses — unresolved details carry `[NEEDS CLARIFICATION]` markers, collected under open
      questions
- [ ] **Human + AI readable** — no wave-rollup or agent-only shorthand; no repo-path banner; a human can
      understand scope from the body alone (see Audience on
      [enterprise-prd-template.md](enterprise-prd-template.md))
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

| Avoid                             | Do instead                                         |
| --------------------------------- | -------------------------------------------------- |
| Feature list without problem      | Lead with user problem + outcome                   |
| Vague AC: "works well"            | "Loads in <2s on 3G; shows skeleton while loading" |
| One giant story                   | Split by user goal (INVEST)                        |
| Solution in req before validation | Problem + options + recommendation                 |
| Missing error flows               | Include failure/empty/loading states               |
| Publishing PRD via `gh` here      | Tell user to invoke `/to-prd`                      |

Human-readable PRD anti-patterns (repo-path banner, `US#n`-only titles, strikethrough cut scope) live in
[enterprise-prd-template.md](enterprise-prd-template.md) — single source of truth; do not restate here.

## Agent

For deep PM work in an isolated context, delegate to the **pm**:

```
Use the pm to [task]
```

The agent reads this skill when invoked (`skills/reqs/`).
