---
name: design
description: Turn a PRD or feature brief into an engineering-ready design spec mapped to @polyms/core-ui. Invoke with /design, UI spec, design spec, thiết kế màn hình, spec giao diện, làm lại giao diện, or wireframe from PRD.
disable-model-invocation: true
---

# Design

Turn a PRD or feature brief into an **engineering-ready design spec** at `docs/design/<feature>.md`. Map screens and components to **`@polyms/core-ui`** — do not invent a parallel design system.

**Boundary vs `core-ui`:**

| Invoke         | Repo              | Answers                                                       |
| -------------- | ----------------- | ------------------------------------------------------------- |
| **`/design`**  | ai-kit            | _What_ — flows, screens, states, component map, motion intent |
| **`/core-ui`** | `@polyms/core-ui` | _How_ — compose primitives, tokens, motion API when coding    |

`/design` does **not** duplicate core-ui API docs. **User-invoked** — you cannot agent-fire `/core-ui`. Before the component map, ask the user to invoke **`/core-ui`** in this chat (skill ships with the lib — symlink or `npx skills add`), or follow it if the user already attached it.

**Boundary vs `pm`:** `pm` writes requirements and PRD — `/design` consumes PRD and produces UI spec. Do not rewrite product scope.

**Boundary vs `arch`:** `arch` is code module/seam shape — not visual design.

**Upstream:** `/align` → `/pm` or `/to-prd` → `/to-issues` (optional) → `/design`.

**Downstream:** `/dev` implements from `docs/design/<feature>.md`; `dev` uses `core-ui` when writing UI code.

**Prerequisites:** Soft — read `CONTEXT.md` + ADRs when present. Recommend `@polyms/core-ui` installed and user runs `/core-ui` before component mapping. Read `docs/agents/language.md` when present — write the spec in that language.

## References

