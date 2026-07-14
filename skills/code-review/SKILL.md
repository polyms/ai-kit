---
name: code-review
description: Review code changes since a pinned git fixed point — Standards, Spec, and
  Simplify axes. Use when user mentions review code, review PR, review diff, rà soát code,
  xem diff, over-engineered, simplify review, or cắt bớt.
---

# Code Review

Three-axis review of the diff between `HEAD` and a fixed point the user supplies:

- **Standards** — does the code conform to this repo's documented coding standards?
- **Spec** — does the code faithfully implement the originating issue / PRD / spec?
- **Simplify** — what surplus complexity can the diff delete without losing the ask?

All three axes run as **parallel sub-agents** so they don't pollute each other's context,
then this skill aggregates their findings.

**Issue fetch (soft):** If `docs/agents/issue-tracker.md` exists, follow it for
`gh issue view` / `gh pr view`. If missing, use `gh` directly — no `/setup` gate unless
you need to publish or write to the tracker.

## Process

### 1. Pin the fixed point

Whatever the user said is the fixed point — a commit SHA, branch name, tag, `main`,
`HEAD~5`, etc. If they didn't specify one, ask for it.

Capture the diff command once: `git diff <fixed-point>...HEAD` (three-dot, merge-base
comparison). Also note commits via `git log <fixed-point>..HEAD --oneline`.

Confirm the fixed point resolves (`git rev-parse <fixed-point>`) and the diff is
non-empty. A bad ref or empty diff fails here — not inside parallel sub-agents.

Check diff size (`git diff <fixed-point>...HEAD --stat`, sum of `+N/-M`). Under 10 changed
lines → skip sub-agent spawn; read the diff yourself and apply all three checklists
(Standards/Spec/Simplify) inline in one pass, then go straight to **5. Aggregate** using
the same headings and severity tags as a spawned run. 10 lines or more → continue to
steps 3–4 as normal.

**Completion criterion:** Valid ref, non-empty three-dot diff, diff command and commit
list captured; diff-size branch decided (inline vs spawn).

### 2. Identify the spec source

Look for the originating spec, in this order:

1. Issue references in commit messages (`#123`, `Closes #45`, `Refs #123`) — fetch with
   `gh issue view <number> --comments`. When the issue has an agent brief comment
   (`ready-for-agent`), treat the brief as authoritative over the issue body (triage
   convention).
2. A path the user passed as an argument.
3. A PRD/spec file under `docs/`, `docs/design/`, `specs/`, or `.scratch/` matching the
   branch name or feature.

If nothing is found, ask the user where the spec is. If they say there isn't one, skip
the Spec sub-agent and report **no spec available** explicitly.

**Completion criterion:** Spec path or fetched contents recorded, or explicit decision to
skip Spec axis.

### 3. Identify the standards sources

Collect anything in the repo that documents how code should be written:

- `CONTEXT.md` — glossary naming and domain vocabulary
- `.cursor/rules/conventional-commits.mdc` — commit message format
- `CODING_STANDARDS.md`, `CONTRIBUTING.md`, `AGENTS.md` when present
- Project linter/formatter configs referenced by the repo (ESLint, Prettier, etc.)

On top of repo docs, the Standards axis always carries the **smell baseline** in
[standards-baseline.md](standards-baseline.md) — paste it in full into the Standards
sub-agent prompt; the sub-agent has no other access to it.

**Completion criterion:** Standards-source file list assembled; smell baseline ready to
paste.

### 4. Spawn three sub-agents in parallel

Skip this step when step 1 decided **inline** (diff under 10 changed lines) — go straight
to **5. Aggregate** with your own inline findings instead.

Send a **single message** with three Task tool calls (`subagent_type: general-purpose`) —
or two when Spec is skipped. Do not run axes sequentially.

Always include Standards and Simplify. Include Spec when a spec source exists.

**Standards sub-agent prompt** — include:

- The full diff command and commit list.
- The list of standards-source files found in step 3, **plus the smell baseline pasted in
  full**.
- Brief: "Report — per file/hunk where relevant — (a) every place the diff violates a
  documented standard: cite the standard (file + rule); and (b) any baseline smell you
  spot: name it and quote the hunk. Distinguish hard violations from judgement calls —
  documented-standard breaches can be hard, but baseline smells are always judgement
  calls, and a documented repo standard overrides the baseline. Skip anything tooling
  enforces. Under 400 words."

