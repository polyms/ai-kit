---
name: release
description: Prepare and evaluate release readiness, go-live checks, rollout and rollback plans.
  Use for release notes, launch checklist, production verification, triển khai release, go-live. Unaccented Vietnamese examples include kiem tra go live, rollout.
---

# Release management

**All hosts:** Read [portable skill standard](../../docs/agents/portable-skills.md) and the target execution profile.

**Codex / GitHub Copilot:** Apply [client compatibility](../../docs/agents/client-compatibility.md) before this workflow.

Use [release-templates.md](release-templates.md) and the shared work artifact standard
(`docs/agents/work-artifact-standard.md`).

1. Identify scope, version, target environment, owners, release window and approved changes.
   Separate previously verified work from this release's new verification.
2. Read the actual change set, QA evidence, CI status and open defects. Identify migration, payments,
   configuration, permissions, monitoring and compatibility checks where relevant.
3. Define go/no-go gates, rollout phases, observable smoke checks, rollback triggers and recovery.
   Assign owners only when confirmed. Mark irreversible migrations and recovery limitations.
4. Assess each gate against evidence: Pass, Fail, Blocked, Not run or Not applicable. A green preview
   build is not evidence of a successful production deployment or functional verification.
5. Produce a readiness report, checklist or user-facing notes appropriate to the request.
   Do not deploy, merge, change flags or approve a launch without explicit authorization.

For environment-specific release or feature questions, compare the approved scope to the
actual target environment/build, deployment or flag evidence, QA confirmation and open
questions independently. Do not infer Production presence from a Dev/Staging test, a completed
ticket or a green deployment. Report missing environment evidence as `Unknown` and preserve
historical revision references when older builds are live.

**Done when:** Every applicable gate has an evidence-backed status, unresolved risk is visible,
and the proposed release decision is distinct from authorized sign-off.

Use `devops` for infrastructure incidents and implementation; `qa` owns test coverage and evidence.
