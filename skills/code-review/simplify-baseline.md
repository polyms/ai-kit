# Simplify axis baseline

Paste this in full into the Simplify sub-agent prompt. Scope: **over-engineering and
surplus complexity only** — not correctness bugs, security holes, or performance tuning.
Those belong on Standards or Spec (or a normal fix pass).

## Tags (one finding per line)

- `delete:` — dead code, unused flexibility, speculative feature. Replacement: nothing.
- `stdlib:` — hand-rolled thing the standard library ships. Name the function.
- `native:` — dependency or code doing what the platform already does. Name the feature.
- `yagni:` — abstraction with one implementation, config nobody sets, layer with one caller.
- `shrink:` — same logic, fewer lines. Show the shorter form.

## Format

`path:L12-38: tag: short what-to-cut. replacement.`

Examples:

- `L12-38: stdlib: 27-line email validator. "@" check + confirmation mail is enough.`
- `L4: native: moment.js for one format. Intl.DateTimeFormat, 0 deps.`
- `repo.py:L88: yagni: AbstractRepository with one impl. Inline until a second exists.`
- `L52-71: delete: retry wrapper around an idempotent local call. Nothing replaces it.`

## Scoring

End with `net: -N lines possible.` (estimate deletions across findings).

Nothing to cut → exactly: `Lean already. Ship.`

## Boundaries vs other axes

- Do **not** use Fowler smell names (Standards owns those).
- Do **not** judge missing/wrong requirements (Spec owns those).
- Do **not** flag a single smoke / seam regression test as bloat.
- Do **not** apply fixes — list only.
- Design-spec / ADR / stack choices already locked for the change are not delete targets
  (e.g. chosen router, `@polyms/core-ui`, Zustand) — only surplus on top of them.
