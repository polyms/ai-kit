/** Authoring guidance for MCP write tools — agent responsibility, not runtime validation. */

export const KNOWLEDGE_MCP_AUTHORING_GUIDE = `
Knowledge articles are org-wide recipes — do not embed project-specific paths, ports, or repo names.

Use generic placeholders when needed:
- {project}, apps/{project}, http://localhost:{port}
- {your tailwindCSS configFile}, {route}

Config chunks (chunkType: config): body is a verbatim artifact. Replace or remove project-specific values before upsert — never copy raw from the working repo.

Prose, checklist, and incident chunks: write generic, stack-combo oriented content. Symptoms and fixes use descriptive language, not hardcoded kit-site routes.

sortOrder: checklist/overview first (0), config artifacts after.

intent: incident | design | toolchain — match audience (/devops, /arch, /dev).

axisTags: stack manifest tags, not repo names.

This publishes immediately and replaces all chunks, not a draft. For a contribution, search/open
existing Knowledge, use sanitized verified provenance and show the complete proposed publication.
Require explicit approval of this exact publication in addition to admin access. For updates,
re-open the target, preserve unrelated fields/chunks and stop on conflicts. For new article or
chunk IDs/slugs, verify all-status availability via authorized admin evidence; published-only
MCP NOT_FOUND is insufficient. If unverifiable, do not write. Verify the returned identity and
read back content; reconcile before
retrying. Never auto-publish or submit private evidence. See the Reflection and Knowledge
Contribution Protocol (docs/agents/reflection-protocol.md) for the host methodology.
`.trim()

export const UPSERT_KNOWLEDGE_TOOL_DESCRIPTION = `Create or update a published Knowledge article with chunks. ${KNOWLEDGE_MCP_AUTHORING_GUIDE}`

export const DELETE_KNOWLEDGE_TOOL_DESCRIPTION =
  'Delete a Knowledge article by id. Cascades all chunks. Requires polyms.dev admin role.'
