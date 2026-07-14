---
name: setup
description: Configure a repo for the ai-kit pipeline — documentation language, issue tracker, domain docs, stack profile, agent pointers. Invoke with /setup, cấu hình repo, thiết lập repo, cấu hình lần đầu, first-time setup, or configuring CONTEXT.md and issue tracker.
disable-model-invocation: true
---

# Setup — Configure Repo for ai-kit

Scaffold per-repo configuration that `/reqs`, `/to-prd`, `/align`, `/design`, `/triage`,
`/to-issues`, `/dev`, `/devops`, and `/arch` assume. Prompt-driven — explore, confirm with user,
then write.

## Process

### 1. Explore

Read what exists; don't assume:

- `git remote -v` — GitHub, GitLab, or local-only?
- `CONTEXT.md`, `CONTEXT-MAP.md`, `docs/adr/` — presence, layout, and written language
- `docs/agents/` — prior setup output? especially `stack-profile.md`
- Stack signals — `package.json` / lockfile (router, start, zustand, vercel, pnpm, nx);
  `vercel.json`; workspace / monorepo layout
- `.scratch/` — local markdown issue convention?
- `AGENTS.md`, `CLAUDE.md` — existing agent config?
- `.cursor/rules/agent-voice.mdc`, `.claude/rules/` — prior opt-in chat voice?

**Completion criterion:** Current repo state documented; no assumptions about missing config;
candidate stack axes listed from signals when detectable.

### 2. Walk decisions one at a time

Present each section, get answer, then move on. Explain terms briefly before choices.

**A — Documentation language**

The language skills write into persistent repo docs — `CONTEXT.md`, `docs/adr/`, PRDs, `docs/design/`, and
`docs/agents/*.md` itself. Separate from chat tone (IDE/user rules, or opt-in voice in step **G**) — this
fixes the language of files that outlive the conversation, so a repo's rules stay in one language even when
different people chat with agents in different languages.

| Choice                                                                        | When                                          |
| ----------------------------------------------------------------------------- | --------------------------------------------- |
| **Match existing docs** (default when `CONTEXT.md`/`docs/adr/` already exist) | Detected from Explore step                    |
| **Vietnamese**                                                                | Internal team writes/reads docs in Vietnamese |
| **English**                                                                   | Internal team writes/reads docs in English    |
| **Other**                                                                     | User names the language                       |

Code, identifiers, file paths, and technical terms (seam, ADR, PRD, …) stay in English regardless of choice.

**B — Issue tracker**

Where issues and PRDs live. Skills read/write here.

| Choice                                      | When                                     |
| ------------------------------------------- | ---------------------------------------- |
| **GitHub** (default if `github.com` remote) | `gh` CLI                                 |
| **GitLab**                                  | `glab` CLI                               |
| **Local markdown**                          | `.scratch/<feature>/` files              |
| **Other**                                   | User describes workflow in one paragraph |

If GitHub or GitLab: ask whether **external PRs/MRs are a request surface** (default: no).

**C — Domain docs**

| Layout                       | Structure                                                 |
| ---------------------------- | --------------------------------------------------------- |
| **Single-context** (default) | `CONTEXT.md` + `docs/adr/` at root                        |
| **Multi-context**            | `CONTEXT-MAP.md` → per-context `CONTEXT.md` + `docs/adr/` |

See [context-format.md](context-format.md) and [adr-format.md](adr-format.md).

**D — Pipeline artifacts**

Where specs land after `/reqs`, `/to-prd`, and `/align`:

| Artifact | Default path                                                            |
| -------- | ----------------------------------------------------------------------- |
| PRDs     | Issue tracker canonical; `/to-prd` also mirrors to `docs/prd/<slug>.md` |
| ADRs     | `docs/adr/`                                                             |
| Glossary | `CONTEXT.md`                                                            |

Confirm or override paths. `/reqs` drafts enterprise PRDs in chat or `docs/prd/` and does **not** publish;
`/to-prd` publishes to the tracker (and mirrors to `docs/prd/`). Once published, keep tracker and repo mirror
in sync when both exist.

