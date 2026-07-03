---
description: >-
  Button primitive — variants, sizes, icon, touch targets, compose-through-render for Modal/Menu/Toolbar triggers.
---

# Button

The most-used primitive. `Button` wraps a native `<button>` through `useRender`, so it accepts all native button attributes (`disabled`, `type`, `onClick`, …) plus the `render` prop for polymorphism. With no `variant`, it renders the ghost style (`btn-ghost`).

| Prop       | Type                                                                             | Default   | Notes                                                                                                                                                      |
| ---------- | -------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`  | `'primary' \| 'success' \| 'info' \| 'warning' \| 'danger' \| 'dark' \| 'light'` | — (ghost) | Maps to `btn-*` classes; omit for the transparent ghost button.                                                                                            |
| `size`     | `'xs' \| 'sm' \| 'lg' \| 'xl' \| '2xl' \| '3xl'`                                 | — (base)  | Adds `btn-<size>`; omit for the default medium size.                                                                                                       |
| `rounded`  | `boolean`                                                                        | `false`   | Pill shape (`rounded-full`).                                                                                                                               |
| `icon`     | `boolean`                                                                        | `false`   | Square icon-only button (`btn-icon`); pair with an `aria-label`. Prefer **`size='lg'`** or **`xl`** when the hit area would otherwise fall below ~44×44px. |
| `outlined` | `boolean`                                                                        | `false`   | Outline style for the chosen variant.                                                                                                                      |
| `active`   | `boolean`                                                                        | `false`   | Forces the active/pressed visual state.                                                                                                                    |
| `tooltip`  | `string`                                                                         | —         | Rich tooltip; falls back to the native `title` before hydration.                                                                                           |
| `disabled` | `boolean`                                                                        | `false`   | Native attribute; disables interaction and applies disabled styling.                                                                                       |
| `render`   | `useRender` render prop                                                          | —         | Render as another element (e.g. an `<a>` or router link) while keeping button styling.                                                                     |

**There is no `content` prop.** Do not pass `content='center'` or similar invented props.

## Styling rules (agents miss these)

Prefer **`<Button>` props** over hand-written `btn-*` classes. The component maps props → classes:

| `Button` prop       | CSS class                      | Common mistake                                 |
| ------------------- | ------------------------------ | ---------------------------------------------- |
| (no `variant`)      | `btn-ghost`                    | omitting `variant` then adding random Tailwind |
| `variant='primary'` | `btn-primary`                  | `className='btn-primary'` without `btn` base   |
| `size='xl'`         | `btn-xl`                       | `size-xl`, `btn size-xl`                       |
| `rounded`           | `rounded-full`                 | bare Tailwind `rounded`                        |
| `outlined`          | `outlined` modifier on variant | duplicate border utilities                     |
| `icon`              | `btn-icon`                     | fixed `w-10 h-10` one-offs                     |

```tsx
// ✅ Correct
<Button variant='primary' size='xl' rounded>Save changes</Button>

// ❌ Wrong — bypasses Button; easy to get class names wrong
<button className='btn btn-primary size-xl content-center rounded' type='button'>
  Save changes
</button>
```

Use raw `className='btn …'` only on **native** `<button>` / `<a>` when `Button` truly cannot be used (rare). Even then, copy the exact mapping above (`btn-xl`, not `size-xl`).

### Touch targets

Interactive controls should meet **~44×44px** minimum hit area (WCAG / mobile).

| Situation               | Pattern                                                                                                                                |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Icon-only `Button`      | `icon` + **`size='lg'`** or **`xl`** + **`aria-label`** — not `size='xs'` in primary toolbars                                          |
| Dense table row actions | Inside **`Toolbar`**: `Toolbar.Button render={<Menu.Trigger />}` — standalone row: `Menu.Trigger render={<Button icon size='lg' … />}` |
| Async submit            | `disabled` + inline `Spinner` while pending — [display.md#spinner](display.md#spinner)                                                 |

Do not shrink library buttons with `className='size-6 p-0'` to fit tight layouts — pick a smaller **`size`** prop or use `Toolbar` spacing instead.

## Compose `Button` through `render`

Primitives that accept Base UI `render` should receive **`render={<Button … />}`** — not `btn-*` classes on the primitive alone:

| Primitive                        | Pattern                                                                                                                                                                                         |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Modal.Trigger`                  | `<Modal.Trigger render={<Button variant='primary' />}>Open</Modal.Trigger>`                                                                                                                     |
| `Modal.Close` (footer)           | `<Modal.Close render={<Button rounded size='xl' />}>Cancel</Modal.Close>` — **omit `variant`** (ghost); `autoFocus` on footer CTA only when body has no form input ([modal.md](modal.md#modal)) |
| `Offcanvas.Trigger`              | `<Offcanvas.Trigger render={<Button variant='primary' outlined />}>Open</Offcanvas.Trigger>`                                                                                                    |
| `Offcanvas.Close` (body dismiss) | `<Offcanvas.Close render={<Button rounded />}>Done</Offcanvas.Close>` — not the built-in icon close in `Offcanvas.Content` chrome                                                               |
| `Menu.Trigger`                   | `<Menu.Trigger render={<Button variant='primary' outlined />}>Actions</Menu.Trigger>`                                                                                                           |
| `Popover.Trigger`                | `<Popover.Trigger render={<Button variant='primary' />}>Details</Popover.Trigger>`                                                                                                              |
| `Popover.Close`                  | `<Popover.Close render={<Button size='sm' variant='light' className='w-full' />}>Close</Popover.Close>`                                                                                         |
| `Collapsible.Trigger`            | `<Collapsible.Trigger render={<Button />}>Toggle</Collapsible.Trigger>` — omit `variant` for ghost                                                                                              |
| `Toolbar.Button` + overflow menu | `<Toolbar.Button render={<Menu.Trigger />}>More</Toolbar.Button>` inside `Toolbar` — [navigation.md#responsive-toolbar](navigation.md#responsive-toolbar)                                       |
| `Toolbar.Button`                 | `<Toolbar.Button render={<Toggle />}>…</Toolbar.Button>`                                                                                                                                        |

Footer **`Modal.Close`** wires Dialog dismiss — pass **`children`** for a labeled button (with `render={<Button … />}`). Omit **`variant`** on that `Button` (ghost Cancel/Close). **`autoFocus`**: one target per modal — form in body → first **`Field.Control`** / input; confirm-only → main footer CTA (`Delete`, `Confirm`, …), not dismiss. Do not use a plain **`Button`** with a manual `onClick` just to close.

When `render` is provided on **`Button`**, the default `type='button'` is dropped so the target element keeps its own semantics.

```tsx
import { Button } from '@polyms/core-ui'

<Button variant='primary' size='lg' onClick={save}>
  Save changes
</Button>

<Button variant='danger' outlined disabled>
  Delete
</Button>

<Button icon rounded aria-label='Add item'>
  <PlusIcon />
</Button>
```
