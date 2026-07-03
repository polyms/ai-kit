---
description: >-
  Popover and Tooltip — lightweight overlays. Blocking flows → modal.md. Toolbar tooltips → navigation.md.
---

# Popover & Tooltip

Lightweight overlays — **not** modals. Blocking dialogs → [modal.md](modal.md).

## Popover

Anchored panel for hints, metadata, compact actions. No `Modal.Container`, no focus trap for full workflows.

**Tree:** `Popover` → `Popover.Trigger` + `Popover.Content`.

```tsx
import { Button, Popover } from '@polyms/core-ui'

const storagePopover = (
  <Popover>
    <Popover.Trigger render={<Button variant='primary' />}>Details</Popover.Trigger>
    <Popover.Content
      side='bottom'
      title='Storage usage'
      description='You are using 4.2 GB of 10 GB on this plan.'
    />
  </Popover>
)
```

| Rule          | Detail                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Trigger**   | Prefer `render={<Button … />}` — [button.md](button.md#compose-button-through-render)                              |
| **Content**   | `title` / `description` props on `Popover.Content` — optional `children` for extra body                            |
| **Placement** | `side`, `align` on `Popover.Content`                                                                               |
| **vs Modal**  | Popover for hints, metadata, compact actions; Modal for blocking confirm / multi-step forms ([modal.md](modal.md)) |

## Tooltip

Hover/focus hint — **not** a dialog or toast.

**Simple API** — wrap a single child and pass `title`:

```tsx
import { Button, Tooltip } from '@polyms/core-ui'

const tooltipRegion = (
  <Tooltip.Provider>
    <Tooltip side='top' title='Save your changes before leaving'>
      <Button outlined>Save</Button>
    </Tooltip>
  </Tooltip.Provider>
)
```

| Rule              | Detail                                                                                                     |
| ----------------- | ---------------------------------------------------------------------------------------------------------- |
| **Provider**      | Wrap a region with `Tooltip.Provider` when multiple tooltips share one tree                                |
| **Child**         | One focusable child (often `Button`); `title` renders the tooltip body                                     |
| **Rich tooltips** | `Button` `tooltip` prop uses the same primitive — prefer for icon-only actions                             |
| **Toolbar**       | `Tooltip.Trigger` + `render` when composing with `Toolbar.Button` — [navigation.md](navigation.md#toolbar) |

Confirm API details in `index.d.ts` when using `Tooltip.Trigger` / `Tooltip.Content` directly.
