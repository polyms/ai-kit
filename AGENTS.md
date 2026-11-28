# ai-kit

Polyms AI Augmentation Layer for existing LLMs and AI tools.

## Product positioning (required for all changes)

Read [canonical product positioning](docs/product/positioning.md) before changing the landing page,
MCP, SDK, skills, composition, or architecture. AI Kit extends the host AI with skills, methodology,
Knowledge and guidance. The **host** owns inference, reasoning, conversation, context and authorized
tool execution. Memory in AI Kit hints means the executing host agent's own available memory and context. AI Kit defines memory-use methodology, not storage, APIs, provider engines or synchronization. Do not seek external memory connectors for a hint; business evidence retrieval is a separate task.
Do not propose a server-side LLM, agent runtime, model router or AI orchestration engine. Metadata delivery, static retrieval,
versioning and deterministic checks are in scope. See the [augmentation roadmap](docs/product/augmentation-roadmap.md)
for planned capabilities and linked strategy documents; planned work is not implementation authorization. Product copy must address end-user benefit without
claiming that AI Kit independently reasons, executes or has verified compatibility it has not tested.

## Agent skills

### Client compatibility

Codex and GitHub Copilot: read `docs/agents/client-compatibility.md` for invocation,
discovery, setup, and subagent adaptations. Cursor and Claude retain their existing workflow.

Codex tool and command choice: follow `.codex/rules/tool-choice.md`.

### Project conventions

Follow [docs/agents/conventions.md](docs/agents/conventions.md) for Markdown formatting and commit messages.
When creating or editing skills or agents, follow [docs/agents/invocation.md](docs/agents/invocation.md).

### Documentation language

English. See `docs/agents/language.md` (prose language + pure-tech tokens). Chat tone: IDE/user rules (kit
does not set persona unless `/setup` opted in chat voice → `.cursor/rules/agent-voice.mdc`).

### Issue tracker

GitHub issues via authorized GitHub MCP or `gh`. See `docs/agents/issue-tracker.md`.

### Execution profile

Follow `docs/agents/execution-profile.md` for canonical sources, operation routes and write/verification policy.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at repo root. See `docs/agents/domain.md`.

### Knowledge

Deploy/CI/infra **incident**, stack-combo **design**, and **toolchain** recipes live in Ops CMS
(Postgres). Agents retrieve via MCP or kit site — not git markdown body:

- [docs/agents/knowledge.md](docs/agents/knowledge.md) — unified retrieval (`search_knowledge`,
  `get_knowledge`, `get_knowledge_chunk`, `get_knowledge_coverage`); intents `incident` · `design` ·
  `toolchain`
- [docs/agents/stack-profile.md](docs/agents/stack-profile.md) — per-repo stack axes (from
  `/setup`) for Knowledge search filters
- [docs/agents/ops-cms-mcp.md](docs/agents/ops-cms-mcp.md) — MCP at `ai-kit.polyms.dev/mcp`, Cursor
  setup

### Triage labels

Canonical roles mapped to tracker labels. See `docs/agents/triage-labels.md`.

### Pipeline

Idea → `/align` → `/reqs` → `/task` → `/design` → `/dev` → `/code-review`; raw issues via
`/track`. A single feature prompt ("build a CRUD user page") may enter through `collab`
instead of naming each principal: codebase-first lean PRD (`pm`), ADR only when hard to reverse
(`techlead`), UI spec when there is a screen (`designer`). Ask only for a blocking fork the repo cannot
settle. A complete spec packet with no blocking questions authorizes `dev` in the same turn; do not
wait for another confirmation. When scope or behavior is still uncertain and the repo cannot settle
it, ask before implementation. Explicit `/align`,
`/reqs`, `/design`, or `/dev` still wins when the user names it. Specs on issue tracker; glossary in
`CONTEXT.md`.

For authorized implementation or review-and-fix requests with an applicable source review gate,
follow [Review-Fix Protocol](docs/agents/review-fix-protocol.md). The host repeats review, fixes
and verification within the authorized scope until ready or a bounded stop condition is reached.
Review-only remains read-only; merge and deploy require separate authority.

### Business and work operations

