---
description: >-
  Theming — slate chrome, semantic tones, dark mode, bg-body/text-fg tokens, item-* ghost surfaces.
  Use when setting colors, toggling dark mode, or using semantic utilities.
---

# Theming

## Colors

Use `slate` for gray UI chrome:

- Good: `text-slate-500`, `bg-slate-100`, `border-slate-300`, `var(--color-slate-400)`
- Bad: `text-neutral-500`, `bg-neutral-100`, `border-neutral-300`

Use semantic tones for intent:

| Intent                 | Tone            |
| ---------------------- | --------------- |
| Brand/default emphasis | `primary`       |
| Positive/completion    | `success`       |
| Caution/at-risk        | `warning`       |
| Error/destructive      | `danger`        |
| Surfaces/contrast      | `light`, `dark` |

Do not substitute raw palettes such as `rose-*`, `emerald-*`, `amber-*`, `zinc-*`, or `blue-*` for semantic roles unless the app explicitly documents them as one-off accents.

## Dark Mode

Dark mode is class-based. Apply `.dark` on `<html>` or another ancestor.

```html
<html class="dark"></html>
```

Prefer semantic surface utilities:

| Utility                 | Role                        |
| ----------------------- | --------------------------- |
| `bg-body` / `text-body` | Page background             |
| `text-fg`               | Primary text                |
| `text-muted`            | Secondary text              |
| `bg-surface`            | Raised surface              |
| `bg-surface-2`          | Popover/menu/select surface |
| `bg-input`              | Form control background     |
| `border-line`           | Default divider             |

Default token values:

| Token         | Light     | Dark      |
| ------------- | --------- | --------- |
| `--body`      | `#ffffff` | `#2e3440` |
| `--fg`        | slate-900 | `#eceff4` |
| `--surface`   | slate-100 | `#434c5e` |
| `--surface-2` | `#ffffff` | `#3b4252` |
| `--muted`     | slate-500 | `#c0c8d4` |
| `--line`      | slate-300 | `#4c566a` |
| `--input`     | `#ffffff` | `#3b4252` |

`color-scheme` is set automatically (`light` on `:root`, `dark` on `.dark`) so native controls and scrollbars follow the active theme.

```tsx
<div className='min-h-dvh bg-body text-fg'>
  <header className='border-line border-b bg-surface px-4 py-3'>
    <h1 className='font-semibold'>Dashboard</h1>
    <p className='text-muted text-sm'>Welcome back</p>
  </header>
</div>
```

Use Tailwind `dark:` only for app-specific one-off overrides.

Consumer brand accents: override `--color-primary-*` in app CSS after importing library styles. See [brandkit.md](brandkit.md).

Before shipping, verify hierarchy and contrast in **both** light and dark modes. See [quality.md](quality.md#pre-flight-check).

## Transparent Interactive States

For ghost-style surfaces, use `item-*` classes. Inside custom component CSS, mirror the library pattern with CSS variables and `color-mix(in oklab, var(--variant) 10%, transparent)` instead of hardcoded hex values.

## Logical Direction

Prefer logical-direction utilities for new code:

- `ms-*` / `me-*` over `ml-*` / `mr-*`
- `ps-*` / `pe-*` over `pl-*` / `pr-*`
- `border-s-*` / `border-e-*` over `border-l-*` / `border-r-*`

Follow nearby code for minimal diffs in existing files.
