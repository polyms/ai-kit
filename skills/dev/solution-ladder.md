# Solution ladder

Stop at the **first rung that holds** — after the problem is understood, not instead of
reading. Trace the real flow (files and callers the change touches) before climbing.

Use after seams are confirmed and before the red-green loop. Stack already chosen in the
repo, design spec, or ADRs **overrides** "prefer native / avoid deps" for that choice
(e.g. Zustand, TanStack Router, `@polyms/ui-kit` stay).

## Rungs

1. **YAGNI** — does this need to exist for the confirmed acceptance criteria?
2. **Reuse** — helper, util, type, or pattern **already** in this codebase? (Do not invent a
   new shared helper to “reuse later” — see **Colocate** below.)
3. **Stdlib** — language / runtime standard library covers it?
4. **Native platform** — browser/OS/DB feature covers it? (`<input type="date">`, CSS,
   constraint, `Intl`, …)
5. **Installed dependency** — something already in the project solves it? Do not add a new
   dependency for a few lines.
6. **One line** — can it be one line?
7. **Minimum that works** — only then write the smallest code that passes the seam tests.

Two rungs work → take the higher (lazier) one and move on.

## Colocate

A function with **one call site** stays with its consumer — inline or private in the same
module. Do **not** park it in `helpers/`, `utils/`, `lib/`, or a shared barrel “for neatness.”

Extract to a shared helper only when a **second real call site** exists (or the same shape is
already duplicated across files). Premature shared helpers widen the import / bundle graph,
hurt tree-shaking, and erase locality.

Not this rule: domain types, seam adapters, or trust-boundary validation the module already
owns — those live at the seam, not in a junk-drawer utils file.

## Never strip

Do not ladder away: trust-boundary validation, error handling that prevents data loss,
security, accessibility, anything the spec or user explicitly requested. Understanding
the problem first is never optional — a small wrong-place diff is a second bug.

## Bug fix = root cause

A report names a **symptom**. Before editing: grep every caller of the function you touch.
Fix once in the shared function when that is the smaller correct diff — patching only the
ticket path leaves sibling callers broken.