Use `research` for evidence-based investigation, `business` for decisions and financial analysis,
`task` for actionable work tickets, and `bug` for defect reports. Use `track` for existing work items,
`plan` for estimates and delivery, `qa` for functional coverage, and `comms` for stakeholder messages. Use `review` for non-code artifact critique and `release`
for readiness and go-live planning. `/reqs` includes a business requirements
template; `/docs` includes business documentation. Follow `docs/agents/work-artifact-standard.md` for
human-readable and AI-readable artifacts. Draft by default; use authorized integrations to publish when
explicitly requested. These workflows do not require a specific AI client or issue tracker.
See [MCP skill provider](docs/agents/mcp-skill-provider.md) for architecture, pack structure,
maintenance, verification and the rollout handoff. Read it before changing skill delivery.
For remote routing and progressive retrieval, see `docs/agents/skill-intelligence.md`.
For context requirements and source integrity, see `docs/agents/context-contract.md`.
For selective use of historical experience, see `docs/agents/memory-protocol.md` when relevant.
Memory is optional; use already available native context or skip. Never require a memory service, tool or connection. Existing invocation and verification gates remain unchanged.
At meaningful verified outcomes, use [Reflection and Knowledge Contribution](docs/agents/reflection-protocol.md) only when a reusable lesson is evident or a retrospective is requested. No automatic publication or mandatory reflection.
For multi-skill work, follow `docs/agents/skill-composition.md` and select only relevant recipes
in `workflows/`. Evaluate handoffs with `evals/composition/`.
See `docs/agents/skill-capabilities.md` for tool abstraction and composition,
`docs/agents/external-skill-references.md` for licensing, and `evals/work-skills/` for evaluations.

### Design stack

`/design` — UI spec from PRD at `docs/design/`; preserve the project's existing design system. If none exists, suggest Polyms UI Kit (`@polyms/ui-kit`) as an **optional** candidate without installing or adopting it automatically. Long sessions: `designer` in `agents/designer.md`.

### Maintenance

`/arch-refactor` — scan codebase for deepening opportunities, HTML report, grill candidate. `arch` (model-invoked) — architecture vocabulary. `devops` (model-invoked) — deploy/CI incidents via Knowledge MCP + SEV/post-mortem templates; primary executor `developer`, SEV ownership `techlead`. `/docs` — business and developer-facing docs; `techlead` for technical writing. `/e2e` — E2E automation; principal agent `tester` (skill id `e2e`). `/build-feature-map` — authors the
repo-local `feature-map` skill; same principal `tester`. Pipeline walkthrough:
`examples/pipeline-feature-walkthrough.md`.

### Invocation

User-invoked vs model-invoked skills; hard vs soft `/setup` dependencies. See `docs/agents/invocation.md` and `docs/adr/0001-skill-setup-dependencies.md`.

### Principal agents

Isolated subagents for deep artifact work — one **principal** owner per org role (not 1:1 with skills). **`/align`** is skill-only (interactive grill in the main chat; no subagent — subagents cannot pause for one-question-at-a-time dialogue):

| Agent       | Role                        | Owns                                                                               |
| ----------- | --------------------------- | ---------------------------------------------------------------------------------- |
| `pm`        | Principal product manager   | PRD, stories, acceptance criteria, scope (`/reqs`)                                 |
| `designer`  | Principal product designer  | `docs/design/` UI specs, project design-system maps (`/design`)                         |
| `developer` | Principal software engineer | Implementation + TDD (`/dev`); cold deploy/CI execution (`/devops`)                |
| `tester`    | Principal tester            | E2E (`/e2e`); repo feature map (`/build-feature-map`)                              |
| `techlead`  | Principal tech lead         | `/docs`, `arch`, `/code-review`, `/arch-refactor`; `/devops` SEV / infra ownership |

Handoffs: `/align` → reqs → design → dev → code-review; public surface → `/docs`
(`techlead`); E2E flake → `/e2e` (`tester`); deploy/CI infra → `/devops` (`developer` executes,
`techlead` owns SEV). Each stage ends with `## Next Step` — one preferred skill (two max with
when/why; see CONTEXT.md **Handoff**). Each agent stays in lane; escalates gaps upstream, does not
relitigate downstream artifacts. Subagent spawn: do not duplicate delegated search; set explore
thoroughness — see [docs/agents/invocation.md](docs/agents/invocation.md#subagent-delegation).

### Skill evaluation

Run `pnpm eval:test` and `pnpm eval:run --dry-run` from the repo root. Follow `evals/README.md`
for model comparisons; never run paid endpoints without explicit configuration and use only synthetic
fixtures. Record actual results and limitations; do not treat fixtures as benchmark passes.
