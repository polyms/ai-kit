# Design Pre-flight

Every checkbox must honestly pass before handing a design spec to `/dev`. **Design system lock** on `@polyms/core-ui`.

## Spec completeness

- [ ] Every screen in the inventory has **loading, empty, error, and success** states defined
- [ ] No `TBD`, `TODO`, or placeholder copy in the spec body
- [ ] Flows cover the PRD's critical paths — nothing in PRD is orphaned
- [ ] Open questions are listed explicitly — none hidden in prose

## core-ui alignment

- [ ] Every interactive element maps to a `@polyms/core-ui` primitive **or** has a documented custom exception with follow-up (issue/ADR)
- [ ] No invented component names that duplicate an existing core-ui primitive
- [ ] Theme/variant choices reference core-ui presets — not ad-hoc Tailwind one-offs in the spec
- [ ] `/core-ui` was available (user invoked or attached) when mapping components

## Anti-slop (spec level)

- [ ] [BRIEF-INFERENCE.md](BRIEF-INFERENCE.md) table present in spec §1 (or linked appendix)
- [ ] [QUALITY-BAR.md](QUALITY-BAR.md) — visual reference URL + measurable craft intent
- [ ] [CSS-INTENT.md](CSS-INTENT.md) §4 present — type scale, surfaces, grids named
- [ ] [VISUAL-ACCEPTANCE.md](VISUAL-ACCEPTANCE.md) §8 present — `/dev` criteria + P0 slice order
- [ ] [ANTI-SLOP.md](ANTI-SLOP.md) §A bans listed — each marked apply or N/A
- [ ] At least one **visual reference** URL or screenshot attached in spec
- [ ] No generic template layouts unless PRD explicitly requests them (e.g. purple-gradient hero, three-column feature grid)
- [ ] Screen names use `CONTEXT.md` vocabulary — not handler/class names
- [ ] Layout notes are specific to this feature — not copy-paste from another project
- [ ] Viewport grid behaviour documented for asymmetric layouts (bento, sticky rail)

## Visual acceptance (before `/dev` handoff)

- [ ] Spec describes **one focal beat per viewport** for hero and primary section
- [ ] Dark-first acceptance called out — screenshots for sign-off use dark theme unless PRD excepts
- [ ] If redesign: audit includes **screenshot of shipped UI** vs intent (not codebase walk only)

## Motion and accessibility

- [ ] Every motion row has a `prefers-reduced-motion` fallback
- [ ] Focus order is defined for non-trivial forms and modals
- [ ] Error states are actionable — user knows what to do next

## Handoff

- [ ] Spec saved at `docs/design/<feature-slug>.md`
- [ ] `## Next Step` names one preferred skill (`/dev` default; `/to-issues` only when P0
      visual slices ship first — optional second with when)

Design pre-flight ends here. **`/dev`** runs [visual-ship.md](../dev/visual-ship.md) before declaring UI done — functional tests alone are insufficient.
