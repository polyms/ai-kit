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

| User-invoked                                          | Model-invoked                                                 |
| ----------------------------------------------------- | ------------------------------------------------------------- |
| `/align`, `/setup`, `/craft`, `/to-issues`, `/triage` | `align-loop`, `domain-modeling`, `/pm`, `/dev`, `code-review` |

Orchestrators delegate: `/align` runs `align-loop` + `domain-modeling`; `/triage` runs `align-loop` + `domain-modeling` when grilling.

## Dependencies between skills

Express dependencies as **`/skill`-style prose** ("Run `align-loop`", "Use `domain-modeling`"), not deep `../other-skill/FILE.md` cross-references into another skill's body.

Shared reference inside a skill folder (templates, glossaries) is fine via sibling links. Cross-skill behavior reaches through **invoking** the model-invoked skill.

## Passive vs active domain work

Merely reading `CONTEXT.md` for vocabulary is a one-line habit — not `domain-modeling`.

Only the active discipline (challenge terms, probe edge cases, update `CONTEXT.md` inline, offer ADRs) is **`domain-modeling`**.

## Setup dependencies

See [ADR-0001](../adr/0001-skill-setup-dependencies.md) — hard vs soft dependency on `/setup` output.
