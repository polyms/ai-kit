# ai-kit

**Polyms** agent skills for **real engineering** — not vibe coding.

Agents and skills for agentic fullstack development: from product requirements to UI/UX to shipping production code. One version-controlled kit, linked globally across projects.

Cursor-first today, tool-agnostic by design.

## Real engineering

Inspired by [Matt Pocock's skills](https://github.com/mattpocock/skills) — built for work you ship, not demos you discard.

| Principle                  | What it means in `ai-kit`                                                                                       |
| -------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Align before you build** | `/pm` closes the communication gap — discovery, PRD, testable acceptance criteria                               |
| **Small and composable**   | Short-named skills (`/pm`, `/ux`, `/dev`) you combine per task — no heavyweight process that takes away control |
| **Feedback loops**         | `/dev` (planned) encodes TDD, types, and debugging discipline — agents need fast signal, not blind codegen      |
| **Design every day**       | Specs name modules and seams; code skills resist the ball of mud agents accelerate                              |
| **Hack and own them**      | Fork, adapt, commit back — skills are yours, not black-box prompts                                              |

Heavy frameworks that own the whole process can hide bugs in the process itself. These skills stay **small, explicit, and composable** — you stay in control.

## Vision

`ai-kit` is the shared brain for **agentic fullstack dev** at Polyms. Each capability is a short-named skill or agent you invoke with a slash command:

```
/setup → configure repo for ai-kit pipeline (run once)
/align → align before you build (grill + domain language)
/pm    → requirements, PRD, user stories
/ux    → UI/UX (planned)
/dev   → fullstack implementation, TDD, debugging
```

The goal: a coherent pipeline where PM artifacts hand off cleanly to design and engineering agents — without reinventing prompts every project.

## What's inside

| Type          | Path               | Purpose                                                |
| ------------- | ------------------ | ------------------------------------------------------ |
| **Skills**    | `skills/<name>/`   | Workflows, templates, and checklists (`/pm`, `/ux`, …) |
| **Agents**    | `agents/<name>.md` | Specialized subagents for isolated deep work           |
| **Bootstrap** | `bootstrap.sh`     | Symlink into local AI tool directories                 |

### Catalog

| Invoke   | Name                                                          | Status        | Domain                                                         |
| -------- | ------------------------------------------------------------- | ------------- | -------------------------------------------------------------- |
| `/setup` | [`setup`](skills/setup/)                                      | **Available** | Repo config — issue tracker, domain docs, pipeline             |
| `/align` | [`align`](skills/align/) + [`align-loop`](skills/align-loop/) + [`domain-modeling`](skills/domain-modeling/) | **Available** | Alignment (user + auto-discovery), domain language, CONTEXT.md |
| `/pm`    | [`pm`](skills/pm/)                                            | **Available** | Requirements, PRD, user stories, prioritization                |
| `/ux`    | `ux`                                                          | Planned       | UI/UX flows, wireframes, design specs, a11y                    |
| `/dev`   | [`dev`](skills/dev/)                                          | **Available** | Fullstack implementation, TDD, debugging, review               |
| `/craft` | [`craft`](skills/craft/)                                      | **Available** | Authoring and editing skills — predictability, pruning         |

Each skill ships with an optional matching agent for work that needs a separate context (long PRDs, multi-step design, large refactors). Use `/craft` when writing or editing any skill.

**Descriptions:** WHAT in English; invoke triggers in **English + Vietnamese** — bilingual recall for you, auto-discovery for model-invoked skills (`align-loop`, `domain-modeling`, `pm`, `dev`).

## Quick start

```bash
git clone git@github.com:polyms/ai-kit.git ~/src/ai-kit
cd ~/src/ai-kit
pnpm bootstrap
```

`bootstrap.sh` symlinks this repo into:

| Tool            | Agents             | Skills                                  |
| --------------- | ------------------ | --------------------------------------- |
| **Cursor**      | `~/.cursor/agents` | `~/.cursor/skills`                      |
| **Claude Code** | —                  | `~/.claude/skills` (per-skill symlinks) |

Restart your editor or start a new chat session after bootstrap.

### Manual setup

```bash
ln -sfn ~/src/ai-kit/skills/pm ~/.cursor/skills/pm
ln -sfn ~/src/ai-kit/agents/pm.md ~/.cursor/agents/pm.md
```

## Usage

### `/pm` — Product Management

**Skill** (recommended for daily work — same chat, interactive):

```
/pm

Write a PRD for [feature].
Users: [who]. Success metric: [what]. Deadline: [when].
```

Includes:

- Discovery, PRD, user story, prioritization, and refinement workflows
- [PRD template](skills/pm/prd-template.md) (14 sections)
- [User story guide](skills/pm/user-story-guide.md) (INVEST, Gherkin AC, DoR/DoD)

**Agent** (optional — isolated context for long PM sessions):

```
Use the pm agent to write a PRD for [feature]
```

### `/setup` — One-Time Repo Configuration

Run once per repo before other skills:

```
/setup
```

Configures issue tracker (GitHub/GitLab/local), domain docs layout (`CONTEXT.md`, ADRs), and pipeline artifact paths.

### `/align` — Align Before You Build

Clarify plans and sharpen domain language before specs or code:

```
/align

Làm rõ kế hoạch [feature] trước khi viết PRD.
```

`/align` (user-invoked) orchestrates; **`align-loop`** (model-invoked) auto-fires when you clarify plans in EN or VI; **`domain-modeling`** maintains `CONTEXT.md` and ADRs when terms resolve. Hands off to `/pm`, `/ux`, or `/dev`.

### `/dev` — Fullstack Implementation

```
/dev

Implement [feature] from PRD at docs/prd/feature-x.md
```

TDD vertical slices, disciplined debugging, code review. See [tdd-guide.md](skills/dev/tdd-guide.md) and [debug-loop.md](skills/dev/debug-loop.md).

### `/craft` — Writing Great Skills

Matt Pocock's [`writing-great-skills`](https://github.com/mattpocock/skills/tree/main/skills/productivity/writing-great-skills), adapted for ai-kit:

```
/craft

Review skills/pm/SKILL.md for sprawl and no-ops.
```

Covers predictability, invocation, information hierarchy, leading words, and pruning. See [glossary.md](skills/craft/glossary.md).

### Upcoming

```
/ux   Design flows and UI specs from a PRD or feature brief
```

## Repository structure

```
ai-kit/
├── README.md
├── LICENSE
├── bootstrap.sh
├── agents/
│   ├── align.md
│   ├── dev.md
│   └── pm.md
└── skills/
    ├── align/
    │   └── SKILL.md
    ├── align-loop/
    │   └── SKILL.md
    ├── craft/
    │   ├── SKILL.md
    │   └── glossary.md
    ├── domain-modeling/
    │   └── SKILL.md
    ├── dev/
    │   ├── SKILL.md
    │   ├── debug-loop.md
    │   └── tdd-guide.md
    ├── pm/
    │   ├── SKILL.md
    │   ├── prd-template.md
    │   └── user-story-guide.md
    └── setup/
        ├── SKILL.md
        ├── adr-format.md
        ├── context-format.md
        ├── domain.md
        ├── issue-tracker-github.md
        ├── issue-tracker-gitlab.md
        └── issue-tracker-local.md
```

## Adding skills and agents

Run `/craft` before authoring or editing skills. Then:

1. Create `skills/<name>/SKILL.md` with frontmatter `name` and `description`
2. Optionally add `agents/<name>.md` for isolated deep work
3. Keep names **short** — lowercase, 2–4 chars when possible (`pm`, `ux`, `dev`)
4. Commit and push; `git pull` on other machines is enough when using directory symlinks

### Conventions

| Rule                               | Example                                        |
| ---------------------------------- | ---------------------------------------------- |
| Short invoke name                  | `/pm`, not `/product-management`               |
| Skill folder = skill name          | `skills/pm/SKILL.md` → `name: pm`              |
| Agent file = agent name            | `agents/pm.md` → `name: pm`                    |
| Description includes trigger terms | `/pm`, viết PRD, user stories (EN + VI)        |
| Bilingual triggers                 | English WHAT + EN/VI WHEN in every description |
| Templates in separate files        | `prd-template.md`, linked from `SKILL.md`      |
| No built-in tool skills            | Do not copy Cursor `skills-cursor/` content    |

## Agentic fullstack pipeline

```
Idea → /align (align) → /pm (spec) → /ux (design) → /dev (build) → ship
```

Run `/setup` once per repo first.

Each stage produces artifacts the next agent can consume. PM writes PRD and stories; UX adds flows and component notes; Dev implements against both.

## Daily workflow

```
1. Edit skills or agents in ~/src/ai-kit
2. git commit && git push
3. Other machines: git pull (symlinks stay pointed at the repo)
```

## Roadmap

- [x] `/setup` — repo configuration for ai-kit pipeline
- [x] `/align` + `align-loop` + `domain-modeling` — alignment and domain docs with auto-discovery (EN/VI)
- [x] `/pm` — requirements, PRD, user stories
- [x] `/dev` — fullstack implementation, TDD, debugging
- [x] `/craft` — writing and editing skills (from Matt's writing-great-skills)
- [ ] `/ux` — UI/UX flows, wireframes, design handoff
- [ ] Frontmatter validation script
- [ ] Claude agent support

## License

[MIT](LICENSE) — Copyright (c) 2026 [Polyms](https://github.com/polyms)
