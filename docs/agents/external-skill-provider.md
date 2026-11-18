# External skill provider (V0.4 foundation)

Business MCP servers can retrieve public AI Kit skills without connecting a second MCP in the
client. The client still performs reasoning and authorized actions. No server-side LLM is added.

## HTTP contract

POST `https://ai-kit.polyms.dev/api/skills` with JSON. The route exposes only public repository
skill content; Ops CMS and user context are excluded. No OAuth token is required for this public API.
Do not send private project data to the provider.

- `{ "version": "0.3.0" }`: catalog.
- `{ "name": "reqs", "version": "0.3.0" }`: starter content and remaining file metadata.
- `{ "name": "reqs", "strategy": "manifest" }`: metadata only.
- `{ "name": "reqs", "paths": ["skills/reqs/enterprise-prd-template.md"] }`: selective content.
- `strategy: "full"`: explicit full retrieval. Do not combine paths and strategy.

Every response carries schemaVersion, version and immutable Git revision. The initial registry
supports 0.3.0 only; latest resolves to that release, not main. Preserve the 0.3.0 catalog snapshot
before changing the existing manifest in future releases; do not silently change pinned metadata.
The legacy MCP tools are unchanged and continue fetching main.

## TypeScript integration

Copy the dependency-free source `sdk/skill-provider.ts` into the consuming server for this initial
release (not an npm-published package). Configure the trusted endpoint server-side.

```ts
const provider = createSkillProvider({ endpoint: 'https://ai-kit.polyms.dev' })
const base = await provider.getSkill('reqs', { version: '0.3.0' })
const workflow = extendSkill(base, {
  name: 'product-reqs',
  extends: 'ai-kit/reqs@0.3.0',
  instructions: 'Every requirement belongs to a project. Preserve existing IDs.',
})
// Return workflow plus authorized project context from your own MCP tool.
```

Return the core entry and shared standard first. Fetch additional templates using exact paths and
the same resolved version. Domain instructions are additive and separate from core content.
The consuming MCP validates actual business writes and obtains user authorization independently.
An extension is not an executable plugin, arbitrary remote URL or permission grant.

## Limits and next steps

The registry is code-owned and read-only. The initial implementation supports a single trusted
AI Kit source and local domain extensions. Multi-repository registry, published SDK, native
MCP Skills Extension compatibility, rate limiting and release automation are follow-ups.
Run provider tests and build, then smoke-test from an actual Business MCP before production use.
