# Product development

**Use when:** The user requests several product-delivery artifacts from a problem, decision or brief.
Start at the first missing artifact. Read the composition protocol. Do not replace the repository's
native engineering implementation workflow. Produce only requested deliverables.

| Stage | Input / output | Run when |
| --- | --- | --- |
| research | Question -> cited evidence | A decision needs research not already supplied. |
| business | Objectives and evidence -> proposed/confirmed decision | Commercial or strategic choices need analysis. |
| reqs | Brief and decisions -> scoped requirements | Required behavior or AC is missing. |
| review | Requirements -> prioritized findings | Independent scrutiny is requested or part of the requested package. |
| design | Requirements -> UI spec | UI behavior or design specification is requested. |
| plan | Stable scope and capacity -> delivery estimate | Effort or schedule is requested. |
| task | Requirements, optional plan/spec -> work items | New tasks are requested. |
| qa | Requirements, spec or tasks -> test plan or verified report | Coverage or actual testing is requested. |

**Gates:** A blocking business decision or disputed behavior stops final requirements for that
scope. Review findings may return to reqs only within authorized revision scope. Do not overwrite
accepted requirements. A draft conditional estimate may exclude blocked work and state assumptions.
A UI spec is optional; do not make it a requirement for backend-only tasks. QA can use stable AC
without completed tasks, and a test plan is not a test report.

**Finish:** Return the requested artifacts with shared requirement IDs, explicit dependencies,
unresolved decisions and publication status. Do not initiate implementation, ticket creation,
approval or execution unless requested and supported.
