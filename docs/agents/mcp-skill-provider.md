# MCP skill provider and work operations

## Purpose and scope

AI Kit extends its existing engineering workflows with reusable research, business, requirements,
documentation and ticket-authoring capabilities. The same skill source serves local coding assistants
and remote MCP clients, without client-specific workflow forks. The thirteen registered packs are
listed below. Other local skills remain local until explicitly registered for remote delivery.

This document is the maintainer and new-session entry point for the skill provider. For authentication
and deployment configuration, see [Ops CMS MCP](ops-cms-mcp.md). For ticket and document quality,
see [Work artifact standard](work-artifact-standard.md).

## Architecture

```text
Local clients                          Remote MCP clients
    |                                         |
    | local skill installation                | list_skill_packs / get_skill_pack
    |                                         v
    |                                AI Kit landing app (Vercel)
    |                                allowlisted skill manifest
    |                                         | parallel HTTPS fetch
    v                                         v
skills/<name>/SKILL.md + templates <--- GitHub raw files on main

Agent applies workflow -> drafts Markdown -> authorized client integration (if requested)
```

- **Skill layer:** Markdown workflow, templates, reference files, shared quality rules.
- **Delivery layer:** The existing authenticated MCP endpoint exposes read-only discovery and retrieval.
- **Execution layer:** Each client selects and applies a skill using its available reasoning and tools.
- **Integration layer:** Ticket and document operations use the client's authorized integrations;
  the skill provider itself does not create tickets or publish documents.

Knowledge retrieval and authoring remain the separate Ops CMS/Postgres capability on the same
MCP endpoint. No new service, database, cache, dependency or MCP tool is introduced for skill delivery.

## Published skill catalog

| Pack     | Intended output                                        | Bundled references                                                           |
| -------- | ------------------------------------------------------ | ---------------------------------------------------------------------------- |
| research | Evidence-based research brief or comparison            | research-template.md, evidence-guide.md                                      |
| business | Business case, pricing or decision analysis            | business-case-template.md, decision-templates.md                             |
| reqs     | Explicit BRD or detailed PRD, user stories             | business-requirements-template.md, assumptions-and-change.md, PRD references |
| docs     | Business documents or developer documentation          | business-doc-template.md, work-records.md                                    |
| task     | Actionable standalone task ticket                      | task-template.md                                                             |
| bug      | Evidence-based defect report                           | bug-template.md                                                              |
| design   | UI specification                                       | Existing design references; optional Polyms uiKit files                                   |
| track    | Ticket review, backlog snapshot, bulk update receipt   | tracking-templates.md                                                        |
| plan     | Effort estimate and delivery plan                      | delivery-plan-template.md                                                    |
| qa       | Test plan, cases, coverage and report                  | qa-templates.md                                                              |
| comms    | Client replies, comments and stakeholder messages      | communication-templates.md                                                   |
| review   | Artifact review, assumption challenge and gap analysis | review-template.md                                                           |
| release  | Readiness, go-live and release notes                   | release-templates.md                                                         |

All packs except design include `docs/agents/work-artifact-standard.md`. Design retains its
existing specialized quality guidance. The manifest, not this table, determines what MCP serves.

Routing: research gathers evidence; business evaluates decisions; reqs specifies outcomes and
behavior; docs explains or communicates; task defines work to perform; bug records a defect. Track manages existing work; plan estimates delivery; qa designs and verifies
functional coverage; comms drafts professional messages.
The consolidated reqs, task and track packs own lean PRD publication, vertical slicing and triage respectively; their original gates remain.
Use an explicit BRD for business-facing scope; use the enterprise PRD for detailed product behavior.
Do not generate duplicate PRD/BRD artifacts unless requested.

## Repository layout

```text
skills/
  research/  SKILL.md, research-template.md
  business/  SKILL.md, business-case-template.md
  reqs/      SKILL.md, business-requirements-template.md, existing PRD references
  docs/      SKILL.md, business-doc-template.md
  task/      SKILL.md, task-template.md
  bug/       SKILL.md, bug-template.md
  design/    SKILL.md, existing design references
  track/     SKILL.md, tracking-templates.md
  plan/      SKILL.md, delivery-plan-template.md
  qa/        SKILL.md, qa-templates.md
  comms/     SKILL.md, communication-templates.md
  review/    SKILL.md, review-template.md
  release/   SKILL.md, release-templates.md
docs/agents/
  mcp-skill-provider.md       architecture, maintenance, verification
  work-artifact-standard.md  shared authoring and publishing rules
  ops-cms-mcp.md             transport, auth, tool contract
apps/landing/src/lib/skill-pack/
  skill-pack.ts              allowlist, descriptions, path resolution
  skill-pack.mcp.ts          MCP registration, fetch, response, errors
  skill-pack.test.ts         manifest and retrieval contract tests
```

