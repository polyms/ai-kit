# ai-kit

**Polyms** AI toolkit — agents and skills for agentic fullstack development.

From product requirements to UI/UX to shipping code — one version-controlled kit, linked globally across projects.

Cursor-first today, tool-agnostic by design.

## Vision

`ai-kit` is the shared brain for **agentic fullstack dev** at Polyms. Each capability is a short-named skill or agent you invoke with a slash command:

```
/pm   → requirements, PRD, user stories
/ux   → UI/UX (planned)
/dev  → fullstack implementation (planned)
```

The goal: a coherent pipeline where PM artifacts hand off cleanly to design and engineering agents — without reinventing prompts every project.

## What's inside

| Type          | Path               | Purpose                                                |
| ------------- | ------------------ | ------------------------------------------------------ |
| **Skills**    | `skills/<name>/`   | Workflows, templates, and checklists (`/pm`, `/ux`, …) |
| **Agents**    | `agents/<name>.md` | Specialized subagents for isolated deep work           |
| **Bootstrap** | `bootstrap.sh`     | Symlink into local AI tool directories                 |

### Catalog

| Invoke | Name               | Status        | Domain                                          |
| ------ | ------------------ | ------------- | ----------------------------------------------- |
| `/pm`  | [`pm`](skills/pm/) | **Available** | Requirements, PRD, user stories, prioritization |
| `/ux`  | `ux`               | Planned       | UI/UX flows, wireframes, design specs, a11y     |
| `/dev` | `dev`              | Planned       | Fullstack implementation, review, testing       |

Each skill ships with an optional matching agent for work that needs a separate context (long PRDs, multi-step design, large refactors).

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

### Upcoming

```
/ux   Design flows and UI specs from a PRD or feature brief
/dev  Implement, review, and test fullstack features from specs
```

## Repository structure

```
ai-kit/
├── README.md
├── LICENSE
├── bootstrap.sh
├── agents/
│   └── pm.md
└── skills/
    └── pm/
        ├── SKILL.md
        ├── prd-template.md
        └── user-story-guide.md
```

## Adding skills and agents

1. Create `skills/<name>/SKILL.md` with frontmatter `name` and `description`
2. Optionally add `agents/<name>.md` for isolated deep work
3. Keep names **short** — lowercase, 2–4 chars when possible (`pm`, `ux`, `dev`)
4. Commit and push; `git pull` on other machines is enough when using directory symlinks

### Conventions

| Rule                               | Example                                     |
| ---------------------------------- | ------------------------------------------- |
| Short invoke name                  | `/pm`, not `/product-management`            |
| Skill folder = skill name          | `skills/pm/SKILL.md` → `name: pm`           |
| Agent file = agent name            | `agents/pm.md` → `name: pm`                 |
| Description includes trigger terms | `/pm`, PRD, user stories, requirements      |
| Templates in separate files        | `prd-template.md`, linked from `SKILL.md`   |
| No built-in tool skills            | Do not copy Cursor `skills-cursor/` content |

## Agentic fullstack pipeline

```
Idea → /pm (spec) → /ux (design) → /dev (build) → ship
```

Each stage produces artifacts the next agent can consume. PM writes PRD and stories; UX adds flows and component notes; Dev implements against both.

## Daily workflow

```
1. Edit skills or agents in ~/src/ai-kit
2. git commit && git push
3. Other machines: git pull (symlinks stay pointed at the repo)
```

## Roadmap

- [x] `/pm` — requirements, PRD, user stories
- [ ] `/ux` — UI/UX flows, wireframes, design handoff
- [ ] `/dev` — fullstack implementation and code review
- [ ] Frontmatter validation script
- [ ] Claude agent support

## License

[MIT](LICENSE) — Copyright (c) 2026 [Polyms](https://github.com/polyms)
