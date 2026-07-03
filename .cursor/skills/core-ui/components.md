---
description: >-
  Component composition root — public surface, compound slots, dynamic import, useRender.
  Sub-topics → button, inputs, navigation, display, overlays. Field → field.md; Modal → modal.md.
disable-model-invocation: true
---

# Component Composition

Prefer exported React components from `@polyms/core-ui` before generating custom markup. Keep compound trees intact so accessibility wiring, focus management, sibling selectors, and animations keep working.

## Topic routing

Authoritative keyword → file map: **[SKILL.md#skill-routing](SKILL.md#skill-routing)**.

Sub-topics from this file: [button.md](button.md) · [inputs.md](inputs.md) · [navigation.md](navigation.md) · [display.md](display.md) · [overlays.md](overlays.md). Field → [field.md](field.md); Modal/Offcanvas → [modal.md](modal.md).

## Public Surface

Use the package barrel only. Common exports include:

- Polyms components: `Alert`, `Button`, `Checkbox`, `Radio`, `RadioGroup`, `Switch`, `Field`, `Modal`, `NumberField`, `Select`, `Toast`, `Offcanvas`, `Menu`, `NavigationMenu`, `Tabs`, `Toolbar`, `Avatar`, `Breadcrumb`, `Accordion`, `Collapsible`, `Spinner`, `Popover`, `Tooltip`, and others — confirm in `index.d.ts`.
- Base UI re-exports: `Toggle`, `ToggleGroup`, and `useRender`.
- Programmatic overlays: `useModalStore` and `useOffcanvasStore`.
- Code splitting: `dynamic` (alias `LazyComponentLoader`) — [Dynamic import](#dynamic-import)

Common compound roots:

| Area           | Pattern                                                                                                                                                                                                                                                                       |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modal          | `Modal`, `Modal.Trigger`, `Modal.Content`, `Modal.Header`, `Modal.Body`, `Modal.Footer`, `Modal.Close`, `Modal.Container`                                                                                                                                                     |
| Field          | `Field`, `Field.Label`, `Field.Control`, `Field.Description`, `Field.Feedback`, `Field.Floating`                                                                                                                                                                              |
| Select         | `Select`, `Select.Trigger`, `Select.Content`, `Select.Item`, `Select.Group`, `Select.GroupLabel`, `Select.Separator`                                                                                                                                                          |
| Menu           | `Menu`, `Menu.Trigger`, `Menu.Content`, `Menu.Item`, `Menu.Separator`, `Menu.SubmenuRoot`, `Menu.SubmenuTrigger`                                                                                                                                                              |
| NavigationMenu | `NavigationMenu`, `NavigationMenu.List`, `NavigationMenu.Item`, `NavigationMenu.Trigger`, `NavigationMenu.Icon`, `NavigationMenu.Content`, `NavigationMenu.GroupLabel`, `NavigationMenu.Separator`, `NavigationMenu.Footer`, `NavigationMenu.Link`, `NavigationMenu.Viewport` |
| Offcanvas      | `Offcanvas`, `Offcanvas.Trigger`, `Offcanvas.Content`, `Offcanvas.Header`, `Offcanvas.Title`, `Offcanvas.Description`, `Offcanvas.Body`, `Offcanvas.Close`, `Offcanvas.Container`                                                                                             |
| Tabs           | `Tabs`, `Tabs.List`, `Tabs.Tab`, `Tabs.Panel`                                                                                                                                                                                                                                 |
| Toolbar        | `Toolbar`, `Toolbar.Button`, `Toolbar.Link`, `Toolbar.Input`, `Toolbar.Group`, `Toolbar.Separator`                                                                                                                                                                            |
| Toast          | `Toast`, `Toast.Container`; use `Toast.useToastManager` for imperative toast flows                                                                                                                                                                                            |
| Alert          | `Alert`, `Alert.Heading`                                                                                                                                                                                                                                                      |
| Breadcrumb     | `Breadcrumb`, `Breadcrumb.Item`                                                                                                                                                                                                                                               |
| Accordion      | `Accordion`, `Accordion.Item`, `Accordion.Header`, `Accordion.Trigger`, `Accordion.Panel`                                                                                                                                                                                     |
| Collapsible    | `Collapsible`, `Collapsible.Trigger`, `Collapsible.Panel`                                                                                                                                                                                                                     |
| Popover        | `Popover`, `Popover.Trigger`, `Popover.Content`, `Popover.Close`                                                                                                                                                                                                              |
| Tooltip        | `Tooltip`, `Tooltip.Provider`, `Tooltip.Trigger`, `Tooltip.Content` — simple API: wrap child + `title` on `Tooltip` ([overlays.md](overlays.md))                                                                                                                              |
| Avatar         | `Avatar`, `Avatar.Image`, `Avatar.Fallback`                                                                                                                                                                                                                                   |
| NumberField    | `NumberField` — standalone numeric control (not a `Field` slot)                                                                                                                                                                                                               |

## Dynamic import

Utility — wraps **`React.lazy`** + **`Suspense`**. Import as **`dynamic`** or **`LazyComponentLoader`** (same helper). Not a visual primitive.

```tsx
import { dynamic, Spinner } from '@polyms/core-ui'

const SettingsPanel = dynamic(() => import('./SettingsPanel'), { loadingComponent: <Spinner size={24} /> })

function Page() {
  return <SettingsPanel userId={userId} />
}
```

| Rule                   | Detail                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------- |
| **Factory**            | `() => Promise<{ default: Component }>` — default export required                      |
| **`loadingComponent`** | Suspense fallback while chunk loads — `Spinner`, `.skeleton`, or `null`                |
| **Props / ref**        | Returned component forwards props and ref to the lazy default export                   |
| **vs raw `lazy`**      | Prefer `dynamic()` for consistent loading UI across the app                            |
| **Module Federation**  | Same helper for remote entry components — core ships a `module-federation` Vite plugin |
| **When not to use**    | Sync components, tiny modules, or trees that already have route-level Suspense         |

## Extending Primitives With useRender

When building a wrapper primitive, use `useRender.ComponentProps<'tag'>` and pass `props.ref` into `useRender`. React 19 does not require `forwardRef` for this pattern.

```tsx
import { useRender } from '@polyms/core-ui'
import clsx from 'clsx'

type ComponentProps = useRender.ComponentProps<'div'>

export function Component({ className, render, ...props }: ComponentProps) {
  return useRender({
    defaultTagName: 'div',
    ref: props.ref,
    render,
    props: {
      ...props,
      className: clsx('component-class', className),
    },
  })
}
```

## Built-In Shells

Library primitives such as `Modal.Content`, `Offcanvas.Content`, `Menu.Content`, `Select.Content`, and `Accordion.Panel` are already styled. Apply layout classes to your own children or wrappers instead of replacing shell geometry, padding, background, border, or shadow.
