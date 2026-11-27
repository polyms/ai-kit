# ai-kit

**AI Kit is an AI Augmentation Layer for the AI tools you already use.**

It extends existing LLMs and AI clients with reusable skills, structured methodologies, domain knowledge,
templates, context contracts and composable workflow guidance. The **host AI** remains responsible for
reasoning, conversation, context, tool calls and authorized execution. AI Kit does not run a
server-side LLM or autonomous agent workflow engine.

For end users, this means better-supported research, requirements, decisions, planning, documentation
and QA inside compatible AI chat tools. For engineers, the same methodology supports repo-aware work
in coding assistants. Client capabilities and invocation methods vary.

Use native/local skill installation, MCP or the SDK to deliver the same version-controlled methodology.

**Kit site:** [ai-kit.polyms.dev](https://ai-kit.polyms.dev) — browse skills, copy sample prompts, quick start. Source in `apps/landing/`.

## Optional feedback

Have an idea or a problem with an AI Kit skill, workflow or template?
Simply tell your AI client what worked or what should change. AI Kit's
`prepare_feedback_issue` MCP tool creates a complete public GitHub Issue
**draft**. The AI shows it for review, then after your explicit approval
uses an independently connected GitHub `create_issue` action to publish
on your behalf. If no GitHub integration is available, you get a
**prefilled issue link**, not a blank form. No benchmarks or trace exports
required. See [AI-assisted feedback](docs/feedback.md).

## Product boundary

AI Kit **augments** host assistants; it does not replace them or take over user work.

| AI Kit supplies | The host AI/client owns |
| --- | --- |
| Skills, standards, templates and Knowledge | Model inference, reasoning and conversation |
| Context contracts and optional workflow recipes | Skill selection, context and orchestration |
| Memory Protocol guidance and reflection hints | Agent or business memory; authorized recall and capture |
| MCP, SDK and local skill delivery | Authenticated tools, actions, approvals and verification |

AI Kit's server may deliver skill content and Knowledge, but does **not** perform LLM inference for
end-user work. See [canonical product positioning](docs/product/positioning.md) before changing
architecture or product messaging. The [augmentation roadmap](docs/product/augmentation-roadmap.md)
records current and planned capabilities. AI Kit does not store or manage agent or business memory;
its shipped Memory Protocol guides effective use of existing memory sources. The roadmap links the
architecture, memory, Knowledge and quality strategies; these describe direction, not shipped features.

## Real engineering

Inspired by [Matt Pocock's skills](https://github.com/mattpocock/skills) — built for work you ship, not demos you discard.

| Principle                  | What it means in `ai-kit`                                                                                             |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Align before you build** | `/align` closes the communication gap — grill decisions before `/reqs`                                   |
| **Small and composable**   | Short-named skills (`/reqs`, `/design`, `/dev`) you combine per task — no heavyweight process that takes away control |
| **Feedback loops**         | `/dev` encodes TDD, types, and debugging discipline — agents need fast signal, not blind codegen                      |
| **Design every day**       | Specs name modules and seams; code skills resist the ball of mud agents accelerate                                    |
| **Hack and own them**      | Fork, adapt, commit back — skills are yours, not black-box prompts                                                    |

Heavy frameworks that own the whole process can hide bugs in the process itself. These skills stay **small, explicit, and composable** — you stay in control.

## Vision

`ai-kit` is Polyms' shared **augmentation methodology** for business operations and agentic fullstack development. In supported coding clients, capabilities may be explicitly invoked as short-named skills or delivered through host-specific discovery:

```
/setup         → configure repo for ai-kit pipeline (run once)
/align         → align before you build (grill + domain language)
/dev        → one feature prompt → PRD + ADR (if needed) + UI spec
/reqs            → discovery, enterprise PRD, stories (chat — does not publish)
/reqs        → synthesize conversation into lean PRD, publish to GitHub
/task     → break spec into vertical-slice GitHub issues
/track        → move raw issues through triage state machine
/design        → UI spec from PRD using the project's design system
/dev           → fullstack implementation, TDD, debugging
/code-review → three-axis review (Standards + Spec + Simplify) before merge
/arch → scan codebase for deepening opportunities (maintenance)
```

`arch` (model-invoked) supplies architecture vocabulary. **Polyms UI Kit** (`@polyms/ui-kit`) offers an **optional** component library and `/ui-kit` skill. AI Kit `/design` and `/dev` work with the existing project's chosen design system and do not require installing or invoking Polyms UI Kit.

The goal: a coherent pipeline where PM artifacts hand off cleanly to design and engineering agents — without reinventing prompts every project.

## What's inside

| Type          | Path               | Purpose                                                      |
| ------------- | ------------------ | ------------------------------------------------------------ |
| **Skills**    | `skills/<name>/`   | Workflows, templates, and checklists (`/reqs`, `/design`, …) |
| **Agents**    | `agents/<role>.md` | Principal subagents for org roles (not 1:1 skills)           |
| **Bootstrap** | `bootstrap.sh`     | Symlink into local AI tool directories                       |

### Catalog

21 canonical skills are available both as native skill entries and live MCP packs. Select the relevant workflow within each skill; actual execution depends on the host.

| Invoke | Scope |
| --- | --- |
| [`/align`](skills/align/) | Decision alignment, glossary and ADRs |
| [`/arch`](skills/arch/) | Architecture design and refactor assessment |
| [`/bug`](skills/bug/) | Evidence-based defect reports |
| [`/build-feature-map`](skills/build-feature-map/) | Project-owned behavior map authoring and maintenance |
| [`/business`](skills/business/) | Commercial and strategic decision analysis |
| [`/comms`](skills/comms/) | Stakeholder messages and ticket replies |
| [`/craft`](skills/craft/) | Skill methodology authoring and evaluation |
| [`/design`](skills/design/) | UI flows, component mapping and specifications |
| [`/dev`](skills/dev/) | Feature preparation, implementation, TDD and debugging |
| [`/devops`](skills/devops/) | Deploy, CI and infrastructure incidents |
| [`/docs`](skills/docs/) | Business and technical documentation |
| [`/plan`](skills/plan/) | Effort, dependencies, capacity and delivery planning |
| [`/qa`](skills/qa/) | Functional test design, verification and E2E automation |
| [`/release`](skills/release/) | Go-live readiness and rollback |
| [`/reqs`](skills/reqs/) | Discovery, BRD, enterprise/lean PRD and authorized publication |
| [`/research`](skills/research/) | Evidence-based research |
| [`/review`](skills/review/) | Evidence-based artifact critique and assumption challenge |
| [`/code-review`](skills/code-review/) | Standards, Spec and Simplify source-code review |
| [`/setup`](skills/setup/) | Canonical sources, operation routes and project execution policy |
| [`/task`](skills/task/) | Standard work items and dependency-ordered vertical slicing |
| [`/track`](skills/track/) | Inspect, update and triage issues/PRs |

Principal agents (`pm`, `designer`, `developer`, `tester`, `techlead`) map to **org roles** — multiple
skills per agent OK. Use `/craft` when writing or editing any skill.

**Descriptions:** WHAT in English; invoke triggers in **English + Vietnamese** — bilingual recall for you, auto-discovery
for model-invoked skills (`align`, `arch`, `dev`, `review`, `devops`, `qa`, `task`, `track`).

## Remote skill provider (MCP)

In addition to local installation, MCP-capable clients can connect to `https://ai-kit.polyms.dev/mcp`
with Streamable HTTP and OAuth. Discover available packs via `list_skill_packs` and load workflow,
templates and references using `get_skill_pack`. The server retrieves Markdown from GitHub main.

The live MCP exposes the same 21 canonical entries above. No checkout or native install is required to retrieve methodology. The published immutable SDK snapshot has its own release catalog; do not infer its contents from live MCP.

Use the catalog routing hints and `starterPaths` to choose and load the smallest relevant workflow;
fetch additional exact paths only when needed. `[]` returns the manifest only; omission retains full-pack
compatibility. See [skill intelligence](docs/agents/skill-intelligence.md) and the [composition protocol](docs/agents/skill-composition.md).
Five optional workflow recipes live in `workflows/`; use them only for relevant multi-skill requests.
The provider only loads skills; the client uses its authorized integrations to publish artifacts.
See [architecture and maintenance](docs/agents/mcp-skill-provider.md),
[work artifact standard](docs/agents/work-artifact-standard.md) and
[connection details](docs/agents/ops-cms-mcp.md).

## Quick start

```bash
git clone git@github.com:polyms/ai-kit.git ~/src/ai-kit
cd ~/src/ai-kit
pnpm bootstrap
```

`bootstrap.sh` installs this repo for Cursor, Claude Code, Codex, and GitHub Copilot.
Run `pnpm bootstrap codex` or `pnpm bootstrap copilot` to install only that client
(other targets: `cursor`, `claude`, `all`). Install dependencies with `pnpm install`
first; the Codex/Copilot installer uses Node.js and the repo's YAML parser.

| Tool            | Agents                                                   | Skills                                  |
| --------------- | -------------------------------------------------------- | --------------------------------------- |
| **Cursor**      | `~/.cursor/agents` (dir → repo)                          | `~/.cursor/skills` (dir → repo)         |
| **Claude Code** | `~/.claude/agents` (per-file)                            | `~/.claude/skills` (per-skill symlinks) |
| **Codex**       | `~/.codex/agents/*.toml` (generated role pointers)       | `~/.agents/skills` (per-skill symlinks) |
| **Copilot**     | `~/.copilot/agents/*.agent.md` (generated role pointers) | `~/.agents/skills` (shared with Codex)  |

Codex respects `CODEX_HOME` for its agent directory; user skills remain under
`~/.agents/skills`. Skill edits and agent body edits are read from this checkout.
Rerun bootstrap after adding skills/roles or changing role names/descriptions.
Existing Codex entries are backed up as `.bak`, `.bak.1`, etc. before replacement
under `~/.agents/ai-kit-backups/skills` and `$CODEX_HOME/ai-kit-backups/agents`
(`CODEX_HOME` defaults to `~/.codex`), outside skill/agent discovery folders.
Copilot role backups live under `~/.copilot/ai-kit-backups/agents`.
Unrelated entries are preserved. The installer does not change global MCP settings
or VS Code user settings. The `codex`/`copilot` targets do not modify Cursor/Claude installs.

Manual-only skills retain `disable-model-invocation: true` for Cursor/Claude/Copilot
and add `agents/openai.yaml` policy for Codex. Kit `/name` examples remain valid for
Cursor/Claude/Copilot; use `$name` or `/skills` in Codex CLI/IDE. See
[client compatibility](docs/agents/client-compatibility.md) for runtime adaptations.

In VS Code, select the **Copilot** harness and open **Chat: Open Customizations** to
check skills and the five principal agents. The Local harness has different personal
agent storage; use the Copilot harness for the native `~/.copilot/agents` installation.
Project instructions use the existing `AGENTS.md`. Reload the window or start a new
chat after installation. Discovery checks do not prove every workflow was exercised.

This repo's `.codex/config.toml` connects to the production Knowledge MCP server.
If OAuth is needed, run `codex mcp login aikit`. For local MCP development, start
`pnpm dev`, then optionally add `codex mcp add ai-kit-local --url http://localhost:6300/mcp`.
See [Ops CMS MCP](docs/agents/ops-cms-mcp.md) for endpoint and authentication details.
VS Code uses `.vscode/mcp.json` for this same server. Start `aikit` through
**MCP: List Servers** and complete OAuth if prompted; credentials are client-specific.

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

- Discovery interview (one question at a time), then a behavior pass for rules, failures, and data
- PRD, user story, prioritization, and refinement workflows; explicit business-facing BRDs use the
  [business requirements template](skills/reqs/business-requirements-template.md)
- [PRD interview](skills/reqs/prd-interview.md)
- [Enterprise PRD template](skills/reqs/enterprise-prd-template.md)
- [User story guide](skills/reqs/user-story-guide.md) (INVEST, Gherkin AC, DoR/DoD)

After `/align`, to synthesize and **publish** a lean PRD, invoke `/reqs` and request the lean publication workflow.

**Agent** (optional — isolated context for long PM sessions):

```
Use the pm to write a PRD for [feature]
```

### `/reqs` — Lean synthesis and authorized publication

When the conversation is aligned and you want the PRD on GitHub — no interview:

```
/reqs

Chốt PRD từ cuộc chat này — publish lên GitHub.
```

Synthesizes from current conversation + codebase context using
[lean-prd-template.md](skills/reqs/lean-prd-template.md) (not `/reqs`'s enterprise template). Sketches test
seams (user confirms), publishes via `gh issue create` with mapped `ready-for-agent` label from
`triage-labels.md`. Hands off to `/task`.

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

`/align` (when alignment is requested or materially needed) runs the decision-loop and domain-modeling references together (Matt `grill-with-docs` pairing): design tree, **one question**, **lettered options** (2–4 real forks) with **(Recommended)**, codebase explored before asking when possible, `CONTEXT.md` updated inline. Hands off to `/reqs`, `/design`, or `/dev`.

### `/dev` — Feature preparation branch

Model-invoked. A feature ask that names no skill — "build a CRUD user page", "làm trang user" —
runs a codebase pass, asks at most once when a blocking fork is still open, then spawns `pm`,
`techlead` (ADR only), and `designer`:

```
Build a CRUD user page.
```

Writes `docs/prd/<slug>.md` and, when there is a screen, `docs/design/<slug>.md`. ADR only when the
decision is hard to reverse. Does not publish. Follows `/dev` in that turn when nothing
blocking remains, and asks once when a fork is still open. Explicit `/reqs` or `/design` skips this and keeps that
skill's own flow.

### `/design` — UI Spec from PRD

Turn a PRD or feature brief into an engineering-ready design spec at `docs/design/<feature>.md`, mapped to **the project's existing design system** (or vendor-neutral component roles):

```
/design

Thiết kế màn hình từ PRD #42 — spec giao diện.
```

Flows, screen inventory (**four content states** each), **§4 CSS intent**, **§8 visual
acceptance**, **§11 anti-slop appendix**, component map. Audit-only branch (`chấm UI` / score
this screen) → punch list, no spec file. [`/dev` runs visual-ship](skills/dev/visual-ship.md)
before UI is done. See [QUALITY-BAR.md](skills/design/QUALITY-BAR.md). User invokes
Existing project components take precedence; optional **`/ui-kit`** references apply only when Polyms UI Kit was chosen. Pre-flight via [PREFLIGHT.md](skills/design/PREFLIGHT.md).
Hands off to `/dev`. See [design-spec-template.md](skills/design/design-spec-template.md).

**Agent** (optional — isolated context for long design sessions):

```
Use the designer to spec UI from PRD #42
```

**Optional Polyms integration:** If the project already uses `@polyms/ui-kit` or the user elects to adopt it, attach its `/ui-kit` reference skill as documented in the Polyms UI Kit repository. It is **not** a setup prerequisite or default dependency. If the project has no design system, AI Kit may suggest Polyms UI Kit for consideration, without auto-installing or adopting it.

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

### `/code-review` — Three-axis source-code review

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

### `/docs` — Business and Technical Writing

Business proposals, SOPs, reports and internal memos use the [business document template](skills/docs/business-doc-template.md).
Developer-facing docs for shipped surfaces — API/MCP/CLI reference, tutorials, migrations.
Not PRDs (`/reqs`), not feature code (`/dev`). Long sessions: `techlead`.

```
/docs

Write a tutorial: connect Cursor to kit MCP and search Knowledge intent: incident.
```

See [SKILL.md](skills/docs/SKILL.md).

### `/qa` — E2E automation branch

Playwright (or repo harness) flake elimination, CI sharding, journey coverage, traces. Skill
id **`qa`**; principal agent **`tester`**. Not seam TDD (`/dev`); not deploy Knowledge
(`/devops`).

```
/qa

Stabilize flaky Playwright checkout journey — signal waits, quarantine with owner.
```

See [E2E workflow](skills/qa/e2e-workflow.md).

### `/build-feature-map` — Repo feature map

Authors a repo-local skill at `.agents/skills/feature-map/`. Cursor and Claude symlink to that
directory. That skill reads
`references/features/` and opens one area file. The kit skill does not contain the map.
`/setup` can scaffold an empty package. `/dev`, `/dev`, and `/qa` read it once areas
exist. Principal: `tester`.

```
/build-feature-map

Seed a map from the sign-in then send-a-message journey. Three areas, then stop.
```

See [SKILL.md](skills/build-feature-map/SKILL.md).

### `/devops` — Deploy, CI & Infra

Symptom → cause → fix → verify via Knowledge MCP (`intent: incident`). After green verify:
classify, status updates, and SEV1/SEV2 post-mortem via
[incident-templates.md](skills/devops/incident-templates.md).

```
/devops

Vercel build failed — No Output Directory named dist.
```

See [SKILL.md](skills/devops/SKILL.md) and [knowledge.md](docs/agents/knowledge.md).

### `/task` — Vertical-slicing branch

Break an approved PRD or plan into independently-grabbable vertical-slice issues:

```
/task

Bẻ PRD #42 thành issues — vertical slices, publish lên GitHub.
```

After `/reqs` produces a PRD or user stories, `/task` drafts tracer-bullet slices, quizzes you on granularity and dependencies, then publishes through the configured authorized tracker route (GitHub MCP or CLI) with the `ready-for-agent` label when triage labels are configured. Hands off to `/dev` for the first unblocked slice. See [issue-template.md](skills/task/vertical-slice-template.md).

### `/track` — Triage branch

Move raw GitHub issues (and optional external PRs) through a triage state machine:

```
/track

Show me what needs attention.
Phân loại issue #42 — verify và viết agent brief.
```

Categorises (`bug` / `enhancement`), verifies claims, grills via the align decision and domain branches when needed, writes agent briefs, manages `.out-of-scope/`. Issues reaching `ready-for-agent` hand off to `/dev`. Complements `/task` — triage processes inbound backlog; `/task` creates slices from specs. See [agent-brief.md](skills/track/agent-brief.md) and [triage-labels.md](docs/agents/triage-labels.md).

### `/craft` — Writing Great Skills

Matt Pocock's [`writing-great-skills`](https://github.com/mattpocock/skills/tree/main/skills/productivity/writing-great-skills), adapted for ai-kit:

```
/craft

Review skills/reqs/SKILL.md for sprawl and no-ops.
```

Covers predictability, invocation, information hierarchy, leading words, and pruning. See [glossary.md](skills/craft/glossary.md).

### `/arch` — Refactor assessment branch

Scan the codebase for deepening opportunities — shallow modules, seam leakage, poor test surfaces:

```
/arch

Rà soát kiến trúc — tìm chỗ deepen module.
```

Explores organically, writes a visual HTML report to the OS temp directory (Tailwind + Mermaid), then grills your chosen candidate via the align decision and domain branches. Uses **`arch`** vocabulary throughout. Hands off to `/dev` when the design is resolved. Maintenance skill — outside the daily ship pipeline.

### `/arch` — Architecture Vocabulary

Model-invoked vocabulary for deep modules — seam, depth, leverage, locality, design-it-twice. Skills `dev` and `/arch` reach for it when placing seams or deepening interfaces. See [SKILL.md](skills/arch/SKILL.md), [DEEPENING.md](skills/arch/DEEPENING.md), [DESIGN-IT-TWICE.md](skills/arch/DESIGN-IT-TWICE.md).

## Repository structure

```text
ai-kit/
├── agents/                  # Principal roles
├── docs/agents/             # Shared protocols and project setup
├── workflows/               # Optional composition recipes
├── skills/                  # 21 canonical skill entries
│   ├── reqs/                # Discovery, enterprise and lean PRD branches
│   ├── task/                # Standard tasks and vertical slicing
│   ├── track/               # Inspect, update and triage
│   ├── align/               # Decision loop and domain modeling
│   ├── arch/                # Design vocabulary and refactor assessment
│   ├── dev/                 # Feature preparation, implementation and debug
│   ├── qa/                  # Functional and E2E test workflows
│   ├── review/              # Artifact review
│   ├── code-review/         # Three-axis source-code review
│   ├── setup/               # Project execution profile and configuration
│   └── ...                  # Remaining canonical entries in catalog above
└── registry/releases/       # Immutable published skill snapshots
```

Each canonical skill has one `SKILL.md` plus branch references and templates.
The project's `docs/agents/execution-profile.md` records canonical sources, preferred and fallback
operation routes, and write/verification policy. The host checks real availability and authority.

## Adding skills and agents

See [capability abstraction](docs/agents/skill-capabilities.md),
[external references and licensing](docs/agents/external-skill-references.md) and
[work skill evaluation fixtures](evals/work-skills/README.md).

Run `/craft` before authoring or editing skills. Then:

1. Create `skills/<name>/SKILL.md` with frontmatter `name` and `description`
2. Optionally add `agents/<role>.md` for isolated deep work (org role — not 1:1 with the skill)
3. Keep skill names **short** — lowercase, 2–4 chars when possible (`reqs`, `design`, `dev`)
4. For MCP delivery, register the pack and test it per the [provider guide](docs/agents/mcp-skill-provider.md)
5. Commit and push; `git pull` on other machines is enough when using directory symlinks

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
Idea → /align → /reqs → /task → /design → /dev → /code-review → ship
Raw issues → /track → ready-for-agent → /dev → /code-review
```

Run `/setup` once per repo first (includes triage label mapping).

Each stage produces artifacts the next agent can consume. `/reqs` drafts enterprise PRD/stories in chat;
`/reqs` publishes a lean PRD to the tracker; `/task` publishes vertical-slice GitHub issues; `/track`
processes inbound backlog into `ready-for-agent` issues with agent briefs; `/design` adds `docs/design/` specs
mapped to the project's chosen components; Dev implements against briefs and design specs (Polyms UI Kit is optional); `/code-review` gates merge on Standards + Spec + Simplify before ship.

## Daily workflow

```
1. Edit skills or agents in ~/src/ai-kit
2. git commit && git push
3. Other machines: git pull (symlinks stay pointed at the repo)
```

## Roadmap

- [x] `/setup` — repo configuration for ai-kit pipeline
- [x] `/align` + the align decision and domain branches — alignment and domain docs with auto-discovery (EN/VI)
- [x] `/reqs` — discovery, enterprise PRD, user stories (user-invoked; does not publish)
- [x] `/reqs` — synthesize conversation into lean PRD, publish to GitHub (from Matt's to-prd)
- [x] `/task` — break spec into vertical-slice GitHub issues (from Matt's to-issues)
- [x] `/track` — issue backlog triage, agent briefs, `ready-for-agent` (from Matt's triage)
- [x] `/dev` — fullstack implementation, TDD, solution ladder, scope self-check, status report
- [x] `/code-review` — three-axis review (Standards + Spec + Simplify), 🔴/🟡/💭 tags
- [x] `/docs` — business and developer-facing docs
- [x] `research`, `business`, `task`, `bug` — work operations skills and templates
- [x] MCP skill provider — mutable Markdown delivery; new 0.3.4 pinned release pending production smoke
- [x] `/qa` — E2E automation (`tester`)
- [x] `/build-feature-map` — authors the repo-local `feature-map` skill (`tester`)
- [x] `/devops` — Knowledge incident workflow + SEV/post-mortem templates
- [x] `/craft` — writing and editing skills (from Matt's writing-great-skills)
- [x] `/arch` + `arch` — architecture maintenance and vocabulary (from Matt's improve-codebase-architecture + codebase-design)
- [x] `/design` — vendor-neutral UI specs at `docs/design/`, optional Polyms UI Kit integration
- [x] `examples/` — pipeline feature walkthrough for onboarding
- [ ] Frontmatter validation script
- [ ] Claude agent support

## License

[MIT](LICENSE) — Copyright (c) 2026 [Polyms](https://github.com/polyms)

## Skill evaluation

Run `pnpm eval:test` for deterministic scoring tests and `pnpm eval:run --dry-run` to inspect
benchmark scope without model calls. See [the evaluation runner](evals/README.md) for opt-in
paired runs, trace scoring, model configuration and limitations.
Use `node scripts/verify-skill-release.mjs --version 0.3.4 --endpoint https://ai-kit.polyms.dev`
for production delivery checks. See [Quality Baseline](docs/quality/baseline.md) and
`pnpm eval:report` for measured-run summaries.

## Skill migration

The canonical catalog has 21 skills. Old workflow names are MCP aliases only; use the canonical native command plus the requested branch. See [skill migration](docs/agents/skill-migration.md) for the complete map and preserved gates.
