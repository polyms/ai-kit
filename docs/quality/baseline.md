# Quality Baseline and Release Verification

Status (2026-11-26): **historical skill delivery verified; new 0.3.5 HTTP release delivery and workflow-augmentation effectiveness are not yet independently measured**.
This is an evaluation and delivery-verification plan, not a claim that skills outperform
the baseline, a new release gate or authorization to run paid models.

## Verified evidence

| Capability | Observed result | Evidence and limit |
| --- | --- | --- |
| P2 production deployment | AI Kit production commit `4c028ae` after PR #14 merge | MCP `server_info` read-only response |
| Historical delivery (retired) | Astra Stg returned core `0.3.3`, revision `2617cd6` | Old smoke evidence, not proof of `0.3.5` production deployment |
| Remote skill metadata | 13 skill packs; five pilot contracts expose optional `memory` hints | AI Kit `list_skill_packs` |
| Post-PR #18 MCP identity | Production server `0.3.0`, commit `9a25162`, `packCount = packs.length = 13`, source `main` mutable | Read-only MCP verification; **not** immutable `0.3.5` HTTP release verification |
| Post-merge ChatGPT Instant regression | 12 planned QA cases with conditional cross-team and forged-role variants; no tests executed | [User-supplied manual evidence](../../evals/manual/2026-11-23-team-invitation-instant-regression.md); no independent model trace or causal control |
| Unassisted Team Invitation baseline (manual pair) | 8 tasks, 15 planned tests, 9.0 developer-days; explicit forged role and status override checks | [User-supplied draft review](../../evals/manual/2026-11-23-team-invitation-unassisted-baseline-candidate.md); shared prompt **confirmed by user**, no independent host trace |
| Neutral-prompt AI Kit-assisted (manual pair) | 8 tasks, 12 planned tests, 8–13 dev-day task range, 2–3 allowance; conditional cross-team and forged-role variants | [User-submitted follow-up](../../evals/manual/2026-11-23-team-invitation-neutral-assisted-candidate.md); 4 MCP calls self-reported, shared prompt confirmed, mode/tool traces not independently verified |
| Memory reference | On-demand `docs/agents/memory-protocol.md` retrieved with full content | AI Kit `get_skill_pack`, exact path selection |
| SDK RC tag | `sdk-v1.0.0-rc.1` published with `next` dist-tag | [GitHub Actions #45020141109](https://github.com/polyms/ai-kit/actions/runs/45020141109) |
| Workflow augmentation outcome | **Partially observed; not measured as uplift** | Same-prompt manual pair documents routing/template/process behavior, not improved underlying model intelligence; no replicated host trace |
| SDK performance and public proxy install | **Unverified** | Release candidate published, but external proxy install/consumer timing not recorded |

These are observed deployment and delivery checks. They do not prove model-output
quality, SDK package consumption in Astra, private memory access, or authorization
to persist or publish any business artifact.

## AI-driven production release verification

Ask an AI client connected to AI Kit MCP:

> Check AI Kit production, verify skill release 0.3.5 and Astra compatibility.

The AI calls `server_info`, then `get_release_info` for the configured
immutable release, and optionally `get_release_info` with
`expectedVersion="0.3.5", checkHttp=true, retiredVersion="0.3.4"` for **bounded public HTTP
checks** (latest and pinned catalogs, QA skill, exact Context Contract, and
retired endpoints returning HTTP 404). That HTTP result is observed from the
**MCP server's network perspective**. A requested-version mismatch fails before HTTP; complete latest/pinned catalog metadata must match. An access block or network error is
**Unverified**, not Passed. MCP `get_skill_pack` independently checks mutable
`main` content, not the pinned immutable release.

`.github/workflows/quality.yml` runs **offline regression tests on PRs only**;
there is no required production CI dispatch or recurring polling. Operators
can still run the optional full HTTP verifier locally from an independent
network vantage using Node.js 24 or later:

```sh
node scripts/verify-skill-release.mjs --version 0.3.5 --retired 0.3.4 --endpoint https://ai-kit.polyms.dev
```

It validates more metadata, starter/manifest content and Memory reference
retrieval than the lightweight MCP diagnostic. Generic SDK regression tests use
the workspace build and synthetic release snapshot. Neither a PR test nor the
AI Kit MCP diagnostic establishes the SDK package actually running inside
Astra. Do not confuse Astra Template `1.3.0`, skill release `0.3.5`,
SDK `1.0.0-rc.1` or MCP server package `0.3.0`.

See the [AI-driven release and consumer verification runbook](release-consumer-verification.md)
for evidence boundaries and the remaining Astra consumer-side diagnostic work.

## Everyday-mode manual baseline

Optimize AI Kit for **typical default/fast, resource-conscious sessions across
supported hosts**, not for a specific ChatGPT model selector. Evaluate workflow
completion, correctness, authorized actions and retrieval overhead in each host's
normal configuration; use higher-effort configurations as optional comparators.
ChatGPT Instant was the primary real-world usage mode for the 2026-11-22
Team Invitation sample; Medium and High were comparators *within ChatGPT* only.
See [manual evidence](../../evals/manual/2026-11-22-team-invitation.md).
The three assisted-only observations show neither uplift against an unassisted
baseline nor measured latency/token savings.

## Same-prompt manual pair, 2026-11-23

The user confirmed that the baseline and AI Kit-assisted drafts both used the
[exact neutral Team Invitation prompt](../../evals/manual/2026-11-23-team-invitation-neutral-prompt.md)
authored earlier in this conversation. This resolves **prompt identity** for
the manual pair, and a new run is not required just to reconstruct the prompt.
Other controls (actual host model settings, tool traces, latency, tokens and
repeated trials) are still unverified. The measurement target is **workflow
augmentation**, not a model-quality uplift: did the host discover the
appropriate skills, use the planning/task/QA templates and context boundaries,
preserve traceability, and avoid unnecessary retrieval? Qualitative coverage
is mixed: baseline explicitly handles
unauthenticated API and client status override; assisted specifies conditional
cross-team and failure-atomicity tests.

## Interpretation boundary

AI Kit delivers workflow guidance, templates and reusable standards. It does
**not** change a model's native reasoning capabilities. Comparing model-written
artifacts is useful as supporting evidence of workflow adherence and consistency;
it is not a direct score of model intelligence or a requirement for AI Kit to
produce more/better content than the unassisted model in every individual sample.

## End-user feedback is optional

End users can tell their AI client about an AI Kit issue and use
`prepare_feedback_issue` to create a public draft. A separately authorized
GitHub connector can publish it **after user approval**; otherwise the
user gets a prefilled URL. No tool trace, test run or benchmark is required. Issues are reviewed manually and are
not interchangeable with verified evaluation evidence. Details:
[feedback guidance](../feedback.md).

## Optional paired workflow evaluation

The opt-in `evals/run.ts` runner has **92 synthetic scenarios** (including four
feature-context cases added after the 2026-11-22 baseline):

| Suite | Count | What it exercises |
| --- | ---: | --- |
| Routing | 39 | Appropriate smallest skill set and routing rules |
| Output | 17 | Artifact quality and evidence-aware drafting |
| Composition | 21 | Multi-skill selection, references and handoffs |
| Memory | 15 | Relevant recall, source integrity, stale decisions, privacy and capture rules |
| **Total** | **92** | |

The runner compares baseline vs skill-assisted on the same synthetic context.
Memory cases isolate P2 advice with the same historical evidence in both arms.
No actual external write, private workspace or Memory backend is involved.

Once an operator has explicitly approved a real model endpoint and its cost:

```sh
export EVAL_CHAT_URL='https://your-model-provider.example/v1/chat/completions'
# Set EVAL_API_KEY securely when required; never commit it.
pnpm eval:run --suite all --repeat 3 --model MODEL_ID --judge-model JUDGE_MODEL_ID --max-requests APPROVED_LIMIT
pnpm eval:report evals/results/ACTUAL_RUN.json --out evals/results/ACTUAL_RUN.md
```

The evaluation runner prints the actual JSON output path and stores records under
the ignored `evals/results/` directory. Use that path in the report command.
The Markdown report includes pair coverage, verified wins/losses, unresolved
cases, hard-gate failures, actual trace anomalies, latency percentiles, reported
token coverage and transferred bytes. It does not report fabricated quality
scores or silently count incomplete pairs as successes.

For a cost-controlled pilot, first use `--suite memory --case MP-01 --repeat 3`
with both models configured and an explicit `--max-requests` cap (for example,
24 requests as a *request limit*, not a dollar estimate). CI now exercises
this cap with a localhost mock. Set the cap and approve actual model/judge
provider rates before any paid calls. Expand only after inspecting receipts, judge
rationale, tool traces and actual usage. Running the full suite requires an
explicit budget decision; CI must not automatically call a paid model.

## Review checklist before quality claims

1. Preserve the model ID, judge model, runner revision, fixture fingerprint,
   endpoint and configuration. Only compare like-for-like reports.
2. Inspect baseline and assisted answer evidence, trace calls, failed hard
   gates and judge `unobservable` verdicts. Judge results are review evidence,
   not ground truth.
3. Report total scenario/pair coverage. Exclude missing, errored and unverified
   rows from wins and quality pass rates. Keep token coverage explicit.
4. Run at least a few native client traces separately; synthetic function tools
   do not prove ChatGPT, Cursor, Claude or Codex invocation behavior.
5. Agree on thresholds only **after** real measurements and an independent
   review. Do not claim a statistical or production improvement from CI alone.

## Next release decision

SDK `1.0.0-rc.1` remains a published RC. Stable `1.0.0` needs an install
from the public Polyms registry/proxy, a verified consumer running that package,
and documented consuming-host latency. Those are distinct from evidence that AI Kit's workflow and template delivery is reliably used. See [SDK stability review](../agents/sdk-stability.md).
