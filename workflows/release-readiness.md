# Release readiness

**Use when:** The user asks to assess a release and optionally prepare a stakeholder update. Read
the composition protocol.

| Stage | Input / output | Run when |
| --- | --- | --- |
| track | Release scope and filters -> current change/defect snapshot | Actual work item status is needed. |
| qa | Target version, requirements and test evidence -> coverage/report | Verification has gaps or must be assessed. |
| release | Change scope, QA, CI and environment evidence -> readiness report | A gate evaluation, checklist or release note is requested. |
| comms | Readiness decision status -> stakeholder draft | A release update is requested. |

**Gates:** Evidence must match the actual version and target environment. A successful preview
build does not imply production deployment or functional QA. Missing applicable critical QA,
rollback or approval evidence yields conditional/not-ready/insufficient-evidence status as
appropriate. Report critical blockers rather than proceeding to a false go-live sign-off.
Release recommendations never authorize a merge, deploy, flag change or message send.

**Finish:** Return an evidence-backed gate report and requested message. If deployment was
explicitly requested but an applicable blocker prevents proceeding, report it and stop. Otherwise
do not initiate deployment. Mark notification status only from an authorized send receipt.
