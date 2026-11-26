# Release and consumer verification

Status (2026-11-27): **verification tooling proposed; production HTTP delivery and
actual Astra SDK runtime are not yet independently verified by this document.**
This runbook tests distribution and the consumer contract, not model reasoning,
the quality of business artifacts, or an Astra deployment.

## Two separate verification surfaces

| Surface | What passes | What it does not establish |
| --- | --- | --- |
| HTTP release verifier | Live `latest` equals immutable `0.3.5` catalog/revision, selected starter/manifest/reference delivery, `0.3.4` GET/POST routes return 404 | SDK installed in Astra, production MCP tool authorization |
| SDK reference consumer | Compiled SDK lists pinned/latest metadata, loads QA starter and on-demand Memory reference, preserves environment and approval guidance, applies additive domain extension without mutating core contract | Which SDK package or release is running inside Astra |
| Astra Staging manual read | Authorized tool can retrieve its own issue templates | End-to-end SDK delivery, QA approval, ticket creation or feature-map runtime |

**Do not collapse these into a single “Astra integration verified” claim.**

## Production, on demand and read-only

Run GitHub Actions **Verify Skill Release and Quality Reports → Run workflow**
on the deployed `main` revision. Inputs: `version=0.3.5`,
`retired=0.3.4`. The workflow has no schedule and uses no Astra credentials.
It first checks live public HTTP responses, then builds the SDK and exercises
its read-only reference consumer against the same public endpoint.
A failed or blocked HTTP request is a failed or **unverified** production gate,
not evidence of successful deployment.

Equivalent local commands from the repository root (Node.js 24+):

```sh
node scripts/verify-skill-release.mjs --version 0.3.5 --retired 0.3.4 --endpoint https://ai-kit.polyms.dev
pnpm install --frozen-lockfile
pnpm exec tsc -p sdk/tsconfig.json
node scripts/verify-sdk-consumer.mjs --version 0.3.5 --endpoint https://ai-kit.polyms.dev
```

The HTTP verifier requires a matching `schemaVersion=1`, pinned revision,
unchanged catalog metadata, correct starter-only and manifest-only content, and
a selected Memory Protocol reference. A retired version must return HTTP 404 for
`/skill-bundles/0.3.4/catalog.json`,
`/skill-bundles/0.3.4/qa/starter.json`, and the versioned
`POST /api/skills` call. HTTP 200 or a redirect from a retired route fails.
This detects stale public assets or a proxy that silently falls back to latest.
No writing to production or private system data is needed.

The SDK script uses the locally built **AI Kit workspace SDK**, not a version
proven to be installed in Astra. It verifies the `qa` bundle includes
environment-specific Context Contract guidance, does not allow the model to
self-confirm QA, lazily retrieves `docs/agents/memory-protocol.md`, and adds
trusted consumer context without changing the core contract. It uses only public
AI Kit methodology and prints a small, non-sensitive receipt.

## Pull request / local deterministic coverage

The regular PR quality workflow tests HTTP verification against mocked responses.
The SDK build workflow tests the **real compiled SDK** against the repository's
generated `0.3.5` release snapshot, without making public HTTP requests.
Negative cases include a stale catalog, missing environment separation guidance,
incomplete exact-path retrieval, and retired endpoints returning 200.

CI passing on a PR demonstrates fixture and SDK compatibility, **not** that
the deployed Vercel endpoint, Astra runtime or Grok bot has passed its smoke test.

## Astra Staging: authorized read-only consumer check

A read-only tool check on 2026-11-27 returned `get_issue_template` for
`feature` and `task`, both reporting Astra Template `1.3.0` with AI Kit
methodology instructions. This is narrow evidence of **Astra template retrieval
only**. No ticket was created, no business record was modified, and no SDK
dependency version was returned.

Before marking **Astra consumer verified**, its deployment owner must confirm:

1. The **resolved package actually running in Astra Staging** (lockfile,
   build/deployment receipt), including whether it consumes
   `@polyms/ai-kit-sdk@1.0.0-rc.1` or another compatible build.
2. The runtime's configured content version is `0.3.5` or `latest`, not a
   retired `0.3.4` pin, and a **read-only call in that runtime** obtains
   catalog and QA bundle `0.3.5` with the expected immutable revision.
3. The Grok bot receives the selected Context Contract, QA and approval
   boundaries, and retrieves environment/build/decision evidence via
   **authorized Astra tools**. Test a Dev-only QA observation with no
   Production evidence: Production must remain `Unknown`.
4. No assistant independently marks a PM/PO approval or human QA confirmation.
   A planned test is not executed evidence; live system records remain the
   source of truth.

If any check is unavailable, report **Pending / Not observed** and the
specific missing receipt. Do not create a dummy ticket, grant new permissions,
publish a fake verification result, or copy Astra data into AI Kit.

## Follow-up gates

SDK `1.0.0` stable promotion still requires a clean installation through the
configured Polyms registry proxy, an independently verified Astra/runtime
dependency, and cold/warm consumer latency evidence. This verification PR does
not bump the SDK package or change its wire schema.
