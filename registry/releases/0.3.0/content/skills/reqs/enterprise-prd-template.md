# Enterprise PRD Template

Enterprise template for `/reqs` — discovery + formal PRD in chat (optional `docs/prd/`). Does **not** publish
to the issue tracker; use `/to-prd` + [lean-prd-template.md](../to-prd/lean-prd-template.md) to publish from
an aligned conversation.

Copy this structure when writing a PRD. Replace bracketed placeholders. Delete instructional comments.

**Audience:** PRD must be **human + AI readable** — any role (PM, design, eng, ops, support, sales, exec)
understands the product without opening the repo or knowing the stack. Structure helps agents; **prose serves
humans first**.

**Plain language:** Full sentences in everyday words. When a domain term first appears, define it in one
sentence. Problem, Solution, and Stories state **behavior and outcomes** — not a file, API, or path inventory.

**Native + English thrift:** One prose language from `docs/agents/language.md`. When that language is
Vietnamese, prefer Vietnamese first; keep English only for pure-tech / specialty terms (Keep-EN table and
anti-mix in `skills/setup/language.md`). Do not sprinkle ordinary English (feature, submit, flow, dashboard,
feedback) when a natural Vietnamese phrasing exists. Avoid shorthand only an AI can parse (wave rollup,
code-only bullets, missing Given/When/Then).

**Cross-references:**

| Prefer (main body)                                          | Do not (unless the user asked)                                   |
| ----------------------------------------------------------- | ---------------------------------------------------------------- |
| Tracker issue keys / URLs                                   | Repo paths, blob URLs, `docs/…`, `CONTEXT.md`, `apps/…`, `lib/…` |
| Opaque ids (`FR-01`, open-question / clarification markers) | Mid-body “see docs/…” / “see CONTEXT.md” as the requirement      |
| Decision written in prose                                   | ADR filename as the explanation                                  |

Do **not** open with a `docs/prd/` · `CONTEXT.md` · align-notes banner under the title. Omit repo-path lists
from the Appendix unless the user asked for repo refs.

**Anti-patterns:**

| Avoid                                                  | Do instead                                     |
| ------------------------------------------------------ | ---------------------------------------------- |
| Repo-path banner under H1                              | Start with Executive Summary or Problem        |
| Mid-body “see docs/…” as the requirement               | Write the requirement; omit the path           |
| Repo paths / blob links in body or Appendix by default | Omit unless the user asked for repo refs       |
| Flavor English in a Vietnamese body                    | Rewrite in natural Vietnamese (English thrift) |
| Story titled only `US#n` / `§8.5`                      | Title the human outcome                        |
| Strikethrough archaeology for cut scope                | Delete, or list under Out of scope             |

Two rules that keep this template honest:

- **Delete sections that don't apply.** A deleted section says "considered, not applicable"; an empty or boilerplate-filled section says "forgot to think". State the deletion in one line under Appendix (e.g. _"No timeline section — no external deadline"_). Modern PRDs run 1–3 pages; length comes from thinking, not from section count.
- **Never guess silently.** When a detail is unresolved — a threshold, a method, a failure behavior — write `[NEEDS CLARIFICATION: the specific question]` inline where the gap is, and collect all markers under Open Questions. Markers get resolved in review; invented answers get shipped.

---

# PRD: [Feature / Initiative Name]

| Field        | Value                        |
| ------------ | ---------------------------- |
| Author       | [name]                       |
| Status       | Draft / In Review / Approved |
| Version      | 1.0                          |
| Last updated | [date]                       |
| Stakeholders | [names/roles]                |

## 1. Executive Summary

