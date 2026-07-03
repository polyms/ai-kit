---
description: >-
  Brand kit for @polyms/core-ui — primary accent, surfaces, BRAND.md tokens. Not brand image generation.
  Migrating old screens → also load redesign.md.
disable-model-invocation: true
---

# Brand Kit → @polyms/core-ui

A **token map + application rules** so every screen reads as one product. For day-to-day color rules: [theming.md](theming.md). For migrating existing screens: [redesign.md](redesign.md).

## Core principle

A brand kit here is not decoration. It is a **token map + application rules** so every screen reads as one product.

Every brand pass must answer:

1. What does the product represent?
2. What is the **one** brand accent (mapped to `primary`)?
3. How do surfaces read in light and dark (`bg-body`, `text-fg`, `bg-surface`)?
4. How do core components express the brand (`Button`, `Field`, `Badge`, `link-primary`, `item-primary`)?
5. What must **not** change (semantic `danger` / `warning`, slate chrome, compound APIs)?

## Workflow

```
Strategy → Token map → Light/dark parity → Component applications → BRAND.md (optional) → Brand pre-flight
```

Declare one line before editing CSS:

**"Brand kit for \<product> — \<personality> — primary \<hue family> on slate chrome, \<comfortable \| compact> density."**

## Brand strategy first

Infer before touching tokens:

| Signal          | Guides                                                                               |
| --------------- | ------------------------------------------------------------------------------------ |
| Category        | Developer tool, B2B ops, compliance, consumer app, internal admin                    |
| Audience        | Builders, operators, buyers, end users                                               |
| Trust level     | Playful vs institutional — affects contrast and copy, not random purple gradients    |
| Existing assets | Logo, wordmark, primary hex, type stack — **extract first**, do not replace silently |
| What to avoid   | AI-purple mesh, neon glow, fake luxury beige, inconsistent logo marks                |

**Symbolic metaphor** (logo, icon, marketing) can inform accent hue and illustration direction. It does **not** justify breaking semantic tones or hand-rolling components.

## Token map (implementation)

`@polyms/core-ui` ships defaults in `_root.css`. Consumers override in **their** global CSS after importing library styles.

### What you own (brand)

| Token family                                                                           | Role                                           | Override pattern                                  |
| -------------------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------- |
| `--color-primary-50` … `--color-primary-950`                                           | Brand accent ramp                              | Remap steps to brand hue; keep 11-step scale      |
| `--color-primary` / `--color-primary-700`                                              | Links, buttons, `item-primary`, focus emphasis | Usually tracks `primary-700`                      |
| Optional: `--body`, `--fg`, `--surface`, `--surface-2`, `--muted`, `--line`, `--input` | Page chrome                                    | Tune for brand warmth; test light **and** `.dark` |

### What stays semantic (do not remap per brand whims)

| Family                                 | Role                                                                                                 |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `success`, `warning`, `danger`, `info` | Intent — errors stay readable, success stays green-family unless accessibility review says otherwise |
| `slate-*`                              | Gray chrome — **never** swap to `neutral-*` or `zinc-*` for library-adjacent UI                      |
| Z-index utilities                      | `.z-modal`, `.z-dropdown`, etc. — use library scale                                                  |

### Minimal brand theme example

```css
@import '@polyms/core-ui/styles/tailwind.css';

@theme {
  /* Brand: replace cyan default with your hue — generate 50–950 consistently */
  --color-primary-500: #6366f1;
  --color-primary-600: #4f46e5;
  --color-primary-700: #4338ca;
  /* …remaining primary steps… */
}

/* Optional: warmer light surfaces */
:root {
  --body: #fafaf9;
  --surface: var(--color-slate-100);
}

.dark {
  /* Keep hierarchy parity — do not only lighten primary in dark mode */
  --body: #2e3440;
  --fg: #eceff4;
}
```

Rules:

- **One dominant brand accent** through `primary-*`. Accents repeat across buttons, links, active nav (`item-primary`), badges — not a new hex per screen.
- **No pure `#000` / `#fff`** page backgrounds — use `--body` / semantic surfaces.
- **No purple-blue AI gradient** as default app chrome unless the brand brief requires it.
- Override on `:root` / `.dark` or `@theme` — do not fork component CSS inside `node_modules`.

See [theming.md](theming.md) for surface utilities and the default token table. Human-facing walkthrough: **Design System → Brand theming** in the docs site.

## Visual modes (product UI)

Choose a mode for mockups and new screens. These replace Taste Skill's image-board modes with **implementable** direction.

| Mode                   | Best for                       | Token / UI cues                                                                                  |
| ---------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------ |
| **Builder / devtool**  | SDKs, agents, infra            | `primary` cool hue; monospace for code blocks; compact density; `Toolbar`, terminal-like `Field` |
| **Operator**           | Sales, growth, automation      | Strong `primary` on actions; `badge-*` for status; tables + toolbars; comfortable density        |
| **Calm system**        | Strategy, wellness, quiet SaaS | Softer `--body`; more whitespace; conversational `Field.Label`                                   |
| **Trust / compliance** | Legal, finance, admin          | Restrained accent; high contrast; terse labels on dense forms; no playful motion                 |
| **Consumer app**       | End-user product               | Conversational copy; `Modal` / `Offcanvas` flows; avatar + `item-*` nav                          |