| Topic           | Read when                                                                                                      |
| --------------- | -------------------------------------------------------------------------------------------------------------- |
| Brief inference | [BRIEF-INFERENCE.md](BRIEF-INFERENCE.md) — **mandatory** before layout                                         |
| Anti-slop       | [ANTI-SLOP.md](ANTI-SLOP.md) — big bans + composition; cite in spec                                            |
| Quality bar     | [QUALITY-BAR.md](QUALITY-BAR.md) — visual reference + measurable craft intent                                  |
| CSS intent      | [CSS-INTENT.md](CSS-INTENT.md) — **required** §4 in spec; `/dev` implements before wiring                      |
| Visual accept   | [VISUAL-ACCEPTANCE.md](VISUAL-ACCEPTANCE.md) — criteria `/dev` proves via visual-ship in `/dev` |
| Spec template   | [design-spec-template.md](design-spec-template.md)                                                             |
| Pre-flight      | [PREFLIGHT.md](PREFLIGHT.md) — must pass before handoff                                                        |
| Redesign        | [REDESIGN.md](REDESIGN.md) — audit-first when modernizing existing UI                                          |
| Domain glossary | `CONTEXT.md` at repo root                                                                                      |
| ADRs            | `docs/adr/` — do not re-litigate recorded decisions                                                            |
| PRD source      | Issue tracker, `docs/`, or conversation — fetch per issue-tracker if needed                                    |
| Component API   | **`/core-ui`** in `@polyms/core-ui` — user invokes before component map, or attached in chat                   |
| External ref    | [Taste Skill](https://www.tasteskill.dev/) — anti-slop discipline only; DS locked to core-ui                   |

## Quick Router

| User intent               | Workflow                                |
| ------------------------- | --------------------------------------- |
| New feature from PRD      | [Spec from PRD](#spec-from-prd)         |
| One complex flow          | [Screen drill-down](#screen-drill-down) |
| Modernize existing UI     | [Redesign audit](#redesign-audit)       |
| Missing core-ui primitive | [Component gap](#component-gap)         |

## Spec from PRD

**Goal:** Complete `docs/design/<feature>.md` ready for `/dev`.

### 1. Gather context

Read the PRD (issue, path, or conversation). Read `CONTEXT.md` and relevant ADRs.

Run [BRIEF-INFERENCE.md](BRIEF-INFERENCE.md) — fill the table; write **brief lock** paragraph. Output maps to **core-ui**, not Material/shadcn.

**Completion criterion:** PRD read; brief inference table filled; domain vocabulary and ADR constraints noted.

### 2. Infer layout direction

From brief lock + PRD, state mood and layout family. Pick core-ui **theme/variant/motion tier**. Read [ANTI-SLOP.md](ANTI-SLOP.md) — list which §A bans apply; which §B composition rules this feature must satisfy.

Ask user to invoke **`/core-ui`** if not already attached — use its catalog when listing primitives for the component map.

**Completion criterion:** Brief + theme direction stated; anti-slop rows cited; user corrects or explicitly proceeds before step 3.

### 3. Draft spec

Read [QUALITY-BAR.md](QUALITY-BAR.md) — finished-site polish (tokens, CSS intent, core-ui); PRD drives sections, not a fixed layout checklist.

Fill [design-spec-template.md](design-spec-template.md):

- Flows (Mermaid)
- Screen inventory with **four states** each
- Component map → core-ui primitives
- Motion plan (intent only — API details in `/core-ui`)
- Responsive + a11y
- **Visual reference** (1–2 URLs or screenshots — target craft tier; see [ANTI-SLOP.md](ANTI-SLOP.md) §C, not generic UI kits)
- **Anti-slop appendix** — applicable rows from [ANTI-SLOP.md](ANTI-SLOP.md) §A–§B
- **Typography & visual system** — per [CSS-INTENT.md](CSS-INTENT.md) (required for UI)
- **Visual acceptance for `/dev`** — per [VISUAL-ACCEPTANCE.md](VISUAL-ACCEPTANCE.md)

ASCII wireframes OK — no full component code.

**Completion criterion:** Every template section filled; §4 CSS + §8 visual acceptance present for UI specs; file written to `docs/design/<feature-slug>.md`.

### 4. Pre-flight

Run [PREFLIGHT.md](PREFLIGHT.md) honestly. Fix failures before handoff.

**Completion criterion:** All pre-flight items pass.

### 5. Handoff

Summarize what was written (path + feature name). End with `## Next Step` → `/dev` (default) or `/to-issues` if P0 CSS/visual slices should ship separately.

**Completion criterion:** Summary delivered; one next skill named; `/dev` has §4 CSS + §8 visual acceptance to run visual-ship in `/dev`.

## Screen drill-down

**Goal:** Deep spec for one complex flow without re-specifying the whole feature.

1. Identify the flow from existing PRD or partial spec

   **Completion criterion:** Target flow named; scope bounded to one sub-flow.

2. Expand one screen or sub-flow — all four states, component map, motion

   **Completion criterion:** Expanded section draft complete.

3. Merge into `docs/design/<feature>.md` or append as clearly labelled section

   **Completion criterion:** Merged into spec file at agreed path.

4. Re-run pre-flight for touched sections

   **Completion criterion:** User confirms sub-flow; pre-flight pass on touched sections.

## Redesign audit

**Goal:** Modernize existing UI without breaking logic or data.

Follow [REDESIGN.md](REDESIGN.md) — audit-first, preserve behaviour, update visual layer via core-ui.

**Completion criterion:** Audit notes in spec; preservation rules explicit; pre-flight pass.

## Component gap

**Goal:** Flag a PRD requirement that needs a primitive not in `@polyms/core-ui`.

1. Document the gap in the spec **Custom components** table
2. Propose follow-up (GitHub issue or ADR) — do not invent the primitive in `/dev` without approval
3. Hand off to `/pm` or user if scope change is needed

**Completion criterion:** Gap documented with follow-up action; no silent custom UI in implementation spec.

## Hard constraints

- Design specs live in **`docs/design/`** — committed, reviewable
- **Do not** use Cursor Canvas instead of markdown spec files
- **Do not** publish design specs to the issue tracker unless user explicitly asks

## Agent

For long design sessions in isolated context (full feature spec, redesign audit):

```
Use the design-agent to [task]
```

The agent reads this skill when invoked.