[2–3 sentences: what we're building, for whom, and expected outcome]

## 2. Problem Statement

### Current state (AS-IS)

[What people do today, with which tools, and what it costs. Put a quantity the user gave here (hours, error
rate, money). No quantity yet → `[NEEDS CLARIFICATION]`, not an estimate.]

### Problem

[Specific pain point — who suffers, how often, cost of not solving]

### Future state (TO-BE)

[What changes when this ships — outcomes, not a feature list]

## 3. Goals & Success Metrics

Each metric must be measurable and technology-agnostic — a number, threshold, or binary outcome. "User-friendly" and "fast" are not metrics until defined.

If the user gave no target, put `[NEEDS CLARIFICATION]` in the Target cell. A proposed metric name is fine.
A proposed number is not agreed until the user supplies it — say that the target needs real data.

| Goal                            | Metric            | Target | Measurement method |
| ------------------------------- | ----------------- | ------ | ------------------ |
| [e.g. Reduce checkout drop-off] | [conversion rate] | [+5%]  | [analytics event]  |

### Non-goals

[What this initiative explicitly does NOT aim to solve]

## 4. Users & Personas

### Primary persona

- **Who:** [role/description]
- **Need:** [what they want to accomplish]
- **Pain today:** [current friction]

### Secondary personas

[If applicable — delete otherwise]

### Who is not a user

[Role or context this version does not serve. If unknown:
`[NEEDS CLARIFICATION: who is explicitly not a user?]`]

### Stakeholders

People who approve or are affected, when they are not the primary user. Delete this subsection when they are
the same person.

| Role                            | Interest                   |
| ------------------------------- | -------------------------- |
| [sponsor / approver / affected] | [what they need from this] |

## 5. User Stories

Prioritized, numbered stories — `As an <actor>, I want a <feature>, so that <benefit>`:

Stories here are a **draft** and priority tags a proposal until the user confirms the list and the P0/P1/P2
cut. Say so above the list.

- **Title the outcome** in human language (not `US#17` / section number alone).
- **Prioritize:** tag each story **P0** (core — the feature is pointless without it), **P1** (important), or
  **P2** (nice-to-have). One line of _why this priority_ for each P0.
- **Independent:** each story must be independently testable — implementing only the P0 stories should still
  yield a viable, deployable slice. If a story only makes sense together with another, merge them.
  (`/to-issues` slices along these lines.)
- Cover error, empty, and permission states — not just the happy path.
- Prefer human personas stakeholders recognize; if the consumer is an agent skill, say so in plain language.

For each P0 story, add acceptance scenarios:

```
Given [initial state], when [action], then [outcome]
```

## 6. Proposed Solution

### Overview

[High-level description of the solution approach]

### User flows

[Numbered steps or link to diagram]

```
1. User does X
2. System responds with Y
3. ...
```

### Key screens / touchpoints

[Describe or reference mockups — not required to be pixel-perfect]

## 7. Functional Requirements

Behavior only. Colors, layout, and visual design belong in `/design`.

**P0** uses **shall** (must). **P1** uses **should**. **P2** is deferrable. Each row has a unique id. If you
cannot name one check that proves the row, split it.

### Business rules

Precise gates: a threshold, a role, or a time window. Delete this subsection when there are none, and note
that in the Appendix.

- [e.g. Refunds above $200 require a user with the manager role]

| ID    | Requirement           | Priority | Verified by            |
| ----- | --------------------- | -------- | ---------------------- |
| FR-01 | [The system shall...] | P0       | [one observable check] |

### Data

Entities the feature stores or processes. Delete this subsection when it stores nothing, and note that in
the Appendix.

| Entity  | Field    | Constraint                |
| ------- | -------- | ------------------------- |
| [Order] | [status] | [pending, paid, refunded] |

### Model behavior

Delete this whole subsection when every behavior is deterministic, and note that in the Appendix. A request
that says "AI" is not a reason to keep it. If a rule or a simpler screen removes the same friction, write
that requirement above and delete the rest of this subsection.

- **Who decides:** the model acts, or a person confirms before anything changes.
- **Wrong output:** how the user knows the answer is wrong, and how they recover. Unsettled →
  `[NEEDS CLARIFICATION]`.
- **Good enough:** one check tied to the user outcome. A threshold the user did not give stays a marker.
  Model accuracy is not the success metric unless the user made it one.
- **Data the model reads:** source, how old it may be, whose permissions it inherits. Delete this bullet
  when the model reads nothing beyond the current request.
- **Refusal and review:** what it must refuse, and when a human takes over. Delete this bullet when a wrong
  answer cannot harm or mislead.
- **Uncertainty:** what the user is shown when the model is unsure. Visual treatment belongs to `/design`.
- **Cost:** at the volume the user named. No volume → delete this bullet. Do not estimate a bill.

## 8. Non-Functional Requirements

Keep only rows that apply. Each kept row needs a measurable target — a number, a threshold, or a named
standard. No target yet → `[NEEDS CLARIFICATION]` in the Requirement cell. Do not invent an industry default.

**Blocking** means release waits on this row. **Advisory** means the row is tracked and does not block.

| Category      | Requirement                | Ship gate |
| ------------- | -------------------------- | --------- |
| Performance   | [e.g. p95 < 200ms]         | Blocking  |
| Security      | [auth, data handling]      | Advisory  |
| Accessibility | [WCAG level, keyboard nav] | Blocking  |
| Compatibility | [browsers, devices]        | Advisory  |
| Scalability   | [expected load]            | Advisory  |
| i18n          | [languages, RTL]           | Advisory  |

## 9. Assumptions & Constraints

Facts the plan depends on that are not yet proven, plus constraints that are not non-functional requirements
(locked stack, required integration, budget, compliance, org policy).

- **Assumption:** [statement — what we are treating as true]
- **Constraint:** [statement — what we cannot change]

Delete this section only when there are none, and note the deletion in Appendix.

## 10. Edge Cases & Error Handling

Every primary workflow has at least one row (invalid input, lost connectivity, or a dependent system down).
When the user did not settle the recovery, write the scenario and put `[NEEDS CLARIFICATION]` in the behavior
cell. Do not invent the recovery.

| Scenario          | Expected behavior   |
| ----------------- | ------------------- |
| [Empty state]     | [show CTA]          |
| [Network failure] | [retry + message]   |
| [Invalid input]   | [inline validation] |

## 11. Dependencies

Other systems this feature talks to, and the data that moves. Delete the section when nothing is external,
and note that in the Appendix.

| Dependency        | Data exchanged     | Owner  | Impact if missing or down |
| ----------------- | ------------------ | ------ | ------------------------- |
| [API from team X] | [order id, status] | [team] | [cannot ship FR-03]       |

## 12. Scope

### In scope (v1 / MVP)

- [item]

### Out of scope

A longer exclusion list makes a sharper PRD. One line per item, with a brief reason (later version, never,
or a different product). A single vague line is a gap.

- [item — reason]

### Future considerations

- [item for later, not committed]

## 13. Risks & Mitigations

| Risk   | Likelihood | Impact | Mitigation |
| ------ | ---------- | ------ | ---------- |
| [risk] | H/M/L      | H/M/L  | [action]   |

## 14. Timeline & Milestones

[Delete when there is no external deadline — agent-consumed PRDs rarely need this]

| Milestone       | Target date | Deliverable     |
| --------------- | ----------- | --------------- |
| Spec approved   | [date]      | This PRD        |
| Design complete | [date]      | Figma           |
| Dev complete    | [date]      | Feature flag on |
| Launch          | [date]      | GA              |

## 15. Open Questions

Collect every `[NEEDS CLARIFICATION]` marker from the sections above here.

- [ ] [Question — owner — due date]

## 16. Appendix

[Research links, competitor analysis, technical spikes, glossary, and one-line notes for deleted sections.
Do **not** list repo paths, blob URLs, or ADR filenames here unless the user asked for repo refs — decisions
belong in the sections above, written in prose.]
