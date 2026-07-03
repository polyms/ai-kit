# Visual ship — UI from design spec

When `/dev` implements from `docs/design/<feature>.md` with UI, **functional completeness is not done**. Run this after tests pass and before declaring the slice shipped.

Design pre-flight ([PREFLIGHT.md](../design/PREFLIGHT.md)) gates the spec. This file gates **shipped pixels**.

## CSS-first slice order

1. Read spec **Typography & visual system** ( [CSS-INTENT.md](../design/CSS-INTENT.md) ) and **Visual acceptance** sections
2. Implement `globals.css` / theme / type scale / grid classes **first**
3. Section shells (wrappers, borders, surfaces) **second**
4. core-ui primitives and data wiring **third**
5. Motion last

Do not ship a vertical slice that is correct in React but still using default unstyled layout.

## Hard checks (before done)

- [ ] Dark theme is the default acceptance view — matches spec (flash script if specified)
- [ ] Type scale from spec is visible — display / section / body / mono, not one size everywhere
- [ ] No ANTI-SLOP §A violations in shipped UI (centered hero slop, equal card grid soup, 70vh text void)
- [ ] core-ui primitives used where spec maps them — not raw `<input>` / ad-hoc buttons
- [ ] Compared to spec **visual reference** URL — composition tier in the same ballpark; gaps listed if not

## Visual acceptance section

If the design spec includes **Visual acceptance for `/dev`**, treat it as authoritative — check every row.

If missing, still run hard checks above and note the gap in handoff.

## Handoff

UI slice is not ready for `/code-review` until visual ship passes. Spec-only functional review will miss “styles very bad.”
