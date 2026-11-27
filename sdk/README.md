# AI Kit SDK

Dependency-free server-side TypeScript client. Create one provider per process, use the latest skill release by default and
optionally preload frequently used skills. Starter bundles use a static GET; exact reference paths
use the local snapshot API. Successful results are cached in memory, identical concurrent requests
are coalesced and errors are not cached. No project data is sent to AI Kit.

```ts
import { createSkillProvider, extendSkill } from '@polyms/ai-kit-sdk'

const provider = createSkillProvider({
  endpoint: 'https://ai-kit.polyms.dev',
})
await provider.preload(['reqs'])
const base = await provider.getSkill('reqs')
const skill = extendSkill(base, {
  name: 'product-reqs',
  extends: `ai-kit/reqs@${base.version}`,
  instructions: 'Preserve existing requirement IDs.',
})
```

GitHub Actions builds and tests on Node.js 24. RC `1.0.0-rc.1` was built,
pack-verified and **published to GitHub Packages** by tag `sdk-v1.0.0-rc.1`
([release workflow](https://github.com/polyms/ai-kit/actions/runs/45020141109)).
It uses the `next` dist-tag, not `latest`. Public Polyms proxy installation
has not yet been independently verified. To check the *published* package
(rather than a local tarball) and its public HTTP skill delivery from a host
with Node.js 24+ and registry/network access, run:

```sh
node scripts/verify-published-sdk.mjs
```

The check uses a fresh temporary npm project and the published
`@polyms/ai-kit-sdk@1.0.0-rc.1` through `registry.polyms.dev/npm`,
then reuses the existing reference consumer verification. It runs **only
on demand**, never in production CI, and is not proof of the SDK version
actually loaded by Astra.

For future versions: update `sdk/package.json`, verify CI, then push a
matching `sdk-v<version>` tag. The workflow tests, packs and publishes the
exact verified tarball. Prereleases use `next`; stable tags use `latest`
and must point to `main`. Do not reuse an already published version.

For a local tarball test without the registry, after workspace install run
`pnpm exec tsc -p sdk/tsconfig.json` and `npm pack ./sdk --ignore-scripts` to create a local tarball.
Install that tarball in your Business MCP. No new workspace dependencies or runtime packages.

## Performance benchmark

Run from the host that will consume the provider, after building the SDK and deploying the API:

```sh
node sdk/benchmark.mjs https://ai-kit.polyms.dev 0.3.5 20
```

The report includes cold/warm p50 and p95, reference fetch timing and network call counts.
Cold means a new SDK instance, not an empty CDN, DNS or connection cache. Use the same host and
version for comparisons. Initial targets for `reqs` are cold p95 under 500 ms and warm p95 under
5 ms, subject to network and runtime conditions. These are targets, not measured results.

For installation, configure the consuming repository's npm scope:

```ini
@polyms:registry=https://registry.polyms.dev/npm
```

```sh
pnpm add @polyms/ai-kit-sdk
```

For an **on-demand read-only delivery check**, use the [release and consumer
verification runbook](../docs/quality/release-consumer-verification.md). Its SDK
reference consumer uses the local workspace build, not Astra's deployed SDK:
a separate consumer-side receipt is required before claiming Astra compatibility.

The latest catalog is refreshed on demand after 30 minutes by default; override with `latestTtlMs`.
Pinned bundles remain cached until eviction or explicit clearing.

## Context-aware consumers

Skill release 0.3.5 adds environment-aware feature context governance. Starter bundles
include shared context guidance. Forward both the contract and selected file contents to the AI client,
together with trusted domain instructions. The client resolves context through authorized
tools; do not send workspace data to the skill provider. Earlier skill releases, including 0.3.3 and 0.3.4,
are retired: consumers pinning them must switch to 0.3.5 or `latest`. SDK and skill versions
are independent.

For multi-skill discovery, `provider.list()` includes optional `composition` metadata (recipes and
protocol path). Load only relevant stage bundles; retain already loaded shared paths in the current
session and select missing paths when needed. Context-aware extensions may add domain needs:

```ts
const base = await provider.getSkill('plan')
const skill = extendSkill(base, {
  name: 'project-plan',
  extends: `ai-kit/${base.name}@${base.version}`,
  instructions: 'Use authorized project planning rules.',
  context: [{
    key: 'project-policy', importance: 'required', description: 'Applicable planning policy.',
  }],
})
// Forward skill.base.contract, skill.base.files, skill.domainInstructions and skill.domainContext.
```

Duplicate keys and collisions with the core contract are rejected. The SDK does not resolve context,
call Knowledge tools or execute recipes. Keep actual project data within authorized consumer tools.

## Memory-aware consumers

Skill release 0.3.5 retains optional `contract.memory` recall/capture hints and an allowlisted shared
`docs/agents/memory-protocol.md` reference. The SDK keeps the same wire schema and forwards the
contract unchanged; no SDK upgrade or provider integration is required. Forward selected contracts
and paths to the host. When memory guidance is
materially helpful, request the reference using the existing exact-path selection and the same
resolved release version. Reuse it within the session. Starter-only consumers still receive the
core context rules and hints; consumers must expose the reference to enable full guidance.
The SDK only retrieves public methodology, never memory contents or business data.

## API stability and release candidate

The source package version is `1.0.0-rc.1`. This is a **published release candidate**,
not a stable `1.0.0` release. `list()` returns typed `SkillCatalog`, `getSkill()`
returns typed `SkillBundle` with `SkillContract` (including optional
`MemoryHints`), and `extendSkill()` applies trusted local instructions only.
Responses are checked for schema, pinned identity, known paths, duplicate entries,
unexpected reference origins, incomplete content and inconsistent immutable metadata.

Supported runtime: Node.js 24 or later, ESM and built-in `fetch`. The wire schema
remains 1; added optional fields never imply authorization or memory persistence.
Skill content versions are separate from SDK package versions. Older experimental
content versions are no longer served by the deployed provider.

The SDK remains prerelease pending the remaining external gates in
[SDK stability review](../docs/agents/sdk-stability.md).
