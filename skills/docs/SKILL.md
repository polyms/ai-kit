---
name: docs
description: Developer-facing documentation — API reference, tutorials, integration guides,
  migration notes. Invoke with /docs, write docs, API docs, tutorial, hướng dẫn tích hợp,
  viết tài liệu kỹ thuật, or use techlead for long doc sessions.
disable-model-invocation: true
---

# Docs — Technical Writing

Write **developer-facing** docs for systems that already exist (or are shipping). Not PRDs,
not UI specs, not marketing copy.

**Boundary vs `/reqs`:** `/reqs` owns product requirements (what to build). **`/docs`** owns how
to use/integrate what was built.

**Boundary vs `/dev`:** `/dev` owns production code and TDD. **`/docs`** may cite seams and
examples; does not implement features or rewrite AC.

**Boundary vs `domain-modeling`:** Reading `CONTEXT.md` for vocabulary is fine. Active glossary
or ADR updates → escalate; do not expand product language in docs alone.

## Soft setup dependency

Prefer `docs/agents/language.md` when present for documentation language. No `/setup` gate.

## Quick Router

| Intent                         | Workflow                                  |
| ------------------------------ | ----------------------------------------- |
| API / MCP / CLI reference      | [Reference workflow](#reference-workflow) |
| Tutorial / how-to              | [Tutorial workflow](#tutorial-workflow)   |
| Breaking change / migrate      | [Migration workflow](#migration-workflow) |
| Review existing docs for drift | [Drift workflow](#drift-workflow)         |

## Reference Workflow

**Goal:** Accurate surface docs a stranger can call without Slack.

### 1. Orient

- Name the **public surface** (HTTP routes, MCP tools, CLI, package exports)
- Read types / OpenAPI / MCP schemas / skill frontmatter / ADRs that define contracts
- Note audience (integrator, contributor, agent author)

**Completion criterion:** Surface and audience stated; source-of-truth files listed.

### 2. Draft

For each operation/tool cover:

- Purpose (one sentence)
- Auth / prerequisites
- Inputs (required vs optional) + types
- Outputs / side effects
- Errors callers must handle
- One runnable example (curl, code, or MCP call)

**Completion criterion:** Every public entry has purpose, auth, I/O, errors, example.

### 3. Verify

Run or mentally walk each example against current code. Flag undocumented behavior and
undocumented-but-public surface as gaps.

**Completion criterion:** Examples match current contracts; gaps listed or fixed.

## Tutorial Workflow

**Goal:** Numbered path from zero to a working outcome.

### 1. Define outcome

One sentence: “After this, the reader can __.” Out of scope listed.

**Completion criterion:** Outcome + out-of-scope confirmed (or assumed and stated).

### 2. Steps

1. Prerequisites (tools, env, access)
2. Ordered steps — each step does one thing and has a **verify** (command, UI check, expected
   output)
3. Common failure paths (short)

Do not invent product behavior — if a step needs undecided product choice → `/reqs`.

**Completion criterion:** Stranger can finish without asking; every step has verify.

## Migration Workflow

**Goal:** Breaking-change readers upgrade without guessing.

- Before / after contracts
- Who is affected
- Step-by-step migrate + verify
- Rollback note when relevant

**Completion criterion:** Migrate path + verify for the happy case; unknowns marked.

## Drift Workflow

**Goal:** Docs match code (or explicit known drift).

1. Diff doc claims vs code/schema
2. Fix docs or file `/dev` issues when code is wrong
3. Do not “fix” product by documenting wishful APIs

**Completion criterion:** Drift list empty or each item assigned (doc fix vs `/dev` bug).

## Output locations

Prefer existing project paths (`docs/`, `apps/*/README`, skill body, kit site content). Ask
before creating a new top-level docs tree.

## Agent

For long doc sets or multi-file reference work:

```
Use the techlead to [task]
```

The agent reads this skill when invoked.

## Handoff

When/why cues (not a pasteable menu). End with `## Next Step` (CONTEXT.md **Handoff**) after docs
ship — prefer **exactly one**:

- Ship / link the doc path — docs done
- `/dev` — drift found that needs code fixes
- `/reqs` — undecided product needs discovery, stories, or enterprise PRD
- `/align` — plan or domain still fuzzy; need design-tree grill before more docs

Pick one preferred next action (two max only when the fork is genuine — each with when).
Escalation cues (cite `/devops` for infra Knowledge; pair with `/e2e` for tester how-to) may appear
in body prose; `## Next Step` still names one preferred.

**Completion criterion:** `## Next Step` names one preferred next action (two max with when/why).
