# PRD Template

Copy this structure when writing a PRD. Replace bracketed placeholders. Delete instructional comments.

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

### Background

[Context: why this matters now]

### Problem

[Specific pain point — who suffers, how often, cost of not solving]

### Opportunity

[What success looks like at a high level]

## 3. Goals & Success Metrics

Each metric must be measurable and technology-agnostic — a number, threshold, or binary outcome. "User-friendly" and "fast" are not metrics until defined.

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

## 5. User Stories

Prioritized, numbered stories — `As an <actor>, I want a <feature>, so that <benefit>`:

- **Prioritize:** tag each story **P0** (core — the feature is pointless without it), **P1** (important), or **P2** (nice-to-have). One line of _why this priority_ for each P0.
- **Independent:** each story must be independently testable — implementing only the P0 stories should still yield a viable, deployable slice. If a story only makes sense together with another, merge them. (`/to-issues` slices along these lines.)
- Cover error, empty, and permission states — not just the happy path.

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

| ID    | Requirement           | Priority (P0/P1/P2) | Notes |
| ----- | --------------------- | ------------------- | ----- |
| FR-01 | [The system shall...] | P0                  |       |

## 8. Non-Functional Requirements

Keep only rows that apply to this feature.

| Category      | Requirement                |
| ------------- | -------------------------- |
| Performance   | [e.g. p95 < 200ms]         |
| Security      | [auth, data handling]      |
| Accessibility | [WCAG level, keyboard nav] |
| Compatibility | [browsers, devices]        |
| Scalability   | [expected load]            |
| i18n          | [languages, RTL]           |

## 9. Edge Cases & Error Handling

| Scenario          | Expected behavior   |
| ----------------- | ------------------- |
| [Empty state]     | [show CTA]          |
| [Network failure] | [retry + message]   |
| [Invalid input]   | [inline validation] |

## 10. Dependencies

| Dependency        | Owner  | Status          | Impact if delayed   |
| ----------------- | ------ | --------------- | ------------------- |
| [API from team X] | [team] | [blocked/ready] | [cannot ship FR-03] |

## 11. Scope

### In scope (v1 / MVP)

- [item]

### Out of scope

- [item — defer to v2 with brief reason]

### Future considerations

- [item for later, not committed]

## 12. Risks & Mitigations

| Risk   | Likelihood | Impact | Mitigation |
| ------ | ---------- | ------ | ---------- |
| [risk] | H/M/L      | H/M/L  | [action]   |

## 13. Timeline & Milestones

[Delete when there is no external deadline — agent-consumed PRDs rarely need this]

| Milestone       | Target date | Deliverable     |
| --------------- | ----------- | --------------- |
| Spec approved   | [date]      | This PRD        |
| Design complete | [date]      | Figma           |
| Dev complete    | [date]      | Feature flag on |
| Launch          | [date]      | GA              |

## 14. Open Questions

Collect every `[NEEDS CLARIFICATION]` marker from the sections above here.

- [ ] [Question — owner — due date]

## 15. Appendix

[Research links, competitor analysis, technical spikes, glossary. Note deleted sections here in one line each.]