## MCP contract and client usage

Connect the client's MCP implementation to `https://ai-kit.polyms.dev/mcp` using Streamable HTTP
and the server's OAuth flow. Client support for these features varies; do not assume every AI product
can connect or automatically invoke remote skills.

1. Call `list_skill_packs` to discover names and descriptions.
2. Select only relevant packs using descriptions and routing hints; honor explicit invocation and client policy.
   Call `get_skill_pack` with the selected name and that pack's `starterPaths` as `paths`.
3. Read the returned SKILL.md first. Apply the relevant bundled template and shared standard.
4. Use user-supplied or authorized context. Draft the output, or publish only when requested.
5. Return actual ticket/document IDs and links after a successful write.

The list returns `{packs: [{name, skillRawUrl, description, useWhen, avoidWhen, starterPaths, relatedSkills, contract}], packCount, source, composition: {protocol, recipes}}`. The `packCount` is derived from `packs.length`.
The additional routing and composition fields are advisory and backward-compatible.
The get operation returns `{name, contract, source, files: [{path, rawUrl, content}]}`.
The contract includes advisory context requirements; starter content includes shared context guidance. For design it also exposes optional
`uiKit` entries of the same file shape. Polyms UI Kit is not a required library; honor the existing project design system. Omitting paths retrieves all core files but **does not load Polyms UI Kit content**; optional UI Kit paths remain discoverable and require explicit selection. Existing raw URLs are retained; clients need not perform
an HTTP GET. Unknown names return `NOT_FOUND`; upstream failures return `FETCH_FAILED`.
A failed fetch fails the whole pack rather than silently returning incomplete instructions.

The existing transport uses MCP text results containing serialized JSON. Paths are explicitly
allowlisted. Skills are fetched in parallel with a ten-second per-file timeout; no application
cache is used. GitHub CDN propagation may delay updated content. There is no commit pinning across
parallel reads. Both tools now expose `source: {kind: "mutable-branch", ref: "refs/heads/main", immutable: false, revision: null}`. The deployment commit from `server_info` is not a pinned Markdown revision. Do not infer skill release `0.3.3` from it or from a file mentioning that version. For independently pinned provenance use the separate versioned provider, `/skill-bundles/<version>/catalog.json` and `/api/skills` with an explicit version; do not equate the versioned snapshot bytes with live MCP `main` content. A Markdown-only edit to an already registered file does not require redeploying the
landing app after it reaches main. New packs, changed file lists and server changes do require
deployment. Preview/local servers also fetch from main, not the PR branch; mocked tests or a
controlled test fixture are needed for pre-merge content checks.

## Canonical skill catalog

The live MCP catalog exposes 21 canonical packs, including all engineering responsibilities.
Use reqs for discovery or lean PRD publication; task for standard tickets or vertical slicing;
track for inspect/update or triage; align for decision loop/domain modeling; arch for design/refactor;
dev for preparation/implementation/debug; qa for functional/E2E; review for non-code artifacts; code-review for source changes.
Setup, devops, craft and build-feature-map retain distinct responsibilities.

Legacy workflow names resolve to their canonical packs with requestedName metadata and are not listed
as skills. Native clients should use the new canonical commands with the branch described in prose.
Authorization and verification gates remain independent of routing. Existing immutable SDK releases
are unchanged; live MCP retains mutable-main provenance pending versioned release validation.

## Progressive retrieval

Existing clients may continue to omit paths and receive complete packs. Prefer the catalog's
`starterPaths` for new calls: this returns entry content, shared standard for work packs and the default
template where applicable; all other file paths remain metadata. For large packs:

- Discover file paths with `get_skill_pack({name: "design", paths: []})`; this performs no upstream fetch.
- Fetch the entry point using `paths: ["skills/design/SKILL.md"]`, then request referenced files as needed.
- Unselected files retain path and rawUrl but omit content. The optional design uiKit group is preserved as manifest metadata; select content only when the user/project chose Polyms UI Kit.
- All paths must match the selected pack manifest; INVALID_PATHS fails before external fetch.
- For work packs, load the shared work artifact standard and relevant templates before drafting.
- Request only missing references. Batch needed exact paths per pack in one call, reuse already loaded content, and skip optional recipes when contracts already suffice.
- Related skills are optional handoffs, not prerequisites, automatic execution or permission to publish.

The provider has no arbitrary URL endpoint, cache or orchestration engine. Optional selection is a
backward-compatible field; it does not change the default full-pack behavior.

