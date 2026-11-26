# Work artifact standard

Use this standard for tickets, requirements, research and business documents, regardless of AI client
or destination. A person and an agent must understand the artifact without the originating chat.

## Readability and structure

- Use Markdown, descriptive titles, stable section headings and short paragraphs.
- Describe the affected actor, context, behavior and outcome in plain language before technical detail.
- Follow the selected template. Replace placeholders; omit optional sections when irrelevant.
- Use one prose language, matching the user or destination project. Keep technical terms when needed.
- Use stable IDs (BR-01, AC-01) within an artifact when traceability helps. Explain each ID in words.
- Make acceptance criteria independently testable; use Given/When/Then for conditional behavior.
- Keep confirmed facts, observations, assumptions, proposals and open questions distinct.
- Mark unknown required information as Unknown or [NEEDS CLARIFICATION: reason]. Never fabricate facts.
- Link source documents, parent tickets, dependencies and evidence by real IDs or URLs.
- Do not expose secrets, personal data, raw internal prompts, unnecessary repo paths or internal agent jargon.
- Prefer readable Markdown over JSON/YAML in ticket bodies. Use tracker-native fields for metadata when
  available. Do not duplicate conflicting status, priority, assignee or due date in the body.

## Feature and environment-specific artifacts

When documenting a feature or QA observation, distinguish **approved behavior** from
**observed behavior** and name the target environment, feature/requirement revision and
build/snapshot where material and known. Keep documentation completeness, ticket progress,
deployment, feature-flag availability and QA verification as separate claims.

- Preserve the authoritative source and status for requirements, decisions, Q&A, feature maps,
  test runs and environment observations. A database-backed map may be canonical while a
  repository copy is only an E2E export; do not silently rewrite the canonical source from an
  older fixture. Follow the consumer's stated ownership rather than assuming either storage.
- Record actual source IDs, timestamps and evidence references when available. An unavailable
  record is **Unknown**, not a verified absence or a passing test. Do not copy evidence from one
  environment/build to another without verification.
- Keep a proposed QA question or answer distinct from an approved business rule. Keep a draft
  feature map distinct from an authorized QA-confirmed snapshot. Different approvals may have
  different role owners; a document edit does not grant approval or QA confirmation rights.
- When version/build relationships cannot be established, note that limitation explicitly
  rather than assigning an inferred deployed requirement revision.

## Publishing

Draft unless the user requested creation or update. When publishing, use the available authorized tracker
or document integration. Resolve the destination and search for duplicates where supported. Map metadata
to the destination's actual field values; do not invent assignees, labels, priorities or deadlines.
If a required destination or field cannot be resolved, return the draft and the blocker.
Report the real created or updated ID and URL only after success. Never claim unperformed verification.

## Updates and verification

- For existing artifacts, read the latest version and preserve unrelated fields, confirmed decisions,
  scope, acceptance criteria and references. Update only the requested section or field.
- For bulk changes, resolve the exact target set; distinguish successful, failed, skipped and
  unverified operations. Read back changed values when the integration supports it.
- For summaries, record the scope and snapshot time, distinguish incomplete retrieval from complete
  results, and cite the actual source. Do not infer that missing information means zero.
- For estimates and test reports, distinguish proposed work from completed work. Use consistent units
  and reconcile totals; do not represent an unexecuted test or unverified deployment as passed.

## Final check

- [ ] A new reader understands the goal and scope from the artifact alone.
- [ ] The selected template's required sections are populated or explicitly marked unknown.
- [ ] Each acceptance criterion can be independently tested.
- [ ] Facts, assumptions and evidence are distinguishable.
- [ ] No unresolved placeholder, duplicate ticket or unsupported claim is silently presented as confirmed.
