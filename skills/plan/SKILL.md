---
name: plan
description: Estimate effort and plan delivery using scope, dependencies, capacity and risks.
  Use for delivery plans, estimates, milestones, man-days, lập kế hoạch, ước lượng.
---

# Plan

Use [delivery-plan-template.md](delivery-plan-template.md) and the shared work artifact standard
(`docs/agents/work-artifact-standard.md`).

1. Establish the scope, target outcome, team availability, deadline and constraints. Distinguish
   commitments from proposals. If scope is incomplete, estimate only known work and flag gaps.
2. Decompose work into independently verifiable deliverables. Include applicable discovery, UI,
   backend, integration, migration, QA, review, release and coordination effort without double counting.
3. Estimate effort per deliverable as a range or justified point estimate. State the unit and basis.
   Separate person-days of effort from elapsed working days, and list assumptions and exclusions.
4. Map dependencies, ownership, available capacity and parallelism. Compute total effort and
   feasible schedule; do not divide effort by team size when dependencies constrain execution.
   Account for holidays, part-time allocation and non-project work when known.
5. Identify critical dependencies, uncertainty, contingency and options for scope reduction.
   Explain what would change the estimate. Use the template at the detail level requested.

**Done when:** Effort totals reconcile; elapsed schedule respects dependencies and capacity;
assumptions, risks and unknowns are visible. Avoid presenting unapproved dates as commitments.

Use `task` for individual work tickets, `business` for financial analysis and `reqs` for scope gaps.
