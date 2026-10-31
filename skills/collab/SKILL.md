---
name: collab
description: >-
  Orchestrate principals on one feature prompt into a lean PRD, an ADR only when hard
  to reverse, and a UI spec when there is a screen. Use for a new feature when the user
  says build a page, tạo trang mới, add CRUD, or thêm CRUD without naming a skill.
  Do NOT use when the user named a skill or principal, or asks for a bugfix, review,
  deploy incident, or docs-only work.
---

# Collab

**Codex / GitHub Copilot:** Apply
[client compatibility](../../docs/agents/client-compatibility.md) before this workflow.

One feature prompt drives the spec packet. Principals stay in lane; this skill only
sequences them. It does **not** fire user-invoked skills. It spawns agents, and each
agent reads its own skill.

**Packet:** lean PRD at `docs/prd/<slug>.md`, UI spec at `docs/design/<slug>.md` when the
feature has a screen, ADR in `docs/adr/` only when the three-part test in
`domain-modeling` passes. No tracker publish. A blocking fork
is defined only in [inference-brief.md](inference-brief.md).

**Soft setup:** read `CONTEXT.md`, `docs/adr/`, and `docs/agents/language.md` when present.
Missing files do not block; the codebase is the evidence.

## When this skill owns the turn

Own the turn when all of these are true:

- The ask is a new product feature: a new screen, a new CRUD, or a new user-facing flow. A change
  to a screen that already exists (a filter, a field, a column) is `dev`, not this skill.
- The user did not name a skill or a principal (`/reqs`, `use pm`, …).
- The packet is missing, or it is on disk and the `dev` ship checklist has not passed.

Explicit skill invokes win. A bugfix, review, deploy, docs, or E2E ask is not this skill.

**Slug and resume:** An existing `docs/prd/` or `docs/design/` file that covers the same entity
and screen is this feature — reuse its slug. Otherwise pick a kebab-case slug that neither folder
already uses. Inspect each existing artifact against its completion criterion before deciding
whether to skip or resume its owner. If complete, pass its path to the next principal and do not
spawn its owner again. If incomplete, resume with that owner, preserve existing content, and fill
the gaps; do not replace the file wholesale. For an ADR, reuse an existing decision that covers
the same trade-off; otherwise choose the next free `docs/adr/NNNN-*.md` path.

## Workflow

### 1. Codebase pass

Before exploring, confirm this client can spawn named principals and receive their results. If it
cannot, tell the user which capability is missing and stop before writing the packet or product
code. Do not impersonate a principal in the parent context. Use the current client's delegation
tool and argument schema; see [client compatibility](../../docs/agents/client-compatibility.md).

Explore once (`medium`). Read `CONTEXT.md`, nearby ADRs, `docs/agents/language.md`, the
nearest existing list/form/CRUD when present, and the entity named in the prompt (schema, routes,
who may mutate). If no analogous surface exists, record that and use the closest relevant code
instead. If a feature-map area covers the surface, use its file for behavior and inspect only
missing schema, route, or authorization facts; do not repeat the surface walk.

Fill an [inference brief](inference-brief.md) in the parent context. Do not write a brief
file. Do not start the PRD interview.

**Feature map:** Read `docs/agents/feature-map.md` when it exists. An area is a markdown link in
the index to a sibling `*.md`. A pointer that says `Status: declined` → say nothing about the map
and explore as usual. No pointer, or no area links → say once, in the user's language, that the
repo has no feature map, this session explores as usual, and `/build-feature-map` lets later
sessions open one file instead. Then explore as usual. Do not stop the packet. When area links
exist, read the repo `SKILL.md` at `Skill` and open the one area file it names for this screen.
Put that file's user path and gotchas on the inference brief. Do not repeat the surface walk. Do not
run `/build-feature-map` on this turn.

**Completion criterion:** Delegation capability is confirmed. The brief is filled; each inferred
fact cites a repo fact; blocking forks are listed or explicitly none. When a feature map has areas,
the brief cites the one area file. When it has none and is not declined, the one-line suggestion was
said once.

### 2. Ask gate

