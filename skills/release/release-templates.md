# Release templates

## Readiness report

- Release / version / environment: [Confirmed target]
- Scope and references: [Changes, tickets, known exclusions]
- Decision: [Ready / conditional / not ready / insufficient evidence; recommendation only]

| Gate | Status | Evidence | Owner / next action |
| --- | --- | --- | --- |
| CI and build | [Pass / Fail / Blocked / Not run / Not applicable] | [Run link] | [Known] |
| Functional QA | [Status] | [Test report] | [Known] |
| Migration and configuration | [Status] | [Evidence] | [Known] |
| Rollback and monitoring | [Status] | [Evidence] | [Known] |

Add gates for relevant payments, security, privacy, performance and operational support.
Do not mark a gate passed merely because it appeared in a checklist.

## Go-live checklist

- [ ] Confirm scope, deployment artifact and release window.
- [ ] Verify applicable environment settings and migration/recovery plan.
- [ ] Confirm QA, critical defects, monitoring and rollback trigger.
- [ ] Obtain required approval.
- [ ] Deploy only when authorized; record actual deployment ID.
- [ ] Verify production smoke tests and monitor defined signals.
- [ ] Record outcome, incidents and next actions.

Customize to the release. Mark inapplicable checks rather than claiming completion.

## Release notes

[Version / date, if confirmed.]

### What's changed

[User-facing improvements and fixes, grouped by outcome.]

### Important information

[Breaking changes, migration steps, known limitations or actions, when applicable.]
