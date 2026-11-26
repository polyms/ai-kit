---
name: qa
description: Derive test coverage from requirements and assess manual QA, UAT and regression
  evidence. Use for test cases, test plans, acceptance verification, kiểm thử, kiểm tra chất lượng. Unaccented Vietnamese examples include viet test case, ra coverage.
---

# QA

Use [qa-templates.md](qa-templates.md) and the shared work artifact standard
(`docs/agents/work-artifact-standard.md`).

## Design coverage

1. Read requirements, target version, environments, business rules, roles and acceptance criteria.
   Assign stable requirement IDs if missing; label inferred expected behavior as unconfirmed.
2. Identify risk-based scenarios: happy path, invalid input, boundaries, permissions, state
   transitions, failures and regression. Include accessibility, security or migration where relevant.
   For role-restricted or multi-tenant actions, test direct API access beyond UI hiding.
   Where applicable, include a different-team target and forged client owner-role claim.
   Treat these as threat-model variants of existing authorization rules, not new requirements;
   label variants conditional when API or tenant details are unknown.
3. Write cases with preconditions, data, ordered steps and observable expected results. Trace each
   case to requirements; flag requirements without defined expected behavior.
4. Prioritize cases by impact and identify environment/data needs, exclusions and entry/exit criteria.

**Done when:** Critical requirements have positive and negative coverage or explicit gaps.

For environment-specific feature work, use the **authorized, current source** of the
feature map and target revision/build. Repository test fixtures or exported map bundles are
not automatically canonical when a project service owns the map. Compare approved
requirements to observed behavior without treating either as a substitute for the other.
A missing map or test run is `Unknown`, not proof that the feature is unavailable.

## Verify and report

1. Execute tests only with available authorized tools, or analyze explicitly supplied test evidence.
   Record build, environment, date and evidence. Never turn planned cases into passing results.
2. Use Pass, Fail, Blocked, Not run, or Not applicable consistently. Mark unverified claims.
3. Link defects and evidence; use `bug` to draft them. Do not change release status or publish
   defects unless requested.
4. Summarize coverage and counts, unresolved risks, retest requirements and release recommendation.
5. For feature availability or behavior verification, identify the exact environment,
   build/commit or snapshot, evidence, scope/areas verified and observed time. Keep partial
   coverage explicit; a result from another environment or prior build does not transfer
   automatically. Distinguish test execution from a separate authorized QA confirmation where
   the consumer requires one. An assistant may propose a confirmation but cannot self-approve.

**Done when:** Counts reconcile with the test inventory, gaps are explicit, and the recommendation
is tied to observed evidence.

Use `e2e` for browser automation/CI harness work; this skill owns functional test design and evidence,
not the automated infrastructure.