See [capabilities and composition](skill-capabilities.md), [external references](external-skill-references.md)
and the [work skill evaluations](../../evals/work-skills/README.md).

## Skill intelligence

See [skill-intelligence.md](skill-intelligence.md) for routing metadata, selective retrieval policy,
composition and regression checks. See [skill composition](skill-composition.md) for typed metadata,
shared context, gates, handoffs and recipes. Load the protocol and chosen recipe on demand;
recipe paths are scoped to their host pack, and no composition files are in starterPaths.
MCP implicit full-pack loading includes core files only; optional Polyms UI Kit content requires exact paths. The versioned provider defaults to minimal `starter`; its explicitly requested `full` strategy intentionally includes all registered files, including optional UI Kit. The server does not classify
prompts or execute workflows.
The client chooses relevant skills using metadata and user intent, while local manual-only policy
continues to govern native skill invocation.

## Human-readable and AI-readable artifacts

Use Markdown with stable semantic headings, outcome-first prose and testable acceptance criteria.
Requirement/rule/criterion IDs are useful for traceability, not a substitute for meaningful wording.
Separate known facts, assumptions, proposed decisions and open questions. A bug report must never
claim independent reproduction unless performed. Prefer tracker-native metadata and avoid duplicating
conflicting values in the body. See the shared standard and each pack's template for required and
optional sections.

A skill is not permission to perform external writes. The client must resolve the actual destination,
check duplicates when possible and follow the user's requested draft/publish intent.

## Adding or modifying a pack

1. Read [invocation conventions](invocation.md) and use the existing craft workflow.
2. Create or update `skills/<name>/SKILL.md` with valid frontmatter and concise routing.
3. Add reusable Markdown templates and references as separate files. Link them from SKILL.md.
4. Include shared quality rules for work artifacts; do not fork the standard for a specific client.
5. Register name, description and all intended files in `skill-pack.ts`. Preserve existing response
   fields; never allow a caller-provided URL or arbitrary path to be fetched.
6. Extend the manifest and response tests. Update this guide, README catalog, and any affected
   landing-site catalog or local bootstrap documentation. Rerun local bootstrap for newly added skills
   if the client uses per-skill links.
7. Verify and deploy through the existing landing-app process. Do not add cache or a new tool
   unless an observed requirement warrants it.

## Verification and rollout

From the repository root after installing dependencies:

```sh
pnpm --filter @polyms/landing test src/lib/skill-pack/skill-pack.test.ts
pnpm --filter @polyms/landing test
pnpm build
```

After merge and Vercel deployment, smoke-test with an authenticated MCP client:

- Discover thirteen packs and confirm descriptions; fetch each and verify every expected file is populated.
- Confirm unknown pack handling; verify design still includes uiKit and no raw-URL follow-up is needed.
- Draft a task, bug and BRD using their templates; check standalone context, testable criteria and unknowns.
- Test at least two client implementations that support the endpoint's transport and OAuth.
- Test an authorized ticket creation in a safe project if publishing is in scope; verify the returned ID.

## Handoff status

Phase 1 was merged in PR #3. Production Vercel status succeeded and authenticated MCP retrieval
returned nonempty Markdown for all seven initial packs. This verifies retrieval only, not workflow
quality. Phase 2 adds track, plan, qa and comms, extending the MCP contract without breaking full-pack retrieval and using the same
manifest and shared standard. Verify the expanded catalog and test each new workflow after deployment.

PR #5 also adds review/release, evidence and decision references, assumption/change templates,
work records, opt-in selective retrieval, and evaluation fixtures. REQS_REFERENCE_PATHS includes
known kit-owned reqs dependencies. Project-specific context remains client-provided. V0.3 closes known relative Markdown links in design/docs, including client compatibility and
visual-ship. Project-specific files and external resources are still resolved by the client.
Landing-site UI catalog and actual comparative evaluation runs remain follow-up work.

The initial expansion was merged in [PR #3](https://github.com/polyms/ai-kit/pull/3). The current
work is in [PR #5](https://github.com/polyms/ai-kit/pull/5); check its live status for the latest state.
V0.2 production smoke tests passed for all thirteen packs and selective retrieval; unit tests and
comparative skill evaluations were not executed in the authoring session.

Next: review the diff; run targeted and full tests/build; merge and deploy; verify full-pack and
selective retrieval; run the evaluation fixtures with representative clients. Keep the landing-site
catalog and remaining legacy dependencies as explicit follow-ups. No compatibility claims for untested
clients.

## External integrations

See [External skill provider](external-skill-provider.md) for the separate versioned HTTP API and
local domain extension SDK. Existing MCP clients retain the original contract.
