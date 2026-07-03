---
name: core-ui
description: >-
  Build UI with @polyms/core-ui — compound components, semantic theming, CSS utilities, responsive product UI.
  Entry skill: open routing table before coding. Form in overlay → field.md + modal.md.
---

# @polyms/core-ui

`@polyms/core-ui` **is** the design system — no shadcn/ui, Fluent, Carbon, or parallel libraries for the same surfaces.

## Skill routing

Load **every** matched file before generating code.

| Triggers (keywords / intent)                                                                                                               | Read                                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| migrate, migration, redesign, refresh, modernise, legacy, overhaul, re-skin, preserve brand, swap to core-ui, existing screen, visual debt | [redesign.md](redesign.md)                                                                                                                                                                                               |
| brand, rebrand, BRAND.md, theme.css, primary color, accent, identity                                                                       | [brandkit.md](brandkit.md)                                                                                                                                                                                               |
| new app, install, styles import, app shell, containers                                                                                     | [setup.md](setup.md)                                                                                                                                                                                                     |
| toast, notification, snackbar, Toast.useToastManager                                                                                       | [setup.md](setup.md#toast) · [display.md](display.md#toast)                                                                                                                                                              |
| form, field, Field.Floating, textarea, debounce, validation                                                                                | [field.md](field.md) · label tone [quality.md#field-label-copy](quality.md#field-label-copy)                                                                                                                             |
| modal, dialog, offcanvas, drawer, showModal, showOffcanvas, blocking confirmation, delete confirm                                          | [modal.md](modal.md) — not Toast / Popover / Tooltip                                                                                                                                                                     |
| form in modal/offcanvas, modal form, filter panel, side panel with form, create/edit in dialog                                             | [field.md](field.md) + [modal.md](modal.md)                                                                                                                                                                              |
| Button, CTA, icon button, btn styling, render prop                                                                                         | [button.md](button.md)                                                                                                                                                                                                   |
| Menu, NavigationMenu, Toolbar, Select, Tabs, listbox, tab panel                                                                            | [navigation.md](navigation.md) · [inputs.md](inputs.md#select) · [navigation.md](navigation.md#tabs)                                                                                                                     |
| Checkbox, Radio, RadioGroup                                                                                                                | [inputs.md](inputs.md#field-checkbox-radio)                                                                                                                                                                              |
| Switch, Popover, Tooltip, Toggle, ToggleGroup                                                                                              | [inputs.md](inputs.md#switch) · [overlays.md](overlays.md) · [inputs.md](inputs.md#toggle)                                                                                                                               |
| Avatar, Breadcrumb, Accordion, FAQ, expand/collapse                                                                                        | [display.md](display.md#avatar) · [navigation.md](navigation.md#breadcrumb) · [display.md](display.md#accordion) · [display.md](display.md#collapsible)                                                                  |
| Alert, banner, inline status, dismissible feedback                                                                                         | [display.md](display.md#alert)                                                                                                                                                                                           |
| NumberField, quantity, stepper, numeric input                                                                                              | [inputs.md](inputs.md#numberfield)                                                                                                                                                                                       |
| Spinner, loading indicator, async pending                                                                                                  | [display.md](display.md#spinner) · layout placeholders → [css-utilities.md](css-utilities.md)                                                                                                                            |
| dynamic import, React.lazy, code split, lazy route, module federation                                                                      | [components.md#dynamic-import](components.md#dynamic-import)                                                                                                                                                             |
| compound API, public surface, compound slots, useRender wrapper, extending primitive                                                       | [components.md](components.md)                                                                                                                                                                                           |
| dark mode, slate, semantic tones, bg-body, text-fg                                                                                         | [theming.md](theming.md)                                                                                                                                                                                                 |
| table, badge, item-*, link utilities                                                                                                       | [css-utilities.md](css-utilities.md)                                                                                                                                                                                     |
| Toolbar, Tabs, responsive, mobile-first, breakpoint, scrollable tab list, overflow-x                                                       | [quality.md#responsive-and-mobile-first](quality.md#responsive-and-mobile-first) · [navigation.md#responsive-toolbar](navigation.md#responsive-toolbar) · [navigation.md#responsive-tabs](navigation.md#responsive-tabs) |
| anti-slop, copy tells, output completeness, pre-flight, field label tone                                                                   | [quality.md](quality.md)                                                                                                                                                                                                 |
| docs demo, `-views/`, MDX live preview                                                                                                     | [quality.md#sample-data-and-docs-demos](quality.md#sample-data-and-docs-demos)                                                                                                                                           |
| library component, maintainer, change compound API                                                                                         | [quality.md#maintainer](quality.md#maintainer)                                                                                                                                                                           |
| jargon, useRender, compound tree, item-*, ghost style, Container, barrel import                                                            | [glossary.md](glossary.md)                                                                                                                                                                                               |

**Pairs:** rebrand existing app → **redesign.md** then **brandkit.md**. Form in overlay → **field.md** + **modal.md** (both pre-flights).

**Disambiguation:** blocking **confirmation** (delete, irreversible) → **Modal** + `Modal.Close`, not Toast. `side panel` / `filter panel` **with form fields** → [field.md](field.md) + [modal.md](modal.md). `panel` as page layout chrome → your layout, not necessarily an overlay.

## Hard rules (always)

1. Barrel import only — `import { … } from '@polyms/core-ui'`; trust `index.d.ts` over memory.
2. `slate` chrome + semantic tones (`primary`, `danger`, …) — [theming.md](theming.md).
3. Compound trees intact — no `ModalHeader`-style invented imports ([glossary.md](glossary.md#compound-tree--compound-component)).
4. `item-*` for ghost hover surfaces ([glossary.md](glossary.md#item--utilities)); library shells are not Tailwind rewrite targets.
5. `@hugeicons/react` for icons — no hand-rolled SVG paths.
6. Ship complete UI — [quality.md](quality.md) (copy tells, output completeness, pre-flight).

**Frequent mistakes:** conversational `Field.Label` ([quality.md#field-label-copy](quality.md#field-label-copy)); `Modal.Trigger` / footer `Modal.Close` / `Offcanvas.Trigger` / body `Offcanvas.Close` via `render={<Button … />}` ([button.md](button.md#compose-button-through-render), [modal.md](modal.md)); footer `Modal.Close` without `variant` (ghost); `autoFocus` on footer CTA when modal has form inputs — use first input instead ([modal.md#modal](modal.md#modal)); no invented `content` prop on `Button`.

## Workflow

1. Match [routing](#skill-routing) → open **every** matched file (single source of truth for keywords → topic files).
2. One-line **task read** — classify surface and density at [quality.md#task-read-before-generating](quality.md#task-read-before-generating); do not re-route from `quality.md`.
3. **Confirm symbols** — open `index.d.ts` and verify every named import exists. Done when you can paste the exact export line for each symbol used.
4. Run [pre-flight](quality.md#pre-flight-check) + topical pre-flight when triggered: [field](field.md#pre-flight) · [modal](modal.md#pre-flight) · [redesign](redesign.md#redesign-pre-flight) · [brandkit](brandkit.md#brand-pre-flight).

App shell (styles, Toast, overlay containers, `zustand`): [setup.md#app-shell](setup.md#app-shell).
