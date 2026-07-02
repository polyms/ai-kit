---
name: setup
description: Configure a repo for the ai-kit pipeline — issue tracker, domain docs, agent pointers. Invoke with /setup, cấu hình repo, thiết lập repo, cấu hình lần đầu, first-time setup, or configuring CONTEXT.md and issue tracker.
disable-model-invocation: true
---

# Setup — Configure Repo for ai-kit

Scaffold per-repo configuration that `/pm`, `/align`, and `/dev` assume. Prompt-driven — explore, confirm with user, then write.

## Process

### 1. Explore

Read what exists; don't assume:

- `git remote -v` — GitHub, GitLab, or local-only?
- `CONTEXT.md`, `CONTEXT-MAP.md`, `docs/adr/`
- `docs/agents/` — prior setup output?
- `.scratch/` — local markdown issue convention?
- `AGENTS.md`, `CLAUDE.md` — existing agent config?

**Completion criterion:** Current repo state documented; no assumptions about missing config.

### 2. Walk decisions one at a time

Present each section, get answer, then move on. Explain terms briefly before choices.

**A — Issue tracker**

Where issues and PRDs live. Skills read/write here.

| Choice                                      | When                                     |
| ------------------------------------------- | ---------------------------------------- |
| **GitHub** (default if `github.com` remote) | `gh` CLI                                 |
| **GitLab**                                  | `glab` CLI                               |
| **Local markdown**                          | `.scratch/<feature>/` files              |
| **Other**                                   | User describes workflow in one paragraph |

If GitHub or GitLab: ask whether **external PRs/MRs are a request surface** (default: no).

**B — Domain docs**

| Layout                       | Structure                                                 |
| ---------------------------- | --------------------------------------------------------- |
| **Single-context** (default) | `CONTEXT.md` + `docs/adr/` at root                        |
| **Multi-context**            | `CONTEXT-MAP.md` → per-context `CONTEXT.md` + `docs/adr/` |

See [context-format.md](context-format.md) and [adr-format.md](adr-format.md).

**C — Pipeline artifacts**

Where specs land after `/pm` and `/align`:

| Artifact | Default path                 |
| -------- | ---------------------------- |
| PRDs     | `docs/prd/` or issue tracker |
| ADRs     | `docs/adr/`                  |
| Glossary | `CONTEXT.md`                 |

Confirm or override paths.

**Completion criterion:** Issue tracker, domain layout, and artifact paths all confirmed by user.

### 3. Confirm draft

Show before writing:

- `## Agent skills` block for `CLAUDE.md` or `AGENTS.md`
- `docs/agents/issue-tracker.md`
- `docs/agents/domain.md`

Let user edit.

**Completion criterion:** User approves draft or requests edits before any files are written.

### 4. Write

**Pick config file:** edit existing `CLAUDE.md` or `AGENTS.md`; if neither exists, ask which to create. Never create both.

If `## Agent skills` exists, update in-place — don't duplicate.

```markdown
## Agent skills

### Issue tracker

[one-line summary]. See `docs/agents/issue-tracker.md`.

### Domain docs

[single-context or multi-context]. See `docs/agents/domain.md`.

### Pipeline

Idea → `/align` → `/pm` → `/ux` → `/dev`. Specs in [path]; glossary in `CONTEXT.md`.
```

Write docs using templates:

- GitHub → [issue-tracker-github.md](issue-tracker-github.md)
- GitLab → [issue-tracker-gitlab.md](issue-tracker-gitlab.md)
- Local → [issue-tracker-local.md](issue-tracker-local.md)
- Domain → [domain.md](domain.md)

**Completion criterion:** `docs/agents/issue-tracker.md`, `docs/agents/domain.md`, and agent config file written to disk.

### 5. Done

Tell user setup is complete. Mention `/align` before building, `/pm` for specs. They can edit `docs/agents/*.md` directly later.

**Completion criterion:** User notified setup is complete; `/align` and `/pm` mentioned as next steps.
