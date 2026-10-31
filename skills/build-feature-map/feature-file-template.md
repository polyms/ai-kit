# {Area name}

{One or two sentences: what the user can do here.}

## Sub-features

- {id}: {behavior the user can see, not a component name}.

## How to get to it (user POV)

{Where focus starts. What they click or press. A few sentences.}

## Driving it

- Root: `{stable selector}`

### Selectors

{Define each mapped CTA using selectors supported by the recorded harness. When Harness is
none, describe the accessible role/name and visible scope. Replace the examples below with
selectors verified against this repo; do not assume these names or test ids exist.}

| Action | Scope / target | Selector within scope | Expected matches |
| ------ | -------------- | --------------------- | ---------------- |
| Open item deletion | Row identified by the item's stable key or unique visible name | Button named `Delete` | 1 |
| Delete selected items | Area toolbar | Button named `Delete selected` | 1 |
| Confirm item deletion | Dialog named `Delete item` | Button named `Delete` | 1 |
| Cancel item deletion | Dialog named `Delete item` | Button named `Cancel` | 1 |

Selector rules:

- Prefer role + accessible name within a stable container. Record the container selector as
  well as the CTA selector; together they must identify exactly one target in the intended state.
- For repeated rows/cards, scope by the intended entity's stable key or unique visible name.
  Distinguish row actions, bulk actions, menu items, and dialog confirmation even when their
  labels match. Record any menu/dialog opening step before using its selector.
- If semantic selectors cannot distinguish targets, record an existing stable test id with
  feature/action scope (for example, `items-row-delete` versus `items-bulk-delete`), plus the
  entity scope for repeated instances. Do not use array position, `.first()`, or `.nth()` to
  hide ambiguity, or rely on styling classes or DOM order.
- Check uniqueness with competing CTAs visible, including an open confirmation dialog when
  applicable. A zero-match or multi-match selector is unresolved: record the gap in Gotchas
  and the required accessible-name/test-id change; do not invent a selector or edit product
  code in this workflow. Mark selectors not exercised in the harness as unverified.

### Actions

- {Action}: {selector-table action + harness command, or visible action when Harness is none;
  observable end state}

## Gotchas

- {What lies: focus, async menus, OS drag, entitlements. Say when a path is manual.}