**E — Triage labels**

Map canonical triage roles to label strings on the issue tracker. Required for `/triage` and `/to-issues`.

| Role type    | Canonical roles                                                               |
| ------------ | ----------------------------------------------------------------------------- |
| **State**    | `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix` |
| **Category** | `bug`, `enhancement`                                                          |

Default: label strings equal canonical names unless the user overrides. Show the mapping table; confirm or
edit the right-hand column.

Remind user to create matching labels on the remote tracker after setup (see [triage-labels.md](triage-labels.md)
for `gh label create` examples).

**F — Design**

| Item          | Default                                                      |
| ------------- | ------------------------------------------------------------ |
| Design specs  | `docs/design/<feature>.md`                                   |
| Design system | `@polyms/core-ui` + `/core-ui` skill (symlink from lib repo) |

Confirm paths. Note: `/design` writes specs; `/core-ui` skill documents component API — not duplicated in
ai-kit.

**G — Chat voice** (optional)

Repo-level chat **persona** for agents. Distinct from documentation language (step A) and from grill
question shape (`align-loop` / GRILL-FORMAT). Default: **do not** install — use the user's IDE/user rules.

Ask: _Do you want a kit-written chat voice for this repo?_ If Explore found an existing
`.cursor/rules/agent-voice.mdc`, say so and ask skip / replace / keep.

| Choice                       | When                                                         |
| ---------------------------- | ------------------------------------------------------------ |
| **No** (default)             | User already has Cursor/Claude user rules, or wants defaults |
| **Yes — kit voice template** | Team wants a shared repo persona (edit the rule after write) |

If **Yes**, collect any one-line overrides (e.g. keep EN peer tone only; drop em/anh). Otherwise use
[voice-rule.mdc](voice-rule.mdc) as-is.

**H — Stack profile** (Knowledge filter)

Per-repo **Stack manifest** axes for Knowledge search — see [stack-profile.md](stack-profile.md) and
[knowledge.md](../../docs/agents/knowledge.md). Filters `search_knowledge` for all intents.

1. Propose axes from Explore signals (lowercase CMS tags: `tanstack-start`, `vercel`, `pnpm`, …).
2. Show the candidate list; let the user add/remove/confirm.
3. Greenfield / unclear stack: ask once, or use `polyms-default` only when the user confirms org
   defaults.
4. After axes are confirmed (and MCP is available): for each intent, build a heuristic **subset**
   (intersection with the intent pool, core priority, max ~3–4 — see
   [stack-profile.md](stack-profile.md) **Coverage**). Skip intents with an empty subset. Call
   **`get_knowledge_coverage`** per non-empty subset; write a **Coverage** section into
   `docs/agents/stack-profile.md` (bootstrap only — not live SSOT for later `/arch` work).

**Completion criterion:** Documentation language confirmed; all seven triage role mappings confirmed;
issue tracker, domain layout, artifact paths, triage labels, design paths, voice choice (No or Yes +
any overrides), and **stack axes** confirmed by user.

### 3. Confirm draft

Show before writing:

- `## Agent skills` block for `CLAUDE.md` or `AGENTS.md`
- `docs/agents/language.md`
- `docs/agents/issue-tracker.md`
- `docs/agents/domain.md`
- `docs/agents/triage-labels.md`
- `docs/agents/design.md`
- `docs/agents/stack-profile.md` (axes list + detected-from notes + optional Coverage)
- If voice **Yes**: `.cursor/rules/agent-voice.mdc` and `.claude/rules/agent-voice.mdc` → symlink

Let user edit.

**Completion criterion:** User approves draft or requests edits before any files are written.

### 4. Write

**Pick config file:** edit existing `CLAUDE.md` or `AGENTS.md`; if neither exists, ask which to create. Never
create both.

If `## Agent skills` exists, update in-place — don't duplicate.

