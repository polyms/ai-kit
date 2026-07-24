# ADR-0001: Explicit `/setup` pointer only for hard dependencies

## Status

Accepted

## Context

Engineering skills depend on per-repo config (issue tracker, triage label vocabulary, domain doc layout) seeded by `/setup`. Some skills cannot function without that config — they publish to a specific tracker or apply specific label strings. Others only use domain docs to sharpen output and degrade gracefully without them.

Adapted from [Matt Pocock ADR-0001](https://github.com/mattpocock/skills/blob/main/.agents/adr/0001-explicit-setup-pointer-only-for-hard-dependencies.md).

## Decision

Split skills into **hard-dependency** and **soft-dependency**:

### Hard dependency

Include an explicit prerequisite — run `/setup` if the required `docs/agents/*.md` file is missing. Without the mapping, output is **wrong**, not just fuzzy.

| Skill        | Requires                                                       |
| ------------ | -------------------------------------------------------------- |
| `/to-prd`    | `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md` |
| `/to-issues` | `docs/agents/issue-tracker.md`                                 |
| `/triage`    | `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md` |

When publishing issues, apply labels from `docs/agents/triage-labels.md` when that file exists.

### Soft dependency

Reference "the project's domain glossary" and "ADRs in the area you're touching" in prose only. If docs are absent, the skill still works; output is less sharp.

| Skill             | Soft use                                                                                                                                                                                 |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dev`             | Read `CONTEXT.md` + `docs/adr/` if present; Knowledge (`design`/`toolchain`/`incident`) + `stack-profile.md` when present                                                                |
| `code-review`     | Read `docs/agents/issue-tracker.md` if present for `gh` fetch                                                                                                                            |
| `align-loop`      | Same when exploring codebase                                                                                                                                                             |
| `domain-modeling` | Creates `CONTEXT.md` lazily when terms resolve; writes in `docs/agents/language.md` if present                                                                                           |
| `reqs`, `to-prd`  | Glossary vocabulary in specs when `CONTEXT.md` exists; writes in `docs/agents/language.md` if present (`/reqs` does not publish; `/to-prd` does)                                         |
| `design`          | `CONTEXT.md`; `docs/design/` output; user invokes `/ui-kit` before component map; writes in `docs/agents/language.md` if present                                                        |
| `devops`          | [knowledge.md](../agents/knowledge.md) (`intent: incident`) + MCP; `stack-profile.md` when present (from `/setup`)                                                                       |
| `docs`            | `docs/agents/language.md` when present; `CONTEXT.md` vocabulary only (no glossary expansion)                                                                                             |
| `e2e`             | Repo Playwright/Cypress + CI workflows as source of truth; no docs/agents gate                                                                                                           |
| `arch`            | `CONTEXT.md` + `docs/adr/` when designing module interfaces; Knowledge `intent: design` for stack seams; `stack-profile.md` when present; writes in `docs/agents/language.md` if present |
| `arch-refactor`   | Same; reaches `arch`, `align-loop`, `domain-modeling`                                                                                                                                    |

Do **not** cargo-cult the `/setup` pointer into soft-dependency skills. No `docs/agents/language.md`: match the language of whatever doc is being edited, or ask once if creating fresh.

## Consequences

- Hard-dependency skills stay token-light on setup prose — one prerequisite line, not repeated setup docs inline.
- Authors adding skills must classify hard vs soft before writing prerequisites.
- `/setup` remains the single place that writes `docs/agents/language.md`, `issue-tracker.md`, `domain.md`,
  `triage-labels.md`, `design.md`, and `stack-profile.md`. Opt-in chat persona (default off) writes
  `.cursor/rules/agent-voice.mdc` plus a Claude symlink under `.claude/rules/` — not a hard dependency for
  any skill.
