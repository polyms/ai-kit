# MCP skill provider and work operations

## Purpose and scope

AI Kit extends its existing engineering workflows with reusable research, business, requirements,
documentation and ticket-authoring capabilities. The same skill source serves local coding assistants
and remote MCP clients, without client-specific workflow forks. The first seven published packs are
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

| Pack | Intended output | Bundled references |
| --- | --- | --- |
| research | Evidence-based research brief or comparison | research-template.md |
| business | Business case, pricing or decision analysis | business-case-template.md |
| reqs | Explicit BRD or detailed PRD, user stories | business-requirements-template.md, existing PRD references |
| docs | Business documents or developer documentation | business-doc-template.md |
| task | Actionable standalone task ticket | task-template.md |
| bug | Evidence-based defect report | bug-template.md |
| design | UI specification | Existing design references and uiKit files |

All packs except design include `docs/agents/work-artifact-standard.md`. Design retains its
existing specialized quality guidance. The manifest, not this table, determines what MCP serves.

Routing: research gathers evidence; business evaluates decisions; reqs specifies outcomes and
behavior; docs explains or communicates; task defines work to perform; bug records a defect.
The existing `to-prd`, `to-issues`, `triage`, and engineering pipeline are not replaced.
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
2. Call `get_skill_pack` with the selected name (for example, `{"name":"task"}`).
3. Read the returned SKILL.md first. Apply the relevant bundled template and shared standard.
4. Use user-supplied or authorized context. Draft the output, or publish only when requested.
5. Return actual ticket/document IDs and links after a successful write.

The list returns `{packs: [{name, skillRawUrl, description}]}`.
The get operation returns `{name, files: [{path, rawUrl, content}]}`. For design it also returns
`uiKit` entries of the same file shape. Existing raw URLs are retained; clients need not perform
an HTTP GET. Unknown names return `NOT_FOUND`; upstream failures return `FETCH_FAILED`.
A failed fetch fails the whole pack rather than silently returning incomplete instructions.

The existing transport uses MCP text results containing serialized JSON. Paths are explicitly
allowlisted. Skills are fetched in parallel with a ten-second per-file timeout; no application
cache is used. GitHub CDN propagation may delay updated content. There is no commit pinning across
parallel reads. A Markdown-only edit to an already registered file does not require redeploying the
landing app after it reaches main. New packs, changed file lists and server changes do require
deployment. Preview/local servers also fetch from main, not the PR branch; mocked tests or a
controlled test fixture are needed for pre-merge content checks.

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

- Discover seven packs and confirm descriptions; fetch each and verify every expected file is populated.
- Confirm unknown pack handling; verify design still includes uiKit and no raw-URL follow-up is needed.
- Draft a task, bug and BRD using their templates; check standalone context, testable criteria and unknowns.
- Test at least two client implementations that support the endpoint's transport and OAuth.
- Test an authorized ticket creation in a safe project if publishing is in scope; verify the returned ID.

## Handoff status

The initial work-operations expansion is tracked in [PR #3](https://github.com/polyms/ai-kit/pull/3).
It includes server-side Markdown retrieval, the seven-pack catalog, six new templates, shared authoring
rules and unit test changes. The PR branch is the source of these changes until merged.
At the time of this handoff, automated tests/build and production smoke tests have not been executed,
and the landing-site UI catalog has not been expanded for the four new skills. Check live PR and
deployment status rather than assuming this snapshot stays current.

Next: review the diff; run tests/build; reconcile landing-site catalog visibility as needed; merge,
deploy and run the smoke checks above. Optimize payload size, caching or finer-grained reference
retrieval only if measurements show a need. No compatibility claims for untested clients.
