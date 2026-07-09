# PRD Template (lean)

Lean template for `/to-prd` — synthesize from conversation, publish to the issue tracker. Enterprise discovery PRD uses `/pm`'s template instead.

Copy this structure when writing a PRD. Replace bracketed placeholders.

**Ambiguity rule:** never guess silently. When the conversation did not settle a detail the implementer will need — a threshold, a method, a behavior on failure — write `[NEEDS CLARIFICATION: the specific question]` inline where the gap is. A PRD with honest markers beats a PRD with invented answers: markers get resolved in review; invented answers get shipped.

---

# PRD: [Feature / Initiative Name]

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## Success Criteria

How we know the feature works — measurable and technology-agnostic. 2–4 criteria, each checkable after ship (a number, a threshold, or a binary outcome — not "works well").

1. [e.g. User can complete X in under N steps]
2. [e.g. Zero manual steps remain in workflow Y]

## User Stories

Prioritized, numbered user stories. Format:

`As an <actor>, I want a <feature>, so that <benefit>`

Rules that make the list useful downstream (`/to-issues` slices along these lines):

- **Prioritize:** tag each story **P0** (core — the feature is pointless without it), **P1** (important), or **P2** (nice-to-have). One line of _why this priority_ for each P0.
- **Independent:** each story must be independently testable — implementing only the P0 stories should still yield a viable, deployable slice. If a story only makes sense together with another, merge them.
- **Extensive:** cover all aspects of the feature, including error, empty, and permission states.

For each P0 story, add acceptance scenarios:

```
Given [initial state], when [action], then [outcome]
```

## Implementation Decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it within the relevant decision and note briefly that it came from a prototype. Trim to the decision-rich parts — not a working demo, just the important bits.

## Testing Decisions

A list of testing decisions that were made. Include:

- A description of what makes a good test (only test external behavior, not implementation details)
- Which modules will be tested
- Prior art for the tests (i.e. similar types of tests in the codebase)

## Out of Scope

A description of the things that are out of scope for this PRD.

## Open Questions

Collect every `[NEEDS CLARIFICATION]` marker from the sections above here, as a checklist. Empty section = no markers = the conversation settled everything.

- [ ] [question — where it blocks]

## Further Notes

Any further notes about the feature.