Follow the ask gate in [inference-brief.md](inference-brief.md). Do not run
`skills/reqs/prd-interview.md`. Do not grill one question per turn.

**Completion criterion:** If there are no blocking forks, the parent states the assumptions and
continues. Otherwise, the parent sends one batched ask with up to three decisions and stops. Resume
only after the user answers; if any decision remains unanswered, keep it open and stop again before
dependent work.

### 3. PRD — spawn `pm`

If `docs/prd/<slug>.md` exists, verify it against the completion criterion. Skip only when it passes;
otherwise resume with `pm` (see **Slug and resume**).

Spawn **`pm`** with the brief and the expected output path. The agent reads the `reqs` skill at
`skills/reqs/SKILL.md` in the kit checkout (or the active client's installed skill path) and follows
**Codebase-first** only: lean PRD at `docs/prd/<slug>.md`, no publish, no interview.
Use the brief as the codebase pass; inspect only gaps needed to write or complete the PRD, and do not
repeat the parent's broad exploration. Parent does not draft the PRD in parallel.

**Completion criterion:** The parent confirms `docs/prd/<slug>.md` exists and contains a problem
statement, scope, and assumptions, with no unresolved `[NEEDS CLARIFICATION]`. If the PM surfaces a
new blocking fork, handle it through step 6 before continuing. If the file already existed, verify
its required sections before treating it as complete.

### 4. ADR — spawn `techlead` only if the test passes

Run `domain-modeling` to apply its three-part ADR test. Copying an existing CRUD screen fails the
test — skip the ADR and name which part failed.

When all three pass, spawn **`techlead`** with the decision, the brief, and the ADR path to create
or resume. This run includes `domain-modeling` (ADR + glossary lines the decision forces) and
`arch` for the seam. Reuse an existing ADR for the same trade-off or use the next free
`docs/adr/NNNN-*.md`. Do not widen product scope.

**Completion criterion:** ADR file exists and status is Accepted, or the packet states
which of the three tests failed.

### 5. UI spec — spawn `designer` when there is a screen

Skip when the feature has no screen. If `docs/design/<slug>.md` exists, verify it against the
completion criterion; skip only when it passes, otherwise resume with `designer`.

Before spawning `designer`, check the component-map source using client compatibility. Use repo
imports when they cover every required primitive, an already attached `/ui-kit`, or an installed
model-invoked catalog where the client allows it. If these sources cannot cover the map and `/ui-kit`
is missing or manual-only, ask the user to attach it through the active client's picker and stop
before component mapping. Resume this step after it is attached.

Spawn **`designer`** with the PRD path, the brief, and the expected output path. The agent reads
the `design` skill at `skills/design/SKILL.md` in the kit checkout or the active client's installed
skill path. Brief lock is already inferred — do not wait for a second confirm. Map `@polyms/ui-kit`
from the source confirmed above; do not invent the component map. Write `docs/design/<slug>.md`.

**Completion criterion:** The spec exists, names flows and four content states per screen, and
passes `skills/design/PREFLIGHT.md`; or the packet explicitly says there is no screen.

### 6. Check the packet, then implement or ask

Parent checks disk against every applicable completion criterion: PRD has its required sections;
ADR, when required, exists with Accepted status; UI spec, when required, passes
`skills/design/PREFLIGHT.md`. A principal's "done" line is not enough — see
[invocation.md](../../docs/agents/invocation.md) verification after delegation. Do not re-run the
explore.

A new `[NEEDS CLARIFICATION]` that surfaces in an artifact → state the blocking decision in one
batched ask and stop. Do not enter `dev`. Do not re-ask a fork the ask gate already closed. After
the answer, resume at the unfinished step.

Nothing blocking left → spawn `developer` and follow the `dev` skill through its ship
checklist in this same turn. The parent does not write the implementation in parallel. Do
not ask for permission to implement.

Use `→ /to-prd` only when the user asked to publish and there is no UI left to spec. Suggest
that and stop. Do not publish on your own. Never a menu of stages.

**Completion criterion:** The `dev` ship checklist passed, including the disk-gate exit code
recorded in that checklist. Otherwise the turn stopped on one blocking question the ask gate
left open and wrote no application code.
