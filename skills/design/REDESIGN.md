# Redesign Audit

Audit-first workflow when modernizing **existing** UI. Preserve data flow and business logic; change the visual layer through `@polyms/core-ui`.

Use this workflow from `/design` when the user asks to redesign, refresh, or modernize screens that already exist.

## When to use

- Existing pages feel dated or inconsistent with core-ui
- PRD is a visual refresh, not a new feature
- User says "redesign", "modernize", "refresh UI", "làm lại giao diện"

**Do not** use for greenfield features — use [Spec from PRD](SKILL.md#spec-from-prd) instead.

## Process

### 1. Audit current UI

Walk the codebase **and capture screenshots** at `sm`, `md`, `lg` (or user-provided). For each screen or cluster:

| Audit item     | Note                                                                                  |
| -------------- | ------------------------------------------------------------------------------------- |
| Screen purpose | Still matches PRD / CONTEXT?                                                          |
| core-ui usage  | Which primitives already used vs raw HTML/Tailwind?                                   |
| State coverage | Missing loading/empty/error?                                                          |
| Motion         | Ad-hoc animations vs core-ui motion API?                                              |
| a11y gaps      | Focus traps, labels, contrast                                                         |
| Slop signals   | Generic hero, template grids, purple gradients, **flat doc page**, broken bento grids |

Compare overall craft to the spec's **visual reference** — composition and tokens, not a section checklist.

**Completion criterion:** Audit table or bullet list per screen/cluster.

### 2. Preservation rules

Explicitly list what **must not change**:

- API contracts and data shapes
- Navigation routes and deep links
- Permission / auth gates
- Analytics events (unless PRD says otherwise)
- Business validation rules

**Completion criterion:** Preservation section written in design spec.

### 3. Modernization levers

Propose changes scoped to core-ui:

- Replace raw elements with core-ui primitives
- Consolidate duplicate patterns into shared layout
- Align tokens/theme to current core-ui preset
- Motion tier normalization
- Fill missing four states

**Completion criterion:** Each lever maps to component map rows in `docs/design/<feature>.md`.

### 4. ADR and conflicts

If redesign contradicts an ADR, surface only when friction is real — same rule as `/arch-refactor`. Offer ADR update when user rejects a candidate for load-bearing reasons.

### 5. Pre-flight and handoff

Run [PREFLIGHT.md](PREFLIGHT.md). Hand off to `/dev` with audit + spec path.

**Completion criterion:** Spec at `docs/design/<feature>.md` includes audit summary + preservation rules; pre-flight pass.
