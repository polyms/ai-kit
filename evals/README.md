# Evaluation runner

V0.3 adds a local, opt-in benchmark for the 13 output, 38 routing and 17 composition cases.
The runner is separate from the deployed MCP server and does not introduce a provider dependency.
It uses the repository's existing tsx and MCP functions; a configurable OpenAI-compatible chat
completion HTTP endpoint is the reference adapter. Tool-call support is required for assisted
output/composition. Native client testing (ChatGPT, Claude, Codex, etc.) remains a separate exercise.

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

The dry run prints case count and upper bounds on model/judge requests (16 rounds per assisted
output, one baseline request; counts are deliberately conservative). Actual token/cost totals
depend on the selected endpoint. Tool requests are read-only and allowlisted; max generation rounds
are 16, per request timeout 120s and output cap 4096 tokens. No automatic retries or real mutations.
Use a trusted endpoint and synthetic fixtures only; inputs and selected skill Markdown are sent there.

## Regression workflow

Add anonymized fixture context and a scenario for a failure. Run `pnpm eval:test`, inspect
deterministic scores and compare like-for-like paired reports. Review hard gates, missing evidence,
token and payload changes; do not silently convert unobservable results into passes. To assess real
ChatGPT/Claude/Codex MCP behavior, follow the manual routing/composition guidance with actual tool
trace evidence instead of treating this client simulation as a native integration benchmark.
