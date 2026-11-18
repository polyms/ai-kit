---
description: >-
  CSS-only utilities — table, badge, card, link, item-* interaction states, typography h1–h6.
  Use when no React component fits: tables, badges, ghost nav rows, skeleton.
---

# CSS Utilities

When no exported React component exists, use semantic HTML + these classes.

## CSS-Only Classes

- Table: `.table`, `.table-sm`, `.table-lg`, `.table-striped`, `.table-hover`, `.table-bordered`, `.table-borderless`, `.table-active`, `.table-group-divider`, `.caption-top`, `thead.thead-light`.
- Badge: `.badge`, `.badge-lg`, `.badge-xl`, `.badge-primary`, `.badge-success`, `.badge-info`, `.badge-warning`, `.badge-danger`, `.badge-light`, `.badge-dark`.
- Card: `.card`, `.card-body`.
- Link: `.link`, `.link-primary`, `.link-danger`, `.link-light`, `.stretched-link`.
- Alert (in alert body): `.alert-link`.
- Toggle: `.toggle`, `.toggle-group` for Base UI `Toggle` and `ToggleGroup`.
- Checkbox/radio advanced rendering: `.checkbox`, `.radio`, `.radio-group`, `.check-group`. Prefer React components for accessibility and state attributes.
- Skeleton: `.skeleton`.
- Typography: `.h1` through `.h6`.
- Z-index: `.z-dropdown`, `.z-sticky`, `.z-fixed`, `.z-toolbar`, `.z-offcanvas`, `.z-modal`, `.z-popover`, `.z-tooltip`, `.z-toast`.
- Layout: `.@page` (container query root — `className='@page'` in JSX), `.container-page`.
- Theme: `.dark`, `bg-body`, `text-fg`, `text-muted`, `bg-surface`, `border-line`.
- Chrome helpers: `.border-light`, `.border-{t|r|b|l|s|e|x|y}-light`, `.bg-light`.
- State: `.item-primary` through `.item-dark`.

## Table

```tsx
<table className='table table-striped table-hover table-bordered'>
  <thead className='thead-light'>
    <tr>
      <th scope='col'>Name</th>
      <th scope='col'>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Order #1024</td>
      <td>Paid</td>
    </tr>
  </tbody>
</table>
```

## Typography

Use `.h1` through `.h6` for page and section titles — not ad-hoc `text-2xl` / `text-xl` mixes for the same level.

```tsx
<h1 className='h1'>Settings</h1>
<h2 className='h2'>Profile</h2>
<p className='text-muted'>Update how others see you on this workspace.</p>
```

See [quality.md — Visual consistency](quality.md#visual-consistency) for heading discipline.

## Lists and collections

Prefer structured primitives over long styled `<div>` stacks:

| Situation                  | Class / component              |
| -------------------------- | ------------------------------ |
| Columnar data              | `.table` (see [Table](#table)) |
| Sectioned content          | `Tabs`, `Accordion`            |
| Single disclosure          | `Collapsible`                  |
| Per-row actions            | `Menu`                         |
| Toolbar filters above list | `Toolbar` + `Field.Floating`   |

Full decision table: [quality.md — Lists and collections](quality.md#lists-and-collections).

## Badge And Card

```tsx
<div className='card'>
  <div className='card-body'>
    <div className='mb-2 inline-flex gap-2'>
      <span className='badge badge-primary'>New</span>
      <span className='badge badge-light'>Draft</span>
    </div>
    <a className='link link-primary stretched-link' href='/docs'>
      Open docs
    </a>
  </div>
</div>
```

## Interactive State Utilities

`item-*` classes encode transparent idle, tinted hover, and selected active states. Use them for nav links, sidebar links, interactive chips, hoverable rows, command palette rows, segmented controls, and status-tinted action rows.

Variant behavior:

| Class          | Idle                        | Hover                                    | Active / `.active`                    |
| -------------- | --------------------------- | ---------------------------------------- | ------------------------------------- |
| `item-primary` | transparent, inherits color | `bg-primary-700/10` + `text-primary-700` | same as hover                         |
| `item-success` | `text-success-600`          | `bg-success-100` + `text-success-700`    | `bg-success-200` + `text-success-700` |
| `item-info`    | `text-info-600`             | `bg-info-500/5` + `text-info-600`        | same as hover                         |
| `item-warning` | `text-warning-500`          | `bg-warning-100` + `text-warning-600`    | `bg-warning-200` + `text-warning-600` |
| `item-danger`  | `text-danger-500`           | `bg-danger-100` + `text-danger-600`      | `bg-danger-200` + `text-danger-600`   |
| `item-light`   | `text-slate-600`            | `bg-slate-100` + `text-slate-900`        | `bg-slate-200` + `text-slate-900`     |
| `item-dark`    | `text-slate-300`            | `bg-slate-700` + white                   | `bg-slate-800` + white                |

Rules:

1. Default to `item-*` instead of custom `hover:bg-*` / `hover:text-*` chains for ghost-style surfaces.
2. Pick the variant by intent: `primary`, `light`, `dark`, `success`, `warning`, `danger`, or `info`.
3. Selected state is `.active`, not custom data/ARIA styling.
4. Use `.badge` for static labels and `item-*` for interactive surfaces.
5. If a Polyms component exists (`Button`, `Toolbar`, `Menu`, etc.), prefer the component.

```tsx
import clsx from 'clsx'

<a
  className={clsx('item-primary flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium', isActive && 'active')}
  href='/dashboard'>
  Dashboard
</a>

<button type='button' className='item-danger flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium'>
  Move to trash
</button>
```

Disabled state is not built into `item-*`; add `disabled:pointer-events-none disabled:opacity-50` when needed.
