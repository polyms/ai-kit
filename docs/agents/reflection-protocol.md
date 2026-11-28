# Reflection and Knowledge Contribution Protocol

Host-executed, optional improvement guidance. AI Kit supplies methodology, not a learning runtime,
new skill, memory store or publication service. Use the existing selected skill and its gates.

## 1. Decide whether to reflect

Reflect once at a meaningful task boundary, when verified outcomes, a correction, or voluntary
feedback reveal a materially reusable lesson. Do not add a routine retrospective, search or
question to every task or every review-fix iteration. Skip when there is no useful lesson,
the task is still in progress, or reflection would exceed the authorized scope. An explicitly
requested retrospective can discuss incomplete work, with uncertainty marked. Do not delay
the requested deliverable to collect contribution evidence. A read-only or draft-only request
remains read-only or draft-only.

Record only what is necessary in the current working context:

| Field | Meaning |
| --- | --- |
| Intended outcome | Expected behavior, requirement or previous decision |
| Observed outcome | What actually happened; distinguish observed, reported and unknown |
| Evidence | Relevant source, date/version, environment and verification receipt; mark unavailable facts |
| Explanation | Verified cause, plausible hypothesis or unknown; a green test alone does not establish causality |
| Lesson | Bounded, reusable guidance with applicability, exclusions and remaining uncertainty |

A draft, suggestion, successful tool call or a passed mock test is not proof of production behavior.
Do not generalize a single observation beyond its evidence. A hypothesis may motivate future
verification, not published prescriptive guidance. Do not run new mutations, experiments or paid
evaluations solely to obtain a lesson without separate authority.

## 2. Choose at most the useful destinations

- **No contribution:** the default when evidence, relevance, generality or authority is insufficient.
- **Host-native memory:** a useful private preference, decision or scoped lesson may remain in the
  current handoff; follow the [Memory Protocol](memory-protocol.md) and host settings. Never
  discover, connect to or call a memory service, create a memory record, or claim persistence.
- **Project record:** project-specific requirements, incidents or architecture decisions belong
  to that project's existing authorized records. Reflection does not authorize a write.
- **Shared Knowledge candidate:** a generalized, verified technical incident, design seam or
  toolchain recipe may be drafted using section 3. It need not originate in native memory.
- **Skill feedback:** if the issue is methodology (not model reasoning, host tool behavior or
  project configuration alone), explain the gap, observed evidence and proposed improvement.
  Only for voluntary AI Kit feedback use the existing `prepare_feedback_issue` flow: show the
  exact PUBLIC draft, get explicit approval before authorized GitHub creation, otherwise use the
  prefilled link. No automatic issue creation, skill edits or promotion from Knowledge.

These are optional alternatives, not a mandatory chain. Multiple destinations are appropriate
only when each has a distinct material benefit. No new tool or storage is required for reflection.

## 3. Prepare a Knowledge candidate

Use the existing Ops CMS published Knowledge catalog, not a new database. The candidate is an
in-conversation draft, not a CMS draft record. After completing the requested work, a material
reusable lesson may warrant one brief optional offer to contribute. Only start this section
when the user explicitly requests a contribution draft or voluntarily chooses to contribute.
Do not initiate contribution-specific retrieval or tools merely because reflection found a lesson;
reuse any applicable search evidence from the original task. Declining or ignoring the offer has
no effect on task completion, review gates or skill behavior:

1. **Generalize before any external query.** Remove customer/project identities, private URLs,
   account identifiers, paths/ports, tokens, logs, raw conversations, proprietary code and
   other sensitive data. Use safe generic placeholders and public source URLs only. Do not
   disclose private evidence in search queries, candidate text or public feedback; keep it local.
   If a safe verified basis cannot be described, keep the lesson private or stop.
2. **Check applicability and provenance.** Choose an existing intent (`incident`, `design`,
   `toolchain`), relevant stack axes and tested versions/environment. Record a sanitized
   verification summary, source and date, observed vs inferred cause, prerequisites, known
   exclusions and limitations. Use repeatable steps with verification; do not invent a source.
3. **Search before proposing.** Use `search_knowledge` with sanitized symptom/topic, intent and
   relevant axes; try a bounded alternate wording or related intent if the first search misses
   and overlap is plausible. Open relevant matches with `get_knowledge`; use
   `get_knowledge_chunk` for config content. Record the actual searches and matching IDs/slugs.
   Search absence is not proof of uniqueness; coverage alone is not duplicate detection.
   If retrieval is unavailable or inconclusive, mark overlap unverified and do not publish to CMS;
   a sanitized issue candidate may request maintainer verification.
