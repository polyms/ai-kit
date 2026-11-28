# Evaluation runner

The local, opt-in benchmark includes output, routing, composition and 18 host-agent memory scenarios. Use the runner's dry-run count for the current total.
The runner is separate from the deployed MCP server and does not introduce a provider dependency.
It uses the repository's existing tsx and MCP functions; a configurable OpenAI-compatible chat
completion HTTP endpoint is the reference adapter. Tool-call support is required for assisted
output/composition and two memory cases that expose an external lookup trap (expected zero calls). Native client testing (ChatGPT, Claude, Codex, etc.) remains a separate exercise.

## Everyday-first native client priority

**Prioritize the everyday/default/fast configuration available on each client.**
AI Kit is model- and host-independent. Check minimal correct routing, selective
retrieval, context reuse, critical authorization QA, provenance and overhead on
that configuration first; compare other effort levels **only inside a host**
when useful. Do not require a ChatGPT-only name or assume another provider
exposes the same effort modes. More tool calls or longer output are not a
quality proxy. Native-client evidence is separate from this model-endpoint runner.

In the [Team Invitation manual 3-mode evidence](manual/2026-11-22-team-invitation.md),
**Instant/Medium/High are labels of the tested ChatGPT sessions**, not universal
AI Kit model tiers. All three were assisted-only sessions without an independent
baseline or provider audit trace.

## Optional user feedback

This benchmark runner is for maintainers and researchers, **not** an expected
end-user step. End users who wish to comment can use the
[AI-assisted conversational GitHub Issue workflow](../docs/feedback.md) without logs,
trace exports or tests. Maintainers may later turn verified public feedback
into narrowly scoped regression cases.

## Feature-context regression cases

Four synthetic output cases (WS-14 through WS-17) cover per-environment QA evidence,
pending questions and approved-revision preservation, older Production revisions,
and canonical feature-map ownership versus E2E exports. These fixtures do not
establish model correctness or real integration behavior. Use the ordinary
`--suite output` runner and review model/judge evidence before reporting results.

## Reflection and Knowledge Contribution

See [manual reflection scenarios](reflection/README.md) for ten synthetic host-client cases.
They are structurally checked in the skill-pack suite, not part of the paired runner; no real writes.

## Memory Protocol pilot

See [Memory Protocol evaluation](memory/README.md) for 18 paired host-agent memory scenarios.
Run `pnpm eval:run --suite memory --dry-run`. Both arms get pinned P0/P1 methodology;
only assisted receives the current live host-native memory guidance and hints. Native remembered context is fixture-supplied; external lookup traps are identical in both arms and expect zero calls.
Fixture count is not a benchmark result. A full Git checkout is required.

## Run

Install the repository dependencies first. No model requests are made by the scoring tests or dry run.

```sh
pnpm eval:test
pnpm eval:run --dry-run
pnpm eval:run --suite composition --case CP-01 --dry-run
```

For actual evaluation, choose a local or remote compatible endpoint; remote model/judge calls may
incur charges. Pass the full chat completions URL (not a base URL) and model ID explicitly.
Use an environment variable for the API key; never commit it or include it in reports.

```sh
export EVAL_CHAT_URL='https://your-provider.example/v1/chat/completions'
# Set EVAL_API_KEY securely if the endpoint requires authentication.
pnpm eval:run --suite routing --model YOUR_MODEL
pnpm eval:run --suite composition --case CP-01 --model YOUR_MODEL --judge-model YOUR_JUDGE
pnpm eval:run --suite output --model YOUR_MODEL --repeat 3 --judge-model YOUR_JUDGE
```

The endpoint must accept messages, standard function tool calls (for assisted work), and max_tokens.
No extra model SDK. The runner does not configure any native AI clients, authenticate to production
MCP, access the web, or use real workspace connectors. Synthetic mock observations and receipts are
supplied as prompt context, not live external effects. Local repository Markdown is delivered via
the same allowlisted retrieval functions using a local-file fetch adapter.

## Comparison and scoring

