# AI-driven release and consumer verification

Status (2026-11-27): **MCP-first diagnostics proposed in PR #21**. Until merged and deployed,
production `get_release_info` is unavailable. Astra's resolved SDK version and
public HTTP release delivery are **not yet independently verified**.

## One prompt, available tools

Ask the AI client:

> Check AI Kit production, verify skill release 0.3.5 and Astra compatibility.

The host should use only tools that are actually connected and available:

1. Call AI Kit `server_info` for the deployed MCP server's identity and commit.
2. Call AI Kit `get_release_info` **without arguments** for the *configured*
   immutable HTTP skill release, revision and supported versions. This step
   makes **no network request**, and is **not HTTP delivery verification**.
3. Call `get_release_info({ "expectedVersion": "0.3.5", "checkHttp": true, "retiredVersion": "0.3.4" })`
   to require the requested release and perform bounded read-only verification of public HTTP `latest`, pinned
   catalog, QA starter, exact Context Contract retrieval and retired
   catalog/API 404. The tool uses a **fixed** destination
   `https://ai-kit.polyms.dev`; the caller cannot supply a URL or token.
   If the configured release differs from `expectedVersion`, the check is
   **Failed** without attempting HTTP. A failed, timed-out or protected request
   is **Unverified**, never silently treated as Passed. Wrong status/content or
   differing `latest` and pinned catalog metadata is **Failed**. The catalogs
   are compared recursively, regardless of JSON object key order.
4. Optionally use `list_skill_packs` / `get_skill_pack` to read current
   MCP skill bodies and validate specific guidance. **MCP skills use mutable
   `main`**, so this does not prove that immutable HTTP release `0.3.5`
   delivered its pinned content.
5. If Astra is connected, make authorized **read-only** calls for its
   current methodology/template. Report the SDK package version as **Unverified**
   unless there is explicit evidence from the *running Astra consumer*.

The response must present **Passed / Failed / Unverified / Not run** for
separate checks, with evidence and limitations. Avoid a single all-green
status that conflates MCP, HTTP, SDK and Astra.

## What each check establishes

| Tool or check | Positive evidence | It does NOT prove |
| --- | --- | --- |
| `server_info` | MCP deployment commit and server identity | HTTP skill version or SDK dependency |
| `get_release_info` default | Immutable skill version and revision **configured in the deployed build** | Public HTTP bundle retrieval |
| `get_release_info` with `expectedVersion` and `checkHttp=true` | Requested version and public HTTP identity/QA/Context content from **the MCP server's network perspective** | Independent outside network, Astra SDK/runtime |
| `get_skill_pack` | Live mutable-`main` MCP content returned to AI client | Immutable SDK release content |
| Astra `get_issue_template` | Template/methodology retrieval as observed | Installed SDK version, end-to-end Grok flow or approved QA evidence |
| Consumer-specific diagnostic | Resolved package/runtime release when implemented and read from actual deployment | PM/PO approval or QA confirmation by itself |

The live HTTP check is a bounded diagnostic invoked by the user through AI
rather than a GitHub Actions schedule. It makes up to 6 fixed-route requests,
including a read-only versioned `POST /api/skills` selection. No private
workspace data, credentials, unrestricted URL input or business writes are used.
The tool does **not** run the full 10-request release smoke suite or perform
SDK package installation. Use the optional local verification scripts for
deeper troubleshooting.

## CI stays small and offline

PR CI still compiles the SDK and runs deterministic regression tests. It
covers `get_release_info` configuration, expected/retired HTTP responses,
stale catalogs, expected-version mismatches, complete latest/pinned metadata drift, missing QA guidance, restricted network and errors. It also
tests the reference SDK against generated fixtures, including negative cases.

**No manual or scheduled production GitHub Actions job is required** to ask
the AI for a health check. The separate optional local CLI remains useful
for operators who want an independent network vantage or full bundle validation:

```sh
node scripts/verify-skill-release.mjs --version 0.3.5 --retired 0.3.4 --endpoint https://ai-kit.polyms.dev
pnpm exec tsc -p sdk/tsconfig.json
node scripts/verify-sdk-consumer.mjs --version 0.3.5 --endpoint https://ai-kit.polyms.dev
```

These commands run only when explicitly invoked, not by the PR quality workflow.

## Astra verification boundary

On 2026-11-27, read-only Astra Staging calls to `get_issue_template` for
`feature` and `task` both returned Astra Template version `1.3.0`,
with AI Kit methodology instructions. That is **template retrieval evidence
only**, not SDK package evidence.

To verify the running Astra consumer, Astra MCP would need a safe, read-only
diagnostic such as `get_ai_kit_runtime_info` that reports its own **resolved
package name/version**, configured skill release, retrieved release/revision,
and current source environment. Do **not** infer it from the AI Kit server's
version or the Astra template version. Adding a diagnostic to Astra requires a
separate Astra code change and its own deployment verification.

If Astra's runtime diagnostic is not available, mark this gate Unverified.
The host may still read the existing Astra templates and perform safe
authorization/evidence reasoning checks, but must not self-approve QA or
PM/PO outcomes or create dummy project data.

## Version semantics

- `@polyms/ai-kit-sdk@1.0.0-rc.1`: published SDK package candidate.
- `0.3.5`: active immutable **skill content** release.
- `server_info.version`: AI Kit **MCP server package** version; separate.
- `server_info.commit`: actual MCP deployment commit; separate.
- Astra Template `1.3.0`: Astra template revision; separate.

SDK `1.0.0` stable promotion still requires clean public registry
installation, actual consuming-runtime compatibility and cold/warm latency
evidence. This PR does not bump the SDK package or change its wire schema.
