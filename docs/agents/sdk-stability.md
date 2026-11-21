# SDK stable-release readiness

Status: **not yet verified ready for 1.0.0**. This assessment is based on
`@polyms/ai-kit-sdk` source and pull-request CI, not package-registry validation.
SDK package versions are independent of skill content releases.

## Existing evidence

- The SDK is a dependency-free TypeScript consumer for Node 22+ with
  `list`, `getSkill`, `preload`, `clearCache` and `extendSkill`.
- It implements read-only skill delivery, endpoint restrictions, explicit timeouts,
  cache limits, deduplication, selective references and basic identity checks.
- PR CI builds SDK TypeScript, runs provider tests and packs a testable artifact.
- The package currently declares `0.4.0-alpha.2`. A successful CI package build
  does not establish that public registry publishing or clean installation works.
- The branch's single supported skill release is experimental `0.3.3`.

## Gates before claiming stable

| Requirement | Gap or current result |
| --- | --- |
| Stable public TypeScript API | `SkillBundle.contract` and catalog `packs` still use `unknown`; freeze typed contracts and optional memory hints |
| Error-handling coverage | Add negative tests for malformed catalogs, bundles, invalid references and inconsistent metadata, including concurrent responses |
| Consumer integration | Astra Stg currently returned core `0.3.2` without forwarding `contract`; verify its migration to `0.3.3` and selective references |
| Distribution | Verify publishing, registry proxy resolution, dist-tags and clean installation from the published package |
| Compatibility policy | Document semantic versioning, supported Node versions, content/schema compatibility, migration and changelog rules |
| Runtime evidence | Record consuming-host cold/warm latency, cache behavior and error-path results; unit tests are not integration results |

Missing evidence is not proof of a broken implementation; build passing is not proof
of production readiness either.

## Decision

Do not tag or publish `sdk-v1.0.0` in this PR. Keep the SDK in prerelease
while closing the public API/type and integration gates. A stable SDK can deliver
experimental, versioned skill content, but its API and protocol guarantees must be
explicit and tested. Only promote to `1.0.0` after a release-candidate install,
real consumer smoke tests and compatibility review.
