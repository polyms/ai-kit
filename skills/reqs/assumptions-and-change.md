# Assumption and requirement change templates

## Assumption register

| ID | Assumption | Evidence / gap | Impact if false | Validation / status |
| --- | --- | --- | --- | --- |
| AS-01 | [Testable premise] | [Source or unknown] | [Affected outcome] | [Proposed test / status] |

Prioritize assumptions whose failure changes the product decision, scope or feasibility.
Do not convert assumptions into confirmed requirements without evidence or stakeholder direction.

## Change request

- Change and rationale: [Requested delta and source]
- Baseline: [Existing version, requirement IDs and confirmed behavior]
- Impact: [Scope, rules, acceptance criteria, dependencies, QA, cost or schedule if known]
- Decision: [Proposed / accepted / rejected / pending]
- Affected artifacts: [Real references and changes needed]
- Open questions: [Blocking uncertainties]

Keep stable requirement IDs where meaning remains unchanged. Do not silently overwrite prior decisions.

## Traceability

| Requirement / rule | Acceptance criteria | Related task | Test / defect | Status |
| --- | --- | --- | --- | --- |
| [ID and behavior] | [AC IDs] | [Real ticket ID] | [Real IDs] | [Verified or unknown] |
