# Anti-slop & composition

Spec-level rules. `/dev` must not ship UI that fails §A–§C. Design system locked to `@polyms/core-ui` — not agnostic DS picking.

## §A — Big bans (never ship)

| Ban                                                         | Why it reads as slop                              |
| ----------------------------------------------------------- | ------------------------------------------------- |
| Centered hero + two buttons + stock subcopy                 | SaaS template                                     |
| Equal-height card grid for features/principles/agents       | 2018 startup landing                              |
| `rounded-xl border bg-surface` on every block               | Card soup — no hierarchy                          |
| `max-w-6xl mx-auto` on every section                        | Everything feels same width, same weight          |
| Purple/blue gradient hero                                   | AI slop signal                                    |
| Wall of text panels with 70vh empty space                   | Spec compliance without composition               |
| Light-gray-on-white as sole theme without dark craft        | Reads as unstyled docs (see kit site screenshots) |
| Monospace labels without size contrast                      | Terminal cosplay, not command surface             |
| Pipeline as vertical list only (no rail/diagram on desktop) | README paste, not journey                         |

## §B — Composition rules (must have)

| Rule                                 | Measure                                                                                              |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| **One focal beat per viewport**      | Hero OR pipeline stage — not 5 equal sections fighting                                               |
| **Type scale ≥ 3 levels visible**    | display / section / body — classes **defined in CSS**, not invented class names                      |
| **Asymmetry**                        | At least one section uses non-50/50 split on `lg+`                                                   |
| **Foreground/background separation** | Header, sections, or rail use distinct surface tokens — not flat white page                          |
| **Dark-first preview**               | Spec includes note: acceptance screenshots taken in **dark** theme unless PRD says otherwise         |
| **Designed empty space**             | `min-h` panels must contain visual structure (rail, chips, progress) — not one line centered in void |
| **Command metaphor**                 | Invoke lines are largest text in row; `>` or `/` prefix on prompts                                   |

## §C — Spec must include (not optional prose)

1. **Visual reference** — 1–2 URLs or attached screenshots of target craft tier (hero density, composition — not "modern clean" boilerplate).
2. **Section rhythm** — list alternating full-bleed vs constrained (e.g. catalog `max-w-4xl`, landing full-bleed).
3. **Hero composition sketch** — ASCII or bullet with **percent widths** and what user sees without scrolling.
4. **Anti-pattern checklist** — copy §A rows that apply to this feature; mark N/A with reason.
5. **Quality bar** — per [QUALITY-BAR.md](QUALITY-BAR.md); §4 CSS + §8 visual acceptance required for UI.

## §D — Redesign / v2 audit extra

When output still looks bad after spec v2:

| Check                                       | Action                                                                                  |
| ------------------------------------------- | --------------------------------------------------------------------------------------- |
| Spec has tokens but no **layout bug** notes | Add viewport-specific grid rules (`sm`/`md`/`lg`) — bento often breaks at `grid-cols-2` |
| `/dev` never ran `/core-ui`                 | Hard gate — primitives list in spec unused                                              |
| No screenshot review                        | **Visual acceptance** in PREFLIGHT — hero + one scroll section                          |
| Theme wrong on first paint                  | ADR dark-first vs `prefers-color-scheme` — spec must state flash script or default      |

**Completion criterion:** Spec §12 or appendix cites applicable §A–§D rows.
