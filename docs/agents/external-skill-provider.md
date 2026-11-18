# External skill provider (V0.4)

Business MCP servers reuse AI Kit skill methodology without a separate client connection.
No runtime GitHub requests, server-side LLM, database, or external registry are needed.

## Delivery and release snapshots

Release 0.3.0 is frozen in registry/releases/0.3.0: original metadata modules and Markdown blobs
from commit b94b59a78dd0704d801a7097ddd4ced19ed2d2dc. Preserve this directory unchanged.
At build time, the generator reads local snapshot files and creates static catalog and starter,
manifest, and full JSON bundles, plus a local snapshot for exact path selection. No build network
requests are needed. Future releases add new immutable directories and explicit generator entries.

- GET /skill-bundles/latest.json: current catalog alias (not immutable).
- GET /skill-bundles/0.3.0/catalog.json: pinned catalog.
- GET /skill-bundles/0.3.0/reqs/starter.json: entry and shared standard.
- GET /skill-bundles/0.3.0/reqs/manifest.json or full.json: other selection modes.
- POST /api/skills with name, version, paths: exact reference selection from local snapshot.

The public API exposes only approved repository skills, never Ops CMS or project data.
Legacy MCP remains unchanged.

## TypeScript SDK

See [SDK README](../../sdk/README.md). Create one provider per server process; pin a version and
preload heavily used skills if appropriate. A cold pinned starter requires one static HTTP request;
a warm hit requires none. The SDK caches successful bundles (32 entries by default), coalesces
identical concurrent requests, and requests only missing reference content. Latest catalog
resolution expires after 60 seconds by default. Returned content is copied to isolate callers.
There is no persistent cache and failures are not cached. Default HTTP timeout is five seconds.

The SDK package is prepared for local packing, not published. Domain extensions remain trusted
local instructions, separate from the base bundle. They neither grant write permission nor replace
core quality gates.

## Verification

Run the landing tests and production build, verify CDN headers and generated assets on deployment,
then measure cold/warm p50 and p95 latency from the consuming MCP. Cache-hit latency and one-request
cold behavior are design goals, not measured production results. Run a real integration smoke test
before declaring stable. External repositories and native MCP skill compatibility are deferred.
