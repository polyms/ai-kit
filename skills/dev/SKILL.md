---
name: dev
description: Fullstack implementation with TDD and disciplined debugging. Use when user mentions /dev, implement, build feature, fix bug, sửa lỗi, red-green-refactor, test-first, triển khai, or ship from spec.
---

# Dev — Fullstack Implementation

Ship production code from specs. Read `CONTEXT.md` and relevant ADRs before touching code.

## Quick Router

| Intent                | Workflow                                  | Reference                      |
| --------------------- | ----------------------------------------- | ------------------------------ |
| New feature from spec | [Implement workflow](#implement-workflow) | [tdd-guide.md](tdd-guide.md)   |
| Bug / regression      | [Debug workflow](#debug-workflow)         | [debug-loop.md](debug-loop.md) |
| Code review           | [Review workflow](#review-workflow)       | —                              |

## Implement Workflow

**Goal:** Vertical slice shipped with tests at confirmed seams.

### 1. Orient

- Read PRD, user stories, or `/align` decisions
- Read `CONTEXT.md` — use glossary vocabulary in code and tests
- Identify modules and **seams** (public interfaces to test at)

**Completion criterion:** Spec source and relevant glossary terms identified; candidate seams listed.

### 2. Confirm seams

Before any test, list seams under test. Get user confirmation. Prefer existing seams; propose new ones at the highest level possible.

> "What's the public interface, and which seams should we test?"

**Completion criterion:** User confirms seams under test before any failing test is written.

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

## Review Workflow

Review diff on two axes:

**Standards** — correctness, security, types, naming (glossary), test quality, a11y

**Spec** — does it implement the PRD/stories? Missing ACs?

Format feedback:

- **Critical** — must fix before merge
- **Suggestion** — consider improving
- **Nice to have** — optional

**Completion criterion:** Every Critical item is fixed or filed as a follow-up issue; Suggestions and Nice-to-haves listed explicitly.

## Stack Defaults

When stack is unspecified, prefer:

- React functional components + hooks (no class components unless error boundary)
- Zustand over Redux
- Type-safe, accessible, performance-focused

Match project conventions when they exist — these are fallbacks only.

## Agent

For large refactors or multi-file implementation in isolated context:

```
Use the dev agent to [task]
```

The agent reads this skill when invoked.
