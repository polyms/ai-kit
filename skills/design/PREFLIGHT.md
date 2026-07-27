# Design Pre-flight

Every checkbox must honestly pass before handing a design spec to `/dev`. **Design system lock**
on `@polyms/ui-kit`.

**Skip this file** for [audit-only](REDESIGN.md#audit-only) — that branch ends at
[ANTI-SLOP.md §E](ANTI-SLOP.md#e--audit-punch-list-report-format); do not run craft critique or
require a `docs/design/` write.

## Spec completeness

- [ ] Every screen in the inventory has **loading, empty, error, and success** states defined
- [ ] Primary interactive controls in the component map note interaction states the primitive
      supports (at least disabled + loading where async; hover/focus called out when non-default)
- [ ] No `TBD`, `TODO`, or placeholder copy in the spec body
- [ ] Flows cover the PRD's critical paths — nothing in PRD is orphaned
- [ ] Open questions are listed explicitly — none hidden in prose
- [ ] No invented metrics, testimonials, or logo counts — PRD/CONTEXT only or labelled pending

## ui-kit alignment

- [ ] Every interactive element maps to a `@polyms/ui-kit` primitive **or** has a documented
      custom exception with follow-up (issue/ADR)
- [ ] No invented component names that duplicate an existing ui-kit primitive
- [ ] Theme/variant choices reference ui-kit presets — not ad-hoc Tailwind one-offs in the spec
- [ ] `/ui-kit` was available (user invoked or attached) when mapping components
- [ ] Colours and fonts in §4 reference named tokens / brandkit — no mid-spec raw hex improvisation

## Anti-slop (spec level)

- [ ] [BRIEF-INFERENCE.md](BRIEF-INFERENCE.md) table present in spec §1 (or linked appendix)
- [ ] [QUALITY-BAR.md](QUALITY-BAR.md) — visual reference URL + measurable craft intent
- [ ] [CSS-INTENT.md](CSS-INTENT.md) §4 present — type scale, surfaces, grids named
- [ ] [VISUAL-ACCEPTANCE.md](VISUAL-ACCEPTANCE.md) §8 present — `/dev` criteria + P0 slice order
- [ ] [ANTI-SLOP.md](ANTI-SLOP.md) §A / §A2 bans listed — each marked apply or N/A
- [ ] Spec **Anti-slop appendix** present (template §11) — §B rows apply or N/A with reason
- [ ] At least one **visual reference** URL or screenshot attached in spec
- [ ] §C items 2–3 (section rhythm / hero sketch) filled **or** marked N/A with reason
- [ ] No generic template layouts unless PRD explicitly requests them (e.g. purple-gradient hero,
      three-column feature grid, stock AI nav/footer)
- [ ] Screen names use `CONTEXT.md` vocabulary — not handler/class names
- [ ] Layout notes are specific to this feature — not copy-paste from another project
- [ ] Viewport grid behaviour documented for asymmetric layouts (bento, sticky rail)

## Craft critique (pre-handoff)

Score the draft spec 1–5 on each axis. Any axis below 3 → revise before handoff.

| Axis        | 1–5 | Pass when                                                                 |
| ----------- | --- | ------------------------------------------------------------------------- |
| Philosophy  |     | Mood + layout family match brief lock; not “clean modern” default         |
| Hierarchy   |     | One focal beat per primary viewport; type scale ≥ 3 levels named in §4    |
| Execution   |     | §4 CSS + §8 visual acceptance concrete enough for `/dev` without guessing |
| Specificity |     | Visual reference + anti-slop rows cited; no orphan PRD paths              |
| Restraint   |     | No invented proof metrics; eyebrows/chrome tells marked N/A or banned     |
| Consistency |     | Product routes share ui-kit tokens/chrome — no variety-for-variety        |

## Visual acceptance (before `/dev` handoff)

- [ ] Spec describes **one focal beat per viewport** for hero and primary section (**N/A**
      with reason when no marketing hero)
- [ ] Dark-first acceptance called out — screenshots for sign-off use dark theme unless PRD
      excepts
- [ ] If redesign: audit includes **screenshot of shipped UI** vs intent (not codebase walk only)

## Motion and accessibility

- [ ] Every motion row has a `prefers-reduced-motion` fallback
- [ ] Focus order is defined for non-trivial forms and modals
- [ ] Error states are actionable — user knows what to do next

## Handoff

- [ ] Spec saved at `docs/design/<feature-slug>.md`
- [ ] `## Next Step` names one preferred skill (`/dev` default; `/to-issues` only when P0
      visual slices ship first — optional second with when)

Design pre-flight ends here. **`/dev`** runs [visual-ship.md](../dev/visual-ship.md) before
declaring UI done — functional tests alone are insufficient.
