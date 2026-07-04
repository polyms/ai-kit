# Quality bar — minimum craft output

`/design` specs must describe UI that `/dev` can ship as a **finished surface** — real CSS, tokens, and core-ui integration — not wireframe boxes or README pasted into a page.

PRD decides **which screens exist**. Craft is **measurable** — type scale, surface rhythm, focal beats — not vague “modern clean.”

## Craft bar

| Dimension             | Bar                                                                                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Visual reference**  | **Required** for UI specs — URL or screenshot (e.g. [tasteskill.dev](https://www.tasteskill.dev/) craft tier). Borrow composition density, not brand. |
| **CSS intent**        | §4 [CSS-INTENT.md](CSS-INTENT.md) — named classes, surfaces, grids; `/dev` implements before wiring                                                   |
| **Visual acceptance** | §8 [VISUAL-ACCEPTANCE.md](VISUAL-ACCEPTANCE.md) — `/dev` proves via [visual-ship.md](../dev/visual-ship.md)                                           |
| **core-ui**           | Primitives and tokens — not ad-hoc one-off styling                                                                                                    |
| **Content**           | Copy from PRD/README/CONTEXT — not invented marketing fluff                                                                                           |

## Spec must record (§1b)

```markdown
## Quality bar

- **Visual reference:** [URL] — what to borrow vs avoid
- **Craft intent:** [type scale, surface rhythm, density — measurable]
```

## Below bar (revise spec)

- No visual reference and vague craft adjectives only
- Component map without §4 CSS — `/dev` will ship unstyled layout
- No §8 visual acceptance — functional `/dev` will pass with bad styles
- Generic SaaS blocks (ANTI-SLOP §A)
