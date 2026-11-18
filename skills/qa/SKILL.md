---
name: qa
description: Derive test coverage from requirements and assess manual QA, UAT and regression
  evidence. Use for test cases, test plans, acceptance verification, kiểm thử, kiểm tra chất lượng.
---

# QA

Use [qa-templates.md](qa-templates.md) and the shared work artifact standard
(`docs/agents/work-artifact-standard.md`).

## Design coverage

1. Read requirements, target version, environments, business rules, roles and acceptance criteria.
   Assign stable requirement IDs if missing; label inferred expected behavior as unconfirmed.
2. Identify risk-based scenarios: happy path, invalid input, boundaries, permissions, state
   transitions, failures and regression. Include accessibility, security or migration where relevant.
3. Write cases with preconditions, data, ordered steps and observable expected results. Trace each
   case to requirements; flag requirements without defined expected behavior.
4. Prioritize cases by impact and identify environment/data needs, exclusions and entry/exit criteria.

**Done when:** Critical requirements have positive and negative coverage or explicit gaps.

## Verify and report

1. Execute tests only with available authorized tools, or analyze explicitly supplied test evidence.
   Record build, environment, date and evidence. Never turn planned cases into passing results.
2. Use Pass, Fail, Blocked, Not run, or Not applicable consistently. Mark unverified claims.
3. Link defects and evidence; use `bug` to draft them. Do not change release status or publish
   defects unless requested.
4. Summarize coverage and counts, unresolved risks, retest requirements and release recommendation.

**Done when:** Counts reconcile with the test inventory, gaps are explicit, and the recommendation
is tied to observed evidence.

Use `e2e` for browser automation/CI harness work; this skill owns functional test design and evidence,
not the automated infrastructure.
