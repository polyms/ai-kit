# Team Invitation: ChatGPT Instant manual regression after PR #18

**Observed:** 2026-11-23 (Asia/Ho_Chi_Minh)  
**Host configuration:** ChatGPT Instant, the user's everyday ChatGPT mode; not a universal AI Kit tier  
**Target:** AI Kit production MCP deployed at `9a25162df48070e86ff8d9745be7ecc42d4c8055` (PR #18 squash merge)  
**Evidence classification:** One user-supplied output artifact (225 lines) plus a **model-reported** MCP-call list, and independent read-only `server_info` / `list_skill_packs` checks. No raw provider/host execution trace, controlled paired baseline, latency, token usage or executed QA results.  
**Scope:** Team Invitation implementation planning and security QA. Design-system/UI scenario trials CP-20/CP-21 were **deliberately skipped** at the user's request.

## Question and approved inputs

Approved: BR-01 only Owner may invite, AC-01 valid email creates `pending` invitation, AC-02 invalid email shows an error and creates no invitation, AC-03 non-owner cannot invite. Two developers; no historical velocity/actual effort, allocation or committed delivery date. Resend and expiry out of scope. Draft only, no tickets or writes.

The observed Instant session used AI Kit MCP, with reported `plan`, `task`, `qa`; no `reqs`, `design` or `business` selected. The reference pre-PR #18 Instant run is documented in [the original three-mode manual evidence](2026-11-22-team-invitation.md).

## Observed before/after (not a causal estimate)

| Signal | Earlier ChatGPT Instant sample | Post-PR #18 ChatGPT Instant sample | Evidence |
| --- | --- | --- | --- |
| Selected packs | `plan`, `task`, `qa` | `plan`, `task`, `qa` | Both model-reported; output also names the three packs |
| MCP calls | 5 | 6 | Model-authored logs; no independent call trace |
| Unique loaded file bodies | 9 | 9 | Model-authored logs; list of nine paths supplied |
| Implementation tasks | 7 | 7 | Visible output |
| Planned QA test cases | 10 | 12 | Visible output |
| Conditional forged-client-role check | Not explicit | TC-08 | Visible output |
| Conditional cross-team check | Not explicit | TC-09 | Visible output |
| Estimated effort | 6–12 dev-days, baseline 8 | 6–11.5 dev-days, baseline 8.5 | Visible output |
| Delivery elapsed time | Unknown | Unknown | Visible output |
| Approved requirement ID coverage | 4/4 | 4/4 | Visible traceability table |
| Historical effort memory recalled | None reported | None reported | Self-report, not provider audit |
| External writes / QA execution | None reported | 0 QA cases executed, no writes reported | 12 cases explicitly `Not run` |

The changes are **observed differences between one pre- and one post-merge sample**, not statistically significant improvement or proof the AI Kit change caused them. The greater case count is not itself a quality score.

## Post-merge output evidence

- **Planning:** 7 tasks (`TI-01`–`TI-07`) with dependencies, acceptance and BR/AC links. Task estimates sum to **6.0–11.5 developer-days**; per-task midpoint planning baseline sums to **8.5 developer-days**. Proposed 15–25% contingency is shown separately, not added twice.
- **Capacity and scope:** Elapsed duration explicitly **Unknown** despite two developers; approved BR-01 and AC-01–03 preserved; resend/expiry excluded. Existing design system marked unknown/unchanged, no replacement proposed.
- **Security QA:** `TC-07` exercises non-owner direct API denial and unchanged persistence. `TC-08` tries client-supplied `role=owner` **if request schema supports this**; `TC-09` exercises Owner of team A targeting B **if multi-team targeting exists**. The two conditional threat-model variants are not new approved business rules.
- **Other QA:** Valid email persists `pending`, malformed/empty email is rejected with no DB side effects, UI/API/backend integration covered. 12 cases were planned, **0 executed**, all marked **Not run**.
- **Context / Memory:** Existing context reused. Unverified schema, allocation, duplicate invitation rule and historical effort remained unknown. Session reported reading `docs/agents/memory-protocol.md`, evaluating hints and doing no recall/persistence without an eligible source.

## MCP evidence and provenance

The user-supplied session report states **6** AI Kit invocations through 4 `functions.exec` calls: `server_info`, `list_skill_packs`, `get_skill_pack(plan)`, `get_skill_pack(task)`, `get_skill_pack(qa)`, and a second `list_skill_packs` to count the catalog. This is a self-authored tool summary, **not** a verified host/provider audit log.

It reported these **9 unique content-bearing files**:

```text
skills/plan/SKILL.md
skills/plan/delivery-plan-template.md
skills/task/SKILL.md
skills/task/task-template.md
skills/qa/SKILL.md
skills/qa/qa-templates.md
docs/agents/work-artifact-standard.md
docs/agents/context-contract.md
docs/agents/memory-protocol.md
```

An independent read-only check of production MCP during this review confirmed:

| Field | Observed |
| --- | --- |
| Server name | `ai-kit-ops-cms` |
| Server version | `0.3.0` (MCP application version, not skill content release) |
| Environment | `production` |
| Deployment commit | `9a25162df48070e86ff8d9745be7ecc42d4c8055` |
| `list_skill_packs` | `packCount: 13`, equal to `packs.length: 13` |
| MCP Markdown source | `refs/heads/main`, `immutable: false`, `revision: null` |

**Do not conflate** deployment commit with skill-file SHA or the separately versioned `0.3.4` catalog. This observation confirms MCP deployment/catalog metadata, **not** successful public HTTP `0.3.4` release smoke; that check remains unverified in this evidence record.

## Regression gates (qualitative)

| Fixture / gate | Result | Boundary |
| --- | --- | --- |
| `RT-39` minimal routing | **PASS, observed** | Three required packs; no unnecessary work pack reported |
| `CP-18` draft planning and governance | **PASS, observed for output** | Correct total, requirements traceability, unknown delivery, no reported writes |
| `CP-19` authorization QA design | **PASS, observed for output** | TC-07/08/09 cover direct API, forged claim and cross-team conditional variants |
| Executed security QA | **NOT RUN** | No backend, test runner, test identities or DB observations provided |
| Independent MCP trace / tool overhead | **UNVERIFIED** | 6 calls model-reported; no latency, tokens or raw wire trace |
| `0.3.4` pinned HTTP release integrity | **UNVERIFIED** | Requires separate `verify-skill-release` public HTTP smoke |
| CP-20 and CP-21 UI design | **OUT OF THIS REVIEW** | Explicitly skipped by user |

## Follow-up issues (non-blocking)

1. **P3 efficiency:** The final `list_skill_packs` call repeated catalog discovery solely to count packs despite the first response already carrying the catalog. Prefer reusing the first returned `packs.length` / `packCount` unless absent, stale or truncated.
2. **P3 test specificity:** Make TC-09 explicitly stipulate an actor who owns team A **but not** team B; add a concrete invalid email fixture to TC-04.
3. **P3 dependency wording:** `TI-05` can start with an agreed API contract; don't imply completed backend implementation is required before any frontend work.

These are observations for future guidance or fixtures, not authorization to change approved requirements, create tracker tickets or publish new skill content.

## Next phase

According to [Quality Baseline](../../docs/quality/baseline.md), next verify deployed **`0.3.4`** via public immutable catalog/bundle smoke (including retirement of `0.3.3`) and then conduct a **small, paired baseline-vs-assisted evaluation** of Team Invitation using the same host/model/settings with repeated trials and actual traces where accessible. Obtain explicit approval before any paid model requests. Avoid UI-design scenarios in this follow-up.
