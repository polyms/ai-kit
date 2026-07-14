# Example: feature through the ai-kit pipeline

Walkthrough of one vertical feature across skills — **illustrative**, not a live PRD.
Use when onboarding contributors or checking that handoffs stay in lane.

## Scenario

**Ask:** "Add a public Knowledge catalog filter by intent (`incident` | `design` |
`toolchain`) on the kit landing site."

**Repo facts assumed:** TanStack Start landing app, Ops CMS Knowledge already exists,
`CONTEXT.md` already defines Knowledge intents.

## Stage map

| Stage               | Invoke         | Principal                             | Artifact out                                                         |
| ------------------- | -------------- | ------------------------------------- | -------------------------------------------------------------------- |
| Align               | `/align`       | (main chat — no subagent)             | Decision summary: filter is MVP; search URL param; no new CMS schema |
| Product             | `/reqs`        | `pm`                                  | Enterprise PRD draft (chat; does not publish)                        |
| Publish             | `/to-prd`      | — (skill, main chat)                  | Lean tracker PRD + ready-for-agent                                   |
| Issues              | `/to-issues`   | —                                     | Slice issues (UI filter, URL sync, empty state)                      |
| Design              | `/design`      | `designer`                            | `docs/design/knowledge-intent-filter.md`                             |
| Implement           | `/dev`         | `developer`                           | Code + tests at confirmed seams                                      |
| Review              | `/code-review` | `techlead`                            | Severity-tagged Standards / Spec / Simplify                          |
| Ops (if deploy red) | `/devops`      | `developer` (exec) / `techlead` (SEV) | Knowledge match → fix → verify                                       |

## Align (grill)

**Settled:** Filter chips in catalog header; `?intent=` sync; default = all intents.
**Deferred:** Saved user prefs, analytics events.
**Not in scope:** New Knowledge authoring UI.

Handoff → `/reqs` (or `/to-prd` if already aligned enough).

## Product

PRD covers: personas (agent authors / ops readers), AC for URL sync and empty state,
MoSCoW — chips + URL = Must. No implementation code.

Handoff → `/to-issues` then `/design`.

## Design

Spec includes CSS intent, four states (loading / empty / error / populated), core-ui
map for chips. Visual acceptance rows for dark default.

Handoff → `/dev` (ask user to attach `/core-ui` if needed).

## Dev (multi-slice)

1. Orient + confirm seams (e.g. catalog search fn, route search params).
2. Solution ladder — reuse existing search seam; no new dep.
3. Red-green per slice; [status-report.md](../skills/dev/status-report.md) after each
   green when >1 slice.
4. [scope-self-check.md](../skills/dev/scope-self-check.md) before done.
5. UI: [visual-ship.md](../skills/dev/visual-ship.md) with evidence.

Example status mid-flight:

```markdown
## /dev status

**Phase:** Red-green
**Current:** slice 2 of 3 — URL ↔ chip sync
**Blockers:** none
**Next:** failing test for `?intent=design` round-trip
```

Handoff → `/code-review`.

Public surface (MCP/API) after ship → optional `/docs` (`techlead`).
Browser journey flake in CI → `/e2e` (`tester`), not seam TDD.

## Code review

Pin `main` (or merge-base). Spec = issue / PRD. Aggregate with 🔴 / 🟡 / 💭. No open 🔴
→ ship.

## DevOps (optional fork)

If Vercel preview fails "No Output Directory": `/devops` → `search_knowledge` intent
`incident` → RB-001 class match → confirm symptom/cause → fix → verify. Close with
[incident-templates.md](../skills/devops/incident-templates.md) if SEV2+.

## Lane discipline (what not to do)

- `developer` does not rewrite PRDs or restyle past design acceptance without `/design`.
- `pm` does not publish tracker issues (`/to-prd` / `/to-issues` only).
- `techlead` does not implement product features (`/dev`).
- `/align` stays in main chat — no subagent grill.
- Marketing / "whimsy" specialists are **out of kit** — keep principals thin.

## Related

- Pipeline overview: [AGENTS.md](../AGENTS.md), [README.md](../README.md)
- Invocation: [docs/agents/invocation.md](../docs/agents/invocation.md)
