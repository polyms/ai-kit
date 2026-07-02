# Issue body template

Use this structure for each published vertical-slice issue. Fill every section; omit **Parent** when the source was not an existing issue.

```markdown
## Parent

A reference to the parent issue (issue number or URL). Omit this section if the source was a PRD or plan in chat, not an existing issue.

## What to build

A concise description of this vertical slice. Describe end-to-end behavior, not layer-by-layer implementation.

Avoid specific file paths or code snippets — they go stale fast. Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it here and note briefly that it came from a prototype. Trim to the decision-rich parts — not a working demo, just the important bits.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Blocked by

- Reference to the blocking issue (number or URL), if any

Or "None — can start immediately" if no blockers.
```
