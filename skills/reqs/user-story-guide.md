# User Story Guide

## Format

```
As a [persona],
I want [goal/capability],
So that [benefit/outcome].
```

**Readable titles:** When listing stories in a PRD or tracker issue, lead with the human outcome
("Playground records a successful run") — not only an id (`US#17`) or section pointer (`§8.5`). Ids may follow
as secondary labels.

**Personas:** Prefer roles a stakeholder recognizes (student, educator, owner, engineer). If the consumer is an
agent or skill, say so in plain language ("engineer running `/dev`") — not bare backtick role ids alone.

## INVEST Checklist

| Principle       | Question                                        |
| --------------- | ----------------------------------------------- |
| **I**ndependent | Can this ship without waiting on other stories? |
| **N**egotiable  | Room for implementation flexibility?            |
| **V**aluable    | Delivers user or business value alone?          |
| **E**stimable   | Team can size it?                               |
| **S**mall       | Fits one sprint?                                |
| **T**estable    | Clear pass/fail criteria?                       |

If any answer is "no" — split, merge, or spike first.

## Acceptance Criteria

### Simple flows — checklist

```
Given [precondition]
When [action]
Then [expected result]
```

### Complex flows — Gherkin

```gherkin
Scenario: [name]
  Given [context]
  And [additional context]
  When [user action]
  Then [outcome]
  And [additional outcome]

Scenario: [error case]
  Given [context]
  When [invalid action]
  Then [error handling]
```

## Story Sizing Hints

| Size | Guideline                    |
| ---- | ---------------------------- |
| S    | < 1 day, no unknowns         |
| M    | 1–3 days, minor unknowns     |
| L    | 3–5 days, consider splitting |
| XL   | Spike first, then split      |

## Epic Breakdown Example

**Epic:** User can reset password via email

| ID    | Story                           | Priority | AC summary                                         |
| ----- | ------------------------------- | -------- | -------------------------------------------------- |
| US-01 | Request reset link              | P0       | Valid email → send link; invalid → generic message |
| US-02 | Click link and set new password | P0       | Token valid → form; expired → error page           |
| US-03 | Password strength validation    | P1       | Min 8 chars, complexity rules, inline feedback     |

## Definition of Ready (DoR)

Story is ready for sprint when:

- [ ] User story written in standard format with a human-readable outcome title
- [ ] Acceptance criteria complete and testable (Given/When/Then or concrete checklist)
- [ ] Dependencies identified (prefer tracker issue keys when published)
- [ ] Design attached (if UI)
- [ ] Priority assigned
- [ ] No open blocking questions
- [ ] Body stands alone — no "see CONTEXT.md / docs/prd/…" as a substitute for the story

## Definition of Done (DoD)

Story is done when:

- [ ] All AC pass
- [ ] Code reviewed and merged
- [ ] Tests written (unit + integration as appropriate)
- [ ] Docs updated if public API changed
- [ ] Accessibility checked (if UI)
- [ ] Deployed to staging and verified
