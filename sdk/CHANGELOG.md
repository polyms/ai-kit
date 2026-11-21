# SDK changelog

## 1.0.0-rc.1 (unpublished)

- Export typed `SkillCatalog`, `SkillBundle`, `SkillPackSummary`,
  `SkillContract`, `ContextRequirement`, `KnowledgeHint`, `MemoryHint`,
  `MemoryHints`, `SkillSelection`, `CompositionCatalog` and
  `SkillProviderOptions`.
- Validate schema, source URL, release identity and content before returning data.
  Reject invalid catalog, unexpected paths, incomplete bundles and conflicting
  immutable metadata; do not cache failed responses.
- Preserve concurrently loaded references when updating the same versioned bundle.
  Prevent in-flight requests from repopulating a cleared cache.
- Keep the existing `createSkillProvider` and `extendSkill` usage, transport,
  caching, Node 22+ requirement and schemaVersion 1.

This candidate does not publish a new package, make claims of provider compatibility
or introduce a Memory service. Stable `1.0.0` requires clean registry installation
and real consumer verification.
