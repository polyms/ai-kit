# Portable skill standard

AI Kit owns reusable methodology and quality gates. Project setup identifies authoritative sources,
preferred execution routes and policies. The host owns reasoning, tools, credentials and execution.
A skill works across IDE, conversational and delegated hosts without installing AI Kit into the target
workspace. A cloud sandbox is not necessarily a checkout; a connector is not necessarily read/write.

## Before work

1. Reuse supplied context. Resolve target project/repository, issue/PR, branch/revision, environment
   and requested result where material. Never confuse the AI Kit source repository with the target.
2. Read target agent instructions and `docs/agents/execution-profile.md` when available, plus relevant
   tracker, language, domain and stack configuration. Discover them through authorized repo/project
   tools or a confirmed checkout. Distinguish absent, inaccessible and unknown. Do not require a
   profile to discover a profile, or download AI Kit Markdown into the project.
3. Follow canonical sources and operation routes. Resolve actual host tool schemas, not guessed MCP
   aliases. Preferences are not proof of access. Without a profile, choose safe equivalent routes
   to the same source. Missing destination, label mapping, branch policy or authority blocks the
   affected write, not a read-only draft. Ask only material questions. Do not auto-run setup,
   install tools, change credentials or permissions to satisfy a workflow.

## Execution and continuity

- Memory hints refer to the host agent's own available memory and conversation context. Never
  discover, connect to or call a separate memory service to fulfill a skill hint. If no relevant
  native memory is available, continue; project evidence retrieval remains a separate task need.

- At a meaningful verified outcome, reflect once only when a reusable lesson is evident or a
  retrospective is requested. Load [Reflection and Knowledge Contribution](reflection-protocol.md)
  selectively for a shared Knowledge or skill contribution when available in the current kit;
  preserve scope and privacy, never auto-publish or force another search. No useful lesson means
  skip. Contribution-specific retrieval or tool calls require the user's voluntary choice after
  the original task; do not change skill gates or delay task completion. If the reference is
  unavailable, keep a bounded private lesson/draft; do not publish.
- Express gates as observable outcomes, not mandatory commands. CLI examples are equivalent
  operations, not required tools. Verify checkout/ref or remote comparison; preserve merge-base
  semantics and disclose truncated diffs. Do not mix a PR patch and unrelated HEAD.
- Prefer independent parallel review axes when supported; otherwise use separate checklist passes
  and disclose reduced isolation. Keep local verification gates intact. Remote CI/test evidence must
  match the revision, environment and required checks. Never equate a delegated summary or unrelated
  green build with PASS.
- Interactive tasks retain decision gates. Delegated tasks reuse approved decisions and explicit
  bounded assignments; do not ask again or infer write authority from a mention/event alone. Never
  settle unapproved business decisions. If nobody can answer, return a conditional/blocked handoff
  with questions and proposed options, rather than waiting in an empty loop.
- Carry decisions, source/revision, artifacts, blockers, gate and actual receipts using the existing
  composition handoff. For drafts pass actual content; for persisted artifacts pass a verified accessible
  reference or relevant content. Proposed paths are labels only, not evidence of writes. For separate runs use authorized durable project records or a portable draft;
  AI Kit does not store workflow state.
- Establish draft-only/diagnose-only, authorized artifact write, or implementation mode before delegation or workflow steps that could mutate state. In draft-only mode no repository or tracker writes, including spec, ADR and glossary files. A draft can pass content gates without a file; authorized write and implementation gates still require actual receipts. Pass mode to every child; do not infer approval from a draft.
- Read before writing. Preserve unrelated content, confirm identity/permission/scope and branch/PR
  policy. Reconcile ambiguous outcomes before retrying; never fall through to another write tool
  blindly. Draft, publication, actual test evidence and human approval are distinct.
- In native clients, preserve manual-only frontmatter for setup, craft, build-feature-map, reqs,
  design, docs, align, arch-refactor and e2e. In conversational MCP, use `mcpSelection`: ordinary
  relevant intent selects reqs, design and docs; setup, craft, build-feature-map, align, arch-refactor
  and e2e require clearly requested workflow intent or a bounded authorized assignment, not literal
  slash syntax. Align-loop, domain-modeling and collab remain model-invocable. Do not start a full interactive grill without a relevant request. A canonical skill may select a relevant reference branch without
  automatically invoking a second skill. Lean publication, slice creation, triage mutations, ADR writes,
  architecture refactors, implementation and deployment require their original evidence and approval
  gates. Reading references or relatedSkills is not invocation or authorization.

Skill-relative references are served by AI Kit; project paths are resolved in the target project.
Use starter content and request additional allowlisted references by exact path as needed. Do not
fetch raw URLs or install a checkout merely to read a skill.
