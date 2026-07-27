---
name: design
description: >-
  Turn a PRD or feature brief into an engineering-ready design spec mapped to @polyms/ui-kit.
  Invoke with /design, UI spec, design spec, thiết kế màn hình, spec giao diện, làm lại giao diện,
  wireframe from PRD, audit UI, chấm UI, anti-slop audit, or score this screen.
disable-model-invocation: true
---

# Design

Turn a PRD or feature brief into an **engineering-ready design spec** at `docs/design/<feature>.md`. Map screens and components to **`@polyms/ui-kit`** — do not invent a parallel design system.

**Boundary vs `ui-kit`:**

| Invoke        | Repo             | Answers                                                       |
| ------------- | ---------------- | ------------------------------------------------------------- |
| **`/design`** | ai-kit           | _What_ — flows, screens, states, component map, motion intent |
| **`/ui-kit`** | `@polyms/ui-kit` | _How_ — compose primitives, tokens, motion API when coding    |

`/design` does **not** duplicate ui-kit API docs. **User-invoked** — you cannot agent-fire `/ui-kit`. Before the component map, ask the user to invoke **`/ui-kit`** in this chat (skill ships with the lib — symlink or `npx skills add`), or follow it if the user already attached it.

**Boundary vs `/reqs`:** `/reqs` writes requirements and PRD — `/design` consumes PRD and produces UI spec. Do not rewrite product scope.

**Boundary vs `arch`:** `arch` is code module/seam shape — not visual design.

**Upstream:** `/align` → `/reqs` or `/to-prd` → `/to-issues` (optional) → `/design`.

**Downstream:** `/dev` implements from `docs/design/<feature>.md`; `dev` uses `ui-kit` when writing UI code.

**Prerequisites:** Soft — read `CONTEXT.md` + ADRs when present. Recommend `@polyms/ui-kit` installed and user runs `/ui-kit` before component mapping. Read `docs/agents/language.md` when present — write the spec in that language.

## References

