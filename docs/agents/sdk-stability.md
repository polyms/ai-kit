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
| Polyms registry and real consumer installation | Astra operator confirms `1.0.0-rc.1` installed via `registry.polyms.dev` and deployed in production | Operator-confirmed; no duplicate synthetic installation needed |
| Explicit consumer SDK runtime version | Astra operator reports RC1 at mcp.astra.shadeofhue.com; Astra `get_issue_template` returns skill 0.3.5 | Operator-reported RC1; SDK dependency version not independently returned by Astra MCP |
| Consuming-host performance (optional) | `sdk/benchmark.mjs` is available for diagnosing latency or measuring regressions | No agreed SLO or reported issue; **not a stable release blocker** |
| Full native-client Memory behavior | Client-specific tool traces, not just delivery | Not verified |
| Paired model-quality benefit | Real model + judge measurements under quality plan | Not measured; separate quality track |

## Catalog integrity follow-up

The SDK now compares complete JSON metadata for the same release between
`latest` and the pinned catalog, regardless of object key order. Revision-only
checks previously allowed contracts or composition data to drift without a
revision change. Existing public API, skill schema and consumer behavior remain
unchanged except that inconsistent responses are rejected.

Astra is the real consumer: the operator confirms that SDK RC1 was installed
from the Polyms registry and deployed in production. The Astra MCP template
retrieval verifies skill release 0.3.5, but it does not independently identify
the loaded SDK package. Record the operator confirmation without creating an
additional registry-install harness or claiming tool-verified package identity.

Performance measurements can be made using the existing
`node sdk/benchmark.mjs https://ai-kit.polyms.dev 0.3.5 20` command, only if
there is a concrete latency issue, a measured regression or an agreed SLO.
The benchmark has **no mandatory pass/fail threshold** for the stable SDK
release today. Model-quality and native-client memory behavior are separate
product evaluation tracks, not gates for the SDK's packaging/API stability.

## Stable decision

Do not tag `sdk-v1.0.0` until the SDK API and behavior changes pass
regression/packaging tests, the Astra production consumer evidence is recorded,
and the SDK package version is intentionally updated to 1.0.0 on `main`.
Do not block this on duplicate registry tests or unestablished performance
targets. Promotion of the SDK does not require
inventing a Memory storage engine or claiming a model-quality lift.
Retain the `schemaVersion: 1` compatibility contract and optional hints.

No new Memory persistence, host tool execution or write authorization
is introduced by this release.
