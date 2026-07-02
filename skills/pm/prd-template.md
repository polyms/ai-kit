# PRD Template

Copy this structure when writing a PRD. Replace bracketed placeholders. Delete instructional comments.

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

[If applicable]

## 5. Proposed Solution

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

## 6. Functional Requirements

| ID    | Requirement           | Priority (P0/P1/P2) | Notes |
| ----- | --------------------- | ------------------- | ----- |
| FR-01 | [The system shall...] | P0                  |       |

## 7. Non-Functional Requirements

| Category      | Requirement                |
| ------------- | -------------------------- |
| Performance   | [e.g. p95 < 200ms]         |
| Security      | [auth, data handling]      |
| Accessibility | [WCAG level, keyboard nav] |
| Compatibility | [browsers, devices]        |
| Scalability   | [expected load]            |
| i18n          | [languages, RTL]           |

## 8. Edge Cases & Error Handling

| Scenario          | Expected behavior   |
| ----------------- | ------------------- |
| [Empty state]     | [show CTA]          |
| [Network failure] | [retry + message]   |
| [Invalid input]   | [inline validation] |

## 9. Dependencies

| Dependency        | Owner  | Status          | Impact if delayed   |
| ----------------- | ------ | --------------- | ------------------- |
| [API from team X] | [team] | [blocked/ready] | [cannot ship FR-03] |

## 10. Scope

### In scope (v1 / MVP)

- [item]

### Out of scope

- [item — defer to v2 with brief reason]

### Future considerations

- [item for later, not committed]

## 11. Risks & Mitigations

| Risk   | Likelihood | Impact | Mitigation |
| ------ | ---------- | ------ | ---------- |
| [risk] | H/M/L      | H/M/L  | [action]   |

## 12. Timeline & Milestones

| Milestone       | Target date | Deliverable     |
| --------------- | ----------- | --------------- |
| Spec approved   | [date]      | This PRD        |
| Design complete | [date]      | Figma           |
| Dev complete    | [date]      | Feature flag on |
| Launch          | [date]      | GA              |

## 13. Open Questions

- [ ] [Question — owner — due date]

## 14. Appendix

[Research links, competitor analysis, technical spikes, glossary]
