# QA templates

## Test plan

- Scope and requirement references: [Version, features, IDs]
- Environment and test data: [Build, roles, prerequisites]
- Strategy and priority: [Risk-based coverage, manual/automated split if relevant]
- Entry criteria: [Prerequisites]
- Exit criteria: [Agreed thresholds; mark proposals]
- Exclusions and risks: [Specific gaps]

## Test case

**TC-01: [Observable behavior]**

- Requirement: [Real BR/FR/AC ID or link]
- Priority: [Risk-based, proposed if not agreed]
- Preconditions and data: [Setup]
- Steps:
  1. [Action]
  2. [Action]
- Expected result: [Observable outcome; for denied API requests verify no DB side effects]
- Actual result: [Only after execution]
- Status: [Not run / Pass / Fail / Blocked / Not applicable]
- Evidence / bug: [Real link, if any]

For owner-only team actions, consider independent authorization tests when applicable:
non-owner direct API access, owner of team A targeting team B, and forged client claims
such as role=owner. The backend should derive authorization from trusted server identity,
not user-supplied request fields. Mark these variants conditional when the tenant or
request schema is unknown; do not invent product policy or approved AC.

## Requirements coverage

| Requirement       | Cases    | Execution status | Gap                                       |
| ----------------- | -------- | ---------------- | ----------------------------------------- |
| [ID and behavior] | [TC IDs] | [Actual]         | [Missing coverage or None if established] |

## Test report

- Build / environment / date: [Actual]
- Planned / pass / fail / blocked / not run / not applicable: [Reconciled counts]
- Coverage: [Requirements covered and missing; define denominator if using a percentage]
- Defects and evidence: [IDs and links]
- Residual risks: [Impact and mitigation]
- Recommendation: [Ready / not ready / insufficient evidence, with rationale]
