---
description: >-
  Switch, Select, NumberField, Toggle, Checkbox, Radio. Form validation trees → field.md.
---

# Inputs

Switch, Select, NumberField, Toggle, Checkbox, Radio. Form fields with validation → [field.md](field.md).

## Field, Checkbox, Radio

**`Field`** / **`Field.Floating`**: **[field.md](field.md)**. Form in Modal/Offcanvas: **field.md** + **modal.md**.

```tsx
import { Checkbox, Field, Radio, RadioGroup } from '@polyms/core-ui'

<Checkbox checked={accepted} onCheckedChange={setAccepted}>
  I accept the terms
</Checkbox>

<Field>
  <Field.Label>How do you want to pay?</Field.Label>
  <RadioGroup name='payment-method' onValueChange={setPaymentMethod} value={paymentMethod}>
    <Radio value='card'>Card</Radio>
    <Radio value='bank'>Bank transfer</Radio>
  </RadioGroup>
  <Field.Description>You can change this later.</Field.Description>
</Field>
```

`Checkbox`, `Radio`, and `RadioGroup` support sizes and variants.

## NumberField

Standalone numeric input with increment/decrement and optional label scrub — **not** a `Field` compound slot. Use **`Field`** + `type='number'` only when you need validation feedback trees; use **`NumberField`** for steppers, quantities, and scrub-by-label.

```tsx
import { NumberField } from '@polyms/core-ui'

<NumberField defaultValue={0} label='Quantity' min={0} max={100} step={1} size='lg' />

<NumberField rounded value={value} onValueChange={setValue} label='Amount' />
```

| Prop                                       | Notes                                         |
| ------------------------------------------ | --------------------------------------------- |
| `label`                                    | Enables scrub area on label drag              |
| `min` / `max` / `step`                     | Value constraints — Base UI NumberField props |
| `value` / `defaultValue` / `onValueChange` | Controlled / uncontrolled                     |
| `size`                                     | Same scale as `Field` (`sm`, `lg`, `xl`, …)   |
| `rounded`                                  | Pill shape on input + increment control       |

| Rule         | Detail                                                                      |
| ------------ | --------------------------------------------------------------------------- |
| **vs Field** | `NumberField` = stepper UX; `Field` = labels, errors, icons, textarea       |
| **Shell**    | Bundled `number-field-*` classes — do not rebuild increment buttons by hand |

## Switch

Boolean toggle with optional inline label — not a `Field` replacement for settings forms that need validation feedback.

```tsx
import { Switch } from '@polyms/core-ui'

<Switch label='Receive email notifications' labelPos='start' defaultChecked />
<Switch label='Enable dark mode' disabled />
```

| Prop                         | Notes                                                      |
| ---------------------------- | ---------------------------------------------------------- |
| `label`                      | Optional text beside the control                           |
| `labelPos`                   | `'start'` \| `'end'` (default `'end'`)                     |
| `variant`                    | `'primary'` when you need the tinted track                 |
| `checked` / `defaultChecked` | Controlled / uncontrolled — native checkbox under the hood |

Use inside `Modal.Body` or settings panels for instant-effect prefs. For labeled inputs with errors, use **`Field`** ([field.md](field.md)).

## Toggle

Pressed-state control for formatting tools — not a settings **`Switch`**.

```tsx
import { Toggle, ToggleGroup } from '@polyms/core-ui'

const alignmentToggleGroup = (
  <ToggleGroup aria-label='Alignment' className='toggle-group' defaultValue={['left']}>
    <Toggle className='toggle' value='left'>
      Left
    </Toggle>
    <Toggle className='toggle' value='center'>
      Center
    </Toggle>
  </ToggleGroup>
)
```

| Rule                   | Detail                                                                        |
| ---------------------- | ----------------------------------------------------------------------------- |
| **Classes**            | `.toggle`, `.toggle-group` — [css-utilities.md](css-utilities.md)             |
| **Exclusive vs multi** | Default exclusive; pass `multiple` on `ToggleGroup` for independent toggles   |
| **Toolbar**            | `Toolbar.Button render={<Toggle />}` — [navigation.md](navigation.md#toolbar) |
| **vs Switch**          | Toggle = pressed tool state; Switch = immediate on/off setting                |

## Select

**Tree:** `Select` → `Select.Trigger` + `Select.Content` → `Select.Item`, `Select.Group`, `Select.GroupLabel`, `Select.Separator`.

```tsx
import { Select } from '@polyms/core-ui'

const exportFormats = [
  { label: 'CSV', value: 'csv' },
  { label: 'Excel', value: 'xlsx' },
]

<Select items={exportFormats}>
  <Select.Trigger placeholder='How do you want to export?' />
  <Select.Content>
    <Select.Group>
      <Select.GroupLabel>Spreadsheet</Select.GroupLabel>
      <Select.Item value='csv'>CSV</Select.Item>
      <Select.Item value='xlsx'>Excel</Select.Item>
    </Select.Group>
  </Select.Content>
</Select>
```

| Rule                | Detail                                                                                                                       |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Items**           | Optional `items` on `Select` root for simple data; still render `Select.Item` children for groups                            |
| **Size**            | `size` on `Select.Trigger` (`sm`, `lg`, `xl`, `2xl`, `3xl`) — same tokens as `Field`; inside `Field`, set `size` on the root |
| **No fake listbox** | No hand-built `<div role='listbox'>` when `Select` fits                                                                      |
| **Shell**           | `Select.Content` is already styled — do not wrap in large Tailwind bundles                                                   |
| **vs Menu**         | `Select` for choosing a value; `Menu` for actions — [navigation.md](navigation.md#menu)                                      |
