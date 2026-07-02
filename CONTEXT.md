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
Subagent file at `agents/<name>.md` — runs in isolated context for long tasks (large PRDs, multi-step refactors). Reads the matching skill, then executes.
_Avoid_: subagent, bot, assistant (when referring to `agents/*.md` files)

## Pipeline

**Pipeline**:
The stage chain that turns ideas into shipped code: `/align` → `/pm` → `/ux` → `/dev`. Each stage produces artifacts the next stage consumes.
_Avoid_: workflow, process, flow

**Setup**:
One-time repo configuration for the pipeline — issue tracker, domain docs layout, artifact paths. Invoke with `/setup`.
_Avoid_: bootstrap (when meaning repo config, not symlink install)

**Align**:
Align before you build — grill decisions, sharpen domain language, update `CONTEXT.md`. Invoke with `/align`.
_Avoid_: discovery, planning session

**PM**:
Turn ideas into engineering-ready specs — PRD, user stories, acceptance criteria. Invoke with `/pm`.
_Avoid_: product management (when meaning the `/pm` skill)

**UX**:
Design flows and UI specs from a PRD. Invoke with `/ux`. _(Planned.)_
_Avoid_: design, UI phase

**Dev**:
Ship production code from spec — TDD, debugging, review. Invoke with `/dev`.
_Avoid_: implementation, coding phase

**Handoff**:
Transfer between pipeline stages — summary plus `## Next Step` pointing to exactly one next skill.
_Avoid_: handover, transition

## Artifacts

**Artifact**:
Structured output one stage creates and the next stage consumes — PRD, ADR, glossary entry, user story.
_Avoid_: output, deliverable, document

**PRD**:
Product Requirements Document — full spec for engineering and design review. In ai-kit: published to GitHub Issues.
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

## Authoring

**Craft**:
User-invoked skill for writing and editing ai-kit skills. Authoring vocabulary (predictability, sprawl, context load, pruning) lives in `skills/craft/glossary.md` — not duplicated here.
_Avoid_: skill writing, meta-skill
