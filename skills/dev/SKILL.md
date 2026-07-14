---
name: dev
description: Fullstack implementation with TDD and disciplined debugging. Use when user mentions /dev,
  implement, build feature, fix bug, sửa lỗi, red-green-refactor, test-first, triển khai, or ship
  from spec.
---

# Dev — Fullstack Implementation

Ship production code from specs. Read `CONTEXT.md` and relevant ADRs before touching code.

## Quick Router

- New feature from spec → [Implement workflow](#implement-workflow);
  reference: [tdd-guide.md](tdd-guide.md), [solution-ladder.md](solution-ladder.md)
- Bug / regression → [Debug workflow](#debug-workflow);
  reference: [debug-loop.md](debug-loop.md)
- Branch / PR review → **`code-review`** (pre-merge gate, not red-green loop)

## Implement Workflow

**Goal:** Vertical slice shipped with tests at confirmed seams.

### 1. Orient

- Read PRD, user stories, `/design` spec at `docs/design/<feature>.md`, or `/align` decisions
- Read `CONTEXT.md` — use glossary vocabulary in code and tests
- **Deploy/CI slice (only when it surfaces mid-implementation):** [runbook pointer](../../docs/agents/runbooks.md) —
  MCP `search_knowledge` with `intent: incident` before changing infra config. A deploy/CI symptom
  reported cold, opening the session with no slice already in progress, hands off to `/devops` instead.
- **Design + stack slice:** MCP `search_knowledge` with `intent: design` first — see
  [stack guide pointer](../../docs/agents/stack-guides.md) and ADRs. No match: fall back to
  [stack-defaults.md](stack-defaults.md)
- **Toolchain / formatter setup:** [Knowledge pointer](../../docs/agents/knowledge.md) — retrieve
  **KN-001** via MCP (`search_knowledge` → `get_knowledge_chunk`) before inventing Biome/Prettier
  config in a target repo
- Identify modules and **seams** (public interfaces to test at)
- **Greenfield UI with routing:** confirm routing branch before seam work if the slice touches routes
  — default **TanStack Router**; **TanStack Start** when the user needs SSR or server routes
  (see [stack-defaults.md](stack-defaults.md))

**Completion criterion:** Spec source and relevant glossary terms identified; candidate seams listed;
routing branch noted when applicable.

### 2. Confirm seams

Before any test, list seams under test. Get user confirmation. Prefer existing seams; propose new
ones at the highest level possible. For full module/seam vocabulary and deepening principles, use
**`arch`**.

> "What's the public interface, and which seams should we test?"

**Completion criterion:** User confirms seams under test before any failing test is written.

When implementing UI, use **`core-ui`** for primitives. Read design spec **§4 CSS** and
**§8 visual acceptance** first — run [visual-ship.md](visual-ship.md) (CSS before wiring).
If `core-ui` is not in context, ask the user to attach or invoke `/core-ui`.

### 3. Solution ladder

Before writing production code, climb the ladder — stop at the first rung that holds.
Read [solution-ladder.md](solution-ladder.md). Trace the flow the change touches first;
do not climb instead of reading. Repo / design / ADR stack choices override "prefer
native" for that stack.

**Completion criterion:** Chosen rung named (YAGNI / reuse / stdlib / native / installed
dep / one-liner / minimum); path that would over-build relative to that rung discarded.

### 4. Red-green loop

One vertical slice at a time — see [tdd-guide.md](tdd-guide.md):

1. Write failing test at confirmed seam
2. Minimal code to pass **at the rung chosen in step 3**
3. Repeat for next slice
4. Refactor only after green (not during the loop)

**Completion criterion:** All acceptance criteria covered; tests pass; no speculative code.

### 4b. Status (multi-slice only)

When the feature has **more than one** seam slice, or the session uses `dev-agent` for a long
implement: refresh [status-report.md](status-report.md) after each green slice and when
blocked. Skip for single-slice one-liners.

**Completion criterion:** Status table lists every planned slice; **Next** is one action; blockers
name an upstream skill when blocked.

### 5. Ship checklist

- [ ] Types complete — no `any` without justification
- [ ] Error, empty, and loading states handled
- [ ] Accessibility considered (labels, focus, contrast)
- [ ] No secrets or credentials in code
- [ ] Conventional commit ready
- [ ] **Scope self-check** — fill [scope-self-check.md](scope-self-check.md); shrink
      any line that fails the pass rule before declaring done
- [ ] **UI from `docs/design/`:** [visual-ship.md](visual-ship.md) passed — CSS layer + dark
      acceptance vs visual reference; default posture is **not ship-ready** until checks
      pass with evidence

**Completion criterion:** Every ship checklist item verified; scope self-check filled;
diff passes the line-by-line pass rule.

**Optional handoff:** Public integrator surface (API, MCP, CLI) shipped → tell the user to
invoke `/docs`. Critical browser journey needs CI coverage → `/e2e` (not a substitute for
seam TDD).

## Debug Workflow

**Goal:** Fix with a tight feedback loop — see [debug-loop.md](debug-loop.md).

1. Build a **tight** red-capable loop (failing test, curl, script)
2. Reproduce and minimise
3. Hypothesise (3–5 ranked, falsifiable)
4. Instrument one variable at a time
5. Fix + regression test at correct seam
6. Cleanup debug logs; state hypothesis in commit message
7. Run [scope-self-check.md](scope-self-check.md) — bug-fix diffs stay minimal; list
   cleanup temptations as follow-ups, do not sneak them in

**Completion criterion:** Loop goes green; regression test exists or seam gap documented;
scope self-check filled.

## Stack Defaults

When stack is unspecified, search Knowledge first — MCP `search_knowledge` with `intent: design`
(stack-combo seam recipes, e.g. **SG-001**). Fall back to [stack-defaults.md](stack-defaults.md)
only when that search returns no match:

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
Use the dev-agent to [task]
```

The agent reads this skill when invoked.
