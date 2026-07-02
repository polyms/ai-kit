---
name: code-review
description: Review code changes since a pinned git fixed point — Standards and Spec axes. Use when user mentions review code, review PR, review diff, rà soát code, or xem diff.
---

# Code Review

Two-axis review of the diff between `HEAD` and a fixed point the user supplies:

- **Standards** — does the code conform to this repo's documented coding standards?
- **Spec** — does the code faithfully implement the originating issue / PRD / spec?

Both axes run as **parallel sub-agents** so they don't pollute each other's context, then this skill aggregates their findings.

**Issue fetch (soft):** If `docs/agents/issue-tracker.md` exists, follow it for `gh issue view` / `gh pr view`. If missing, use `gh` directly — no `/setup` gate unless you need to publish or write to the tracker.

## Process

### 1. Pin the fixed point

Whatever the user said is the fixed point — a commit SHA, branch name, tag, `main`, `HEAD~5`, etc. If they didn't specify one, ask for it.

Capture the diff command once: `git diff <fixed-point>...HEAD` (three-dot, merge-base comparison). Also note commits via `git log <fixed-point>..HEAD --oneline`.

Confirm the fixed point resolves (`git rev-parse <fixed-point>`) and the diff is non-empty. A bad ref or empty diff fails here — not inside parallel sub-agents.

**Completion criterion:** Valid ref, non-empty three-dot diff, diff command and commit list captured.

### 2. Identify the spec source

Look for the originating spec, in this order:

1. Issue references in commit messages (`#123`, `Closes #45`, `Refs #123`) — fetch with `gh issue view <number> --comments`. When the issue has an agent brief comment (`ready-for-agent`), treat the brief as authoritative over the issue body (triage convention).
2. A path the user passed as an argument.
3. A PRD/spec file under `docs/`, `specs/`, or `.scratch/` matching the branch name or feature.

If nothing is found, ask the user where the spec is. If they say there isn't one, skip the Spec sub-agent and report **no spec available** explicitly.

**Completion criterion:** Spec path or fetched contents recorded, or explicit decision to skip Spec axis.

### 3. Identify the standards sources

Collect anything in the repo that documents how code should be written:

- `CONTEXT.md` — glossary naming and domain vocabulary
- `.cursor/rules/conventional-commits.mdc` — commit message format
- `CODING_STANDARDS.md`, `CONTRIBUTING.md`, `AGENTS.md` when present
- Project linter/formatter configs referenced by the repo (ESLint, Prettier, etc.)

On top of repo docs, the Standards axis always carries the **smell baseline** in [standards-baseline.md](standards-baseline.md) — paste it in full into the Standards sub-agent prompt; the sub-agent has no other access to it.

**Completion criterion:** Standards-source file list assembled; smell baseline ready to paste.

### 4. Spawn both sub-agents in parallel

Send a **single message** with two Task tool calls (`subagent_type: generalPurpose`). Do not run Standards then Spec sequentially.

**Standards sub-agent prompt** — include:

- The full diff command and commit list.
- The list of standards-source files found in step 3, **plus the smell baseline pasted in full**.
- Brief: "Report — per file/hunk where relevant — (a) every place the diff violates a documented standard: cite the standard (file + rule); and (b) any baseline smell you spot: name it and quote the hunk. Distinguish hard violations from judgement calls — documented-standard breaches can be hard, but baseline smells are always judgement calls, and a documented repo standard overrides the baseline. Skip anything tooling enforces. Under 400 words."

**Spec sub-agent prompt** — include:

- The diff command and commit list.
- The path or fetched contents of the spec.
- Brief: "Report: (a) requirements the spec asked for that are missing or partial; (b) behaviour in the diff that wasn't asked for (scope creep); (c) requirements that look implemented but where the implementation looks wrong. Quote the spec line for each finding. Under 400 words."

If the spec is missing, skip the Spec sub-agent and note this in the final report.

**Completion criterion:** Both sub-agents launched in one parallel batch (or Spec skipped with explicit reason).

### 5. Aggregate

Present each run axis under `## Standards` and `## Spec` headings, verbatim or lightly cleaned (`## Spec` states **no spec available** when that axis was skipped). Do **not** merge or rerank findings across axes.

End with a one-line summary: total findings per axis, and the worst issue _within each axis_ (if any). Don't pick a single winner across axes.

**Completion criterion:** Each run axis under its heading (`## Spec` states **no spec available** when skipped); per-axis totals and worst issue stated.

## Why two axes

A change can pass one axis and fail the other:

- Code that follows every standard but implements the wrong thing → **Standards pass, Spec fail.**
- Code that does exactly what the issue asked but breaks the project's conventions → **Spec pass, Standards fail.**

Reporting them separately stops one axis from masking the other.

## Handoff

- **Critical Standards findings** → fix before merge; use `/dev` if implementation help is needed.
- **Critical Spec gaps** → fix code or update the issue/PRD; use `/pm` if the spec itself was wrong.
- **Ready to merge** → proceed to ship checklist in `/dev`.

_Future:_ a dedicated `prd-view` skill for reading and presenting PRDs from issues is planned — for now, Spec axis fetches via `gh` and file paths above.
