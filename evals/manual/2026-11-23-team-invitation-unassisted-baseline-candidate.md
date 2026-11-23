# Team Invitation: unassisted baseline candidate

**Date in user-supplied artifact:** 2026-11-23  
**Source type:** one user-uploaded Markdown planning draft (133 lines), not a tool/host trace  
**Session classification:** *candidate* unassisted baseline. Its audit says no AI Kit MCP, GitHub, ClickUp or Jira calls, and local `container.exec` was used to create the file. The precise ChatGPT model/mode, original session settings, tool capture and complete prompt are **not independently verified**.

## Preserved scenario

Approved BR-01 (Owner-only), AC-01 (valid email creates pending), AC-02 (invalid email errors and creates no record), AC-03 (non-owner denied); two developers; resend and expiry excluded; no historical actual effort or velocity; no committed delivery date. Draft only. No new product requirement was approved by the document.

## Observations in the submitted draft

| Property | Baseline candidate |
| --- | --- |
| Implementation tasks | 8 (`IMP-01`–`IMP-08`) |
| Base developer-days | 9.0 |
| Effort range | 5.5–15.0 developer-days |
| Effort arithmetic | Base and endpoints reconcile to sum of 8 task rows |
| Delivery elapsed estimate | Not inferred; two developers do not imply a committed calendar schedule |
| Test cases | 15 (`TC-01`–`TC-15`), all planned, not executed |
| Requirements mapped | BR-01, AC-01, AC-02, AC-03 |
| Historical evidence | None reported; judgment-based estimate |
| Tools | User-supplied artifact self-reports `container.exec` for local Markdown; no AI Kit MCP |
| External writes | None reported |
| UI library | No dependency selected or replaced |

### QA strengths and gaps

- Direct authenticated non-owner API denial with unchanged DB state: `TC-07`, `TC-12`.
- Forged client role claim: `TC-08`.
- Server-side pending status integrity when a client supplies `status=accepted`: `TC-14`.
- Unauthenticated request denial: `TC-10`.
- Concrete malformed email fixtures `a@` and missing `@`: `TC-03`, `TC-05`.
- **Cross-team access** is explicitly recognized as a risk/decision if `teamId` is accepted, but **not a separate executable test case**.
- `IMP-05` depends on completed API/authorization tasks in its table; the work could potentially start earlier with an agreed API contract. This is a parallelization opportunity, not a wrong acceptance criterion.
- Some tests cover the same behavior at different layers; test count is **not** a standalone quality metric.
- `TC-08` assumes a client role field; treat it as conditional where the API schema does not support that field.

## Indicative comparison with post-merge AI Kit-assisted Instant sample

| Signal | Candidate unassisted baseline | Previous assisted Instant sample |
| --- | --- | --- |
| Tasks | 8 | 7 |
| Test cases | 15 | 12 |
| Base estimate (dev-days) | 9.0 | 8.5 |
| Estimate range (dev-days) | 5.5–15.0 | 6.0–11.5 |
| Direct non-owner API test | Yes | Yes |
| Forged client Owner role | Yes | Yes (conditional) |
| Cross-team test independently specified | No, tracked as conditional risk | Yes (`TC-09`, conditional) |
| Client override of `pending` status | Yes (`TC-14`) | Not a separate case |
| Unauthenticated API test | Yes | Not a separate case |
| No delivery date commitment | Yes | Yes |
| Actual executed QA | None reported | None reported |

The baseline has meaningful coverage independently of AI Kit. The assisted response puts cross-team authorization directly into a conditional test case. Conversely, the baseline explicitly tests pending-state override and unauthenticated API access. Neither case count nor a slightly different effort estimate establishes higher quality.

## Neutral-prompt assisted candidate received

A second user-supplied ChatGPT draft, submitted after the neutral-prompt assisted
instructions, reports 4 AI Kit MCP invocations and a minimal `plan/task/qa` route.
It has 8 tasks, 12 QA cases, an 8–13 developer-day task range and a separate 2–3
developer-day planning allowance. It turns cross-team access into a conditional
test (TC-09), while this baseline uniquely has dedicated unauthenticated API and
client-side pending-status override cases.

See [neutral-prompt assisted candidate](2026-11-23-team-invitation-neutral-assisted-candidate.md).
This is an **output-level candidate pair**, not a controlled experiment: the
two original complete prompts, client mode/settings and independently captured
call traces have not been authenticated. No measured uplift or efficiency claim.

## Critical comparability warning

**Do not record this as a scored baseline-vs-assisted pair yet.** The earlier assisted Instant artifact came from a prompt explicitly requiring AI Kit MCP and an AI Kit Verification section. The baseline candidate is a new upload following a neutral-prompt experiment, but its exact prompt, ChatGPT effort mode and tool availability have not been independently established. Those differences create selection and instrumentation confounds.

An assisted candidate has now been submitted (linked above). To form a legitimate controlled pair, independently verify the **identical neutral prompt** used in both sessions, mode, tool availability, original prompt and actual calls/usage when exposed. Use the same evaluation rubric, ensure both arms get identical approved requirements and no cross-arm historical memory, and repeat before making any causal claim.

**No paid-model calls were triggered by this evidence review.** Design-system/UI cases remain explicitly out of scope.
