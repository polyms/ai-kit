# Feature map

Behavior inventory. Agents use it to decide which file to open. Humans use it as the regression
checklist.

Shared preconditions live here once. An area file does not repeat them unless that area breaks
the baseline.

## Baseline preconditions

- {Signed-in or other baseline. Delete lines that do not apply.}
- Use the scoped CTA selectors recorded under each area's `Driving it` section.
- Wait on an observable end state. Do not sleep a fixed time.

## Proof and skip reporting

The area file is the coverage set for a change in that area. When a change spans sessions,
shortcuts, or drag-and-drop, also read the journeys file if this index lists one.

- Exercise every reachable entry point the change can affect, including success, cancel, error,
  empty, and persistence.
- Record the action and the final observable state.
- When a path is unreachable, name it and the blocker, then cover the closest real path.

## Areas

{Sweep order. One bullet per area: `[slug](slug.md)` — one sentence the user can see. No bullets
means this map is not ready.}

## Entry contract

Every area file uses these H2s, in order: `Sub-features`, `How to get to it (user POV)`,
`Driving it`, `Gotchas`.
