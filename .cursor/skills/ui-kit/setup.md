---
description: Wire @polyms/ui-kit into a new consumer app — install, styles, app shell, Toast/Modal/Offcanvas containers.
disable-model-invocation: true
---

# Setup

## Install

```bash
pnpm add @polyms/ui-kit
```

`react` and `react-dom` must be `>=19.0.0`. Install `zustand` when using programmatic modals or offcanvas stores.

```bash
pnpm add zustand
```

## Imports

Import components from the package barrel.

```tsx
import { Button, Field, Modal } from '@polyms/ui-kit'
```

Do not deep import feature modules.
When unsure a symbol exists, open `node_modules/@polyms/ui-kit/index.d.ts`.

## Styles

Consumers must import the package styles. Pick one path based on the app build pipeline:

- Pre-built CSS: import the installed `styles-<hash>.css` file from `node_modules/@polyms/ui-kit/`.
- Tailwind v4 pipeline: import `@polyms/ui-kit/styles/tailwind.css`.

Trust the installed package files for exact paths because the hashed CSS filename changes by release.

## App shell

Recommended consumer root — mount programmatic overlay containers once. Install **`zustand`** when using `useModalStore` / `useOffcanvasStore`.

```tsx
import { Modal, Offcanvas, Toast } from '@polyms/ui-kit'

export function App() {
  return (
    <Toast>
      <Modal.Container />
      <Offcanvas.Container />
      <main>{/* routes/layout */}</main>
      <Toast.Container />
    </Toast>
  )
}
```

Omit `Modal.Container` / `Offcanvas.Container` if you only use declarative `<Modal>` / `<Offcanvas>` trees (no `showModal` / `showOffcanvas`).

## Toast

Provider + **`Toast.Container`** under **`Toast`**. Patterns and `Toast.useToastManager()`: **[display.md](display.md#toast)**. Shell with overlay containers: [App shell](#app-shell).

## Programmatic overlays

1. Mount **`Modal.Container`** and/or **`Offcanvas.Container`** once ([App shell](#app-shell)).
2. Call `useModalStore.getState().showModal(id, <Modal.Content>…</Modal.Content>)` or `useOffcanvasStore.getState().showOffcanvas(id, <Offcanvas.Content>…</Offcanvas.Content>)`.
3. `closeModal` / `closeOffcanvas` animate out, then unmount after **300ms**.

Full compound trees, `Modal.Close` patterns, and anti-patterns: **[modal.md#programmatic-overlays](modal.md#programmatic-overlays)**.

## Agent skill

Consumer apps can install the bundled agent skill so assistants follow the same composition rules:

```bash
pnpm exec ui-kit-skill
```

Copies the bundled skill into `.cursor/skills/ui-kit`, `.claude/skills/ui-kit`, and `.agents/skills/ui-kit`. Re-run after upgrading `@polyms/ui-kit`.
