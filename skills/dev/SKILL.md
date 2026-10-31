---
name: dev
description: Fullstack implementation with TDD and disciplined debugging. Use when user mentions /dev,
  implement from spec, fix bug, sửa lỗi, red-green-refactor, test-first, triển khai, or ship from
  spec. Do NOT start a new page or CRUD that has no PRD and no design spec — that is collab.
---

# Dev — Fullstack Implementation

**Codex / GitHub Copilot:** Apply [client compatibility](../../docs/agents/client-compatibility.md) before this workflow.

Ship production code from specs. Read `CONTEXT.md` and relevant ADRs before touching code.

## Quick Router

- New feature from spec → [Implement workflow](#implement-workflow);
  reference: [tdd-guide.md](tdd-guide.md), [solution-ladder.md](solution-ladder.md)
- Touch untested shipping code → [characterization.md](characterization.md) before
  red-green (Implement step 3b / Debug)
- Bug / regression → [Debug workflow](#debug-workflow);
  reference: [debug-loop.md](debug-loop.md)
- Branch / PR review → **`code-review`** (pre-merge gate, not red-green loop)

## Implement Workflow

**Goal:** Vertical slice shipped with tests at the locked seam.

### 0. Spec packet

An explicit `/dev` (or "use developer") wins. Do not hand off to `collab`, even for a new screen with
no spec. Read whatever spec exists, record the missing PRD or design spec as one line of assumptions,
and continue to Orient.

Without an explicit `/dev`, a new screen or CRUD whose PRD or `docs/design/<feature>.md` is missing
is not this skill. Stop and follow `collab`, which resumes from whichever file exists. Do not write
tests or production code on that turn.

A `collab` packet with no `[NEEDS CLARIFICATION]` and no blocking fork enters here in the same
turn. Do not wait for a second confirm. A packet that still has a blocking marker stays in
`collab` until that question is answered.

Any other ask (a field, an endpoint, a refactor, a change to an existing screen) skips this step.
It needs no PRD or design spec. Go to Orient.

**Completion criterion:** One of: the user typed `/dev` and any missing spec is recorded as
assumptions; the ask is not a new screen or CRUD; the PRD and design spec are on disk with no
blocking marker, including a packet `collab` just wrote; or the turn handed off to `collab`
because a blocking gap remains.

### 1. Orient

- Read PRD, user stories, `/design` spec at `docs/design/<feature>.md`, or `/align` decisions
- Read `CONTEXT.md` — use glossary vocabulary in code and tests
- **Feature map:** Read `docs/agents/feature-map.md` when it exists. An area is a markdown link in
  the index to a sibling `*.md`. When area links exist, read the repo `SKILL.md` at `Skill` and
  open the one area file for this slice before locking the seam. Its user path and gotchas are the
  behavior contract. Still read the module this slice edits. The area file does not replace that
  read, and it is not a reason to stop and retell the gotchas. Do not run `/build-feature-map`.
  Do not suggest the map when it is missing — `/collab` and `/e2e` own that suggestion. Glossary,
  ADRs, the PRD, and `docs/design/<feature>.md` are still read in full.
- Read **`docs/agents/stack-profile.md`** when present — pass `axes` on Knowledge searches below
- **Deploy/CI slice (only when it surfaces mid-implementation):** [Knowledge pointer](../../docs/agents/knowledge.md)
  — MCP `search_knowledge` with `intent: incident` and `q` = symptom (no MCP: browse
  `/knowledge?q=…&intent=incident`). Confirm symptom + cause before fix. A deploy/CI symptom
  reported cold, opening the session with no slice already in progress, hands off to `/devops`
  instead.
- **Design + stack slice:** Search only when this slice chooses a router, a store, a module
  boundary, or other stack the repo has not already locked. An Accepted ADR plus a design spec for
  an existing screen is that lock — do not search, and do not retell a design article in chat.
  When the slice does choose stack, MCP `search_knowledge` with `intent: design` and `q` = the seam
  topic — see [Knowledge pointer](../../docs/agents/knowledge.md). No MCP:
  `/knowledge?q=…&intent=design`. Open the best match in `sortOrder`. No match →
  [stack-defaults.md](stack-defaults.md) and ADRs.
- **Toolchain / formatter setup:** MCP `search_knowledge` with `intent: toolchain` and `q` =
  tool/config need (e.g. biome, prettier) — see [Knowledge pointer](../../docs/agents/knowledge.md).
  Open best match; use `get_knowledge_chunk` before copying config. No MCP: browse
  `/knowledge?q=…&intent=toolchain`. No match → report search terms; do not invent formatter config
- Identify modules and **seams** (public interfaces to test at)
- **Greenfield UI with routing:** only after the design Knowledge search above (or confirmed
  stack-defaults fallback) — **TanStack Router** default; **TanStack Start** when the user needs
  SSR or server routes ([stack-defaults.md](stack-defaults.md))

**Completion criterion:** Spec source and relevant glossary terms identified; the seam for this
slice chosen; for any design, toolchain, or deploy Knowledge path that fired — article opened or
no-match search terms recorded, not pasted into chat; routing branch noted when applicable (only
after Knowledge or an explicit stack-defaults fallback).

### 2. Lock seams

Name the public interface under test. Prefer an existing seam. Add a seam only when no existing
public interface reaches the behavior. For module vocabulary, use **`arch`** — do not stop the
slice to invoke it.

A complete packet, or an explicit `/dev`, already approved the work. When the spec and the existing
module agree, record the seam in one line and continue to the ladder and the tests in this same
turn. Do not ask the user to confirm it.

Ask once, then stop, only when two existing public interfaces both match and picking one changes
what the tests lock. Recommend one option, with the repo fact that supports it. Do not ask about
copy, CSS classes, or which file to open.

Do not paste an interview question. Do not narrate Knowledge hits, feature-map gotchas, or the
ladder in the user reply.

**Completion criterion:** The seam is named from the spec and the existing module, or the user
answered the one blocking seam fork. No test is written before that. A settled seam does not end
the turn.

When implementing UI, use **`ui-kit`** for primitives. Read design spec **§4 CSS** and
**§8 visual acceptance** first — run [visual-ship.md](visual-ship.md) (CSS before wiring). Read
the repo `ui-kit` skill when it is on disk. Ask the user to attach `/ui-kit` only when that skill
is absent and the component map would be invented.

### 3. Solution ladder

Before writing production code, climb the ladder — stop at the first rung that holds.
Read [solution-ladder.md](solution-ladder.md). Trace the flow the change touches first;
do not climb instead of reading. Repo / design / ADR stack choices override "prefer
native" for that stack.

**Completion criterion:** Chosen rung named (YAGNI / reuse / stdlib / native / installed
dep / one-liner / minimum); path that would over-build relative to that rung discarded;
single-call-site helpers stay colocated (solution-ladder **Colocate**), not in helpers/utils.

### 3b. Characterization (legacy / untested only)

When the change touches **existing shipping behavior** with **no test covering that
seam**, capture as-is first — see [characterization.md](characterization.md). Skip for
new seams with clear AC and no prior behavior to preserve.

**Completion criterion:** Characterization PASS before the first production edit, or
explicit skip (new seam / covered already) recorded.

### 4. Red-green loop

One vertical slice at a time — see [tdd-guide.md](tdd-guide.md):

1. Write failing test at confirmed seam (desired behavior — after 3b when it fired)
2. Minimal code to pass **at the rung chosen in step 3**
3. Repeat for next slice
4. Refactor only after green (not during the loop)

**Completion criterion:** All acceptance criteria covered; tests pass on disk (see ship
**Disk gate**); no speculative code; WRITE-delta / RUN-all per
[characterization.md](characterization.md) when that branch fired.

### 4b. Status (multi-slice only)

When the feature has **more than one** seam slice, or the session uses `developer` for a long
implement: refresh [status-report.md](status-report.md) after each green slice and when
blocked. Skip for single-slice one-liners.

**Completion criterion:** Status table lists every planned slice; **Next** is one action; blockers
name an upstream skill when blocked.

### 5. Ship checklist

- [ ] Types complete — no `any` without justification
- [ ] Error, empty, and loading states handled
- [ ] API error surfaces return friendly end-user messages; raw technical errors stay in logs/telemetry
- [ ] Accessibility considered (labels, focus, contrast)
- [ ] No secrets or credentials in code
- [ ] Conventional commit ready
- [ ] **Disk gate** — re-run the **gate-deciding** test/typecheck (and build if that is the
      ship gate) on disk yourself; read real exit code. A sub-agent or prior turn saying
      "green" is not enough — see [invocation.md](../../docs/agents/invocation.md)
      (**Verification after delegation**). Skip only for diffs with no runnable gate
      (e.g. docs-only).
- [ ] **Scope self-check** — fill [scope-self-check.md](scope-self-check.md); shrink
      any line that fails the pass rule (incl. **Colocate** / single-call helpers/utils)
      before declaring done
- [ ] **UI from `docs/design/`:** [visual-ship.md](visual-ship.md) passed — CSS layer + dark
      acceptance vs visual reference; default posture is **not ship-ready** until checks
      pass with evidence
- [ ] **Feature map:** when the index already has an area this diff touches, update that one
      `references/features/` file in this PR. Do not start a seed. Do not run
      `/build-feature-map`

**Completion criterion:** Every ship checklist item verified; Disk gate exit code recorded
(or docs-only skip); scope self-check filled; diff passes the line-by-line pass rule.

### 6. Handoff

When/why cues (not a pasteable menu). End with `## Next Step` (CONTEXT.md **Handoff**) after the
ship checklist — prefer **exactly one**:

- Ship / done — feature closed, nothing queued
- `/docs` — public integrator surface (API, MCP, CLI) just shipped
- `/e2e` — critical browser journey needs CI coverage (not a substitute for seam TDD)

Name the higher-priority one when both `/docs` and `/e2e` could apply; two only if both surfaces
genuinely apply (each with when). When blocked: single escalate to `/reqs` or `/design`.

**Completion criterion:** `## Next Step` names one preferred next action (two max with when/why).

## Debug Workflow

**Goal:** Fix with a tight feedback loop — see [debug-loop.md](debug-loop.md).

1. **Untested shipping code:** [characterization.md](characterization.md) PASS at the
   seam before editing production (skip if coverage already captures as-is)
2. Build a **tight** red-capable loop (failing test, curl, script)
3. Reproduce and minimise
4. Hypothesise (3–5 ranked, falsifiable)
5. Instrument one variable at a time
6. Fix + regression test at correct seam
7. Cleanup debug logs; state hypothesis in commit message
8. **Disk gate** — re-run gate-deciding command on disk (same rule as Implement ship)
9. Run [scope-self-check.md](scope-self-check.md) — bug-fix diffs stay minimal; list
   cleanup temptations as follow-ups, do not sneak them in

**Completion criterion:** Loop goes green on disk; regression test exists or seam gap
documented; characterization done or skipped with reason; scope self-check filled.

## Stack Defaults

Fallback tables only — when design Knowledge **search returns no match** (or the repo already chose
a stack). Do not skip search. Details: [stack-defaults.md](stack-defaults.md).

**Routing**

- Default: **TanStack Router** (`@tanstack/react-router`) — typed routes, search params
- SSR / fullstack greenfield: **TanStack Start** (Router included)
- Match existing project conventions when the repo already chose a stack

**State**

- Default: **Zustand** — UI chrome and cross-route client state; small domain-split stores
- Shareable/bookmarkable state → router search params, not Zustand
- Not Redux on greenfield

**React**

- Functional components + hooks (no class components unless error boundary)
- Type-safe, accessible, performance-focused

Match project conventions when they exist — these are fallbacks only.

## Agent

For large refactors or multi-file implementation in isolated context:

```
Use the developer to [task]
```

The agent reads this skill when invoked.
