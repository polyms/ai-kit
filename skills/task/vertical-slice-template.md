# Issue body template

Use this structure for each published vertical-slice issue. Fill every section; omit **Parent** when the
source was not an existing issue.

**Audience:** Issue body **human + AI readable** — a PM or engineer can read it on the tracker without
opening the repo or the parent PRD; agent `/dev` can still parse it. Expand enough slice context. Use prose +
**Given/When/Then** or a specific acceptance checklist — do not roll stories into a shorthand wave summary
(`"US#17–21"`).

**Cross-references:**

| Prefer (main body)                             | Defer to end (optional note)                          |
| ---------------------------------------------- | ----------------------------------------------------- |
| Parent / Blocked by as **issue key or URL**    | Repo paths (`docs/prd/…`, `CONTEXT.md`, source files) |
| Acceptance criteria that name the **behavior** | `US#17` / `§8.5` as the only criterion title          |
| Cut scope under “Out of this slice” in prose   | Strikethrough archaeology mid-body                    |

**Anti-patterns:**

| Avoid                                            | Do instead                                                  |
| ------------------------------------------------ | ----------------------------------------------------------- |
| Parent link to the project issues **index**      | Link `SPROMPT-1` / `#12` / the full issue URL               |
| Mid-body “Tài liệu tham chiếu” dumping repo docs | State behavior here; paths only in a short **Repo notes**   |
| File-path inventory as “What to build”           | End-to-end behavior in product terms; paths optional at end |
| AC titled only `US#17 RunLog + lastRunDate`      | Name the outcome; story id secondary if useful              |
| Leaving ~~struck~~ cut work in the body          | Delete it, or one line under out-of-slice                   |

```markdown
## Parent

A reference to the parent issue (issue key or URL). Omit this section if the source was a PRD or plan in chat,
not an existing issue. Never link only the project issues index.

## What to build

A concise description of this vertical slice. Describe end-to-end behavior, not layer-by-layer
implementation. Enough context that a reader unfamiliar with the parent PRD can still ship the slice.

Write for a human skimming the tracker: who benefits, what works when done, why this slice comes after its
blockers (in one short paragraph — not a schema dump).

Avoid specific file paths or code snippets — they go stale fast. Exception: if a prototype produced a snippet
that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it
here and note briefly that it came from a prototype. Trim to the decision-rich parts — not a working demo.

If implementation hints help `/dev`, keep them short and capability-named. Put repo paths in **Repo notes**
at the end, not as the main content.

## Acceptance criteria

Prefer Given/When/Then when the slice maps to user stories; otherwise a concrete checklist. Title each
criterion with the **behavior**, not only a story id:

- [ ] Given …, when …, then …
- [ ] Criterion 2
- [ ] Criterion 3

## Blocked by

- Reference to the blocking issue (key or URL), if any

Or "None — can start immediately" if no blockers.

## Repo notes

Optional. Paths or ADR filenames for someone with the repo open. Not required to understand the slice.
Omit when empty.
```
