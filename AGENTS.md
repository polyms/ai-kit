# ai-kit

Polyms agent skills for real engineering — align, spec, ship.

## Agent skills

### Issue tracker

GitHub issues via `gh` CLI. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at repo root. See `docs/agents/domain.md`.

### Triage labels

Canonical roles mapped to tracker labels. See `docs/agents/triage-labels.md`.

### Pipeline

Idea → `/align` → `/pm` or `/to-prd` → `/to-issues` → `/ux` → `/dev` → `/code-review`; raw issues via `/triage`. Specs on issue tracker; glossary in `CONTEXT.md`.

### Maintenance

`/arch-refactor` — scan codebase for deepening opportunities, HTML report, grill candidate. `arch` (model-invoked) — architecture vocabulary.

### Invocation

User-invoked vs model-invoked skills; hard vs soft `/setup` dependencies. See `docs/agents/invocation.md` and `docs/adr/0001-skill-setup-dependencies.md`.
