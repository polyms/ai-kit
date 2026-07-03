---
description: >-
  Core-ui jargon — compound tree, useRender, item-*, semantic tones, Container, barrel import, built-in shell.
---

# Glossary

Core-ui jargon — load when a term below appears in the task or generated code.

## Compound tree / compound component

A **root** export with **dot-slot children** that must stay wired together — e.g. `Modal` → `Modal.Trigger` + `Modal.Content` → `Modal.Header` / `Modal.Body` / `Modal.Footer`.

- Import only from the barrel; never invent flat names (`ModalHeader`, `FieldInput`).
- Slots carry a11y, focus, and animation — do not replace with styled `<div>`s.
- Full slot lists: [components.md#public-surface](components.md#public-surface).

## useRender / render prop

Base UI pattern for polymorphic primitives. `render={<Button … />}` on a trigger/close slot renders that element as the interactive node while keeping library wiring.

- Extend wrappers with `useRender.ComponentProps<'tag'>` — [components.md#extending-primitives-with-userender](components.md#extending-primitives-with-userender).
- Compose triggers: [button.md#compose-button-through-render](button.md#compose-button-through-render).

## Ghost style

Transparent idle surface that tints on hover/active — default `Button` (no `variant`), and `.item-*` utilities for nav rows and chips.

- Tokenized as `color-mix(in oklab, var(--variant) 10%, transparent)` in component CSS.
- Do not hand-code hex hover backgrounds on library shells.

## item-* utilities

CSS-only interactive state classes (`.item-primary` … `.item-dark`) — single source of truth for ghost hover surfaces outside React primitives. Details: [css-utilities.md](css-utilities.md#interactive-state-utilities).

## Semantic tones

Intent colors mapped to design-system roles — not raw Tailwind palettes.

| Tone      | Use                          |
| --------- | ---------------------------- |
| `primary` | Brand / default emphasis     |
| `success` | Positive / completion        |
| `warning` | Caution / at-risk            |
| `danger`  | Error / destructive          |
| `info`    | Neutral informational accent |
| `light`   | Light surface contrast       |
| `dark`    | Dark surface contrast        |

Gray chrome uses **`slate`**, not `neutral` / `zinc`. Full rules: [theming.md](theming.md).

## Container (overlay)

Portal mount point for programmatic overlays — mount **once** in the app shell.

| Container             | Pairs with                            |
| --------------------- | ------------------------------------- |
| `Modal.Container`     | `useModalStore` / `showModal`         |
| `Offcanvas.Container` | `useOffcanvasStore` / `showOffcanvas` |
| `Toast.Container`     | `Toast.useToastManager()`             |

Declarative `<Modal>` trees work without `Modal.Container`; programmatic `showModal` does not. Wiring: [setup.md#app-shell](setup.md#app-shell). Overlay patterns: [modal.md](modal.md).

## Built-in shell

Pre-styled library surface (`Modal.Content`, `Menu.Content`, `Select.Content`, `Accordion.Panel`, …). Add layout classes to **your children**, not replacement geometry/padding/shadow on the shell.

## Barrel import

`import { … } from '@polyms/core-ui'` only. Confirm symbols in `index.d.ts` — never deep-import `core/src/…` paths.
