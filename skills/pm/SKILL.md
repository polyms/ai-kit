---
name: pm
description: Product management and requirements — PRDs, user stories, acceptance criteria, scope, MVP, MoSCoW, RICE. Use when user mentions /pm, requirements, PRD, viết PRD, user stories, ưu tiên backlog, or stakeholder alignment. Plan grill or design-tree alignment → `/align`, not this skill.
---

# PM — Product Management & Requirements

Turn ideas into engineering-ready artifacts. Read this skill fully before producing output.

## Quick Router

| User intent                                 | Workflow                                            | Reference                                  |
| ------------------------------------------- | --------------------------------------------------- | ------------------------------------------ |
| Chốt PRD / publish from aligned chat        | User invokes `/to-prd` — not this skill             | —                                          |
| Plan still fuzzy / stress-test before spec  | User invokes `/align` — not this skill              | —                                          |
| "Viết PRD" / write PRD (discovery + formal) | [PRD workflow](#prd-workflow)                       | [prd-template.md](prd-template.md)         |
| User stories / backlog                      | [User story workflow](#user-story-workflow)         | [user-story-guide.md](user-story-guide.md) |
| Làm rõ req / clarify                        | [Discovery workflow](#discovery-workflow)           | —                                          |
| Ưu tiên / prioritize                        | [Prioritization workflow](#prioritization-workflow) | —                                          |
| Review req hiện có                          | [Refinement workflow](#refinement-workflow)         | —                                          |

## Discovery Workflow

**Goal:** Problem statement + scope boundary before any spec.

1. Capture **who** (persona), **what problem**, **why now**, **success metric**
2. List **constraints** (timeline, tech, compliance, budget)
3. State **assumptions** explicitly
4. Propose **in scope** / **out of scope**
5. Ask user to confirm before proceeding to PRD or stories

**Completion criterion:** User confirms problem statement and scope boundary.

## PRD Workflow

**Goal:** Complete PRD ready for engineering + design review.

**Boundary:** Aligned-chat synthesize/publish → `/to-prd` (Quick Router). Plan still fuzzy or needs design-tree grill → `/align`. Below is discovery + enterprise PRD only — not align-loop.

1. Run discovery if problem statement is missing
2. Fill [prd-template.md](prd-template.md) — every section, no empty headers
3. Include wireframe notes or flow description where UI is involved
4. Add **non-functional requirements** (performance, security, accessibility, i18n)
5. End with open questions and next steps

**Completion criterion:** PRD passes the [quality checklist](#quality-checklist).

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
- [ ] Acceptance criteria are testable (no "user-friendly", "fast", "easy" without definition)
- [ ] Edge cases and error states addressed
- [ ] Accessibility and security considered where applicable
- [ ] Assumptions listed separately from facts
- [ ] Open questions collected at the end

## Anti-Patterns

| Avoid                             | Do instead                                         |
| --------------------------------- | -------------------------------------------------- |
| Feature list without problem      | Lead with user problem + outcome                   |
| Vague AC: "works well"            | "Loads in <2s on 3G; shows skeleton while loading" |
| One giant story                   | Split by user goal (INVEST)                        |
| Solution in req before validation | Problem + options + recommendation                 |
| Missing error flows               | Include failure/empty/loading states               |

## Agent

For deep PM work in an isolated context, delegate to the **pm-agent**:

```
Use the pm-agent to [task]
```

The agent reads this skill when invoked.
