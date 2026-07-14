/** Retrieval guidance for MCP read tools — self-contained so it works without a bundled skill loaded. */

export const SEARCH_KNOWLEDGE_TOOL_DESCRIPTION = `Search published Knowledge articles and chunks (incident, design, toolchain) by keyword, filtered by intent and stack manifest axes.

Call this before inventing infra config, design seams, or toolchain setup — it is the org's retrievable-recipe store, not a fallback. Omit axes for org defaults (e.g. polyms-default); pass axes only when a stack manifest names them. Follow up a match with get_knowledge to read the full article.`

export const GET_KNOWLEDGE_TOOL_DESCRIPTION = `Get a published Knowledge article (with all chunks) by id or slug.

Chunks return in sortOrder — read checklist/overview chunks first, config artifacts after. For incident chunks, confirm symptom and cause match before acting on fix steps. Use get_knowledge_chunk to fetch one chunk (e.g. a config artifact) on its own.`

export const GET_KNOWLEDGE_CHUNK_TOOL_DESCRIPTION = `Get a single Knowledge chunk and its parent article by chunk id or slug.

For config chunks (chunkType: config), the body is a verbatim artifact — confirm artifactFilename before copying it into a target repo; do not paraphrase or partially copy it.`

export const GET_KNOWLEDGE_COVERAGE_TOOL_DESCRIPTION = `Evaluate whether published Knowledge articles cover a required axis subset for one or more intents.

Pass a non-empty axes array (stack manifest tags; no blank entries). An article covers when every
passed axis is on article.axisTags (subset match). Omit intents to evaluate incident, design, and
toolchain — do not pass an empty intents array. Returns axes, resolved intents, and byIntent:
{ covered, articleIds } — no titles or summaries.
Use before inventing seams when you only need gap/hit signals; still call search_knowledge to
retrieve recipes. Soft-required for /setup Coverage notes and for /arch / /arch-refactor on the
subset under work (do not trust stale stack-profile Coverage alone).`
