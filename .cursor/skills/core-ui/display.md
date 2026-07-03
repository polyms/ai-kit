---
description: >-
  Toast, Alert, Avatar, Accordion, Collapsible, Spinner — inline and transient feedback. Toast a11y and vs Modal.
---

# Display

Toast, Alert, Avatar, Accordion, Collapsible, Spinner — inline and transient feedback.

## Toast

Declarative provider + portal container. Imperative toasts via `Toast.useToastManager()`.

```tsx
import { Toast } from '@polyms/core-ui'

export function App() {
  return (
    <Toast>
      <main>{/* routes */}</main>
      <Toast.Container />
    </Toast>
  )
}
```

```tsx
const toastManager = Toast.useToastManager()

toastManager.add({
  title: 'Saved',
  description: 'Profile updated.',
  type: 'success',
})
```

Mount **`Toast.Container`** once under **`Toast`**. Full app-shell wiring (with Modal/Offcanvas containers): [setup.md](setup.md#app-shell).

Deep reference for Modal/Offcanvas overlays: **[modal.md](modal.md)** — Toast is not a dialog; do not use it for confirmations that block workflow.

| Rule               | Detail                                                                                                                                                                                        |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Non-blocking**   | Toast does not trap focus — use **`Modal`** for delete confirm and irreversible actions.                                                                                                      |
| **Auto-dismiss**   | Default **`timeout`** is **5000** ms; set `timeout: 0` only when the user must read or act (e.g. undo).                                                                                       |
| **Screen readers** | Keep `title` / `description` concise — Base UI announces via a live region; do not rely on toast alone for critical errors that need a persistent **`Alert`** or inline **`Field.Feedback`**. |
| **Undo / retry**   | Prefer `type: 'actions'` with one clear action — not a second toast stacked on the first.                                                                                                     |

## Alert

Inline status banner — **not** Toast (temporary) and **not** Modal (blocking).

```tsx
import { Alert } from '@polyms/core-ui'

<Alert variant='success'>
  <Alert.Heading>Changes saved</Alert.Heading>
  Your profile updates are live on this workspace.
</Alert>

<Alert badge='New' onDismiss={() => setVisible(false)} variant='info'>
  <Alert.Heading>Policy update</Alert.Heading>
  Review the latest terms before your next billing cycle.
</Alert>
```

| Prop        | Notes                                                              |
| ----------- | ------------------------------------------------------------------ |
| `variant`   | `primary`, `success`, `info`, `warning`, `danger`, `light`, `dark` |
| `onDismiss` | Adds dismiss button — `alert-dismissible` styling                  |
| `badge`     | Optional slot after body (label, count)                            |
| `render`    | Polymorphic container via `useRender`                              |

| Rule              | Detail                                                                         |
| ----------------- | ------------------------------------------------------------------------------ |
| **Heading**       | `Alert.Heading` for title line — not raw `<h4>` with one-off classes           |
| **vs Toast**      | Alert = persistent inline feedback on the page; Toast = transient notification |
| **vs Modal**      | Alert does not trap focus or block the page                                    |
| **Links in body** | Use `.alert-link` on anchors inside the alert body                             |

## Avatar

User identity chip — image, initials fallback, or icon.

```tsx
import { Avatar } from '@polyms/core-ui'

const userAvatar = (
  <Avatar className='size-10'>
    <Avatar.Image alt='Tifa Lockhart' src='/avatars/tifa.jpg' />
    <Avatar.Fallback delay={0}>TL</Avatar.Fallback>
  </Avatar>
)
```

| Rule                  | Detail                                                                                       |
| --------------------- | -------------------------------------------------------------------------------------------- |
| **`alt`**             | Always on `Avatar.Image` when the image is meaningful                                        |
| **`Avatar.Fallback`** | Initials or icon when image fails or is loading; `delay={0}` avoids flicker for local assets |
| **Sizing**            | `className='size-*'` on root — do not invent one-off width/height without need               |

## Accordion

Expand/collapse sections — Polyms wrapper on Base UI with bundled `accordion-*` classes and `accordion-panel-body` padding.

**Shorthand** — `title` on `Accordion.Item`:

```tsx
import { Accordion } from '@polyms/core-ui'

const faqAccordion = (
  <Accordion defaultValue={['billing']}>
    <Accordion.Item title='Shipping' value='shipping'>
      Free shipping on orders over $50.
    </Accordion.Item>
    <Accordion.Item title='Billing' value='billing'>
      Invoices are emailed after checkout.
    </Accordion.Item>
  </Accordion>
)
```

**Full composition** — custom trigger content; put body text directly in `Accordion.Panel` (no extra `<p>` for spacing):

```tsx
<Accordion defaultValue={['notifications']}>
  <Accordion.Item value='notifications'>
    <Accordion.Header>
      <Accordion.Trigger>How will you notify me?</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Panel>We email billing and security updates to tifa.lockhart@polyms.dev.</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

**Multiple open** — `multiple` on root; `defaultValue` / `value` are arrays:

```tsx
<Accordion defaultValue={['shipping', 'returns']} multiple>
  <Accordion.Item title='Shipping' value='shipping'>
    …
  </Accordion.Item>
  <Accordion.Item title='Returns' value='returns'>
    …
  </Accordion.Item>
</Accordion>
```

| Rule                       | Detail                                                                                                                |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **`title` shorthand**      | On `Accordion.Item` — auto-builds Header, Trigger, Panel                                                              |
| **Panel content**          | Text or blocks in `Accordion.Panel`; padding via inner `accordion-panel-body` — no wrapper `<p>` for spacing          |
| **`value`**                | Required per item; matches `defaultValue` / controlled `value` on root                                                |
| **`multiple`**             | Several panels open at once — value arrays on root                                                                    |
| **vs Tabs**                | Accordion = vertical FAQ/settings; Tabs = peer sections — [navigation.md](navigation.md#tabs)                         |
| **vs Collapsible**         | Accordion = grouped items, roving focus, optional `multiple`; Collapsible = one toggle unit with fully custom trigger |
| **Progressive disclosure** | Long settings or FAQ — collapse secondary sections in `Accordion` instead of showing every field at once              |
| **Maintainer docs CSS**    | Scope API Reference accordion grid under `.api-reference` only — [quality.md#maintainer](quality.md#maintainer)       |

## Collapsible

Single expand/collapse region — Base UI wrapper with `.collapsible` animation and `.collapsible-icon` rotation when open.

```tsx
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Collapsible } from '@polyms/core-ui'

