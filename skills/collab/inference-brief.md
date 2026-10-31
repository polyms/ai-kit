# Inference brief

Parent-only. Pass this block into each principal. Do not commit it.

```markdown
## Inference brief — <slug>

**Prompt:** <user words>
**Prose language:** <docs/agents/language.md, else CONTEXT.md, else the user's language>

### Evidence
- <what already exists — entity, nearest screen, who can mutate — one line each, with path>
- <feature-map area file, user path, gotchas — only when the index has area links>

### Inferred
- **User:** <role the nearest screen already serves>
- **Actions:** <create / read / update / delete — only those the prompt or the nearest screen supports>
- **Out of scope:** <what that screen already excludes, plus anything the prompt did not name>

### Assumptions
- <behavior> — inferred from <which existing pattern>

### Blocking forks
- <none>
  or
- <decision> — options, **recommended** <option> because <repo fact>

### ADR
- Write: yes | no — which of the three tests failed, if no

### Screen
- yes | no
```

Paths in the brief are for agents. The PRD body stays free of repo paths unless the user
asked (lean template rule).

## What is blocking

A fork is blocking only when a wrong guess ships the wrong product and the repo does not
settle it:

- Who may mutate, and the repo has no role pattern to copy.
- Two existing entities both match the noun, and picking one changes the data model.
- A destructive action the prompt did not name (delete, public access, cross-tenant) and
  no nearest screen shows that action.

These are **not** blocking. Infer them and label the assumption:

- Field list, when the entity schema exists.
- Empty, loading, error, and success — copy the nearest list/form.
- Success bar for an internal CRUD — the allowed operator can create, read, update, and
  delete (or archive) the record. Binary, not a vanity metric.
- Deadline, visual mood, column order, button order.

## Ask gate

Zero blocking forks: one short assumption paragraph, then spawn `pm`. Do not ask.

Otherwise one message, three decisions max. Each decision: two to four options, one
marked recommended, one line of repo evidence. No numbered interview. No "one question
per turn".

Example shape (CRUD user, repo already has an admin-only member list). Ask in the user's
language; this sample is English:

> The member list is the template: an admin creates, edits, and suspends a user. There is no
> public page.
>
> 1. Hard-delete or suspend — recommend **suspend**, because the member list suspends and does
>    not delete.

Wait for that reply. Then resume the workflow at the next unfinished step.
