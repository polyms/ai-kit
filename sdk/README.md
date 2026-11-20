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

GitHub Actions builds and tests pull requests. Push a dedicated SDK tag matching the SDK package
version to publish to GitHub Packages (for example, sdk-v0.4.0-alpha.1). The SDK is published with the latest dist-tag. Consumers install through the public Polyms npm
registry without authentication.

For local testing before publication, after workspace install, run
`pnpm exec tsc -p sdk/tsconfig.json` and `npm pack ./sdk --ignore-scripts` to create a local tarball.
Install that tarball in your Business MCP. No new workspace dependencies or runtime packages.

## Performance benchmark

Run from the host that will consume the provider, after building the SDK and deploying the API:

```sh
node sdk/benchmark.mjs https://ai-kit.polyms.dev 0.3.2 20
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

The latest catalog is refreshed on demand after 30 minutes by default; override with `latestTtlMs`.
Pinned bundles remain cached until eviction or explicit clearing.

## Context-aware consumers

From skill release 0.3.2, `bundle.contract` includes context requirements and the starter files
include shared context guidance. Forward both the contract and selected file contents to the AI
client, together with trusted domain instructions. The client reuses conversation context and
retrieves missing information through authorized tools; do not send workspace data to the skill
provider. Release 0.3.2 replaces the experimental 0.3.1 snapshot. Use latest or pin 0.3.2;
no SDK upgrade is required to receive the new metadata.