4. **Choose a disposition.** Existing sufficient guidance: reuse, no contribution. Overlapping
   guidance needing correction: propose a targeted update with live ID/slug and preserve
   unrelated chunks. Distinct applicable guidance: propose a new candidate, explaining the
   difference. Conflicting or stale evidence: mark blocked pending maintainer review, not a
   silent overwrite or deprecation. Unknown identity or conflicting ID/slug blocks CMS writes,
   not a safe candidate submitted for maintainer review. Do not invent a target.
5. **Draft for review.** Include the following fields; omit unrelated detail:

   - Disposition (reuse / update / new / blocked), intent, title, stack axes, version/applicability.
   - Evidence and provenance (sanitized source, date, verification method and result, limitations).
   - Overlap check (queries, matches, comparison, target ID/slug if updating).
   - Proposed content: summary, symptom/cause/fix/verify for incidents or prerequisites,
     steps/tradeoffs/verify for design/toolchain; ordered chunks and generic config placeholders.
   - Remaining uncertainty, redactions and proposed verification or review action.

   Preserve provenance in the existing article/chunk text if approved; no new CMS fields are
   assumed. Use the existing authoring guide and actual tool schema for payload preparation.
   A candidate with a material evidence or privacy gap stays blocked. Do not ask for permission
   to publish merely because a reflection hint exists.

## 4. Submit a voluntary Knowledge contribution through GitHub

The default shared contribution route for end users is the existing `polyms/ai-kit` GitHub Issues
queue, not a CMS write. Only offer it when the user wants to contribute; do not interrupt the
original task, mandate a contribution, or request admin access. Reuse the existing feedback tool
with `category: knowledge`, `description` containing the proposed generic guidance, and
`knowledge: { intent, disposition, applicability, evidence, overlap, target? }`. Use `new` or
`update`; for an update provide the live target ID/slug. If overlap is unverified, state that
explicitly for maintainer review; a material privacy/evidence gap still blocks submission.
Show the exact PUBLIC title/body, obtain explicit approval and use the separately authorized host
GitHub create_issue action; if unavailable or unsuccessful, provide the tool's prefilled URL
without retrying. Clearly mark any shortened fallback and retain the full draft in chat.
If the tool does not yet support the category, keep the draft and explain the limitation; never
misclassify it as a skill issue or seek CMS write access. Issue creation is not CMS publication.
The maintainer may accept, amend, reject or request verification; no automatic issue-to-CMS
promotion or skill change. Do not require a contributor to allocate CMS identities.

## 5. Maintainer review, authorization and CMS publication

Only the authorized maintainer handles CMS publication after independently reviewing the candidate.
Show the complete proposed published content (all fields and chunks), destination, disposition and meaningful changes
to the user/authorized maintainer. A successful task, admin token, draft approval for another
artifact or instruction to reflect is not publication approval. Require explicit approval of
the exact Knowledge publication and a verified admin-authorized route before calling
`upsert_knowledge`. The tool creates/updates **published** content and replaces all chunks;
it is not a draft, append or review-queue operation.

For a new article, confirm unused article and chunk IDs/slugs across all statuses through an
authorized admin source or maintainer-confirmed allocation backed by that source. Published-only
MCP reads cannot rule out unpublished collisions; a NOT_FOUND result is not proof of availability.
If all-status identity cannot be verified, stop at the draft. Never reuse an identity for a different
article. For updates, re-open the live target immediately before writing, compare the reviewed
content and preserve all unaffected fields/chunks, their IDs and order. Verify any newly added
chunk identities against the same all-status source. If content changed, identity is uncertain,
or concurrent edits cannot be safely reconciled, stop and return a revised draft for approval.
Do not claim an atomic compare-and-swap guarantee; the existing tool has no revision precondition.
Do not delete or deprecate another article through this protocol.

If explicitly approved and authorized, use the existing admin tool. Verify the actual returned
article identity and read back the published content. If execution or readback fails, report
what is confirmed, unknown or blocked; reconcile live state before any retry. No automatic
publish, deletion, fallback write or retry. This is host guidance; the CMS still enforces its
existing admin role and structural validation, not semantic review or secret detection.

## Completion

Return the requested work first. If reflection is useful, provide a concise lesson or
candidate and its actual disposition (private / draft / reused / blocked / issue submitted /
CMS published and verified). Report the actual issue URL if submitted; do not equate it with publication. Do not generate an empty reflection report, count lessons as a success metric,
or claim improved model intelligence. No contribution is a valid outcome.
