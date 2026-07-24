# Skill Invocation

How skills in ai-kit are reached — adapted from [Matt Pocock's `.agents/invocation.md`](https://github.com/mattpocock/skills/blob/main/.agents/invocation.md).

## User-invoked vs model-invoked

Every `skills/<name>/SKILL.md` is a skill. The axis that splits them is **invocation** — who can reach it:

| Mode              | Frontmatter                      | Who reaches it            | Description                                                                          |
| ----------------- | -------------------------------- | ------------------------- | ------------------------------------------------------------------------------------ |
| **User-invoked**  | `disable-model-invocation: true` | Human typing `/name` only | Human-facing one-liner + invoke hints (EN + VI). No trigger spam for auto-discovery. |
| **Model-invoked** | omit `disable-model-invocation`  | Model or human            | Model-facing: WHAT + WHEN triggers (EN + VI). Pays **context load** every turn.      |

Test for model-invocation: _could the model usefully reach for this autonomously, or must another skill invoke it?_

A user-invoked skill has no model-facing description — **no other skill can fire it**. User-invoked skills may invoke model-invoked skills; never another user-invoked skill.

## ai-kit examples

| User-invoked                                                                                                            | Model-invoked                                                           |
| ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `/align`, `/setup`, `/craft`, `/reqs`, `/to-prd`, `/to-issues`, `/triage`, `/design`, `/docs`, `/e2e`, `/arch-refactor` | `align-loop`, `domain-modeling`, `arch`, `dev`, `code-review`, `devops` |

Orchestrators delegate: `/align` runs `align-loop` + `domain-modeling` together (grill-with-docs pairing); `/triage` runs the same when grilling; `/arch-refactor` runs `align-loop` + `domain-modeling` + `arch` when deepening. `/design` is user-invoked — ask the user to run `/ui-kit` (external lib skill) before component mapping; `dev` uses `ui-kit` when implementing UI.

## Slash prefix

Two contexts — don't mix them:

| Context                                                                      | Form                    | Examples                                                       |
| ---------------------------------------------------------------------------- | ----------------------- | -------------------------------------------------------------- |
| **Invoke name** — pipeline, README Invoke column, handoffs, "Invoke with …"  | `/name` for every skill | `/reqs`, `/dev`, `/arch`, `/arch-refactor`, `/docs`, `/e2e`    |
| **Skill name** — agent delegation, model-invoked registry, "Run …" / "Use …" | `name` without slash    | `Run align-loop`, `Use arch`, reaches `dev`                    |
| **Agent name** — isolated subagent for deep work (org role, not skill twin)  | role id                 | `Use pm`, `Use designer`, `agents/pm.md`, `agents/techlead.md` |

**Handoffs** use `## Next Step` (singular) — prefer one `→ /skill`; at most two with when/why.
SSOT: CONTEXT.md **Handoff**. Agents follow the skill's handoff; do not invent 3+ option menus.

**Agents map to org roles**, not 1:1 skills. Skills stay playbooks; multiple skills per agent OK;
multiple agents may use one skill (e.g. `/devops` → `developer` + `techlead`). **Ownership table
(SSOT):** [AGENTS.md — Principal agents](../../AGENTS.md).

User-invoked skills only appear in the invoke-name column. Model-invoked skills appear in both (humans can still type
`/dev`; agents delegate to `dev`). Agent files live at `agents/<role>.md` with frontmatter `name: <role>` — no
`-agent` suffix.

## Subagent delegation

When the parent chat (or a principal agent) spawns an explore / Task / nested agent:

- **Do not duplicate work** — if you delegated a search or plan, wait for that result; do not re-run the same
  greps/reads in the parent context unless the child failed or returned a gap.
- **Explore thoroughness** — when spawning a codebase explore agent, set breadth explicitly: `quick` (single
  targeted lookup), `medium` (moderate fan-out), or `very thorough` (multiple locations / naming conventions).
  Prefer `quick`/`medium` unless the question truly needs broad sweeps.
- **Resume before re-spawn** — if a matching agent already ran (or is still running) for the same question,
  continue that thread instead of launching a duplicate.

Agent `description` frontmatter should include **negative triggers** (`Do NOT use for…`) so the parent does
not mis-route. Keep agent bodies **lean**: role + router + constraints + “read the skill”; put workflows in
`skills/*/SKILL.md`, not in `agents/*.md`.

## Dependencies between skills

Express dependencies as skill-name prose ("Run `align-loop`", "Use `domain-modeling`"), not deep `../other-skill/FILE.md` cross-references into another skill's body.

Shared reference inside a skill folder (templates, glossaries) is fine via sibling links. Cross-skill behavior reaches through **invoking** the model-invoked skill.

## Passive vs active domain work

Merely reading `CONTEXT.md` for vocabulary is a one-line habit — not `domain-modeling`.

Only the active discipline (challenge terms, probe edge cases, update `CONTEXT.md` inline, offer ADRs) is **`domain-modeling`**.

## Setup dependencies

See [ADR-0001](../adr/0001-skill-setup-dependencies.md) — hard vs soft dependency on `/setup` output.
