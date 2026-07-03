# Visual acceptance for `/dev`

Copy this section into every UI design spec. Design writes criteria; **`/dev` proves them** via [visual-ship.md](../dev/visual-ship.md).

## Template

```markdown
## Visual acceptance for `/dev`

**Reference:** [URL — e.g. tasteskill.dev craft tier] — borrow composition density, not brand.

| Check          | Pass when                                                                     |
| -------------- | ----------------------------------------------------------------------------- |
| Dark-first     | First paint dark (or per ADR); acceptance screenshots in dark                 |
| Type scale     | `.display` / `.h1` / `.h2` / mono invoke visible in hero + one inner section  |
| Surface rhythm | ≥2 distinct surfaces or `border-line` seams — not flat single background      |
| Focal beat     | Hero (or primary section) has one clear visual anchor — not five equal blocks |
| core-ui        | No raw form controls where spec maps `Field.Control` / `Button` / `Modal`     |
| Anti-slop      | No §A rows from ANTI-SLOP.md visible in shipped UI                            |

**P0 slices (order):** [list — CSS/globals → hero → … from implementation priority]
```

**Completion criterion:** Table filled; P0 order named; `/dev` can run visual-ship without guessing.
