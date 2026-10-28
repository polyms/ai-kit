# Feature map

Behavior inventory. Agents use it to decide which file to open. Humans use it as the regression
checklist.

Shared preconditions live here once. An area file does not repeat them unless that area breaks
the baseline.

## Baseline preconditions

- Public kit site. No sign-in. The page is `/knowledge`.
- UI copy below is the English catalog.
- Prefer accessible names. Class selectors are fallbacks.
- Wait on an observable end state. Do not sleep a fixed time.

## Proof and skip reporting

The area file is the coverage set for a change in that area. When a change spans sessions,
shortcuts, or drag-and-drop, also read the journeys file if this index lists one.

- Exercise every reachable entry point the change can affect, including success, cancel, error,
  empty, and persistence.
- Record the action and the final observable state.
- When a path is unreachable, name it and the blocker, then cover the closest real path.

## Areas

- [knowledge-search](knowledge-search.md) — sidebar query, intent filter, and the result list.
- [knowledge-intro](knowledge-intro.md) — center pane when no article is open, with three intent cards.
- [knowledge-article](knowledge-article.md) — article pane at `/knowledge/$id`, including the missing id.

## Entry contract

Every area file uses these H2s, in order: `Sub-features`, `How to get to it (user POV)`,
`Driving it`, `Gotchas`.
