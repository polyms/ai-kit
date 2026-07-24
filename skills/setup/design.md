# Design

How `/design` and `/dev` consume UI specifications and `@polyms/ui-kit`.

## Design specs

- **Path:** `docs/design/<feature-slug>.md` (default — override in setup if needed)
- **Author:** `/design` skill from PRD or feature brief
- **Consumer:** `/dev` implements against the spec; `/code-review` Spec axis may fetch it

Template: `skills/design/design-spec-template.md` in ai-kit.

## Design system

- **Library:** `@polyms/ui-kit` (Tailwind CSS 4)
- **Skill:** `/ui-kit` ships with the lib — symlink via bootstrap or install from the ui-kit repo
- **Boundary:** `/design` maps _what_ (screens, component map, motion intent); `/ui-kit` documents _how_ (primitives, tokens, motion API)

`/design` does not duplicate ui-kit API documentation.

## Before designing

- Read **`CONTEXT.md`** for screen and domain naming
- Read **`docs/adr/`** for decisions that constrain UI
- Before component mapping, user invokes **`/ui-kit`** (or attaches it in chat)

## Rules

- Every screen spec includes loading, empty, error, and success states
- Run [PREFLIGHT.md](../../skills/design/PREFLIGHT.md) before handoff to `/dev`
- Custom components require documented exception — do not invent in `/dev` without approval
