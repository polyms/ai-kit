# ai-kit

Polyms agent skills for real engineering — align, spec, ship. Shared vocabulary for the kit's pipeline, skills, and artifacts.

## Kit

**ai-kit**:
The version-controlled skill library for agentic fullstack development at Polyms — skills, agents, and bootstrap tooling linked globally across projects.
_Avoid_: ai kit, toolkit, prompt library

**Bootstrap**:
The one-time symlink step (`bootstrap.sh`) that links ai-kit skills and agents into local AI tool directories.
_Avoid_: install, setup script (when meaning bootstrap specifically)

## Invocation

**Invoke**:
How a skill is triggered — slash command or autonomous model discovery via `description`.
_Avoid_: trigger, fire, activate

**User-invoked**:
Human types `/name` (e.g. `/align`, `/craft`). Skill has `disable-model-invocation: true`; agent does not auto-fire.
_Avoid_: manual, human-only skill

**Model-invoked**:
Agent reaches the skill via `description` (e.g. `align-loop`, `domain-modeling`, `pm`). No `disable-model-invocation` flag.
_Avoid_: auto, automatic, agent-discovered

## Skills & Agents

**Skill**:
Workflow file at `skills/<name>/SKILL.md` — the agent reads and follows it in the same chat when you invoke `/pm`, `/dev`, etc.
_Avoid_: prompt, instruction, rule

**Agent**:
Subagent file at `agents/<name>-agent.md` — runs in isolated context for long tasks (large PRDs, multi-step refactors). Reads the matching skill, then executes. Suffix `-agent` distinguishes from the skill (`pm` skill vs `pm-agent`).
_Avoid_: subagent, bot, assistant (when referring to `agents/*-agent.md` files)

## Pipeline

**Pipeline**:
The stage chain that turns ideas into shipped code: `/align` → `/pm` or `/to-prd` → `/to-issues` → `/ux` → `/dev` → `/code-review`; raw issues via `/triage`. Each stage produces artifacts the next stage consumes.
_Avoid_: workflow, process, flow

**Setup**:
One-time repo configuration for the pipeline — issue tracker, domain docs layout, artifact paths. Invoke with `/setup`.
_Avoid_: bootstrap (when meaning repo config, not symlink install)

**Align**:
Align before you build — grill decisions, sharpen domain language, update `CONTEXT.md`. Invoke with `/align`.
_Avoid_: discovery, planning session

**PM**:
Turn ideas into engineering-ready specs — PRD, user stories, acceptance criteria. Invoke with `/pm`. May interview; uses full enterprise PRD template.
_Avoid_: product management (when meaning the `/pm` skill)

**To PRD**:
Synthesize the current conversation into a lean PRD and publish to the issue tracker — no interview. Invoke with `/to-prd`.
_Avoid_: publish PRD (generic), write PRD (when meaning `/pm` discovery workflow)

**UX**:
Design flows and UI specs from a PRD. Invoke with `/ux`. _(Planned.)_
_Avoid_: design, UI phase

**Dev**:
Ship production code from spec — TDD, debugging. Pre-merge review via `code-review`. Invoke with `/dev`.
_Avoid_: implementation, coding phase

**Code review**:
Two-axis review skill (Standards + Spec) since a pinned git fixed point — parallel sub-agents, side-by-side findings. Model-invoked; auto-fires on "review PR", "review diff", "rà soát code". Invoke with `/code-review`.
_Avoid_: PR review (generic), lint check

**Handoff**:
Transfer between pipeline stages — summary plus `## Next Step` pointing to exactly one next skill.
_Avoid_: handover, transition

**Triage**:
Move raw GitHub issues through a state machine — categorise, verify, grill, write agent briefs. Invoke with `/triage`.
_Avoid_: backlog grooming (when meaning the triage skill specifically)

**To Issues**:
Break an approved PRD or plan into vertical-slice GitHub issues. Invoke with `/to-issues`.
_Avoid_: issue splitting (generic)

**Arch**:
Model-invoked vocabulary skill for designing deep modules — other skills reach it when placing seams or deepening interfaces. Full glossary in `skills/arch/SKILL.md`.
_Avoid_: codebase design (generic), architecture patterns (when meaning the `arch` skill)

**Arch refactor**:
Maintenance scan for deepening opportunities — HTML report, then grill chosen candidate. Invoke with `/arch-refactor`.
_Avoid_: architecture review (generic), refactor (when meaning `/dev`)

## Artifacts

**Artifact**:
Structured output one stage creates and the next stage consumes — PRD, ADR, glossary entry, user story.
_Avoid_: output, deliverable, document

**PRD**:
Product Requirements Document — full spec for engineering and design review. In ai-kit: published to the issue tracker (often a `PRD: <feature>` issue).
_Avoid_: spec, requirements doc

**ADR**:
Architecture Decision Record — a hard-to-reverse decision that needs context to understand. Stored in `docs/adr/`.
_Avoid_: decision doc, RFC

**Glossary**:
Canonical domain vocabulary for the repo. Lives in `CONTEXT.md` — glossary only, no specs.
_Avoid_: CONTEXT, domain doc

**CONTEXT.md**:
Root glossary file — single source of truth for domain terms. Updated inline when terms resolve during `/align` or `domain-modeling`.
_Avoid_: context file, domain model file

**Domain modeling**:
Model-invoked skill that sharpens the domain model — challenge terms, probe edge cases, update `CONTEXT.md` inline, offer ADRs when warranted.
_Avoid_: domain design, terminology session

## Triage

**Triage role**:
A canonical label role in the triage state machine — either a **state** (`needs-triage`, `ready-for-agent`, …) or **category** (`bug`, `enhancement`). Mapped to tracker label strings in `docs/agents/triage-labels.md`.
_Avoid_: label, tag (when meaning triage roles specifically)

**Agent brief**:
Structured comment on a `ready-for-agent` issue or PR — the AFK contract `/dev` works from. Original issue body is context; the brief is authoritative.
_Avoid_: spec comment, triage notes

**ready-for-agent**:
Triage state role — issue fully specified with an agent brief attached; pick up with `/dev`.
_Avoid_: AFK-ready, agent-ready

## Authoring

**Craft**:
User-invoked skill for writing and editing ai-kit skills. Authoring vocabulary (predictability, sprawl, context load, pruning) lives in `skills/craft/glossary.md` — not duplicated here.
_Avoid_: skill writing, meta-skill

**Hard setup dependency**:
Skill that requires `docs/agents/*.md` from `/setup` — output is wrong without it (e.g. `/to-prd`, `/to-issues`, `/triage`). See ADR-0001.
_Avoid_: must run setup (when meaning hard dependency only)

**Soft setup dependency**:
Skill that reads `CONTEXT.md` / ADRs when present but works without them (e.g. `/dev`, `/pm`).
_Avoid_: optional context
