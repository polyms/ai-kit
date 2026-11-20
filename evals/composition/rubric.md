# Composition evaluation rubric

Use the same synthetic inputs and mocked tool responses in isolated client sessions. Record skill
revision, model, tool availability, catalog, loaded paths, selected route, handoff evidence and final
output. Supply actual fixtures for stated facts; missing facts remain unknown. Do not use real
tracker mutations or send messages when evaluating.

Score each case criterion Pass / Fail / Unobservable with the exact evidence. Required skills must
be used for the requested branch (or an explicit client-policy blocker reported); skip skills must
not be loaded or executed. Additional stages require a task-specific reason. Check:

- Contract fit and minimal route: upstream outputs satisfy actual downstream prerequisites.
- Context sufficiency: use supplied evidence first, retrieve only relevant missing context; never
  substitute historical memory for live facts or make optional Knowledge/Memory mandatory.
- Context continuity: stable source IDs, accepted scope, assumptions and evidence status survive.
- Gates: blocking work stops or is bounded; optional stages are skipped; revision is bounded.
- Side effects: authorization is independent, exact targets reconciled, partial failures not hidden.
- Completion: requested results and blocked/conditional work are explicit; no fabricated outcomes.
- Loading: protocol and relevant recipe at most once per unchanged session; starter files and
  references only as needed. A single-skill case need not fetch composition material.

Any failed hard gate fails the case regardless of other scores. Unobservable hard gates remain
unverified, not passes. Compare repeated client runs against the same prompts without the
composition guidance. Record response sizes, token usage and latency only when measured.

The [evaluation runner](../README.md) supports local read-only tool simulation and optional judging.
Fixture validation alone does not execute a model. Native client behavior requires separate runs.
