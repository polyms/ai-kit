---
name: setup
description: Configure a repo for the ai-kit pipeline — issue tracker, domain docs, agent pointers. Invoke with /setup, cấu hình repo, thiết lập repo, cấu hình lần đầu, first-time setup, or configuring CONTEXT.md and issue tracker.
disable-model-invocation: true
---

# Setup — Configure Repo for ai-kit

Scaffold per-repo configuration that `/pm`, `/to-prd`, `/align`, `/triage`, `/to-issues`, and `/dev` assume. Prompt-driven — explore, confirm with user, then write.

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

Where specs land after `/pm`, `/to-prd`, and `/align`:

| Artifact | Default path                 |
| -------- | ---------------------------- |
| PRDs     | `docs/prd/` or issue tracker |
| ADRs     | `docs/adr/`                  |
| Glossary | `CONTEXT.md`                 |

Confirm or override paths.

**D — Triage labels**

Map canonical triage roles to label strings on the issue tracker. Required for `/triage` and `/to-issues`.

| Role type    | Canonical roles                                                               |
| ------------ | ----------------------------------------------------------------------------- |
| **State**    | `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix` |
| **Category** | `bug`, `enhancement`                                                          |

Default: label strings equal canonical names unless the user overrides. Show the mapping table; confirm or edit the right-hand column.

Remind user to create matching labels on the remote tracker after setup (see [triage-labels.md](triage-labels.md) for `gh label create` examples).

**Completion criterion:** All seven role mappings confirmed; issue tracker, domain layout, artifact paths, and triage labels all confirmed by user.

### 3. Confirm draft

Show before writing:

- `## Agent skills` block for `CLAUDE.md` or `AGENTS.md`
- `docs/agents/issue-tracker.md`
- `docs/agents/domain.md`
- `docs/agents/triage-labels.md`

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

### Triage labels

Canonical roles mapped to tracker labels. See `docs/agents/triage-labels.md`.

### Pipeline

Idea → `/align` → `/pm` or `/to-prd` → `/to-issues` → `/ux` → `/dev`; raw issues via `/triage`. Specs in [path]; glossary in `CONTEXT.md`.
```

Write docs using templates:

- GitHub → [issue-tracker-github.md](issue-tracker-github.md)
- GitLab → [issue-tracker-gitlab.md](issue-tracker-gitlab.md)
- Local → [issue-tracker-local.md](issue-tracker-local.md)
- Domain → [domain.md](domain.md)
- Triage labels → [triage-labels.md](triage-labels.md)

**Completion criterion:** `docs/agents/issue-tracker.md`, `docs/agents/domain.md`, `docs/agents/triage-labels.md`, and agent config file written to disk.

### 5. Done

Tell user setup is complete. Mention `/align` before building, `/pm` or `/to-prd` for specs, `/triage` for backlog issues. Remind them to create GitHub labels matching `docs/agents/triage-labels.md`. They can edit `docs/agents/*.md` directly later.

**Completion criterion:** User notified setup is complete; `/align`, `/pm` or `/to-prd`, and `/triage` mentioned; label creation reminder given.
