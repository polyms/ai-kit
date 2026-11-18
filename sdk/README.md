# AI Kit SDK

Dependency-free server-side TypeScript client. Create one provider per process, pin a version and
optionally preload frequently used skills. Starter bundles use a static GET; exact reference paths
use the local snapshot API. Successful results are cached in memory, identical concurrent requests
are coalesced and errors are not cached. No project data is sent to AI Kit.

```ts
import { createSkillProvider, extendSkill } from '@polyms/ai-kit-sdk'

const provider = createSkillProvider({
  endpoint: 'https://ai-kit.polyms.dev',
  version: '0.3.0',
})
await provider.preload(['reqs'])
const base = await provider.getSkill('reqs')
const skill = extendSkill(base, {
  name: 'product-reqs',
  extends: 'ai-kit/reqs@0.3.0',
  instructions: 'Preserve existing requirement IDs.',
})
```

GitHub Actions builds and tests pull requests. Push a dedicated SDK tag matching the SDK package
version to publish to GitHub Packages (for example, sdk-v0.4.0-alpha.1). Prereleases use the next
dist-tag; stable releases use latest. Installation requires GitHub Packages read access or the
Polyms registry proxy if configured to serve this package.

For local testing before publication, after workspace install, run
`pnpm exec tsc -p sdk/tsconfig.json` and `npm pack ./sdk --ignore-scripts` to create a local tarball.
Install that tarball in your Business MCP. No new workspace dependencies or runtime packages.

## Performance benchmark

Run from the host that will consume the provider, after building the SDK and deploying the API:

```sh
node sdk/benchmark.mjs https://ai-kit.polyms.dev 0.3.0 20
```

The report includes cold/warm p50 and p95, reference fetch timing and network call counts.
Cold means a new SDK instance, not an empty CDN, DNS or connection cache. Use the same host and
version for comparisons. Initial targets for `reqs` are cold p95 under 500 ms and warm p95 under
5 ms, subject to network and runtime conditions. These are targets, not measured results.

For direct GitHub Packages installation, configure the consuming repository's npm scope and a
read-packages credential using its existing secret management:

```ini
@polyms:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

```sh
pnpm add @polyms/ai-kit-sdk@0.4.0-alpha.1
```
