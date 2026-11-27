# Canonical skill migration and responsibility boundaries

The live MCP and native catalogs have 26 canonical skills, derived from 29 original entries.
Only three entry points are consolidated. They remain MCP migration aliases, not independent skills.

| Retired entry | Canonical skill | Preserved workflow |
| --- | --- | --- |
| to-prd | reqs | skills/reqs/lean-prd-workflow.md |
| to-issues | task | skills/task/vertical-slicing.md |
| triage | track | skills/track/triage-workflow.md |

## Do not merge distinct responsibilities

| Skill | Independent responsibility |
| --- | --- |
| align | Explicit combined alignment session; composes align-loop and domain-modeling |
| align-loop | Calibrated decision tree, one question per turn |
| domain-modeling | Active glossary, terminology and justified ADR changes |
| arch | Deep-module vocabulary and interface/seam design |
| arch-refactor | Repository assessment, candidate report and refactor selection |
| collab | Cross-principal feature preparation and verified spec packet |
| dev | Implementation, TDD and debugging |
| qa | Functional coverage, UAT and environment-specific QA evidence |
| e2e | Browser automation harness, flake, journeys, CI test-job stability |
| review | Non-code work artifact critique |
| code-review | Standards, Spec and Simplify source-code review |

Composition or shared vocabulary is not duplicate methodology. Keep distinct inputs, outputs,
invocation policy, authority and completion gates. Setup records the canonical sources and
operation routes; the host checks actual capabilities and permissions.

## Behavioral acceptance of the three consolidations

- Lean PRD: reuse approved decisions, preserve test seams, open-question/deferral gates,
  readable stories, mapped labels, tracker receipt and required mirror.
- Vertical slicing: preserve approved stories, prefactoring, P0 order, dependency order,
  explicit approval, real blocker IDs, mapped labels and parent protection.
- Triage: preserve queue buckets, external PR policy, category/state machine, verification,
  redundancy and prior rejection, agent brief, disclaimer, override, wontfix and out-of-scope record.
  Ordinary tracker inspection must never implicitly start triage mutations.

Existing local installations should rerun bootstrap. Retire only known AI Kit symlinks for the three
aliases; preserve personal skills. Existing SDK snapshots are immutable. Legacy template-only
directories for these aliases may remain temporarily for mutable-main compatibility; they contain
no SKILL.md. Do not create a second invocation or infer write authority from an alias.

## Semantic handoff regression

Native entries alone do not establish correct routing. Maintain the agent, skill, project-guide and site handoff regression in `scripts/bootstrap-clients.test.mjs`. E2E harness work routes to `e2e`, feature-packet preparation to `collab`, glossary/ADR mutation to `domain-modeling`, design-tree questioning to `align-loop`, architecture assessment to `arch-refactor`, and source review to `code-review`. Functional QA, implementation, seam design and artifact review retain their respective independent responsibilities. Check positive and negative routes when changing skill boundaries.