**Spec sub-agent prompt** — include:

- The diff command and commit list.
- The path or fetched contents of the spec.
- Brief: "Report: (a) requirements the spec asked for that are missing or partial; (b)
  behaviour in the diff that wasn't asked for (scope creep); (c) requirements that look
  implemented but where the implementation looks wrong. Quote the spec line for each
  finding. Under 400 words."

**Simplify sub-agent prompt** — include:

- The full diff command and commit list.
- The **simplify baseline pasted in full** from [simplify-baseline.md](simplify-baseline.md).
- Brief: "Hunt over-engineering only. One tagged line per finding
  (`delete:` / `stdlib:` / `native:` / `yagni:` / `shrink:`). End with
  `net: -N lines possible.` or `Lean already. Ship.` Do not use Fowler smell names, do
  not judge spec fidelity, do not apply fixes. Under 400 words."

If the spec is missing, skip the Spec sub-agent and note this in the final report.
Simplify still runs.

**Completion criterion:** Standards + Simplify launched in one parallel batch; Spec in the
same batch when available, or skipped with explicit reason.

### 5. Aggregate

Present each run axis under `## Standards`, `## Spec`, and `## Simplify` headings,
verbatim or lightly cleaned (`## Spec` states **no spec available** when that axis was
skipped). Do **not** merge or rerank findings across axes.

**Severity tags** (presentation only — apply when cleaning each axis; do not invent new
findings):

| Tag               | Meaning               | Typical sources                                                                          |
| ----------------- | --------------------- | ---------------------------------------------------------------------------------------- |
| 🔴 **blocker**    | Must fix before merge | Hard Standards violations; Spec missing/wrong AC; data-loss / security / broken contract |
| 🟡 **suggestion** | Should fix soon       | Soft Standards judgement; Spec scope creep; Simplify `yagni:` / `shrink:` with clear win |
| 💭 **nit**        | Nice to have          | Style outside linter; optional Simplify `delete:` / naming polish                        |

Prefix each finding line with one tag. When an axis returns unstructured prose, assign the
strongest justified tag per discrete issue — prefer under-tagging over inflating blockers.

End with a one-line summary: total findings per axis **by severity** (e.g. `Standards:
1🔴 2🟡 · Spec: 0 · Simplify: 3💭`), and the worst issue _within each axis_ (if any).
Don't pick a single winner across axes.

**Completion criterion:** Each run axis under its heading (`## Spec` states **no spec
available** when skipped); every finding tagged; per-axis totals by severity and worst
issue stated.

## Why three axes

A change can pass one axis and fail another:

- Follows every standard but implements the wrong thing → **Standards pass, Spec fail.**
- Does exactly what the issue asked but breaks project conventions → **Spec pass,
  Standards fail.**
- Meets the spec and standards but still over-builds → **Standards + Spec pass, Simplify
  finds cuts.**
- Speculative Generality on Standards ≠ a tagged `yagni:` delete on Simplify — keep them
  separate so smell framing doesn't blur the delete-list.

Reporting them separately stops one axis from masking the other.

## Handoff

Severity cues are when/why (not a pasteable menu). End the report with `## Next Step` (CONTEXT.md
**Handoff**) — prefer **exactly one**:

- **🔴 blocker** (any axis) → `→ /dev` to fix before merge. Spec wrong (not code) → `→ /reqs` /
  update the issue before coding further (pick one).
- **Ready to merge** (no open 🔴) → ship / merge (optionally note `/dev` ship checklist).
- **Simplify cuts worth taking** → `→ /dev` with the delete-list.

🟡 suggestions and 💭 nits stay in the report body — do not expand `## Next Step` into a menu.

**Completion criterion:** Report includes `## Next Step` with one preferred action (two max with
when/why when fix vs product-gap fork is real).

## Agent

For long review sessions or multi-PR review batches:

```
Use the techlead to review diff since main
```

The agent reads this skill when invoked.

_Future:_ a dedicated `prd-view` skill for reading and presenting PRDs from issues is
planned — for now, Spec axis fetches via `gh` and file paths above.
