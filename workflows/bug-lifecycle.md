# Bug lifecycle

**Use when:** The user requests defect capture, tracker follow-up, fix verification or release impact.
Read the composition protocol and preserve the original defect evidence.

| Stage | Input / output | Run when |
| --- | --- | --- |
| bug | Observation and expected behavior -> defect draft | A report is needed; skip for an existing sufficient report. |
| track | Defect or ticket ID -> current tracker snapshot / update receipt | Check duplicates or inspect/update an existing ticket as requested. |
| qa | Defect, build and acceptance criteria -> retest plan / evidence | Retest or regression coverage is requested. |
| release | Verified QA and release scope -> readiness recommendation | Release impact or readiness is requested. |

**Gates:** An incomplete report can remain a draft with unknowns. Do not manufacture root cause,
independent reproduction or a fix. If an exact duplicate is found, report it instead of creating
another issue. A fix claim without a runnable build or supplied test evidence remains unverified;
QA may return a Not run plan. Use track after QA only if the user requested the status update and
the tracker supports the exact transition. Do not close tickets on the basis of planned tests.

**Finish:** Return the evidence, actual ticket link if an authorized write succeeded, test status
and release impact only if requested. Implementation and deployment are separate actions.
