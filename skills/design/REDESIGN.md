# Redesign Audit

Audit-first workflow when modernizing **existing** UI. Preserve data flow and business logic;
change the visual layer through `@polyms/ui-kit`.

Use this workflow from `/design` when the user asks to redesign, refresh, modernize, **or
audit** screens that already exist.

## When to use

- Existing pages feel dated or inconsistent with ui-kit
- PRD is a visual refresh, not a new feature
- User says "redesign", "modernize", "refresh UI", "làm lại giao diện"
- User says "audit UI", "chấm UI", "anti-slop audit", "score this screen" → **[Audit-only](#audit-only)**

**Do not** use for greenfield features — use [Spec from PRD](SKILL.md#spec-from-prd) instead.

## Audit-only

**Goal:** Ranked punch list against [ANTI-SLOP.md](ANTI-SLOP.md) §A / §A2 (and §B when
layout is in scope). **Do not edit** code or write a redesign spec unless the user asks to
continue into full redesign.

1. Capture or open the target at `sm` / `md` / `lg` (screenshot or live).
2. Score against §A / §A2 (and §B when layout/composition is in scope); report with
   [ANTI-SLOP.md §E](ANTI-SLOP.md#e--audit-punch-list-report-format).
3. Stop. Offer one line: _Continue into redesign (preservation + levers) or stop here?_

**Completion criterion:** §E punch list + verdict delivered; zero file edits in this branch.
Skip [PREFLIGHT.md](PREFLIGHT.md).

## Process (full redesign)

### 1. Audit current UI

Walk the codebase **and capture screenshots** at `sm`, `md`, `lg` (or user-provided). For each
screen or cluster:

| Audit item     | Note                                                                       |
| -------------- | -------------------------------------------------------------------------- |
| Screen purpose | Still matches PRD / CONTEXT?                                               |
| ui-kit usage  | Which primitives already used vs raw HTML/Tailwind?                        |
| State coverage | Missing loading/empty/error? Primary controls missing interaction states?  |
| Motion         | Ad-hoc animations vs ui-kit motion API?                                   |
| a11y gaps      | Focus traps, labels, contrast                                              |
| Slop signals   | §A / §A2 (+ §B if layout in scope) — §E punch list before proposing levers |

Compare overall craft to the spec's **visual reference** — composition and tokens, not a
section checklist.

**Completion criterion:** Audit table or §E punch list per screen/cluster.

### 2. Preservation rules

Explicitly list what **must not change**:

- API contracts and data shapes
- Navigation routes and deep links
- Permission / auth gates
- Analytics events (unless PRD says otherwise)
- Business validation rules

**Completion criterion:** Preservation section written in design spec.

### 3. Modernization levers

Propose changes scoped to ui-kit:

- Replace raw elements with ui-kit primitives
- Consolidate duplicate patterns into shared layout
- Align tokens/theme to current ui-kit preset
- Motion tier normalization
- Fill missing **screen** four content states (loading / empty / error / success)
- For primary interactive controls in the component map: note **interaction states** —
  default · hover · focus-visible · active · disabled · loading · error · success (ship what
  the primitive supports; do not invent parallel chrome)

**Completion criterion:** Each lever maps to component map rows in `docs/design/<feature>.md`.

### 4. ADR and conflicts

If redesign contradicts an ADR, surface only when friction is real — same rule as
`/arch-refactor`. Offer ADR update when user rejects a candidate for load-bearing reasons.

### 5. Pre-flight and handoff

Run [PREFLIGHT.md](PREFLIGHT.md). Hand off to `/dev` with audit + spec path.

**Completion criterion:** Spec at `docs/design/<feature>.md` includes audit summary +
preservation rules; pre-flight pass.
