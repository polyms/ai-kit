---
name: e2e
description: End-to-end test automation — Playwright flake, CI parallelization, journey
  suites, traces. Invoke with /e2e, Playwright flake, stabilize E2E, CI test sharding, test
  automation, flake CI, làm ổn định E2E, or use tester for long suite work.
disable-model-invocation: true
---

# E2E — Test Automation

Own the **E2E / browser suite and its CI health** — deterministic journeys, flake elimination,
sharding, traces. Not feature TDD at code seams.

**Boundary vs `/dev`:** `/dev` owns red-green at confirmed **seams** (unit/integration) and
one-slice visual evidence ([visual-ship.md](../dev/visual-ship.md)). **`/e2e`** owns the
harness, long journeys, and CI test jobs — do not replace seam TDD with E2E for every AC.

**Boundary vs `/devops`:** `/devops` owns deploy/build/install Knowledge fixes (symptom →
cause → fix → verify). **`/e2e`** owns flaky/slow/wrong **test** jobs and Playwright config.
“No Output Directory” / package install → `/devops`.

**Boundary vs `code-review`:** Pre-merge Standards/Spec/Simplify is `code-review`. Suite
stability is this skill.

## Soft setup dependency

No `/setup` gate. Use repo Playwright/Cypress config and CI workflows as source of truth.

## Quick Router

| Intent                         | Workflow                                      |
| ------------------------------ | --------------------------------------------- |
| Flake / intermittent CI fail   | [Flake workflow](#flake-workflow)             |
| Suite too slow / needs shards  | [Parallelize workflow](#parallelize-workflow) |
| New journey coverage           | [Journey workflow](#journey-workflow)         |
| Trace / triage red CI test job | [Triage workflow](#triage-workflow)           |

## Flake Workflow

**Goal:** Same test fails for the same product reason every time — not timing.

1. Capture failure rate, job name, seed/retry history
2. Prefer **await signal** (role, network idle of known request, test-id) over fixed sleeps
3. Isolate shared state (unique user/db, no cross-test globals)
4. Quarantine only with owner + issue link; do not silent-skip forever
5. Re-run locally and in CI; document repro

**Completion criterion:** Flake reproduced then fixed, or quarantined with owner; sleep-based
“fixes” rejected unless justified as last resort.

## Parallelize Workflow

**Goal:** Lower wall-clock CI without new flakes.

1. Map suite duration and file independence
2. Enable sharding / matrix only when tests are isolated
3. Cap workers to infrastructure reality; measure before/after
4. Fail the plan if parallelization shares mutable fixtures

**Completion criterion:** Wall-clock improved or bottleneck named; no new flake class introduced.

## Journey Workflow

**Goal:** One critical user journey covered end-to-end — after product slices exist.

1. Name journey from PRD/AC (happy path + one failure path max for v1)
2. Confirm harness exists; do **not** invent a new stack for a one-off
3. Prefer role-based selectors / stable test ids over brittle CSS
4. Attach trace/video on failure in CI
5. Keep `/dev` TDD at seams for unit logic — E2E asserts observable journey only

**Completion criterion:** Journey green locally + CI path noted; out-of-scope journeys listed.

## Triage Workflow

**Goal:** Classify a red test job in one pass.

| Class                   | Hand off                        |
| ----------------------- | ------------------------------- |
| Product regression      | `/dev` with repro steps         |
| Flake / harness         | Stay on `/e2e` — Flake workflow |
| Deploy/build/install    | `/devops`                       |
| Spec wrong / missing AC | `/reqs`                         |

**Completion criterion:** Class assigned; one next skill named; no shotgun config edits.

## Agent

Skill folder is `e2e`; long sessions use **`tester`** (skill id ≠ agent id by design — principal
tester owns this skill):

```
Use the tester to [task]
```

The agent reads this skill when invoked.

## Handoff

When/why cues for escalation (not a pasteable menu). End the session with `## Next Step`
(CONTEXT.md **Handoff**) — prefer **exactly one**; two max with when/why:

| Cue                         | Typical next                                      |
| --------------------------- | ------------------------------------------------- |
| Feature AC / seam tests     | `/dev`                                            |
| Deploy/CI infra (non-test)  | `/devops`                                         |
| Public flows stabilized     | optional `/docs` for tester/contributor how-to    |
| Harness changes on a branch | `/code-review` when ready for merge               |
| Suite green; nothing queued | ship / done                                       |

**Completion criterion:** `## Next Step` names one preferred next action (two max with when/why).
