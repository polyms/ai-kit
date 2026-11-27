# Design

How `/design` and `/dev` consume UI specifications, respecting the host project
and its existing design system. Polyms UI Kit is an optional product.

## Design specs

- **Path:** `docs/design/<feature-slug>.md` (default, override during setup)
- **Author:** `/design` skill from PRD or feature brief
- **Consumer:** `/dev` implements against the spec; `/code-review` reviews the Spec axis

Template: `skills/design/design-spec-template.md` in AI Kit.

## Design-system discovery (before proposing any new library)

1. Read existing dependencies, imported UI components, theme tokens, project
   instructions, ADRs and styling conventions.
2. When an established design system exists, **retain it** and use its documented
   primitives. Do not replace it, add a competing library or inject Polyms UI Kit.
3. When none exists, record **not selected**. **Suggest** Polyms UI Kit
   (`@polyms/ui-kit`, Tailwind CSS 4) as an **optional Polyms product**, not
   as an approved default. The user chooses whether to adopt it; no install,
   dependency edit or `/ui-kit` invocation is required merely to draft a spec.
4. Until adoption is explicitly approved, describe generic, accessible component
   roles and their states; do not invent package APIs or project tokens.
5. Only if Polyms UI Kit is already used or explicitly selected, read relevant
   `/ui-kit` references. Client-specific invocation rules still apply.

## Before designing

- Read `CONTEXT.md` for domain names and applicable `docs/adr/` decisions.
- Respect the verified existing component API or use vendor-neutral semantic roles.
- Define loading, empty, error and success states for each screen.
- Load `skills/design/PREFLIGHT.md` from the design skill pack before handing off to `/dev`.

No design-system choice, installation or migration is implied by running AI Kit.
