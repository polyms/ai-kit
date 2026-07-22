# ai-kit

Polyms agent skills for real engineering — align, spec, ship.

## Agent skills

### Documentation language

English. See `docs/agents/language.md` (prose language + pure-tech tokens). Chat tone: IDE/user rules (kit
does not set persona unless `/setup` opted in chat voice → `.cursor/rules/agent-voice.mdc`).

### Issue tracker

GitHub issues via `gh` CLI. See `docs/agents/issue-tracker.md`.

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

Idea → `/align` → `/reqs` or `/to-prd` → `/to-issues` → `/design` → `/dev` → `/code-review`; raw issues via `/triage`. Specs on issue tracker; glossary in `CONTEXT.md`.

### Design stack

`/design` — UI spec from PRD at `docs/design/`; `@polyms/core-ui` + `/core-ui` skill for implementation (lib repo, not ai-kit). Long sessions: `designer` in `agents/designer.md`.

### Maintenance

`/arch-refactor` — scan codebase for deepening opportunities, HTML report, grill candidate. `arch` (model-invoked) — architecture vocabulary. `devops` (model-invoked) — deploy/CI incidents via Knowledge MCP + SEV/post-mortem templates; primary executor `developer`, SEV ownership `techlead`. `/docs` — developer-facing docs; `techlead`. `/e2e` — E2E automation; principal agent `tester` (skill id `e2e`). Pipeline walkthrough: `examples/pipeline-feature-walkthrough.md`.

### Invocation

User-invoked vs model-invoked skills; hard vs soft `/setup` dependencies. See `docs/agents/invocation.md` and `docs/adr/0001-skill-setup-dependencies.md`.

### Principal agents

Isolated subagents for deep artifact work — one **principal** owner per org role (not 1:1 with skills). **`/align`** is skill-only (interactive grill in the main chat; no subagent — subagents cannot pause for one-question-at-a-time dialogue):

| Agent       | Role                        | Owns                                                                               |
| ----------- | --------------------------- | ---------------------------------------------------------------------------------- |
| `pm`        | Principal product manager   | PRD, stories, acceptance criteria, scope (`/reqs`)                                 |
| `designer`  | Principal product designer  | `docs/design/` UI specs, `@polyms/core-ui` maps (`/design`)                        |
| `developer` | Principal software engineer | Implementation + TDD (`/dev`); cold deploy/CI execution (`/devops`)                |
| `tester`    | Principal tester            | E2E harness, flake, CI sharding, journeys (`/e2e`)                                 |
| `techlead`  | Principal tech lead         | `/docs`, `arch`, `/code-review`, `/arch-refactor`; `/devops` SEV / infra ownership |

Handoffs: `/align` → reqs/to-prd → design → dev → code-review; public surface → `/docs`
(`techlead`); E2E flake → `/e2e` (`tester`); deploy/CI infra → `/devops` (`developer` executes,
`techlead` owns SEV). Each stage ends with `## Next Step` — one preferred skill (two max with
when/why; see CONTEXT.md **Handoff**). Each agent stays in lane; escalates gaps upstream, does not
relitigate downstream artifacts.
