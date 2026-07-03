---
description: >-
  Modal and Offcanvas overlays. Use when building a dialog, drawer, confirmation,
  delete confirm, or calling showModal/showOffcanvas. Form inside overlay → also load field.md.
---

# Modal & Offcanvas

Same overlay pattern — compound tree, portal shell, programmatic store + **`Container`** — different layout: `Modal` centers, `Offcanvas` slides from an edge.

Setup: [setup.md](setup.md). `Button` + `render` on triggers: [button.md](button.md#compose-button-through-render). Forms inside body: [field.md](field.md).

## Choose which

| Use             | When                                                                                  |
| --------------- | ------------------------------------------------------------------------------------- |
| **`Modal`**     | Confirmations, create/edit flows, focused tasks, nested dialogs                       |
| **`Offcanvas`** | Filters, detail panels, settings, nav, supplementary content without leaving the page |

Both: declarative `<Root>` + `Trigger` + `Content` tree, or `use*Store.getState().show*(id, <Content>…)`. Mount matching **`Container`** once (see [setup.md](setup.md)).

|           | Modal                           | Offcanvas                                          |
| --------- | ------------------------------- | -------------------------------------------------- |
| Container | `Modal.Container`               | `Offcanvas.Container`                              |
| Store     | `useModalStore`                 | `useOffcanvasStore`                                |
| Open      | `showModal(id, element)`        | `showOffcanvas(id, element)`                       |
| Close     | `Modal.Close`, `closeModal(id)` | `Offcanvas.Close`, `closeOffcanvas(id)`            |
| Dismiss   | Escape, backdrop                | Escape, backdrop, swipe (`swipeDirection` on root) |

---

## Modal

**Tree:** `Modal` → `Modal.Trigger` + `Modal.Content` → `Modal.Header`, `Modal.Body`, `Modal.Footer`, `Modal.Close`.

```tsx
import { Button, Field, Modal } from '@polyms/core-ui'

const editProfileModal = (
  <Modal>
    <Modal.Trigger render={<Button variant='primary' />}>Edit profile</Modal.Trigger>
    <Modal.Content size='lg' scrollable>
      <Modal.Header>Edit profile</Modal.Header>
      <Modal.Body>
        <Field>
          <Field.Label>Display name</Field.Label>
          <Field.Control autoFocus name='name' placeholder='Your name' type='text' />
        </Field>
      </Modal.Body>
      <Modal.Footer>
        <Modal.Close render={<Button rounded size='xl' />}>Cancel</Modal.Close>
        <Button variant='primary'>Save</Button>
      </Modal.Footer>
    </Modal.Content>
  </Modal>
)
```

| Rule                       | Detail                                                                                                               |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Trigger / footer close** | `render={<Button … />}` with **`children`** for labeled footer close — not `className='btn …'` on primitive alone    |
| **Footer dismiss**         | Cancel / Close → ghost `Button` — **omit `variant`** on `Modal.Close render={<Button … />}`                          |
| **Focus on open**          | **One** `autoFocus` target per modal — form body → first **`Field.Control`** / input; confirm-only → footer main CTA |
| **Footer main CTA**        | `autoFocus` on primary action (`Confirm`, `Delete`, …) when body has **no** form input — never on Cancel/Close       |
| **Title**                  | `Modal.Header` only — no `title` on `Modal.Content`                                                                  |
| **Header close**           | Icon `Modal.Close` in header when `close={true}` (default); `close={false}` to hide                                  |
| **Long body**              | `scrollable` on `Modal.Content`                                                                                      |
| **Full screen**            | `size='full'`; often `centered={false}`                                                                              |
| **No fake dialogs**        | No `fixed inset-0` div overlays                                                                                      |

Controlled: `<Modal open={open} onOpenChange={setOpen}>`. Prefer `onOpenChange` over manual backdrop.

Programmatic API: [Programmatic overlays](#programmatic-overlays).

Footer = actions only — no `Field` roots in `Modal.Footer`.

---

## Offcanvas

**Tree:** `Offcanvas` → `Offcanvas.Trigger` + `Offcanvas.Content` → `Offcanvas.Header` (`Offcanvas.Title`), `Offcanvas.Description`, `Offcanvas.Body`, `Offcanvas.Close`.

No `Offcanvas.Footer` — actions live in `Offcanvas.Body` or header area.

```tsx
import { Button, Offcanvas } from '@polyms/core-ui'

const filtersOffcanvas = (
  <Offcanvas swipeDirection='right'>
    <Offcanvas.Trigger render={<Button variant='primary' outlined />}>Open filters</Offcanvas.Trigger>
    <Offcanvas.Content size='lg'>
      <Offcanvas.Header>
        <Offcanvas.Title>Filters</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Description>Optional subtitle.</Offcanvas.Description>
      <Offcanvas.Body>
        {/* Field trees or lists — field.md */}
        <Offcanvas.Close render={<Button rounded />}>Done</Offcanvas.Close>
      </Offcanvas.Body>
    </Offcanvas.Content>
  </Offcanvas>
)
```

| Rule                 | Detail                                                                                                                              |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Trigger**          | `render={<Button … />}` — same as `Modal.Trigger`; not `className='btn …'` on primitive alone                                       |
| **Description slot** | `Offcanvas.Description` is a **direct child** of `Offcanvas.Content` — not inside `Offcanvas.Title`, not after `Offcanvas.Body`     |
| **Body dismiss**     | `Offcanvas.Close render={<Button … />}>` with **`children`** for labeled actions (e.g. Done)                                        |
| **Swipe**            | `swipeDirection` on `Offcanvas` root: `left` \| `right` \| `up` \| `down`                                                           |
| **No fake drawers**  | No hand-rolled slide-in panels                                                                                                      |
| **Size**             | `size` on `Offcanvas.Content`: `sm` … `3xl`, `full` — width (left/right) or height (up/down)                                        |
| **Mobile**           | Full-width bottom drawer regardless of `size`                                                                                       |
| **Close button**     | `closeButton={false}` on `Offcanvas.Content` to hide built-in icon closes (mobile header + inner chrome)                            |
| **Built-in close**   | Library renders icon-only `Offcanvas.Close` with `className='offcanvas-close'` — do not restyle with `btn-*`; use `aria-label` only |

Controlled: `<Offcanvas open={open} onOpenChange={setOpen}>`.

Programmatic API: [Programmatic overlays](#programmatic-overlays).

---

## Programmatic overlays

Requires **`Modal.Container`** / **`Offcanvas.Container`** in the app shell ([setup.md#app-shell](setup.md#app-shell)) and **`zustand`** in the consumer app.

| Store               | Open                                                          | Close                                                            |
| ------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------- |
| `useModalStore`     | `showModal(id, <Modal.Content>…full tree…</Modal.Content>)`   | `Modal.Close`, `closeModal(id)`, Escape, backdrop                |
| `useOffcanvasStore` | `showOffcanvas(id, <Offcanvas.Content>…</Offcanvas.Content>)` | `Offcanvas.Close`, `closeOffcanvas(id)`, Escape, backdrop, swipe |

`closeModal` / `closeOffcanvas` set `open: false` first, then remove the entry after **300ms** so exit transitions finish. Reusing an `id` replaces the previous panel.

Pass a **full compound tree** as the second argument — same Header/Body/Footer rules as declarative modals.

```tsx
import { Button, Modal, useModalStore } from '@polyms/core-ui'

function confirmDelete() {
  useModalStore.getState().showModal(
    'delete-item',
    <Modal.Content size='sm'>
      <Modal.Header>Delete this item?</Modal.Header>
      <Modal.Body>This cannot be undone.</Modal.Body>
      <Modal.Footer>
        <Modal.Close render={<Button rounded />}>Cancel</Modal.Close>
        <Button autoFocus onClick={() => useModalStore.getState().closeModal('delete-item')} variant='danger'>
          Delete
        </Button>
      </Modal.Footer>
    </Modal.Content>
  )
}
```

```tsx
import { Offcanvas, useOffcanvasStore } from '@polyms/core-ui'

function openNotifications() {
  useOffcanvasStore.getState().showOffcanvas(
    'notifications',
    <Offcanvas.Content>
      <Offcanvas.Header>
        <Offcanvas.Title>Notifications</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>You're all caught up.</Offcanvas.Body>
    </Offcanvas.Content>
  )
}
```

---

## Composing with other components

| Body content        | Read                                                                                                                  |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Form fields         | [field.md](field.md) — in `Modal.Body`; **`autoFocus`** on first **`Field.Control`**; footer Save without `autoFocus` |
| Destructive confirm | `Button variant='danger' autoFocus` in `Modal.Footer` when body has no inputs — Cancel stays ghost via `Modal.Close`  |
| Tables / lists      | [css-utilities.md](css-utilities.md) `.table` in body                                                                 |
| Unsaved changes     | When the form is dirty, intercept `onOpenChange` / backdrop / swipe — confirm in a nested **`Modal`** before dismiss  |

### Unsaved changes in overlays

Forms in **`Modal.Body`** or **`Offcanvas.Body`** often need a guard before dismiss:

1. Track **dirty** state (any field changed since open).
2. On backdrop click, Escape, swipe, or **`Modal.Close`** / **`Offcanvas.Close`**: if dirty, open a small confirm **`Modal`** (`Discard changes?` / `Keep editing`) instead of closing immediately.
3. Save success → clear dirty → then close the overlay.

Use controlled **`open`** + **`onOpenChange`** when the guard is non-trivial; programmatic flows can swap `showModal` content to the confirm tree on the same `id`.

---

## Anti-patterns

**Modal:** `ModalHeader` imports; `title=` on `Modal.Content`; bare `Modal.Content` without Header/Body/Footer; `showModal` without `Modal.Container`; footer `Button onClick` instead of `Modal.Close`; `variant` on footer `Modal.Close` (use ghost — omit `variant`); `autoFocus` on footer CTA when body has form inputs (use first input instead); missing `autoFocus` on confirm-only modals; two `autoFocus` targets in one modal.

**Offcanvas:** `OffcanvasTitle` as separate import; `Description` nested in `Title` or below `Body`; `showOffcanvas` without `Offcanvas.Container`.

**Both:** custom portal/backdrop markup; `className='btn …'` on `Modal.Trigger` / footer `Modal.Close` / `Offcanvas.Trigger` / body `Offcanvas.Close` instead of `render={<Button … />}` (built-in icon close in `Offcanvas.Content` chrome is library-owned — do not replace with `btn-*`).

---

## Pre-flight

- [ ] **Primitive** — `Modal` (blocking, centered) vs `Offcanvas` (edge panel) matches intent ([Choose which](#choose-which)).
- [ ] **Compound tree** — Modal: `Header` + `Body` + `Footer`; Offcanvas: `Header` + `Description` (direct child of `Content`, before `Body`) + `Body`; no invented flat imports.
- [ ] **Container** — matching `Modal.Container` / `Offcanvas.Container` mounted when using `showModal` / `showOffcanvas` ([setup.md#app-shell](setup.md#app-shell)).
- [ ] **Button triggers** — `Modal.Trigger`, footer `Modal.Close`, `Offcanvas.Trigger`, body `Offcanvas.Close` use `render={<Button … />}` with `children` for labeled actions — not `className='btn …'` on primitives ([button.md](button.md#compose-button-through-render)).
- [ ] **Footer actions** — Cancel/Close via ghost `Modal.Close` (no `variant`); confirm-only modals: `autoFocus` on main CTA; form modals: `autoFocus` on first input, not footer Save.
- [ ] **Scroll** — `scrollable` on `Modal.Content` when body has a long form or list.
- [ ] **Unsaved guard** — dirty forms confirm before backdrop / Escape / swipe dismiss ([Unsaved changes in overlays](#unsaved-changes-in-overlays)).

**Done when:** the overlay uses a full compound tree; programmatic flows have a mounted `Container`; every styled trigger/close is traceable to `render={<Button … />}`; long bodies won't clip without `scrollable`.
