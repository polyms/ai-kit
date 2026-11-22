# SDK stable-release readiness

Status (2026-11-22): **`1.0.0-rc.1` published; stable `1.0.0` not yet authorized**.
SDK versions are independent of immutable skill release `0.3.3`.
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
| Skill `latest` and exact-path reference retrieval | Production MCP and Astra Stg 0.3.3 smoke | Verified |
| Public Polyms registry proxy install | Clean install of RC through `registry.polyms.dev/npm` | Not verified |
| Explicit consumer SDK runtime version | Inspect actual resolved dependency and run RC methods | Not verified by MCP response |
| Consuming-host performance | Cold/warm and reference timing with `sdk/benchmark.mjs` | Not measured |
| Full native-client Memory behavior | Client-specific tool traces, not just delivery | Not verified |
| Paired model-quality benefit | Real model + judge measurements under quality plan | Not measured; separate quality track |

## Stable decision

Do not tag `sdk-v1.0.0` until the actual registry and consumer
compatibility gates have concrete results and the SDK package version
has been updated on `main`. Promotion of the SDK does not require
inventing a Memory storage engine or claiming a model-quality lift.
Retain the `schemaVersion: 1` compatibility contract and optional hints.

No new Memory persistence, host tool execution or write authorization
is introduced by this release.
