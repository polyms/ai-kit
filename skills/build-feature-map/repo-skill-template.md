---
name: {slug}
description: Route a behavior question to one feature file in this repo. Invoke with
  /{slug} when the map already has areas. Read by other skills; do not explore the surface
  this file already names.
disable-model-invocation: true
---

# Feature map

Behavior index for this repo. Agents open one area file. Humans use the index as the regression
checklist.

## Feature map

Index: [references/features/README.md](references/features/README.md).

- No area link in the index (a markdown link to a sibling `*.md`) → the map is not ready. Stop.
  Do not invent areas by reading the app.
- One surface → read the index, open the one matching file, stop. Do not open a second area file.
- A change that crosses sessions, shortcuts, or drag-and-drop → also open the journeys file when
  the index lists one.
- Broad regression → walk the index top to bottom. The journeys file is last.
- An unreachable path → name it, name the blocker (account, OS, entitlement, or native driver),
  and cover the closest real path that remains.

Harness: see `Harness` in `docs/agents/feature-map.md`. `none` means drive by selector and visible
action. Do not invent a driver.

Use the area's `Driving it` selector table: resolve the recorded scope before the CTA and
check that the combined selector matches exactly one target in the intended state. For
unresolved or unverified selectors, inspect the surface and report the gap before acting;
never choose the first of several matches. Keep this table current when a UI change touches
the area, including when labels or repeated-action scopes change.

## Proof bar

Exercise the user-visible path. Record the action and the stable end state. A compile, a unit
test, or a mock that skips the surface under test is not proof.

## Entry contract

Every file under `references/features/` uses these H2s, in order:

1. `Sub-features`
2. `How to get to it (user POV)`
3. `Driving it`
4. `Gotchas`
