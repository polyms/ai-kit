# Anti-slop & composition

Spec-level rules. `/dev` must not ship UI that fails §A / §A2 / §B (and §C in the
spec). Design system locked to `@polyms/ui-kit` — not agnostic DS picking, theme
catalogs, or per-page macrostructure lotteries (product chrome stays consistent;
marketing pages may vary layout family once per brief via
[BRIEF-INFERENCE.md](BRIEF-INFERENCE.md)).

Tells adapted from anti-AI-slop consensus ([Taste](https://www.tasteskill.dev/),
[Hallmark](https://github.com/Nutlope/hallmark)) — discipline only; do not install
parallel skills that invent tokens outside ui-kit.

## §A — Big bans (never ship)

| Ban                                                         | Why it reads as slop                                                                          |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Centered hero + two buttons + stock subcopy                 | SaaS template                                                                                 |
| Equal-height card grid for features/principles/agents       | 2018 startup landing                                                                          |
| Icon-tile feature cards (icon square + heading + 2 lines)   | Universal LLM default                                                                         |
| `rounded-xl border bg-surface` on every block               | Card soup — no hierarchy                                                                      |
| Card-in-card nesting without semantic reason                | Containment noise                                                                             |
| `max-w-6xl mx-auto` on every section                        | Everything feels same width, same weight                                                      |
| Purple/blue gradient hero or gradient-fill headline         | Strongest AI aesthetic tell                                                                   |
| Aurora / mesh blob / floating orb decoration                | 2022–23 generated “premium” default                                                           |
| Wall of text panels with 70vh empty space                   | Spec compliance without composition                                                           |
| Light-gray-on-white as sole theme without dark craft        | Reads as unstyled docs (see kit site screenshots)                                             |
| Monospace labels without size contrast                      | Terminal cosplay, not command surface                                                         |
| Pipeline as vertical list only (no rail/diagram on desktop) | README paste, not journey — applies when the feature **has** a pipeline; else N/A in appendix |
| Pure `#000` / `#fff` as only surfaces                       | Flat synthetic; tint neutrals via tokens                                                      |

## §A2 — Chrome, type & copy tells

| Ban                                                               | Why it reads as slop                                                          |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Italic display headers / one italic word in an upright heading    | Reliable AI “editorial” tic; keep italic for body emphasis                    |
| Section eyebrows on every block (`01 · FEATURES`, mono caps)      | Labelled-list tic; default **off** unless truly ordinal                       |
| Tag-left / heading-right hanging section heads                    | Templated-editorial fingerprint                                               |
| Stock AI nav (wordmark · 4–5 links · CTA right · sticky hairline) | Genre-blind SaaS chrome                                                       |
| Stock AI footer (4 link columns · social row · tiny ©)            | Genre-blind sitemap cosplay                                                   |
| Re-drawn browser / phone / IDE chrome around screenshots          | Fake OS frame; use real screenshot + hairline at most                         |
| Invented metrics / testimonials / logo counts                     | Proof bar lies; use `—` + “metric to confirm” or drop slot                    |
| Emoji as primary feature icons (`✨` `🚀` `⚡`)                   | OS-glyph shortcut; one icon library (ui-kit → Hugeicons) or omit              |
| Mid-render hex / OKLCH bypassing named tokens                     | Theme drift; lift into token then `var(--…)`                                  |
| Inter (or one sans) as both display and body with no pairing      | Template type on marketing; product OK if brandkit single-face is intentional |

**Product UI copy** (labels, errors, empty states) — follow `/ui-kit` quality (copy tells)
when attached; do not duplicate here.

## §B — Composition rules (must have)

| Rule                                 | Measure                                                                                                                                                                                                                        |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **One focal beat per viewport**      | Primary section has one clear anchor — not 5 equal blocks. Marketing: hero **or** pipeline stage, not both competing. **N/A** detail when the screen is a dense single-purpose form/table and hierarchy is already one column. |
| **Type scale ≥ 3 levels visible**    | display / section / body — classes **defined in CSS**, not invented class names                                                                                                                                                |
| **Asymmetry**                        | At least one section uses non-50/50 split on `lg+`. **N/A** for single-column dense admin/settings when brief lock says so.                                                                                                    |
| **Foreground/background separation** | Header, sections, or rail use distinct surface tokens — not flat white page                                                                                                                                                    |
| **Dark-first preview**               | Spec includes note: acceptance screenshots taken in **dark** theme unless PRD says otherwise                                                                                                                                   |
| **Designed empty space**             | `min-h` panels must contain visual structure (rail, chips, progress) — not one line centered in void                                                                                                                           |
| **Command metaphor**                 | **When** invoke/CLI-adjacent: invoke lines largest in the row; `>` or `/` prefix. **N/A** for ordinary product forms/tables.                                                                                                   |

Marketing / landing briefs: pick **one** layout family in brief inference and stick to it for
that surface — do not rotate “fingerprints” across product routes to chase variety.

## §C — Spec must include (not optional prose)

1. **Visual reference** — 1–2 URLs or attached screenshots of target craft tier (hero density,
   composition — not "modern clean" boilerplate). Optional: DNA notes from a study pass
   (macrostructure / type / colour anchor) — borrow structure, never pixel-clone; see
   [QUALITY-BAR.md](QUALITY-BAR.md).
2. **Section rhythm** — list alternating full-bleed vs constrained (e.g. catalog `max-w-4xl`,
   landing full-bleed). **N/A** for single-shell app screens (settings, tables) — say so.
3. **Hero composition sketch** — ASCII or bullet with **percent widths** and what user sees
   without scrolling. **N/A** when the feature has no marketing/landing hero.
4. **Anti-pattern checklist** — copy applicable §A / §A2 rows; mark N/A with reason.
5. **Quality bar** — per [QUALITY-BAR.md](QUALITY-BAR.md); §4 CSS + §8 visual acceptance
   required for UI.

## §D — Redesign / v2 audit extra

When output still looks bad after spec v2:

| Check                                       | Action                                                                                  |
| ------------------------------------------- | --------------------------------------------------------------------------------------- |
| Spec has tokens but no **layout bug** notes | Add viewport-specific grid rules (`sm`/`md`/`lg`) — bento often breaks at `grid-cols-2` |
| `/dev` never ran `/ui-kit`                  | Hard gate — primitives list in spec unused                                              |
| No screenshot review                        | **Visual acceptance** in PREFLIGHT — hero + one scroll section                          |
| Theme wrong on first paint                  | ADR dark-first vs `prefers-color-scheme` — spec must state flash script or default      |

## §E — Audit punch list (report format)

When scoring shipped UI (redesign audit-only or visual-ship failures), report each finding:

```text
[critical|major|minor] Tell name — path:line (or screen)
  why (one line)
  → fix (one line)
```

**Severity (default):** §A → `critical` · §A2 → `major` (use `minor` for punctuation-level
copy nits only) · §B miss → `major`. Do not invent severities outside this map.

Then:

```text
Summary — N critical · M major · K minor
Verdict — ships as slop | reads as AI-generated | close, fix minors
```

Map tell names to §A / §A2 / §B rows. **Audit-only** = punch list, no file edits — see
[REDESIGN.md](REDESIGN.md)#audit-only. Audit-only **skips** [PREFLIGHT.md](PREFLIGHT.md).

**Completion criterion:** Spec appendix cites applicable §A / §A2 / §B (and §D when redesign);
audits use §E format.
