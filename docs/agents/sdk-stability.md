# SDK stable-release readiness

Status: **release candidate prepared; stable 1.0.0 not yet authorized**.
The SDK package is independent of experimental skill content release `0.3.3`.

## Implemented and verified in PR CI

- Public API types replace the previous `unknown` contract and catalog pack
  surfaces. `SkillContract` includes typed optional Knowledge and Memory hints.
- Read-only transport validates catalog/bundle shape, schema and release
  identity, source URL, allowlisted paths, content completeness and consistency.
- Provider errors are not cached. Concurrent reference fetches preserve successful
  content; `clearCache()` invalidates in-flight cache writes.
- CI builds the TypeScript declarations and SDK package, runs negative and
  concurrency tests, and verifies a clean local tarball install/import.
- Node 24 is the SDK baseline in CI. Node 22 is intentionally unsupported;
  package remains dependency-free.
- Prerelease tags use `next`, stable tags use `latest` when eventually published.

## External release gates

| Gate | Status and requirement |
| --- | --- |
| Source TypeScript tests | Confirmed by PR CI |
| Install from local packed tarball | Confirmed by PR CI |
| GitHub Packages publishing | Not performed; requires explicit tag/release |
| Public Polyms registry proxy | Not verified with a published RC and clean consumer install |
| Astra Stg consumer | Current observed core `0.3.2` without forwarded contract; needs migration and reference retrieval for `0.3.3` |
| Operational performance | Recorded consuming-host cold/warm and reference timing still needed |
| Production/native clients | Not verified for Memory Protocol |
| Compatibility policy | ESM, Node 24+, schemaVersion 1; changes requiring a new wire schema or breaking published API require a major SDK version after stable |

## Decision

Ship the source as `1.0.0-rc.1` in PR #14, without tagging or publishing the
package. Real registry and Astra consumer verification remain external release
gates. Promote to stable `1.0.0` only after the candidate passes them.
No AI Kit-owned Memory storage, synchronization or execution is introduced.
