# Team Invitation: neutral-prompt AI Kit-assisted candidate

**Artifact date:** 2026-11-23  
**Source:** user-uploaded 146-line `Team Invitation — Implementation Plan (Draft)` containing a self-reported four-call AI Kit MCP audit; not a raw host/provider tool trace  
**Context:** User submitted the artifact immediately after the neutral-prompt assisted-run instructions. It is a **candidate** ChatGPT Instant assisted arm, **not a verified controlled experiment**. The precise submitted prompt, model/effort setting, AI Kit connection state and invocation trace cannot be independently reproduced from the Markdown alone.  
**Scope:** Owner-only Team Invitation planning and QA. **UI design scenarios omitted** by user direction.

## Approved scenario and output

BR-01 Owner-only invitations; AC-01 valid email produces `pending`; AC-02 invalid email shows error and creates none; AC-03 non-owner denied. Two developers; resend and expiry excluded; no historical velocity/actual effort and no delivery commitment. Only a draft was requested.

Observed:
- **8 tasks**, TI-01 through TI-08, including contract, persistence, validation, server authorization, create API, UI, QA and review.
- Task range sums exactly to **8–13 developer-days** (lower: 0.5+1+0.5+1+1+1+2+1=8; upper: 1+2+1+1.5+2+1.5+3+1=13). A **separate** planning allowance of 2–3 dev-days yields a 10–16 dev-day planning envelope; no second addition.
- No elapsed duration or delivery date inferred from two developers. Assumptions A1–A4 and dependencies/unknowns D1–D3, U1–U3 are explicit.
- **12 QA cases, 12 Not run**; 4/4 BR/AC IDs mapped in a task/case traceability matrix.
- **TC-07:** authenticated non-owner direct API request denied, no DB effects.
- **TC-08:** conditional forged `role=owner` claim rejected when request schema permits such an input.
- **TC-09:** conditional cross-team Owner of team A targeting team B *without* Owner permission on B, denied and no invitation for B.
- **TC-12:** conditional persistence failure atomicity; no false success or partial writes. This is robustness coverage, not a new approved requirement.
- No asserted API error codes, implementation, test execution, delivery commitment, historical actuals, publication or external mutation.

## Reported AI Kit route and retrieval

The artifact reports **4 MCP invocations**: one `list_skill_packs({})` and one `get_skill_pack` each for `plan`, `task`, and `qa`. The paths contain **8 unique content-bearing files**:

```text
skills/plan/SKILL.md
docs/agents/context-contract.md
docs/agents/work-artifact-standard.md
skills/plan/delivery-plan-template.md
skills/task/SKILL.md
skills/task/task-template.md
skills/qa/SKILL.md
skills/qa/qa-templates.md
```

No Memory Protocol file was reported as loaded, and no historical evidence/Memory retrieval was reported. The prompt did not explicitly require a memory-protocol invocation, and no historical source was available; this is **not** a Memory compliance failure. No second catalog discovery was reported, unlike the earlier AI Kit-specific prompt run. MCP source was described as mutable `refs/heads/main` and no immutable skill revision was claimed.

**Evidence boundary:** This call list is part of the generated answer, not an independently captured MCP trace. Do not report measured latency, tokens, payload bytes or skill invocation causality.

## Comparison: candidate unassisted vs neutral assisted

| Observable item | Unassisted baseline candidate | This neutral assisted candidate |
| --- | --- | --- |
| Artifact file length | 133 lines | 146 lines |
| Model-reported AI Kit calls | 0 | 4 |
| Selected AI Kit packs | N/A | plan, task, qa |
| Tasks | 8 | 8 |
| QA cases | 15 | 12 |
| Effort | 9.0 base, 5.5–15.0 range | 8–13 task range, +2–3 allowance |
| Requirements | BR-01 + AC-01–03 preserved | Same |
| Non-owner direct API denial | Yes | Yes |
| Forged client Owner role | Yes | Yes, conditional |
| Cross-team access | Flagged as conditional risk, not standalone test | TC-09 conditional test |
| Unauthenticated API denial | TC-10 explicit | Not independently specified |
| Client overriding pending state | TC-14 explicit | Not independently specified |
| Persistence failure atomicity | Not independently specified | TC-12 conditional |
| QA execution | None | None |
| Delivery commitment | None | None |
| Historical actual effort | None | None |
| External writes | None reported | None reported |

The baseline is strong and has unique security test coverage. The assisted case has unique conditional cross-team and failure-atomicity checks and fewer reported discovery calls than the earlier forced-MCP prompt run (4 vs 6); **neither test count nor call count is a quality or latency score**.

## Provisional output-only rubric, not an experiment score

| Gate | Baseline | Assisted | Limitation |
| --- | --- | --- | --- |
| Approved scope + BR/AC traceability | Pass in draft | Pass in draft | Neither was executed |
| Estimation arithmetic + stated uncertainty | Pass in draft | Pass in draft | Different assumptions/ranges not benchmark calibration |
| No inferred delivery date | Pass | Pass | No schedule data |
| Direct non-owner server denial | Covered in tests | Covered in tests | Neither API tested |
| Cross-team negative test | Risk noted | Conditional test specified | API/team model unknown |
| Client-supplied status integrity | Dedicated test | Not a dedicated test | Existing baseline advantage |
| Authenticated vs unauthenticated path | Dedicated unauthenticated test | Not a dedicated test | Existing baseline advantage |
| Tool/skill use | No AI Kit reported | Minimal 3-pack route reported | Raw host trace unavailable |
| No external write / invented historical record | No write/retrieval claimed | No write/retrieval claimed | Self-reported |

**Decision:** Candidate comparison supports correct routing and broadly adequate output; no established quality uplift and no statistically meaningful outcome. The two arms should not be treated as one audited paired evaluation until original identical prompt/model settings, tool availability and independent traces are verified. Repeat identical neutral prompts in isolated sessions and grade criterion-by-criterion with the same rubric. Keep UI-design tests out of scope. No paid model calls were initiated.
