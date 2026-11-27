# SDK stable-release readiness

Status (2026-11-27): **`1.0.0-rc.1` published; stable `1.0.0` not yet authorized**.
SDK versions are independent of skill release `0.3.5`; the former `0.3.3` and `0.3.4` registry snapshots are retired, while historical evidence remains.
Only Node.js 24+ / ESM with built-in `fetch` is supported.

## Proven release candidate

- Public TypeScript API includes typed `SkillCatalog`, `SkillBundle` and
  contracts with optional Knowledge and Memory hints.
- Schema, release identity, raw URL origin, content completeness, manifest
  consistency and in-flight cache behavior have negative/concurrency tests.
- CI built TypeScript declarations and the package, tested the provider and
  evaluation fixtures, and clean-installed a local tarball in isolation.
- Git tag `sdk-v1.0.0-rc.1` successfully published the tested tarball to
  GitHub Packages with dist-tag `next`.
  Evidence: [successful tag workflow](https://github.com/polyms/ai-kit/actions/runs/45020141109).
- PR #14 merged as `4c028ae`; AI Kit production and Astra Stg retrieved
  skill release `0.3.3` / revision `2617cd6`.
  This verifies delivery but not which SDK package Astra is executing.
- Manual, on-demand public production verification is specified in
  [Quality Baseline](../quality/baseline.md). No periodic production polling
  is configured; no new CI production verification run is claimed here.

## External release gates

| Gate | Evidence | State |
| --- | --- | --- |
| PR source tests and local packed tarball import | GitHub CI on SDK RC head | Verified |
| Publishing to GitHub Packages | Tag workflow `sdk-v1.0.0-rc.1` | Verified |
| Current 0.3.5 skill HTTP delivery | AI Kit production MCP `get_release_info` expectedVersion=0.3.5, checkHttp=true, retiredVersion=0.3.4 | Passed (7/7 from server network; not independent client runtime) |
| Public Polyms registry proxy install | Clean install of RC through `registry.polyms.dev/npm` | Not verified |
| Explicit consumer SDK runtime version | Astra operator reports RC1 at mcp.astra.shadeofhue.com; Astra `get_issue_template` returns skill 0.3.5 | Operator-reported RC1; SDK dependency version not independently returned by Astra MCP |
| Consuming-host performance | Cold/warm and reference timing with `sdk/benchmark.mjs` | Not measured |
| Full native-client Memory behavior | Client-specific tool traces, not just delivery | Not verified |
| Paired model-quality benefit | Real model + judge measurements under quality plan | Not measured; separate quality track |

## Targeted follow-up: registry and catalog consistency

The SDK now checks that the complete catalog metadata for a release matches
between the `latest` alias and the pinned catalog (regardless of JSON object
key order). Previous revision-only comparison could silently admit metadata
drift without a revision bump. This closes an SDK compatibility/integrity gap;
there is **no wire schema or exported API change**.

Use the existing published SDK, not a local workspace tarball, for an
**on-demand** integration check from a machine with Node.js >=24 and public
network access:

```sh
node scripts/verify-published-sdk.mjs
```

The script creates a temporary empty Node project, isolates npm configuration
and credentials, installs the *exact* SDK candidate version through
`https://registry.polyms.dev/npm`, imports its published ESM entry point, and
reuses `verifySdkConsumer` against production skill release 0.3.5. It checks
latest/pinned catalog consistency, QA context, lazy reference retrieval, and
additive domain extension. Temporary files are removed afterward. It writes no
Astra data and is deliberately **not** a scheduled or CI production job.

Record the command output, execution date, package version, Node version and
network vantage. If DNS, registry permission or public network access fails,
the gate stays **Unverified** until it is retried from a capable host; do not
claim a package regression from an inaccessible environment. A successful run
validates a fresh external consumer of the published SDK, **not** which package
is loaded inside Astra.

Run `node sdk/benchmark.mjs https://ai-kit.polyms.dev 0.3.5 20` from the
intended consumer host for actual performance evidence. Node process timings
from a different network cannot substitute for that host. Do not infer the
SDK package from Astra's template version 1.3.0 or skill release 0.3.5.

## Stable decision

Do not tag `sdk-v1.0.0` until the actual registry and consumer
compatibility gates have concrete results and the SDK package version
has been updated on `main`. Promotion of the SDK does not require
inventing a Memory storage engine or claiming a model-quality lift.
Retain the `schemaVersion: 1` compatibility contract and optional hints.

No new Memory persistence, host tool execution or write authorization
is introduced by this release.
