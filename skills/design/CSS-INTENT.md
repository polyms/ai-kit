# CSS & visual system — spec section

Required in every `docs/design/<feature>.md` that ships UI. `/dev` implements this section **before** wiring feature logic — not “polish later.”

## What to specify

| Topic              | Spec must include                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| **Type scale**     | Named classes or token steps — e.g. `.display`, `.h1`, `.h2`, `.label-mono` with size/weight at `sm`/`md`/`lg`    |
| **Surface rhythm** | Which sections use `bg-body` vs `bg-surface` / `bg-surface-2`; `border-b border-line` seams                       |
| **Layout shells**  | `.page-x`, `.section-y`, max-width per route — not one container everywhere                                       |
| **Grids**          | Bento / asymmetric layouts: explicit `grid-template` or `grid-area` per breakpoint — not only `grid-cols-2` prose |
| **Accent**         | When `border-s-4 border-primary-*`, focal card treatment, mono invoke scale                                       |
| **Theme**          | dark-first default, flash script if needed, light mode AA via core-ui tokens only                                 |
| **Custom CSS**     | List classes that belong in `globals.css` `@layer components` — not scattered inline styles                       |

## Borrow / avoid (when visual reference is set)

| Borrow from reference  | Apply on this product       |
| ---------------------- | --------------------------- |
| [e.g. hero type scale] | [concrete class + px/rem]   |
| [e.g. section rhythm]  | [which sections full-bleed] |

**Do not borrow:** reference brand colors, unrelated section inventory, sponsor chrome.

## Below bar

- “Use Tailwind defaults” with no named scale
- Component map without CSS layer — `/dev` will ship unstyled README layout
- Only hex colors with no semantic token mapping

**Completion criterion:** `/dev` can write `globals.css` and section wrappers without inventing the visual system.
