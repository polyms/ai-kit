---
description: >-
  Field and Field.Floating. Use when building forms, inputs, validation, textarea, or debounced search.
  Label tone → quality.md#field-label-copy. Form in overlay → also load modal.md.
---

# Field

Compound overview: [components.md](components.md). Label tone: [quality.md](quality.md#field-label-copy).

## Choose the right API

| Intent                                                   | Use                                                    |
| -------------------------------------------------------- | ------------------------------------------------------ |
| Settings, signup, checkout, validation errors            | **`Field`** compound tree                              |
| Toolbar / table search, floating label, debounced filter | **`Field.Floating`** (standalone)                      |
| Quantities, steppers, label scrub                        | **`NumberField`** — [inputs.md](inputs.md#numberfield) |

**`Field.Floating` is not a child of `Field`.** Do not nest them.

---

## Field compound

Import from the barrel: `Field`, `Field.Label`, `Field.Control`, `Field.Description`, `Field.Feedback`.

### Canonical tree

```tsx
import { Field } from '@polyms/core-ui'

const emailField = (
  <Field required invalid={hasError} name='email'>
    <Field.Label>Let me know your email?</Field.Label>
    <Field.Control type='email' placeholder='tifa.lockhart@polyms.dev' />
    <Field.Description>We'll only use this for account updates.</Field.Description>
    <Field.Feedback defaultShowOnError>Enter a valid email address</Field.Feedback>
  </Field>
)
```

### Child order and icons

All slots are **direct children** of `Field`:

1. `Field.Label` (recommended for a11y)
2. `HugeiconsIcon` with `className='icon-start'` (optional)
3. `HugeiconsIcon` with `className='icon-end'` (optional)
4. `Field.Control`
5. `Field.Description` (optional)
6. `Field.Feedback` (optional)

Icons are **siblings** of `Field.Control`, not nested inside it. With a visible label, put **`Field.Label` before icons**.

### Props on the right node

| Prop                                                                       | Where                |
| -------------------------------------------------------------------------- | -------------------- |
| `invalid`, `required`, `size`, `name`                                      | **`Field`** root     |
| `disabled`, `readOnly`, `rounded`, `debounce`, `type`, `value`, `onChange` | **`Field.Control`**  |
| `defaultShowOnError`                                                       | **`Field.Feedback`** |

Never put `invalid` on `Field.Control`. Never use raw `<label htmlFor=…>` outside the tree.

### Textarea and custom inputs

```tsx
<Field.Control placeholder='Short bio' render={<textarea rows={3} />} />
```

### Debounced onChange

```tsx
<Field.Control debounce={300} onChange={(e) => filter(e.target.value)} />
```

Omit `debounce` for controlled submit forms.

### Validation

`Field.Feedback` shows when **`invalid`** and focused/hovered. Use **`defaultShowOnError`** to keep the message visible after blur.

| Rule                 | Detail                                                                                                                                   |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **When to validate** | On **blur** or **submit** — not on every keystroke unless the field is a live search/filter (`Field.Floating` + `debounce`).             |
| **Error copy**       | State cause + fix in `Field.Feedback` — not only `Invalid input` ([quality.md#copy-tells-product-ui](quality.md#copy-tells-product-ui)). |
| **Submit focus**     | After failed submit, move focus to the **first** `invalid` `Field` control so keyboard users land on the problem.                        |

### Input types (mobile)

Set semantic **`type`** on `Field.Control` so mobile picks the right keyboard:

| `type`     | Use                                                     |
| ---------- | ------------------------------------------------------- |
| `email`    | Email addresses                                         |
| `tel`      | Phone numbers                                           |
| `number`   | Numeric entry (prefer **`NumberField`** for steppers)   |
| `url`      | Links                                                   |
| `password` | Secrets — pair with show/hide in app chrome when needed |

### Autofill (`autoComplete`)

`Field.Control` forwards native input attributes — set **`autoComplete`** so browsers and password managers can suggest values. Pair with **`name`** on the `Field` root (wired to the control automatically).

| Field                              | Typical `autoComplete`                               |
| ---------------------------------- | ---------------------------------------------------- |
| Email (login)                      | `email`                                              |
| Email (signup)                     | `email`                                              |
| Password (login)                   | `current-password`                                   |
| Password (new / reset)             | `new-password`                                       |
| Name                               | `name` or `given-name` / `family-name`               |
| Phone                              | `tel`                                                |
| Address                            | `street-address`, `postal-code`, `country`           |
| One-time code                      | `one-time-code`                                      |
| Search / filter (`Field.Floating`) | `off` when suggestions would clash with live results |

| Rule                      | Detail                                                                                                                                        |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Do not blanket `off`**  | Login, signup, checkout, and address forms should enable autofill — disabling hurts mobile UX and password managers.                          |
| **vs custom suggestions** | Browser autofill ≠ typeahead UI. Enum picks → **`Select`**; searchable lists → app logic or `Menu` — not extra markup inside `Field.Control`. |
| **`datalist`**            | Rare — `render={<input list='…' />}` only when a fixed short suggestion list is enough; prefer **`Select`** for real option lists.            |

### Native forms

Wrap in `<form onSubmit={…}>`. Set `name` on `Field` root (defaults from `id`). Submit with `Button type='submit' variant='primary'`.

Type the handler as **`React.FormEvent<HTMLFormElement>`** (not `React.SubmitEvent` — does not exist in `@types/react` 19). Inline handlers infer the event type.

```tsx
const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  const data = new FormData(event.currentTarget)
}
```

---

## Field.Floating

Compact floating-label input for search/filter — separate component, not a `Field` slot.

```tsx
<Field.Floating
  label='Search'
  placeholder='Results update as you type'
  debounce={400}
  onChange={(e) => setQuery(e.target.value)}
/>
```

| Prop          | Meaning                                                                 |
| ------------- | ----------------------------------------------------------------------- |
| `label`       | Floating label (not `Field.Label`)                                      |
| `placeholder` | Helper below input via `Field.Description` — **not** HTML `placeholder` |
| `debounce`    | ms before `onChange`                                                    |
| `children`    | Extra nodes below description                                           |

Inner input uses `placeholder=' '` for label animation.

For validation UI, use compound **`Field`** or show errors via `children`.

---

## Anti-patterns

- Raw `<label>` + `<input>` when `Field` exists
- `Field.Floating` inside `<Field>`
- `Field.Floating` `placeholder` prop as HTML placeholder
- `invalid` on `Field.Control`
- Icons inside `Field.Control`
- `Field.Input`, `FieldFloating`, `NumberField` inside `<Field>` (use **`NumberField`** standalone), deep imports

---

## Pre-flight

- [ ] **API choice** — `Field` compound vs `Field.Floating` vs `NumberField` vs raw input matches intent ([Choose the right API](#choose-the-right-api)).
- [ ] **Props on correct node** — `invalid` / `required` / `size` / `name` on `Field` root; `disabled`, `debounce`, `type`, etc. on `Field.Control`; never `invalid` on `Field.Control`.
- [ ] **Error visibility** — `Field.Feedback` present when showing validation; `defaultShowOnError` when message must stay visible after blur.
- [ ] **Validation timing** — errors on blur/submit, not per-keystroke (except debounced search fields).
- [ ] **Submit focus** — first invalid field receives focus after a failed submit.
- [ ] **Mobile types** — `email` / `tel` / `url` / `password` on `Field.Control` when the input type is known.
- [ ] **Autofill** — `autoComplete` set on login/signup/address fields; `off` only on search/filter where suggestions conflict.
- [ ] **Label tone** — user-facing `Field.Label` is conversational, not marketing ([quality.md#field-label-copy](quality.md#field-label-copy)).

**Done when:** every field in the tree uses the correct API; you can point to each prop on its documented node; labels read naturally on a real form screen.