```markdown
## Agent skills

### Documentation language

Written docs (`CONTEXT.md`, ADRs, PRDs, design specs, `docs/agents/*.md`) are in [language]. Chat tone is not
set by the kit unless Chat voice was opted in — see Voice below or the user's IDE rules.

### Issue tracker

[one-line summary]. See `docs/agents/issue-tracker.md`.

### Domain docs

[single-context or multi-context]. See `docs/agents/domain.md`.

### Triage labels

Canonical roles mapped to tracker labels. See `docs/agents/triage-labels.md`.

### Design

UI specs and `@polyms/core-ui` pointers. See `docs/agents/design.md`.

### Knowledge

Stack axes for Knowledge retrieval. See `docs/agents/stack-profile.md` and
`docs/agents/knowledge.md`.

### Voice

[Omit this subsection when voice was **No**.]
Opt-in chat persona: `.cursor/rules/agent-voice.mdc` (Cursor). Claude Code:
`.claude/rules/agent-voice.mdc` → symlink to that rule.

### Pipeline

Idea → `/align` → `/reqs` or `/to-prd` → `/to-issues` → `/design` → `/dev`; raw issues via `/triage`. Specs in
[path]; glossary in `CONTEXT.md`.
```

Write docs using templates:

- Language → [language.md](language.md)
- GitHub → [issue-tracker-github.md](issue-tracker-github.md)
- GitLab → [issue-tracker-gitlab.md](issue-tracker-gitlab.md)
- Local → [issue-tracker-local.md](issue-tracker-local.md)
- Domain → [domain.md](domain.md)
- Triage labels → [triage-labels.md](triage-labels.md)
- Design → [design.md](design.md)
- Stack profile → [stack-profile.md](stack-profile.md) (fill confirmed axes + detected-from +
  Coverage when MCP coverage ran)

**If voice Yes:**

1. Write `.cursor/rules/agent-voice.mdc` from [voice-rule.mdc](voice-rule.mdc) (apply user overrides).
2. `mkdir -p .claude/rules`
3. Symlink Claude → Cursor rule (relative path so clones stay portable):

```bash
ln -sfn ../../.cursor/rules/agent-voice.mdc .claude/rules/agent-voice.mdc
```

Do **not** duplicate the persona body under `.claude/` — one SoT, one link.

**If voice No:** do not write or remove an existing rule unless the user confirmed replace/remove in step G.

**Completion criterion:** `docs/agents/language.md`, `docs/agents/issue-tracker.md`,
`docs/agents/domain.md`, `docs/agents/triage-labels.md`, `docs/agents/design.md`,
`docs/agents/stack-profile.md`, and agent config file written; if voice Yes, Cursor rule + Claude
symlink present.

### 5. Done

Tell user setup is complete. Deliver the **orientation tour** in body prose — overview of
pipeline entry points (`/align` before building; `/reqs` or `/to-prd` for specs; `/design` for
UI specs; `/triage` for backlog issues; `/dev` / `/devops` / `/arch` filter Knowledge via
`docs/agents/stack-profile.md`). Remind them to create GitHub labels matching
`docs/agents/triage-labels.md`. They can edit `docs/agents/*.md` directly later. If voice was
installed, point at `.cursor/rules/agent-voice.mdc` to edit persona.

Orientation is **not** `## Next Step` — see [Handoff](#handoff).

**Completion criterion:** User notified setup is complete; orientation tour mentions pipeline
entry points; stack-profile / Knowledge mentioned; label creation reminder given; voice path
mentioned only when opted in; Handoff block delivered.

## Handoff

When/why cues (CONTEXT.md **Handoff**) — not a pasteable menu. After Done's orientation tour,
end with `## Next Step` — preferred `→ /align` (default after setup). Optional second only when
they have a raw backlog ready: `→ /triage` with when.

```
## Next Step
→ /align
```

**Completion criterion:** `## Next Step` names `/align` (optional second `/triage` with when).

## Language

Once `docs/agents/language.md` exists, all skills that write persistent docs (`domain-modeling`, `reqs`,
`to-prd`, `design`, `arch`, `to-issues`) read it and write in the confirmed language. Code, identifiers, and
technical vocabulary stay in English. Chat tone is unaffected by this file — IDE/user rules, or
`.cursor/rules/agent-voice.mdc` when `/setup` voice was opted in.