- **Routing:** baseline receives names/descriptions; assisted receives enriched catalog metadata.
  Both return a declared route as JSON. Deterministic exact-set scoring checks extra/missing,
  duplicate, avoided skills and explicit order for RT-15. This measures routing selection, not
  observed native client calls.
- **Output/composition:** baseline has no skill tools; assisted can call only list/get against
  checked-out files. Same synthetic prompt and context, separate fresh message histories, alternating
  pair order for repeated trials. The harness records actual calls and loaded paths, not model
  self-reports. Trace checks flag missing/avoided skills and unwanted single-skill recipe use;
  extra routes, full loads and reloads are reported separately for review.
- **Quality:** optional separate judge model receives the prompt, fixture and answer without a
  baseline/assisted label; criteria and hard gates are evaluated separately. All criteria must pass
  for a quality pass; any failure fails, unknown evidence remains unverified. Without a judge,
  semantic results are unverified unless a deterministic trace violation fails the case.
  The judge can still infer style/condition; review its evidence rather than treat it as ground truth.
- **Measurements:** generation elapsed time excludes judge, and tool response bytes are UTF-8 bytes.
  Model token usage is recorded only if the endpoint returns it for each generation request.
  Judge usage is separate. These are endpoint-reported tokens, not a price or production latency.

Reports are JSON under ignored `evals/results/` by default, with per-run outputs, traces, grades,
errors, model IDs, revision, content/fixture fingerprint and summary by suite/condition. A run
writes after each result. `--out` can set a new report path. Existing reports are not overwritten.
The fingerprint covers the full local manifest contents, catalog and selected fixture/prompts; use
a clean checkout and the same options for reproducibility. Scores are descriptive; repeat and
review paired runs before drawing conclusions. Do not use the result as a release gate until
thresholds and an independent reviewer are agreed. Error runs return a nonzero exit code.

The dry run prints case count and upper bounds on model/judge requests (up to 16 rounds per
assisted output or memory arm with tools, one request for tool-free arms). Actual token/cost totals
depend on the selected endpoint. Tool requests are read-only and allowlisted; max generation rounds
are 16, per request timeout 120s and output cap 4096 tokens. No automatic retries or real mutations.
Use a trusted endpoint and synthetic fixtures only; inputs and selected skill Markdown are sent there.

## Regression workflow

Add anonymized fixture context and a scenario for a failure. Run `pnpm eval:test`, inspect
deterministic scores and compare like-for-like paired reports. Review hard gates, missing evidence,
token and payload changes; do not silently convert unobservable results into passes. To assess real
ChatGPT/Claude/Codex MCP behavior, follow the manual routing/composition guidance with actual tool
trace evidence instead of treating this client simulation as a native integration benchmark.

## Measured-run summary

To generate an auditable Markdown report from a completed real model run, use
`pnpm eval:report evals/results/<run>.json`. To write an explicitly reviewed
copy without overwriting an existing report, pass `--out <path>.md`.
The formatter reports baseline/assisted pass/fail/unverified/error counts,
completed pairs, assist wins/losses, hard-gate failures, actual tool-trace
failures, latency, observed token coverage and payload bytes. It fails
closed on malformed rows or duplicate pair keys; partial runs are shown
as incomplete, never counted as successes.

For the current measurement plan, fixture counts, coverage and release
verification steps, see [Quality Baseline](../docs/quality/baseline.md).
Run `node --test evals/report.test.mjs` to validate the report formatter
without calling a model. The report is **not** a benchmark until an
actual paired model run has been completed, judged and reviewed.

## End-to-end harness smoke (no real model)

`pnpm exec node evals/mock-model-smoke.mjs` runs the full generation → synthetic
zero external `recall_memory` calls → blinded-judge JSON protocol → paired-run JSON → Markdown
report path against a **localhost mock** using the MP-01 fixture. This validates
integration wiring and report coverage without network access to any model provider.
It is included in SDK CI and performs **zero** real model calls. Its all-pass
mock results must never be reported as evidence that AI Kit improves model quality.
Real paired model benchmarks remain opt-in with an explicitly configured endpoint,
model and judge; see [Quality Baseline](../docs/quality/baseline.md).
