---
name: dev
description: Fullstack implementation with TDD and disciplined debugging. Use when user mentions /dev, implement, build feature, fix bug, sửa lỗi, red-green-refactor, test-first, triển khai, or ship from spec.
---

# Dev — Fullstack Implementation

Ship production code from specs. Read `CONTEXT.md` and relevant ADRs before touching code.

## Quick Router

| Intent                | Workflow                                               | Reference                      |
| --------------------- | ------------------------------------------------------ | ------------------------------ |
| New feature from spec | [Implement workflow](#implement-workflow)              | [tdd-guide.md](tdd-guide.md)   |
| Bug / regression      | [Debug workflow](#debug-workflow)                      | [debug-loop.md](debug-loop.md) |
| Branch / PR review    | **`code-review`** — pre-merge gate, not red-green loop | —                              |

## Implement Workflow

**Goal:** Vertical slice shipped with tests at confirmed seams.

### 1. Orient

- Read PRD, user stories, `/design` spec at `docs/design/<feature>.md`, or `/align` decisions
- Read `CONTEXT.md` — use glossary vocabulary in code and tests
- **Deploy/CI slice:** read [runbook pointer](../../docs/agents/runbooks.md) — search `/runbooks/*` or API before changing infra config
- **Design + stack slice:** read [stack guide pointer](../../docs/agents/stack-guides.md) and ADRs; timeless defaults in [stack-defaults.md](stack-defaults.md)
- Identify modules and **seams** (public interfaces to test at)
- **Greenfield UI with routing:** confirm routing branch before seam work if the slice touches routes — default **TanStack Router**; **TanStack Start** when the user needs SSR or server routes (see [stack-defaults.md](stack-defaults.md))

**Completion criterion:** Spec source and relevant glossary terms identified; candidate seams listed; routing branch noted when applicable.

### 2. Confirm seams

Before any test, list seams under test. Get user confirmation. Prefer existing seams; propose new ones at the highest level possible. For full module/seam vocabulary and deepening principles, use **`arch`**.

> "What's the public interface, and which seams should we test?"

**Completion criterion:** User confirms seams under test before any failing test is written.

When implementing UI, use **`core-ui`** for primitives. Read design spec **§4 CSS** and **§8 visual acceptance** first — run [visual-ship.md](visual-ship.md) (CSS before wiring). If `core-ui` is not in context, ask the user to attach or invoke `/core-ui`.

### 3. Red-green loop

One vertical slice at a time — see [tdd-guide.md](tdd-guide.md):

1. Write failing test at confirmed seam
2. Minimal code to pass
3. Repeat for next slice
4. Refactor only after green (not during the loop)

**Completion criterion:** All acceptance criteria covered; tests pass; no speculative code.

### 4. Ship checklist

- [ ] Types complete — no `any` without justification
- [ ] Error, empty, and loading states handled
- [ ] Accessibility considered (labels, focus, contrast)
- [ ] No secrets or credentials in code
- [ ] Conventional commit ready
- [ ] **UI from `docs/design/`:** [visual-ship.md](visual-ship.md) passed — CSS layer + dark acceptance vs visual reference

**Completion criterion:** Every ship checklist item verified.

## Debug Workflow

**Goal:** Fix with a tight feedback loop — see [debug-loop.md](debug-loop.md).

1. Build a **tight** red-capable loop (failing test, curl, script)
2. Reproduce and minimise
3. Hypothesise (3–5 ranked, falsifiable)
4. Instrument one variable at a time
5. Fix + regression test at correct seam
6. Cleanup debug logs; state hypothesis in commit message

**Completion criterion:** Loop goes green; regression test exists or seam gap documented.

## Stack Defaults

When stack is unspecified, prefer [stack-defaults.md](stack-defaults.md):

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
