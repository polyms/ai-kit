# Team Invitation manual evaluation: everyday-mode baseline (ChatGPT)

**Date:** 2026-11-22
**Status:** User-provided, qualitative, skill-assisted ChatGPT outputs. **Not** a paired
baseline-vs-assisted benchmark, verified provider trace, cost measurement or release gate.

## Product priority

The tested user's **ChatGPT Instant** was their everyday configuration and the
primary target for *this ChatGPT evaluation*. Medium/High were comparators in
that host only. The general AI Kit quality target is a **client's typical/default/
fast configuration**, not a requirement to have ChatGPT's model modes.
Improvements must preserve small, correct routing, critical QA coverage,
truthful provenance and low retrieval overhead across hosts. Avoid unnecessary
composition files and inflated context.

## Test inputs and scope

One shared scenario: approved BR-01 Owner-only Team Invitation; AC-01 valid email
creates `pending`, AC-02 invalid email fails with no record, AC-03 non-owner
denied; two developers; no verified historical effort, allocation or committed
delivery date; resend and expiry out of scope. Deliver effort estimate, linked
tasks and positive/negative/API/authorization test cases as a draft only. Use
AI Kit MCP and assess Context Contract and Memory without assuming a provider.

Source evidence: user-supplied High plan and MCP-call summary, Medium plan and
call log, and Instant plan and call summary. The full session transcripts and
independent provider logs are not available in this evaluation record.

## Observed results (self-reported MCP calls, not verified wire traces)

| Measurement | ChatGPT Instant (daily use) | ChatGPT Medium | ChatGPT High |
| --- | ---: | ---: | ---: |
| Selected packs | plan, task, qa | plan, task, qa | plan, task, qa |
| Reported MCP calls | 5 | 5 | 9 |
| Unique file bodies | 9 | 10 | 11 |
| Implementation tasks | 7 | 8 | 8 |
| Draft test cases | 10 | 12 | 11 |
| Effort baseline/point of reference | 8 dev-days | 7 dev-days | midpoint 8.5 dev-days (not a baseline claim) |
| Reported requirement ID coverage | 4/4 | 4/4 | 4/4 |
| Historical memory recall/persistence | none | none | none |
| External writes | none | none | none |

These are three sessions without repeated trials, a control group, reliable
latency/token measurements or independent model-provider trace. Do not infer
quality uplift, relative model intelligence, financial savings or statistical
significance from these counts.

## Findings and owner

| Priority | Finding | Scope | Follow-up |
| --- | --- | --- | --- |
| P1 ChatGPT Instant sample | No explicit cross-team authorization or forged client-role test case in Instant draft | QA depth | Add conditional threat-model variants to QA guidance and CP-18/CP-19; do not change approved ACs |
| P2 Medium | Suggested 4–6 elapsed working days without verified developer allocation | Planning calibration | Clarify that team headcount alone cannot support elapsed dates |
| P2 High | Report claimed catalog has 14 packs; AI Kit production `list_skill_packs` observed 13 | Factual verification | Derive `packCount` from catalog array and require exact source-based statements |
| P2 All | Server commit `6b6508bf...` is reported; individual skill file revisions unverified | Provenance | Explicitly label MCP `main` as mutable with null revision; use distinct pinned provider for immutable evidence |
| P3 High | More MCP calls and optional recipe retrieval without clear output advantage in this sample | Tool efficiency | Prefer batched exact-path retrieval, optional recipes, and no reloads |

AI Kit server reported `0.3.0` and production commit
`6b6508bf31301c193244d9703ee66a636ca65e65` for these runs. This
identifies deployment, **not** an immutable snapshot of dynamically fetched
`main` Markdown. The separately versioned `0.3.3` skill distribution must
not be silently equated to those MCP reads.

## Everyday-configuration regression gates

1. **Routing:** choose `plan → task → qa` when approved requirements are supplied;
   no unnecessary `reqs`, `track`, design or publishing stage.
2. **Retrieval:** load necessary exact paths and required shared guidance once;
   optional composition recipe is fetched only if it materially helps.
3. **Planning:** reconcile total effort and task estimates, with unknown historical
   actuals and developer allocation; no calendar commitment or unsupported ETA.
4. **Security QA:** direct API non-owner denial, team scoping and client-role
   forgery checks when relevant, all explicitly marked Not run; no new policy.
5. **Provenance:** report catalog pack count only from the array, identify the
   MCP source as mutable `main`, and never reuse server build SHA as file hash.
6. **Memory/governance:** no invented recall, write, approval, ticket ID or execution.

Regression inputs: `RT-39` for routing; `CP-18` for the full draft; `CP-19`
for authorization QA, `CP-20` for an existing non-Polyms design system and
`CP-21` for a greenfield optional Polyms UI Kit recommendation. Run them first in the host's **everyday/default**
configuration. For the original ChatGPT case, this means **Instant**, then
Medium/High with the same prompt and compatible tool setup. Other clients
should use their own normal settings, not emulate ChatGPT effort labels.
Retest in a fresh session after deployment and attach a tool trace when available
before claiming improved behavior.

## Follow-up: post-PR #18 Instant regression

A separate fresh-session ChatGPT Instant output was reviewed on 2026-11-23.
It includes 12 planned cases (up from 10), with conditional forged-client-role
and cross-team authorization tests, and a verified deployment/catalog identity.
See [post-merge Instant regression evidence](2026-11-23-team-invitation-instant-regression.md).
This is a **manual single-run observation**, not paired baseline or production
test execution. UI scenarios were explicitly skipped.

## Decision

Improve the smallest compatible MCP response and guidance and add targeted
synthetic regression prompts. **Do not** change approved business requirements,
invent provider-level measurements, treat an MCP deployment SHA as an immutable file hash, auto-run
paid models or tag SDK stable from this manual evidence.