const detailsCollapsible = (
  <Collapsible className='rounded-lg border border-line' defaultOpen>
    <Collapsible.Trigger className='flex w-full items-center gap-2 p-4 text-left font-medium hover:bg-surface'>
      <HugeiconsIcon className='collapsible-icon' icon={ArrowRight01Icon} size={16} />
      Show more details
    </Collapsible.Trigger>
    <Collapsible.Panel>
      <div className='border-line border-t p-4 text-muted'>Hidden content.</div>
    </Collapsible.Panel>
  </Collapsible>
)
```

| Rule              | Detail                                                                                             |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| **Trigger**       | Style with `className` or `render={<Button … />}` — [button.md](button.md)                         |
| **Icon**          | Add `collapsible-icon` on chevron — rotates 90° when panel open                                    |
| **Panel padding** | You own inner layout (`p-4`, borders) — unlike `Accordion.Panel` body wrapper                      |
| **Controlled**    | `open` + `onOpenChange` on root                                                                    |
| **`animated`**    | `animated={false}` for instant toggle                                                              |
| **vs Accordion**  | Stack of independent FAQs → multiple `Collapsible` roots; grouped keyboard accordion → `Accordion` |
| **FAQ at scale**  | Many sections with shared styling → prefer `Accordion`; one-off disclosure → `Collapsible`         |

## Spinner

Loading indicator for async operations — pair with disabled buttons or skeleton layouts.

```tsx
import { Spinner } from '@polyms/core-ui'

<Spinner />
<Spinner className='text-primary' size={24} />
```

| Prop                 | Notes                                                              |
| -------------------- | ------------------------------------------------------------------ |
| `size`               | Pixel width/height (default `12`)                                  |
| `color` / `subColor` | Arc and track — prefer semantic tokens in app chrome over demo hex |
| `className`          | Adds `spinner-loader`                                              |

| Rule               | Detail                                                                                    |
| ------------------ | ----------------------------------------------------------------------------------------- |
| **Layout loading** | Prefer `.skeleton` placeholders when shape matters — [css-utilities.md](css-utilities.md) |
| **Button loading** | Disable control + inline `Spinner`; do not stack multiple spinners without intent         |
| **vs Toast**       | Spinner = in-place progress; Toast = completion message after the fact                    |