| Topic           | Read when                                                                                                                                                             |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brief inference | [BRIEF-INFERENCE.md](BRIEF-INFERENCE.md) — **mandatory** before layout                                                                                                |
| Anti-slop       | [ANTI-SLOP.md](ANTI-SLOP.md) — §A/§A2 bans, composition, §E punch list                                                                                                |
| Quality bar     | [QUALITY-BAR.md](QUALITY-BAR.md) — visual reference + optional DNA notes                                                                                              |
| CSS intent      | [CSS-INTENT.md](CSS-INTENT.md) — **required** §4 in spec; `/dev` implements before wiring                                                                             |
| Visual accept   | [VISUAL-ACCEPTANCE.md](VISUAL-ACCEPTANCE.md) — criteria `/dev` proves via visual-ship in `/dev`                                                                       |
| Spec template   | [design-spec-template.md](design-spec-template.md)                                                                                                                    |
| Pre-flight      | [PREFLIGHT.md](PREFLIGHT.md) — must pass before handoff (includes craft critique)                                                                                     |
| Redesign        | [REDESIGN.md](REDESIGN.md) — audit-only punch list or full redesign                                                                                                   |
| Domain glossary | `CONTEXT.md` at repo root                                                                                                                                             |
| ADRs            | `docs/adr/` — do not re-litigate recorded decisions                                                                                                                   |
| PRD source      | Issue tracker, `docs/`, or conversation — fetch per issue-tracker if needed                                                                                           |
| Component API   | **`/ui-kit`** in `@polyms/ui-kit` — user invokes before component map, or attached in chat                                                                            |
| External ref    | [Taste](https://www.tasteskill.dev/) / [Hallmark](https://github.com/Nutlope/hallmark) — anti-slop discipline only; DS locked to ui-kit; do not install theme engines |

## Quick Router

| User intent              | Workflow                                |
| ------------------------ | --------------------------------------- |
| New feature from PRD     | [Spec from PRD](#spec-from-prd)         |
| One complex flow         | [Screen drill-down](#screen-drill-down) |
| Score existing UI only   | [Audit-only](#audit-only)               |
| Modernize existing UI    | [Redesign audit](#redesign-audit)       |
| Missing ui-kit primitive | [Component gap](#component-gap)         |

## Spec from PRD

**Goal:** Complete `docs/design/<feature>.md` ready for `/dev`.

### 1. Gather context

Read the PRD (issue, path, or conversation). Read `CONTEXT.md` and relevant ADRs.

Run [BRIEF-INFERENCE.md](BRIEF-INFERENCE.md) — fill the table; write **brief lock** paragraph. Output maps to **ui-kit**, not Material/shadcn.

**Completion criterion:** PRD read; brief inference table filled; domain vocabulary and ADR constraints noted.

### 2. Infer layout direction

From brief lock + PRD, state mood and layout family. Pick ui-kit **theme/variant/motion tier**.
Read [ANTI-SLOP.md](ANTI-SLOP.md) — list which §A / §A2 bans apply; which §B composition rules
this feature must satisfy.

Ask user to invoke **`/ui-kit`** if not already attached — use its catalog when listing primitives for the component map.

**Completion criterion:** Brief + theme direction stated; anti-slop rows cited; user corrects or explicitly proceeds before step 3.

### 3. Draft spec

Read [QUALITY-BAR.md](QUALITY-BAR.md) — finished-site polish (tokens, CSS intent, ui-kit); PRD drives sections, not a fixed layout checklist.

Fill [design-spec-template.md](design-spec-template.md):

- Flows (Mermaid)
- Screen inventory with **four content states** each (loading / empty / error / success)
- Component map → ui-kit primitives + interaction-state notes for primary controls
- Motion plan (intent only — API details in `/ui-kit`)
- Responsive + a11y
- **Visual reference** (1–2 URLs or screenshots — target craft tier; optional DNA notes per
  [QUALITY-BAR.md](QUALITY-BAR.md); see [ANTI-SLOP.md](ANTI-SLOP.md) §C)
- **Anti-slop appendix** — applicable rows from [ANTI-SLOP.md](ANTI-SLOP.md) §A / §A2 / §B
- **Typography & visual system** — per [CSS-INTENT.md](CSS-INTENT.md) (required for UI)
- **Visual acceptance for `/dev`** — per [VISUAL-ACCEPTANCE.md](VISUAL-ACCEPTANCE.md)

ASCII wireframes OK — no full component code.

**Completion criterion:** Every template section filled (anti-slop appendix §11 included);
§4 CSS + §8 visual acceptance present for UI specs; file written to
`docs/design/<feature-slug>.md`.

### 4. Pre-flight

Run [PREFLIGHT.md](PREFLIGHT.md) honestly. Fix failures before handoff.

**Completion criterion:** All pre-flight items pass.

### 5. Handoff

Summarize what was written (path + feature name). End with `## Next Step` — preferred `→ /dev`.
Second option only when P0 CSS/visual slices should ship separately via `/to-issues` (one-line
when). Not a flat pipe menu.

**Completion criterion:** Summary delivered; one preferred next skill named (optional second with
when); `/dev` has §4 CSS + §8 visual acceptance to run visual-ship in `/dev`.

## Screen drill-down

**Goal:** Deep spec for one complex flow without re-specifying the whole feature.

1. Identify the flow from existing PRD or partial spec

   **Completion criterion:** Target flow named; scope bounded to one sub-flow.

2. Expand one screen or sub-flow — all four content states, component map, motion

   **Completion criterion:** Expanded section draft complete.

3. Merge into `docs/design/<feature>.md` or append as clearly labelled section

   **Completion criterion:** Merged into spec file at agreed path.

4. Re-run pre-flight for touched sections

   **Completion criterion:** User confirms sub-flow; pre-flight pass on touched sections.

## Audit-only

**Goal:** Punch list against anti-slop — no edits, no new redesign spec unless user continues.

Follow [REDESIGN.md](REDESIGN.md)#audit-only — [ANTI-SLOP.md §E](ANTI-SLOP.md#e--audit-punch-list-report-format)
format; **skip** [PREFLIGHT.md](PREFLIGHT.md). Then stop or continue into full redesign.

**Completion criterion:** §E punch list + verdict delivered; zero file edits. If stopping:
`## Next Step` may be omitted or state audit complete. If critical tells remain and user may
redesign: preferred `→ /design` (redesign audit).

## Redesign audit

**Goal:** Modernize existing UI without breaking logic or data.

Follow [REDESIGN.md](REDESIGN.md) — audit-first (prefer §E punch list), preserve behaviour,
update visual layer via ui-kit.

**Completion criterion:** Audit notes in spec; preservation rules explicit; pre-flight pass.

## Component gap

**Goal:** Flag a PRD requirement that needs a primitive not in `@polyms/ui-kit`.

1. Document the gap in the spec **Custom components** table
2. Propose follow-up (GitHub issue or ADR) — do not invent the primitive in `/dev` without approval
3. Hand off to `/reqs` or user if scope change is needed

**Completion criterion:** Gap documented with follow-up action; no silent custom UI in implementation spec.

## Hard constraints

- Design specs live in **`docs/design/`** — committed, reviewable (**exception:** audit-only —
  punch list in chat, no file required)
- **Do not** use Cursor Canvas instead of markdown spec files
- **Do not** publish design specs to the issue tracker unless user explicitly asks

## Agent

For long design sessions in isolated context (full feature spec, audit-only, redesign):

```
Use the designer to [task]
```

The agent reads this skill when invoked.
