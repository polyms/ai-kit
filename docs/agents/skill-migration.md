# Canonical skill migration

The live catalog and native library have one entry for each responsibility (20 canonical skills).
Legacy names remain MCP aliases, not independently discoverable skills. Native clients invoke the
canonical command and state the intended branch. Existing published SDK releases are immutable.

| Previous skill | Canonical skill | Preserved reference |
| --- | --- | --- |
| to-prd | reqs | skills/reqs/lean-prd-workflow.md |
| to-issues | task | skills/task/vertical-slicing.md |
| triage | track | skills/track/triage-workflow.md |
| align-loop | align | skills/align/decision-loop.md |
| domain-modeling | align | skills/align/domain-modeling.md |
| arch-refactor | arch | skills/arch/refactor-workflow.md |
| collab | dev | skills/dev/feature-preparation.md |
| e2e | qa | skills/qa/e2e-workflow.md |
| code-review | review | skills/review/code-review-workflow.md |

The remaining engineering skills setup, arch, dev, devops, craft, align and build-feature-map are
available in MCP with their own templates. Setup supplies canonical sources and operation routes;
the host selects real tools and permissions. No new runtime, adapter or automatic write authority.

## Behavioral acceptance

- Lean PRD: no repeated discovery, preserve test seam and explicit open-question deferral gates,
  human-readable stories, mapped label, tracker receipt and required mirror.
- Vertical slicing: preserve approved stories, prefactoring, P0 order, dependencies, explicit
  approval, real blocker IDs, optional mapped labels and parent protection.
- Triage: preserve queue buckets, external PR policy, category/state machine, verification,
  redundancy and prior rejection, agent brief, disclaimer, override, wontfix and out-of-scope record.
- Align: retain one-question design tree, calibration, vocabulary updates, ADR three-part test,
  delegated unresolved-question handoff and no invented business decisions.
- Arch: preserve seam vocabulary, deepening, candidate report and grill; never implement a report.
- Dev: preserve feature-map/brief/PRD/ADR/UI packet gates, TDD, characterization, debug and ship
  evidence; use inline fallback without claiming absent subagents.
- QA: preserve functional coverage and E2E flake, sharding, journey, trace and CI workflows.
- Review: preserve artifact review and independent Standards/Spec/Simplify code review, including
  exact revision, unavailable-spec/partial-diff handling and actionable findings.

Existing local installations should rerun bootstrap or reinstall canonical skills. Remove old copies
only when they are known to belong to AI Kit, not personal user skills. Do not silently execute a
legacy write workflow from a read-only request.

The legacy template-only directories may temporarily remain to keep existing mutable-main consumers
and old local documentation links working; they contain no SKILL.md and do not participate in routing.
Canonical templates and workflow authoring live in the receiving skill directories.
