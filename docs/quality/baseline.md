# Quality Baseline and Release Verification

Status (2026-11-22): **historical skill delivery verified; new 0.3.4 production delivery and model-quality uplift are not yet verified**.
This is an evaluation and delivery-verification plan, not a claim that skills outperform
the baseline, a new release gate or authorization to run paid models.

## Verified evidence

| Capability | Observed result | Evidence and limit |
| --- | --- | --- |
| P2 production deployment | AI Kit production commit `4c028ae` after PR #14 merge | MCP `server_info` read-only response |
| Historical delivery (retired) | Astra Stg returned core `0.3.3`, revision `2617cd6` | Old smoke evidence, not proof of `0.3.4` production deployment |
| Remote skill metadata | 13 skill packs; five pilot contracts expose optional `memory` hints | AI Kit `list_skill_packs` |
| Memory reference | On-demand `docs/agents/memory-protocol.md` retrieved with full content | AI Kit `get_skill_pack`, exact path selection |
| SDK RC tag | `sdk-v1.0.0-rc.1` published with `next` dist-tag | [GitHub Actions #45020141109](https://github.com/polyms/ai-kit/actions/runs/45020141109) |
| Real model improvement | **Unverified** | No reproducible paired model run and reviewed judge report yet |
| SDK performance and public proxy install | **Unverified** | Release candidate published, but external proxy install/consumer timing not recorded |

These are observed deployment and delivery checks. They do not prove model-output
quality, SDK package consumption in Astra, private memory access, or authorization
to persist or publish any business artifact.

## Production release verification

Run from a clean checkout on Node.js 24 or later:

```sh
node scripts/verify-skill-release.mjs --version 0.3.4 --endpoint https://ai-kit.polyms.dev
```

The verifier reads `registry/releases/0.3.4/release.json` and compares its immutable
revision with live `latest.json` and pinned `catalog.json`. It checks key
bundle identities, contracts, manifest-only and starter content, `rawUrl` origin,
five Memory hint contracts, and an exact-path POST for the shared Memory Protocol.
Any mismatch, non-JSON response or missing expected content is a failure.

`.github/workflows/quality.yml` provides two independent paths:

- Pull requests run isolated, deterministic tests for the verifier and report
  formatter. These tests use mock response fixtures and **never** touch production.
- A manual `workflow_dispatch` runs the public production smoke verifier **on demand**,
  such as immediately after a skill release deployment. The expected version defaults
  to `0.3.4`; update it deliberately for future releases.
  There is no recurring production polling. Production checks are read-only and need
  no secret or authenticated MCP session.

The production smoke checks **HTTP skill delivery**, not OAuth/MCP client behavior. The previous `0.3.3` version is not supported by the new registry; old pinned provider requests should return 404 once production is deployed.
Do not call a PR test run proof of production deployment.

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

## Real paired evaluation

The opt-in `evals/run.ts` runner has **88 synthetic scenarios**:

| Suite | Count | What it exercises |
| --- | ---: | --- |
| Routing | 39 | Appropriate smallest skill set and routing rules |
| Output | 13 | Artifact quality and evidence-aware drafting |
| Composition | 21 | Multi-skill selection, references and handoffs |
| Memory | 15 | Relevant recall, source integrity, stale decisions, privacy and capture rules |
| **Total** | **88** | |

The runner compares baseline vs skill-assisted on the same synthetic context.
Memory cases isolate P2 advice with the same historical evidence in both arms.
No actual external write, private workspace or Memory backend is involved.

Once an operator has explicitly approved a real model endpoint and its cost:

```sh
export EVAL_CHAT_URL='https://your-model-provider.example/v1/chat/completions'
# Set EVAL_API_KEY securely when required; never commit it.
pnpm eval:run --suite all --repeat 3 --model MODEL_ID --judge-model JUDGE_MODEL_ID
pnpm eval:report evals/results/ACTUAL_RUN.json --out evals/results/ACTUAL_RUN.md
```

The evaluation runner prints the actual JSON output path and stores records under
the ignored `evals/results/` directory. Use that path in the report command.
The Markdown report includes pair coverage, verified wins/losses, unresolved
cases, hard-gate failures, actual trace anomalies, latency percentiles, reported
token coverage and transferred bytes. It does not report fabricated quality
scores or silently count incomplete pairs as successes.

For a cost-controlled pilot, first use `--suite memory --case MP-01 --repeat 3`
with both models configured. Expand only after inspecting receipts, judge
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
and documented consuming-host latency. Those are distinct from measured
model-quality improvements. See [SDK stability review](../agents/sdk-stability.md).
