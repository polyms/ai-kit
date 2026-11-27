---
name: e2e
description: End-to-end test automation — Playwright flake, CI parallelization, journey
  suites, traces. Invoke with /e2e, Playwright flake, stabilize E2E, CI test sharding, test
  automation, flake CI, làm ổn định E2E, or use tester for long suite work.
disable-model-invocation: true
---

# E2E — Test Automation

Use `qa` for functional coverage, UAT, environment-specific verification and QA reporting. This skill owns the browser harness, automation code and test-job stability; do not infer QA approval from suite results.

**All hosts:** Read [portable skill standard](../../docs/agents/portable-skills.md). Resolve the target project's execution profile and actual authorized tools. A local CLI, workspace or delegation is not mandatory to read methodology; use verified equivalent evidence, or report unavailable operations. Do not infer approval or claim unperformed writes/tests.

**Codex / GitHub Copilot:** Apply [client compatibility](../../docs/agents/client-compatibility.md) before this workflow.

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

**Feature map:** Read `docs/agents/feature-map.md` when it exists. An area is a markdown link in
the index to a sibling `*.md`. When area links exist, read the repo `SKILL.md` at `Skill` and use
the one area file's `Driving it` section as journey coverage. Do not explore that surface. Do not
run `/build-feature-map` on this turn. Flake, shard, and triage never hand off to
`/build-feature-map`.

## Soft setup dependency

No `/setup` gate. Use repo Playwright/Cypress config and CI workflows as source of truth.

## Quick Router

**Execution mode:** For diagnosis, review or test-plan-only requests, inspect existing traces/config/results and return findings, proposed harness changes or test cases. Do not edit tests/config, quarantine, create issues, trigger CI or run a browser journey that mutates live state. An installed write/execution tool is not authorization. For a requested harness fix or new coverage, verify the authorized target and write route before editing; for requested execution, use the authorized environment and test data. If a requested route is unavailable, return proposed changes or an explicit Not run/blocker. Every workflow and delegated tester inherits these boundaries. Existing read-only CI evidence may be inspected in any mode.

A remote host may inspect actual CI artifacts or run a supported browser/test tool at the correct
revision. Without execution capability, provide diagnosis and test plan only; never claim test PASS.

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
5. Re-run in the matching workspace and CI when available; otherwise verify the available matching test evidence and disclose missing execution; document repro

**Completion criterion:** For diagnosis-only, evidence, hypothesis, proposed fix and reproduction/verification limits are explicit; no mutation. For authorized fixes, flake reproduced then fixed, or quarantined with owner; sleep-based
“fixes” rejected unless justified as last resort; gate-deciding suite/CI command re-run on
matching workspace or authorized matching CI evidence before claiming green ([invocation.md](../../docs/agents/invocation.md)
**Verification after delegation**).

## Parallelize Workflow

**Goal:** Lower wall-clock CI without new flakes.

1. Map suite duration and file independence
2. Enable sharding / matrix only when tests are isolated
3. Cap workers to infrastructure reality; measure before/after
4. Fail the plan if parallelization shares mutable fixtures

**Completion criterion:** For plan-only, bottleneck evidence, isolation risks and proposed sharding/measurement plan are stated; no speedup or stability is claimed. For authorized changes, wall-clock improved or bottleneck named; no new flake class introduced, verified or explicitly unverified.

## Journey Workflow

**Goal:** One critical user journey covered end-to-end — after product slices exist.

1. Name journey from PRD/AC (happy path + one failure path max for v1)
2. Confirm harness exists; do **not** invent a new stack for a one-off
3. Prefer role-based selectors / stable test ids over brittle CSS
4. Attach trace/video on failure in CI
5. Keep `/dev` TDD at seams for unit logic — E2E asserts observable journey only
6. When the feature map has an area for this journey, cover the `Driving it` paths that match the
   AC. When the pointer says `Status: declined`, say nothing about the map. Otherwise, when the
   index has no area links, say once, in the user's language, that the repo has no feature map,
   this session explores as usual, and `/build-feature-map` lets later sessions open one file
   instead. Then finish this journey.

**Completion criterion:** For draft-only, proposed journey coverage and selectors are grounded in available evidence and tests are Not run unless matching results exist; no harness edit. Journey green only on actual matching workspace or CI evidence (exit code/logs, not a nested agent summary); out-of-scope journeys listed. If the index has no areas and the map is not
declined, `## Next Step` is `→ /build-feature-map`.

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

| Cue                                    | Typical next                                   |
| -------------------------------------- | ---------------------------------------------- |
| Feature AC / seam tests                | `/dev`                                         |
| Journey walked, no areas, not declined | `/build-feature-map`                           |
| Deploy/CI infra (non-test)             | `/devops`                                      |
| Public flows stabilized                | optional `/docs` for tester/contributor how-to |
| Harness changes on a branch            | `/code-review` when ready for merge            |
| Suite green; nothing queued            | ship / done                                    |

**Completion criterion:** `## Next Step` names one preferred next action (two max with when/why).
