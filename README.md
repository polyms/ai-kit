# ai-kit

**Polyms** agent skills for **real engineering** — not vibe coding.

Agents and skills for agentic fullstack development: from product requirements to design specs to shipping production code. One version-controlled kit, linked globally across projects.

Cursor-first today, tool-agnostic by design.

**Kit site:** [ai-kit.polyms.dev](https://ai-kit.polyms.dev) — browse skills, copy sample prompts, quick start. Source in `apps/landing/`.

## Real engineering

Inspired by [Matt Pocock's skills](https://github.com/mattpocock/skills) — built for work you ship, not demos you discard.

| Principle                  | What it means in `ai-kit`                                                                                             |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Align before you build** | `/align` closes the communication gap — grill decisions before `/reqs` or `/to-prd`                                   |
| **Small and composable**   | Short-named skills (`/reqs`, `/design`, `/dev`) you combine per task — no heavyweight process that takes away control |
| **Feedback loops**         | `/dev` encodes TDD, types, and debugging discipline — agents need fast signal, not blind codegen                      |
| **Design every day**       | Specs name modules and seams; code skills resist the ball of mud agents accelerate                                    |
| **Hack and own them**      | Fork, adapt, commit back — skills are yours, not black-box prompts                                                    |

Heavy frameworks that own the whole process can hide bugs in the process itself. These skills stay **small, explicit, and composable** — you stay in control.

## Vision

`ai-kit` is the shared brain for **agentic fullstack dev** at Polyms. Each capability is a short-named skill or agent you invoke with a slash command:

```
/setup         → configure repo for ai-kit pipeline (run once)
/align         → align before you build (grill + domain language)
/reqs            → discovery, enterprise PRD, stories (chat — does not publish)
/to-prd        → synthesize conversation into lean PRD, publish to GitHub
/to-issues     → break spec into vertical-slice GitHub issues
/triage        → move raw issues through triage state machine
/design        → UI spec from PRD at docs/design/ (maps to @polyms/core-ui)
/dev           → fullstack implementation, TDD, debugging
/code-review   → three-axis review (Standards + Spec + Simplify) before merge
/arch-refactor → scan codebase for deepening opportunities (maintenance)
```

`arch` (model-invoked) supplies architecture vocabulary. **`/core-ui`** skill ships with `@polyms/core-ui` (Tailwind CSS 4) — symlink from the lib repo; `/design` and `/dev` reach it for component API, not duplicated in ai-kit.

The goal: a coherent pipeline where PM artifacts hand off cleanly to design and engineering agents — without reinventing prompts every project.

## What's inside

| Type          | Path               | Purpose                                                      |
| ------------- | ------------------ | ------------------------------------------------------------ |
| **Skills**    | `skills/<name>/`   | Workflows, templates, and checklists (`/reqs`, `/design`, …) |
| **Agents**    | `agents/<role>.md` | Principal subagents for org roles (not 1:1 skills)           |
| **Bootstrap** | `bootstrap.sh`     | Symlink into local AI tool directories                       |

### Catalog

| Invoke           | Name                                                                                                         | Status        | Domain                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------ | ------------- | ------------------------------------------------------------------- |
| `/setup`         | [`setup`](skills/setup/)                                                                                     | **Available** | Repo config — issue tracker, domain docs, pipeline                  |
| `/align`         | [`align`](skills/align/) + [`align-loop`](skills/align-loop/) + [`domain-modeling`](skills/domain-modeling/) | **Available** | Alignment (user + auto-discovery), domain language, CONTEXT.md      |
| `/reqs`          | [`reqs`](skills/reqs/)                                                                                       | **Available** | Discovery, enterprise PRD, stories (user-invoked; does not publish) |
| `/to-prd`        | [`to-prd`](skills/to-prd/)                                                                                   | **Available** | Lean PRD from chat → publish to GitHub Issues (user-invoked)        |
| `/to-issues`     | [`to-issues`](skills/to-issues/)                                                                             | **Available** | Break PRD/plan into vertical-slice GitHub issues                    |
| `/triage`        | [`triage`](skills/triage/)                                                                                   | **Available** | Triage backlog — verify, grill, agent briefs, `ready-for-agent`     |
| `/design`        | [`design`](skills/design/)                                                                                   | **Available** | UI spec from PRD — flows, screens, core-ui component map, a11y      |
| `/dev`           | [`dev`](skills/dev/)                                                                                         | **Available** | Fullstack — TDD, solution ladder, scope self-check, debugging       |
| `/code-review`   | [`code-review`](skills/code-review/)                                                                         | **Available** | Three-axis review — 🔴/🟡/💭 severity tags, parallel axes           |
| `/docs`          | [`docs`](skills/docs/)                                                                                       | **Available** | Developer docs — API ref, tutorials (`techlead`)                    |
| `/e2e`           | [`e2e`](skills/e2e/)                                                                                         | **Available** | E2E automation — flake/CI (`tester`)                                |
| `/devops`        | [`devops`](skills/devops/)                                                                                   | **Available** | Deploy/CI incidents — Knowledge retrieval + SEV/post-mortem         |
| `/craft`         | [`craft`](skills/craft/)                                                                                     | **Available** | Authoring and editing skills — predictability, pruning              |
| `/arch-refactor` | [`arch-refactor`](skills/arch-refactor/)                                                                     | **Available** | Architecture maintenance — scan, HTML report, deepen candidates     |
| `/arch`          | [`arch`](skills/arch/)                                                                                       | **Available** | Architecture vocabulary — deep modules, seams (model-invoked)       |

Principal agents (`pm`, `designer`, `developer`, `tester`, `techlead`) map to **org roles** — multiple
skills per agent OK. Use `/craft` when writing or editing any skill.

**Descriptions:** WHAT in English; invoke triggers in **English + Vietnamese** — bilingual recall for you, auto-discovery
for model-invoked skills (`align-loop`, `domain-modeling`, `arch`, `dev`, `code-review`, `devops`).

## Quick start

```bash
git clone git@github.com:polyms/ai-kit.git ~/src/ai-kit
cd ~/src/ai-kit
pnpm bootstrap
```

`bootstrap.sh` symlinks this repo into:

| Tool            | Agents                          | Skills                                  |
| --------------- | ------------------------------- | --------------------------------------- |
| **Cursor**      | `~/.cursor/agents` (dir → repo) | `~/.cursor/skills` (dir → repo)         |
| **Claude Code** | `~/.claude/agents` (per-file)   | `~/.claude/skills` (per-skill symlinks) |

Restart your editor or start a new chat session after bootstrap.

### Manual setup

```bash
ln -sfn ~/src/ai-kit/skills/reqs ~/.cursor/skills/reqs
ln -sfn ~/src/ai-kit/agents/pm.md ~/.cursor/agents/pm.md
ln -sfn ~/src/ai-kit/agents/designer.md ~/.cursor/agents/designer.md
ln -sfn ~/src/ai-kit/agents/developer.md ~/.cursor/agents/developer.md
ln -sfn ~/src/ai-kit/agents/tester.md ~/.cursor/agents/tester.md
ln -sfn ~/src/ai-kit/agents/techlead.md ~/.cursor/agents/techlead.md
# Claude Code (if ~/.claude/agents exists):
ln -sfn ~/src/ai-kit/agents/pm.md ~/.claude/agents/pm.md
# …same pattern for designer, developer, tester, techlead
```

## Usage

### `/reqs` — Requirements

**Skill** (user-invoked — discovery + enterprise PRD in chat; does **not** publish):

```
/reqs

Write an enterprise PRD for [feature].
Users: [who]. Success metric: [what]. Deadline: [when].
```

Includes:

- Discovery, PRD, user story, prioritization, and refinement workflows
- [Enterprise PRD template](skills/reqs/enterprise-prd-template.md)
- [User story guide](skills/reqs/user-story-guide.md) (INVEST, Gherkin AC, DoR/DoD)

After `/align`, to synthesize and **publish** a lean PRD, invoke `/to-prd` — not `/reqs`.

**Agent** (optional — isolated context for long PM sessions):

```
Use the pm to write a PRD for [feature]
```

### `/to-prd` — Synthesize & Publish PRD

When the conversation is aligned and you want the PRD on GitHub — no interview:

```
/to-prd

Chốt PRD từ cuộc chat này — publish lên GitHub.
```

Synthesizes from current conversation + codebase context using
[lean-prd-template.md](skills/to-prd/lean-prd-template.md) (not `/reqs`'s enterprise template). Sketches test
seams (user confirms), publishes via `gh issue create` with mapped `ready-for-agent` label from
`triage-labels.md`. Hands off to `/to-issues`.

### `/setup` — One-Time Repo Configuration

Run once per repo before other skills:

```
/setup
```

Configures issue tracker (GitHub/GitLab/local), domain docs layout (`CONTEXT.md`, ADRs), triage label mapping, and pipeline artifact paths.

### `/align` — Align Before You Build

Clarify plans and sharpen domain language before specs or code:

```
/align

Grill kế hoạch [feature] — một câu một lần, chọn A/B/C/D.
```

`/align` (user-invoked) runs **align-loop** + **domain-modeling** together (Matt `grill-with-docs` pairing): design tree, **one question**, **lettered options** (2–4 real forks) with **(Recommended)**, codebase explored before asking when possible, `CONTEXT.md` updated inline. Hands off to `/reqs`, `/to-prd`, `/design`, or `/dev`.

### `/design` — UI Spec from PRD

Turn a PRD or feature brief into an engineering-ready design spec at `docs/design/<feature>.md`, mapped to **`@polyms/core-ui`**:

```
/design

Thiết kế màn hình từ PRD #42 — spec giao diện.
```

Flows, screen inventory (four states each), **§4 CSS intent**, **§8 visual acceptance**, component map. [`/dev` runs visual-ship](skills/dev/visual-ship.md) before UI is done. See [QUALITY-BAR.md](skills/design/QUALITY-BAR.md). User invokes **`/core-ui`** when mapping primitives. Pre-flight via [PREFLIGHT.md](skills/design/PREFLIGHT.md). Hands off to `/dev`. See [design-spec-template.md](skills/design/design-spec-template.md).

**Agent** (optional — isolated context for long design sessions):

```
Use the designer to spec UI from PRD #42
```

**External:** Install `@polyms/core-ui` and symlink its `/core-ui` skill (bootstrap or `npx skills add` from the core-ui repo).

### `/dev` — Fullstack Implementation

```
/dev

Implement [feature] from PRD at docs/prd/feature-x.md
```

TDD vertical slices, **solution ladder** before red-green, **scope self-check** before
declaring done, **status report** on multi-slice sessions, disciplined debugging. Stack
defaults: **TanStack Router** (**TanStack Start** if SSR), **Zustand** for client state. UI
from design spec: [visual-ship.md](skills/dev/visual-ship.md) (evidence log required). See
[tdd-guide.md](skills/dev/tdd-guide.md), [solution-ladder.md](skills/dev/solution-ladder.md),
[scope-self-check.md](skills/dev/scope-self-check.md), [status-report.md](skills/dev/status-report.md),
[debug-loop.md](skills/dev/debug-loop.md), and [stack-defaults.md](skills/dev/stack-defaults.md).

Pipeline walkthrough: [examples/pipeline-feature-walkthrough.md](examples/pipeline-feature-walkthrough.md).

### `/code-review` — Three-Axis Code Review

Review branch or PR work since a pinned git fixed point — Standards, Spec, and Simplify in parallel:

```
/code-review

Review diff since main.
Rà soát code trên branch này so với main.
```

Fetches spec from issue refs in commits (`gh issue view`), `docs/design/`, user paths, or
`docs/` / `.scratch/`. Reports findings under separate `## Standards`, `## Spec`, and
`## Simplify` headings — each finding tagged 🔴 blocker / 🟡 suggestion / 💭 nit. Model-invoked
— also auto-fires on "review PR", "review diff", "xem diff", "over-engineered", "cắt bớt". See
[standards-baseline.md](skills/code-review/standards-baseline.md) and
[simplify-baseline.md](skills/code-review/simplify-baseline.md).

_Future:_ dedicated `prd-view` skill for presenting PRDs from issues — not in scope yet; Spec axis uses `gh` + paths for now.

### `/docs` — Technical Writing

Developer-facing docs for shipped surfaces — API/MCP/CLI reference, tutorials, migrations.
Not PRDs (`/reqs`), not feature code (`/dev`). Long sessions: `techlead`.

```
/docs

Write a tutorial: connect Cursor to kit MCP and search Knowledge intent: incident.
```

See [SKILL.md](skills/docs/SKILL.md).

### `/e2e` — Test Automation

Playwright (or repo harness) flake elimination, CI sharding, journey coverage, traces. Skill
id **`e2e`**; principal agent **`tester`**. Not seam TDD (`/dev`); not deploy Knowledge
(`/devops`).

```
/e2e

Stabilize flaky Playwright checkout journey — signal waits, quarantine with owner.
```

See [SKILL.md](skills/e2e/SKILL.md).

### `/devops` — Deploy, CI & Infra

Symptom → cause → fix → verify via Knowledge MCP (`intent: incident`). After green verify:
classify, status updates, and SEV1/SEV2 post-mortem via
[incident-templates.md](skills/devops/incident-templates.md).

```
/devops

Vercel build failed — No Output Directory named dist.
```

See [SKILL.md](skills/devops/SKILL.md) and [runbooks.md](docs/agents/runbooks.md).

### `/to-issues` — Spec to GitHub Issues

Break an approved PRD or plan into independently-grabbable vertical-slice issues:

```
/to-issues

Bẻ PRD #42 thành issues — vertical slices, publish lên GitHub.
```

After `/reqs` or `/to-prd` produces a PRD or user stories, `/to-issues` drafts tracer-bullet slices, quizzes you on granularity and dependencies, then publishes to GitHub via `gh` with the `ready-for-agent` label when triage labels are configured. Hands off to `/dev` for the first unblocked slice. See [issue-template.md](skills/to-issues/issue-template.md).

### `/triage` — Issue Backlog Triage

Move raw GitHub issues (and optional external PRs) through a triage state machine:

```
/triage

Show me what needs attention.
Phân loại issue #42 — verify và viết agent brief.
```

Categorises (`bug` / `enhancement`), verifies claims, grills via `align-loop` + `domain-modeling` when needed, writes agent briefs, manages `.out-of-scope/`. Issues reaching `ready-for-agent` hand off to `/dev`. Complements `/to-issues` — triage processes inbound backlog; `/to-issues` creates slices from specs. See [agent-brief.md](skills/triage/agent-brief.md) and [triage-labels.md](docs/agents/triage-labels.md).

### `/craft` — Writing Great Skills

Matt Pocock's [`writing-great-skills`](https://github.com/mattpocock/skills/tree/main/skills/productivity/writing-great-skills), adapted for ai-kit:

```
/craft

Review skills/reqs/SKILL.md for sprawl and no-ops.
```

Covers predictability, invocation, information hierarchy, leading words, and pruning. See [glossary.md](skills/craft/glossary.md).

### `/arch-refactor` — Architecture Maintenance

Scan the codebase for deepening opportunities — shallow modules, seam leakage, poor test surfaces:

```
/arch-refactor

Rà soát kiến trúc — tìm chỗ deepen module.
```

Explores organically, writes a visual HTML report to the OS temp directory (Tailwind + Mermaid), then grills your chosen candidate via `align-loop` + `domain-modeling`. Uses **`arch`** vocabulary throughout. Hands off to `/dev` when the design is resolved. Maintenance skill — outside the daily ship pipeline.

### `/arch` — Architecture Vocabulary

Model-invoked vocabulary for deep modules — seam, depth, leverage, locality, design-it-twice. Skills `dev` and `/arch-refactor` reach for it when placing seams or deepening interfaces. See [SKILL.md](skills/arch/SKILL.md), [DEEPENING.md](skills/arch/DEEPENING.md), [DESIGN-IT-TWICE.md](skills/arch/DESIGN-IT-TWICE.md).

## Repository structure

```
ai-kit/
├── README.md
├── LICENSE
├── bootstrap.sh
├── examples/
│   ├── README.md
│   └── pipeline-feature-walkthrough.md
├── agents/
│   ├── designer.md
│   ├── developer.md
│   ├── pm.md
│   ├── techlead.md
│   └── tester.md
└── skills/
    ├── align/
    │   └── SKILL.md
    ├── align-loop/
    │   └── SKILL.md
    ├── arch/
    │   ├── SKILL.md
    │   ├── DEEPENING.md
    │   └── DESIGN-IT-TWICE.md
    ├── arch-refactor/
    │   ├── SKILL.md
    │   └── HTML-REPORT.md
    ├── craft/
    │   ├── SKILL.md
    │   └── glossary.md
    ├── code-review/
    │   ├── SKILL.md
    │   ├── standards-baseline.md
    │   └── simplify-baseline.md
    ├── docs/
    │   └── SKILL.md
    ├── domain-modeling/
    │   └── SKILL.md
    ├── devops/
    │   ├── SKILL.md
    │   └── incident-templates.md
    ├── e2e/
    │   └── SKILL.md
    ├── dev/
    │   ├── SKILL.md
    │   ├── visual-ship.md
    │   ├── stack-defaults.md
    │   ├── tdd-guide.md
    │   ├── solution-ladder.md
    │   ├── scope-self-check.md
    │   ├── status-report.md
    │   └── debug-loop.md
    ├── design/
    │   ├── SKILL.md
    │   ├── QUALITY-BAR.md
    │   ├── CSS-INTENT.md
    │   ├── VISUAL-ACCEPTANCE.md
    │   ├── ANTI-SLOP.md
    │   ├── BRIEF-INFERENCE.md
    │   ├── design-spec-template.md
    │   ├── PREFLIGHT.md
    │   └── REDESIGN.md
    ├── reqs/
    │   ├── SKILL.md
    │   ├── enterprise-prd-template.md
    │   └── user-story-guide.md
    ├── to-prd/
    │   ├── SKILL.md
    │   └── lean-prd-template.md
    ├── to-issues/
    │   ├── SKILL.md
    │   └── issue-template.md
    ├── triage/
    │   ├── SKILL.md
    │   ├── agent-brief.md
    │   └── out-of-scope.md
    └── setup/
        ├── SKILL.md
        ├── adr-format.md
        ├── context-format.md
        ├── domain.md
        ├── issue-tracker-github.md
        ├── issue-tracker-gitlab.md
        ├── issue-tracker-local.md
        └── triage-labels.md
```

`docs/agents/` (per-repo, written by `/setup`):

```
docs/agents/
├── issue-tracker.md
├── domain.md
└── triage-labels.md
```

## Adding skills and agents

Run `/craft` before authoring or editing skills. Then:

1. Create `skills/<name>/SKILL.md` with frontmatter `name` and `description`
2. Optionally add `agents/<role>.md` for isolated deep work (org role — not 1:1 with the skill)
3. Keep skill names **short** — lowercase, 2–4 chars when possible (`reqs`, `design`, `dev`)
4. Commit and push; `git pull` on other machines is enough when using directory symlinks

### Conventions

| Rule                               | Example                                              |
| ---------------------------------- | ---------------------------------------------------- |
| Short invoke name                  | `/reqs`, not `/product-management`                   |
| Skill folder = skill name          | `skills/reqs/SKILL.md` → `name: reqs`                |
| Agent file = org role              | `agents/pm.md` → `name: pm` (no `-agent` suffix)     |
| Description includes trigger terms | `/reqs`, user stories, ưu tiên backlog (EN + VI)     |
| Bilingual triggers                 | English WHAT + EN/VI WHEN in every description       |
| Templates in separate files        | `enterprise-prd-template.md`, linked from `SKILL.md` |
| No built-in tool skills            | Do not copy Cursor `skills-cursor/` content          |
| Invocation rules                   | `docs/agents/invocation.md`, ADR-0001                |
| Cursor rule when editing skills    | `.cursor/rules/skill-invocation.mdc`                 |

## Agentic fullstack pipeline

```
Idea → /align → /reqs or /to-prd → /to-issues → /design → /dev → /code-review → ship
Raw issues → /triage → ready-for-agent → /dev → /code-review
```

Run `/setup` once per repo first (includes triage label mapping).

Each stage produces artifacts the next agent can consume. `/reqs` drafts enterprise PRD/stories in chat;
`/to-prd` publishes a lean PRD to the tracker; `/to-issues` publishes vertical-slice GitHub issues; `/triage`
processes inbound backlog into `ready-for-agent` issues with agent briefs; `/design` adds `docs/design/` specs
mapped to `@polyms/core-ui`; Dev implements against briefs and design specs (`dev` uses `core-ui` for UI
code); `/code-review` gates merge on Standards + Spec + Simplify before ship.

## Daily workflow

```
1. Edit skills or agents in ~/src/ai-kit
2. git commit && git push
3. Other machines: git pull (symlinks stay pointed at the repo)
```

## Roadmap

- [x] `/setup` — repo configuration for ai-kit pipeline
- [x] `/align` + `align-loop` + `domain-modeling` — alignment and domain docs with auto-discovery (EN/VI)
- [x] `/reqs` — discovery, enterprise PRD, user stories (user-invoked; does not publish)
- [x] `/to-prd` — synthesize conversation into lean PRD, publish to GitHub (from Matt's to-prd)
- [x] `/to-issues` — break spec into vertical-slice GitHub issues (from Matt's to-issues)
- [x] `/triage` — issue backlog triage, agent briefs, `ready-for-agent` (from Matt's triage)
- [x] `/dev` — fullstack implementation, TDD, solution ladder, scope self-check, status report
- [x] `/code-review` — three-axis review (Standards + Spec + Simplify), 🔴/🟡/💭 tags
- [x] `/docs` — developer-facing docs (`techlead`)
- [x] `/e2e` — E2E automation (`tester`)
- [x] `/devops` — Knowledge incident workflow + SEV/post-mortem templates
- [x] `/craft` — writing and editing skills (from Matt's writing-great-skills)
- [x] `/arch-refactor` + `arch` — architecture maintenance and vocabulary (from Matt's improve-codebase-architecture + codebase-design)
- [x] `/design` — UI spec from PRD at `docs/design/`, `@polyms/core-ui` + `/core-ui` boundary
- [x] `examples/` — pipeline feature walkthrough for onboarding
- [ ] Frontmatter validation script
- [ ] Claude agent support

## License

[MIT](LICENSE) — Copyright (c) 2026 [Polyms](https://github.com/polyms)
