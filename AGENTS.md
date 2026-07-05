# ai-kit

Polyms agent skills for real engineering — align, spec, ship.

## Agent skills

### Issue tracker

GitHub issues via `gh` CLI. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at repo root. See `docs/agents/domain.md`.

### Runbooks & stack guides

Deploy/CI/infra **Runbooks** and stack-combo **Stack guides** live in Ops CMS (Postgres). Agents retrieve via MCP or kit site — not git markdown body:

- [docs/agents/ops-cms-mcp.md](docs/agents/ops-cms-mcp.md) — MCP at `ai-kit.polyms.dev/mcp`, Cursor setup
- [docs/agents/runbooks.md](docs/agents/runbooks.md) — `/devops`, deploy-aware `/dev`
- [docs/agents/stack-guides.md](docs/agents/stack-guides.md) — `/arch`, deploy-aware `/dev`
- [docs/runbooks/](docs/runbooks/) — contributor snapshot only

### Triage labels

Canonical roles mapped to tracker labels. See `docs/agents/triage-labels.md`.

### Pipeline

Idea → `/align` → `/pm` or `/to-prd` → `/to-issues` → `/design` → `/dev` → `/code-review`; raw issues via `/triage`. Specs on issue tracker; glossary in `CONTEXT.md`.

### Design stack

`/design` — UI spec from PRD at `docs/design/`; `@polyms/core-ui` + `/core-ui` skill for implementation (lib repo, not ai-kit). Long sessions: `design-agent` in `agents/design-agent.md`.

### Maintenance

`/arch-refactor` — scan codebase for deepening opportunities, HTML report, grill candidate. `arch` (model-invoked) — architecture vocabulary.

### Invocation

User-invoked vs model-invoked skills; hard vs soft `/setup` dependencies. See `docs/agents/invocation.md` and `docs/adr/0001-skill-setup-dependencies.md`.

### Voice

Chat tone for grill and agents — plain language, natural assistant. See `docs/agents/voice.md`.

### Principal agents

Isolated subagents for deep artifact work — one **principal** owner per downstream pipeline stage. **`/align`** is skill-only (interactive grill in the main chat; no subagent — subagents cannot pause for one-question-at-a-time dialogue):

| Agent          | Role                        | Owns                                            |
| -------------- | --------------------------- | ----------------------------------------------- |
| `pm-agent`     | Principal product manager   | PRD, stories, acceptance criteria, scope        |
| `design-agent` | Principal product designer  | `docs/design/` UI specs, `@polyms/core-ui` maps |
| `dev-agent`    | Principal software engineer | Implementation, TDD, production code            |

Handoffs: `/align` → pm/to-prd → design → dev. Each agent stays in lane; escalates gaps upstream, does not relitigate downstream artifacts.