Skip luxury editorial, halftone campaign boards, and physical mockup panels unless building marketing **outside** the app shell.

## Component applications

Apply the brand through **real exports** — identity applications, not feature demos.

| Touchpoint        | Use                                                                                    |
| ----------------- | -------------------------------------------------------------------------------------- |
| Primary actions   | `Button variant='primary'`                                                             |
| Secondary / ghost | default `Button` or `item-primary` on nav rows                                         |
| Links             | `link link-primary`                                                                    |
| Status chips      | `badge badge-primary` (brand), `badge-success` / `badge-danger` (intent)               |
| Forms             | `Field` + conversational labels ([quality.md](quality.md#field-label-copy))            |
| App chrome        | `bg-body text-fg`, `bg-surface border-line` headers                                    |
| Overlays          | `Modal` / `Offcanvas` / `Toast` — library shells, brand only on **your** inner content |
| Icons             | `@hugeicons/react` — one family, consistent `strokeWidth`                              |
| Loading           | `.skeleton` or `Spinner` — shape matches final layout                                  |

**Mockup rules** (from Taste Skill, adapted):

- Show **fragments** — header, one form, one table row, one modal — not a fake full dashboard built from `<div>` rectangles.
- Browser chrome / URL bar is optional in marketing captures; in app code, use real routes and `NavigationMenu` / sidebar patterns.
- No div-based fake product UI when `@polyms/core-ui` provides the primitive.

## Logo and mark

- Prefer **simple, scalable** marks — monogram, geometric construction, one metaphor.
- Favicon and app icon are **consumer assets** (SVG/PNG), not generated inside the library.
- Do not hand-roll SVG icons in product UI — use Hugeicons or the approved logo asset.
- Repeat the **same** mark everywhere; no drift between header, modal, and email template.

Avoid unless justified: generic lightning bolts, random mascots, fake crests, sparkle clutter.

## Copy and voice

| Element       | Guidance                                                     |
| ------------- | ------------------------------------------------------------ |
| Product name  | Consistent casing across shell, `Modal.Header`, empty states |
| Tagline       | Short, specific — not "Elevate your workflow"                |
| `Field.Label` | Conversational on user-facing flows                          |
| Errors        | Direct — not "Oops!"                                         |
| Sample data   | `Tifa Lockhart`, `tifa.lockhart@polyms.dev` — not `John Doe` |

Keep text sparse in chrome; put policy in `Field.Description`, not oversized labels.

## BRAND.md template (optional)

When the user wants a portable brand doc in the consumer repo, create `BRAND.md` beside their theme entry:

```markdown
# Brand — {ProductName}

## Strategy

- Category:
- Audience:
- Personality:
- Core metaphor (logo / mark):

## Tokens

- Primary source: `--color-primary-700` = `#______`
- Light `--body` / `--fg`:
- Dark `--body` / `--fg`:
- Type stack (if custom):

## Component mapping

- Primary CTA: `Button variant='primary'`
- Nav active: `item-primary` + `.active`
- Links: `link link-primary`
- Destructive: `variant='danger'` — never brand primary

## Do not

- Remap `danger` / `success` for brand flair
- Use `neutral-*` for chrome
- Restyle `Modal.Content` / `Menu.Content` shells with ad-hoc Tailwind

## Brand checklist

- [ ] Light + dark hierarchy parity
- [ ] CTA contrast WCAG AA
- [ ] One accent across app shell
```

Skill agent checklist (authoritative — not the `BRAND.md` template above):

## Brand pre-flight

Run before shipping branded shell changes. **If any item fails, the brand pass is not done.**

- [ ] `@polyms/core-ui` styles imported; overrides live in **consumer** CSS only
- [ ] `primary-*` ramp complete enough for hover/active (`btn-*`, `item-primary` use `primary-700` / mixes)
- [ ] `slate` chrome intact; semantic tones used for intent
- [ ] Light and `.dark` tested — brand accent readable on both
- [ ] Applications use library components, not parallel button/input styles
- [ ] Logo/icon consistent; Hugeicons for UI glyphs
- [ ] Copy matches voice rules; no lorem / TODO in branded shell
- [ ] No silent logo, legal, or analytics identifier changes ([redesign.md](redesign.md#what-never-changes-silently))

## Out of scope

- Generating 3×3 brand-guidelines **images** or logo concept boards — use [Taste Skill brandkit](https://www.tasteskill.dev/) for that
- Replacing the entire type system inside `core/` package CSS
- Custom fonts as the first step before tokens work
- Marketing landing layouts (bento hero, parallax, grain overlays) inside this skill
- shadcn/ui or second component library for "brand expression"

## Decision tree

| Request                                  | Action                                                                                                                        |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| New product, need colors + app shell     | This skill → `setup.md` → token overrides → sample screen with `Button` / `Field` / `NavigationMenu`                          |
| Rebrand existing app                     | [redesign.md](redesign.md) preserve mode + this token map                                                                     |
| Only need logo image / deck              | Taste Skill `brandkit`, not this file                                                                                         |
| Maintainer changing library default cyan | Change package `_root.css` tokens and library docs — not consumer `BRAND.md` — [quality.md#maintainer](quality.md#maintainer) |
