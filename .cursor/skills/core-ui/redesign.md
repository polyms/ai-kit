---
description: >-
  Redesign existing screens with @polyms/core-ui. Use when migrating, refreshing, or re-skinning legacy UI.
  Greenfield → SKILL.md#skill-routing; package source → quality.md#maintainer.
disable-model-invocation: true
---

# Redesign with @polyms/core-ui

For **upgrading existing app screens** to `@polyms/core-ui`. `@polyms/core-ui` **is** the target design system — do not install shadcn/ui, Fluent, or parallel libraries during a redesign.

## Workflow

Follow this sequence. Do not skip to visual polish before the component layer is correct.

```
Scan → Detect mode → Diagnose → Fix (priority order) → Redesign pre-flight
```

### 1. Scan

Read the codebase before editing:

| Check                                                                  | Why                                                                                     |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `package.json` — is `@polyms/core-ui` installed?                       | Run [setup.md](setup.md) first if missing                                               |
| Styles entry — `styles-<hash>.css` or `styles/tailwind.css` imported?  | Unstyled primitives if CSS is missing                                                   |
| `Modal.Container` / `Offcanvas.Container` / `Toast.Container` mounted? | Programmatic overlays break without containers                                          |
| Styling method — Tailwind v4, plain CSS, mixed inline                  | Match existing app patterns; use DS tokens on top                                       |
| Screen inventory — buttons, inputs, tables, menus, modals per route    | Map each to the closest topic file via [SKILL.md#skill-routing](SKILL.md#skill-routing) |
| Analytics hooks — `name`, `data-*`, button labels, section IDs         | Preservation list for Fix phase                                                         |

Declare one line before changing code:

**"Redesign mode: \<preserve \| overhaul \| greenfield-screen> — migrating \<screen> to @polyms/core-ui, \<density> density."**

### 2. Detect mode

Misclassifying the mode is the main source of bad redesign output.

| Mode                  | When                                 | Visual goal                         | IA / content                              |
| --------------------- | ------------------------------------ | ----------------------------------- | ----------------------------------------- |
| **Preserve**          | Refresh look, keep brand recognition | Evolve spacing, tokens, primitives  | Keep slugs, nav, field names, copy voice  |
| **Overhaul**          | New visual language approved         | Treat visuals like greenfield       | Keep IA, routes, and content unless asked |
| **Greenfield screen** | New route or empty shell             | Full [quality.md](quality.md) rules | Design with product patterns from scratch |

If ambiguous, ask **once**: _"Giữ brand/layout hiện tại hay làm lại visual từ đầu?"_

### 3. Diagnose

List concrete problems before fixing. Group findings under the headings below.

#### Design system drift

- Raw `<button>` with one-off Tailwind instead of `Button` / `btn-*`
- Raw `<input>` / `<select>` instead of `Field.*` / `Select.*`
- Raw `<input type='number'>` with hand-built +/- buttons instead of `NumberField`
- Hand-built modal markup instead of `Modal` compound tree
- Custom dropdown/listbox instead of `Menu` / `Select`
- FAQ / settings sections as stacked `divide-y` divs instead of `Accordion` when sections collapse
- `neutral-*`, `zinc-*`, or raw `blue-*` / `rose-*` for chrome instead of `slate` + semantic tones ([theming.md](theming.md))
- Hand-written `hover:bg-*` on nav rows instead of `item-*` ([css-utilities.md](css-utilities.md))
- Deep imports (`@polyms/core-ui/button`) or invented subcomponents (`ModalHeader`)
- Large Tailwind bundles on `Modal.Content`, `Menu.Content`, `Select.Content` shells

#### Typography and spacing

- Inconsistent heading scale (`text-2xl` here, `text-xl` there for same level)
- Form copy in stiff CMS voice (`Email Address`) — see [Field label copy](quality.md#field-label-copy)
- Body text or form columns too wide (target ~65ch for readable prose blocks)
- App content stretched edge-to-edge on wide screens — add a sensible `max-w-*` wrapper you own
- Comfortable screens packed like a cockpit, or dense tables wrapped in redundant `.card` boxes
- `h-screen` causing mobile viewport jump — prefer `min-h-dvh` on page shells ([quality.md#responsive-and-mobile-first](quality.md#responsive-and-mobile-first))

#### Color and theme

- Pure `#000` / `#fff` instead of `bg-body`, `bg-surface`, `text-fg`, `text-muted`
- More than one competing accent outside semantic tones (`primary`, `danger`, …)
- Purple/blue AI-gradient chrome on app shells
- One section flipped to inverted colors mid-page while the rest stays light
- `.dark` not tested — hierarchy breaks in one mode ([theming.md](theming.md))

#### Layout (product UI)

- Tables without `.table` utilities when showing tabular data
- Horizontal overflow on mobile forms/tables without intentional scroll — see [quality.md#responsive-and-mobile-first](quality.md#responsive-and-mobile-first)
- Toolbar actions misaligned or missing `aria-label` on `Toolbar` / `Toolbar.Group`
- Duplicate primary actions with the same intent on one screen
- Three identical cards as the only empty-state pattern
- Sidebar + main layout broken on small viewports

Skip marketing-only diagnoses (hero zigzag, bento grids, parallax, logo walls) unless the screen is literally a marketing page inside the app.

#### Interactivity and states

- Buttons or rows with no discernible hover/focus (do not fight library defaults)
- Missing **loading** state for async data (use `.skeleton` or a clear pending pattern)
- Missing **empty** state for lists/tables
- Missing **error** state on forms (`Field invalid` + `Field.Feedback`)
- `window.alert()` for validation errors
- Dead controls (`href='#'`, buttons with no `onClick` that look enabled)
- No active/current state on nav (`item-*` + `.active`)
- Animations on `top`/`left`/`width`/`height` — prefer `transform` and `opacity`
- `window.addEventListener('scroll', ...)` for reveals

#### Forms and overlays

- `Field` trees missing `Label`, `Description`, or `Feedback` where users need context
- Changed `name` / `id` / field order without approval (breaks analytics + autofill)
- `showModal` / `showOffcanvas` used without mounted containers
- Arbitrary `z-50` instead of `.z-modal`, `.z-dropdown`, `.z-tooltip`, `.z-toast`

#### Content

- `John Doe`, `jane@example.com`, `Acme`, `Lorem ipsum`, `TODO` in shipped UI
- Filler verbs: "Elevate", "Seamless", "Unleash", "Next-Gen"
- Round fake metrics (`99.99%`, `$100.00`) when real-looking data is easy
- Prefer persona sample data: `Tifa Lockhart`, `tifa.lockhart@polyms.dev`, `47.2%`

#### Code quality

- Div soup where `main`, `nav`, `section`, `header` fit
- Inline styles mixed with Tailwind for the same element
- Missing `alt` on meaningful images; missing `aria-label` on icon-only `Button`
- Commented-out dead UI left in the diff
- Imports that do not exist in `package.json`

## Fix priority

Apply in order. **Stop when the brief is satisfied** — do not keep restyling for taste.

| Step | Action                                                                                                       | Risk       |
| ---- | ------------------------------------------------------------------------------------------------------------ | ---------- |
| 1    | **Setup** — package, styles, overlay containers ([setup.md](setup.md))                                       | Low        |
| 2    | **Component swap** — map ad-hoc markup to `@polyms/core-ui` primitives; keep compound trees intact           | Low–medium |
| 3    | **Semantic tokens** — `bg-body`, `text-fg`, `border-line`, `slate` chrome ([theming.md](theming.md))         | Low        |
| 4    | **Interactive surfaces** — `item-*` for ghost nav/actions; `btn-*` variants for actions                      | Low        |
| 5    | **Spacing and density** — align to Comfortable / Compact / Cockpit ([quality.md](quality.md#visual-density)) | Medium     |
| 6    | **Missing states** — loading, empty, error, disabled paths                                                   | Medium     |
| 7    | **Copy** — natural `Field.Label`, believable sample data, remove filler                                      | Low        |
| 8    | **Layout / IA** — only when explicitly requested                                                             | High       |

Do **not** migrate fonts, add motion libraries, or restructure navigation unless the user asked. Extract existing brand accent before recoloring — brand purple stays purple.

## Preservation rules

- Do not change route slugs, primary nav labels, or anchor IDs without approval.
- Do not rename form `name`s, field order, or tracked button labels without approval.
- Preserve copy voice unless a rewrite is requested. Visual refresh ≠ content rewrite.
- Keep legal, consent, cookie, and compliance UI unless asked to remove.
- Honor existing accessibility wins — do not regress focus rings, labels, or keyboard paths.
- For consumer apps with SEO-sensitive marketing routes, document meta titles and OG tags before changing page structure.

## What never changes silently

Get explicit approval before:

- URL structure / route slugs
- Primary navigation labels
- Form field names or order
- Brand logo or wordmark
- Legal / consent / cookie copy
- Analytics event names or `data-*` tracking hooks

## Decision tree

| Situation                                           | Approach                                                                                            |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| IA, routes, and content are sound; UI is just dated | **Preserve** — steps 1–7 only                                                                       |
| Broken mobile layout, no DS, ad-hoc everything      | **Overhaul** visuals — strict content/IA preservation                                               |
| New screen in an existing app                       | **Greenfield screen** — [SKILL.md#skill-routing](SKILL.md#skill-routing) + [quality.md](quality.md) |
| Brand identity itself is changing                   | Treat as greenfield; read [brandkit.md](brandkit.md) for token map — do not force-fit old tokens    |

## Redesign pre-flight

Run after Fix. If any item fails, the redesign is not done.

### Migration

- [ ] `@polyms/core-ui` installed; styles imported; `index.d.ts` checked for symbols used
- [ ] Barrel imports only — no deep paths, no invented compound subcomponents
- [ ] Each replaced control uses the closest library primitive
- [ ] Overlay containers mounted before programmatic `showModal` / `showOffcanvas`

### Product quality

- [ ] `slate` + semantic tones; no raw palette drift for roles
- [ ] `item-*` on ghost surfaces; library shells not re-wrapped in large Tailwind bundles
- [ ] Loading, empty, and error states present where the screen needs them
- [ ] Natural field labels on user-facing forms ([quality.md](quality.md#field-label-copy))
- [ ] Dark mode tested if `.dark` is used

### Safety

- [ ] No silent IA, analytics, or legal changes
- [ ] Existing keyboard focus order still sane in modals, menus, and forms
- [ ] Diff is reviewable — targeted file changes, not whole-app rewrite

## Out of scope

Do not apply these redesign-skill ideas inside a `@polyms/core-ui` migration:

- Swap to Geist/Outfit/custom fonts as the first move
- Marketing layout patterns (bento hero, marquee, parallax, grain overlays)
- Replace modals with inline editing when `Modal` / `Offcanvas` is the right primitive
- Install Taste Skill or shadcn/ui alongside this design system
- Rewrite the `core/` library API or CSS for one consumer app's taste
