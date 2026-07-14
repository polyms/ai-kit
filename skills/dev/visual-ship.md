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

## Default posture

**Not ship-ready** until every hard check below passes. Claims without evidence do not
count — cite visual-acceptance rows, a browser screenshot/snapshot, or an explicit gap
list. Prefer finding **1–3 concrete visual issues** over a soft “looks fine.”

## Evidence (required for UI slices)

Capture proof for the primary journey the slice ships. Prefer tools already in the
session (browser MCP snapshot/screenshot, existing Playwright, or design-spec visual
reference). Do not invent a new E2E harness for a one-slice change.

| Surface      | What to capture                                                   |
| ------------ | ----------------------------------------------------------------- |
| Default view | Dark theme, type scale visible — desktop                          |
| Responsive   | One mobile width when layout is non-trivial                       |
| Interaction  | Before/after for the main control (chip, form submit, modal open) |
| Spec rows    | Each **Visual acceptance** row: pass / fail + evidence ref        |

**Evidence log** (paste into ship handoff):

```markdown
## Visual evidence

- Desktop dark: [path or "browser snapshot — HH:MM"]
- Mobile: [n/a | path]
- Interaction: [what changed — before/after]
- Spec rows: [IDs pass/fail]
- Issues found: [1–3 concrete | none]
```

Default to **needs work** if evidence is missing or any hard check fails.

### No capture tool available

If none of the three evidence sources (browser MCP, existing Playwright, design-spec visual
reference) is available in this session, do not silently default to **needs work** forever.
Stop once and ask the user: attach a capture tool, or approve a self-attested pass for this
session.

If the user approves self-attesting: verify each hard check by reading code (class names,
computed values, diffed against spec) instead of a screenshot. Mark the evidence log
`self-attested — no capture tool in session (user-confirmed)` instead of a path/snapshot ref.
This approval holds for **every remaining UI slice in the current session** — do not re-ask
per slice. A new session re-asks from scratch.

## Hard checks (before done)

- [ ] Dark theme is the default acceptance view — matches spec (flash script if specified)
- [ ] Type scale from spec is visible — display / section / body / mono, not one size everywhere
- [ ] No ANTI-SLOP §A violations in shipped UI (centered hero slop, equal card grid soup, 70vh text void)
- [ ] core-ui primitives used where spec maps them — not raw `<input>` / ad-hoc buttons
- [ ] Compared to spec **visual reference** URL — composition tier in the same ballpark; gaps listed if not
- [ ] Evidence log filled — hard checks traced to screenshot, snapshot, or visual-acceptance IDs

## Visual acceptance section

If the design spec includes **Visual acceptance for `/dev`**, treat it as authoritative — check every row.

If missing, still run hard checks above and note the gap in handoff.

## Handoff

UI slice is not ready for `/code-review` until visual ship passes with an evidence log.
Spec-only functional review will miss “styles very bad.”
