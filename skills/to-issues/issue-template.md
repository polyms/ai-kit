# Issue body template

Use this structure for each published vertical-slice issue. Fill every section; omit **Parent** when the source was not an existing issue.

**Audience:** Issue body **human + AI readable** — dev/PM can read on the tracker without opening the repo;
agent `/dev` can still parse it. Expand enough slice context (do not pass a parent PRD executive summary
down). Use prose + **Given/When/Then** or a specific acceptance checklist; do not roll user stories into a
shorthand wave summary.

```markdown
## Parent

A reference to the parent issue (issue number or URL). Omit this section if the source was a PRD or plan in chat, not an existing issue.

## What to build

A concise description of this vertical slice. Describe end-to-end behavior, not layer-by-layer implementation.
Enough context that a reader unfamiliar with the parent PRD can still ship the slice.

Avoid specific file paths or code snippets — they go stale fast. Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it here and note briefly that it came from a prototype. Trim to the decision-rich parts — not a working demo, just the important bits.

## Acceptance criteria

Prefer Given/When/Then when the slice maps to user stories; otherwise a concrete checklist:

- [ ] Given …, when …, then …
- [ ] Criterion 2
- [ ] Criterion 3

## Blocked by

- Reference to the blocking issue (number or URL), if any

Or "None — can start immediately" if no blockers.
```
