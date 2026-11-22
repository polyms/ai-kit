# Visual acceptance for `/dev`

Copy this section into every UI design spec. Design writes criteria; **`/dev` proves them** via [visual-ship.md](../dev/visual-ship.md).

## Template

```markdown
## Visual acceptance for `/dev`

**Reference:** [URL — e.g. tasteskill.dev craft tier] — borrow composition density, not brand.

| Check          | Pass when                                                                                 |
| -------------- | ----------------------------------------------------------------------------------------- |
| Theme          | First paint and screenshots match approved project theme or ADR                             |
| Type scale     | Type tiers from spec §4 visible (e.g. display / h1 / h2 / body) — not one size everywhere |
| Surface rhythm | ≥2 distinct surfaces or `border-line` seams — not flat single background                  |
| Focal beat     | Hero (or primary section) has one clear visual anchor — not five equal blocks             |
| Components     | Use the project-selected components where specified; otherwise semantic accessible controls                 |
| Anti-slop      | No §A / §A2 (and §B if layout in scope) from ANTI-SLOP.md; failures use §E format         |

**P0 slices (order):** [list — CSS/globals → hero → … from implementation priority]
```

**Completion criterion:** Table filled; P0 order named; `/dev` can run visual-ship without guessing.
