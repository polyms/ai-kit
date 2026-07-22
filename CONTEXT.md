# ai-kit

Polyms agent skills for real engineering — align, spec, ship. Shared vocabulary for the kit's pipeline, skills, and artifacts.

## Kit

**ai-kit**:
The version-controlled skill library for agentic fullstack development at Polyms — skills, agents, and bootstrap tooling linked globally across projects.
_Avoid_: ai kit, toolkit, prompt library

**Bootstrap**:
The one-time symlink step (`bootstrap.sh`) that links ai-kit skills and agents into local AI tool directories.
_Avoid_: install, setup script (when meaning bootstrap specifically)

## Invocation

**Invoke**:
How a skill is triggered — slash command or autonomous model discovery via `description`.
_Avoid_: trigger, fire, activate

**User-invoked**:
Human types `/name` (e.g. `/align`, `/craft`). Skill has `disable-model-invocation: true`; agent does not auto-fire.
_Avoid_: manual, human-only skill

**Model-invoked**:
Agent reaches the skill via `description` (e.g. `align-loop`, `domain-modeling`, `dev`). No `disable-model-invocation` flag.
_Avoid_: auto, automatic, agent-discovered

## Skills & Agents

**Skill**:
Workflow file at `skills/<name>/SKILL.md` — the agent reads and follows it in the same chat when you invoke `/reqs`, `/dev`, etc.
_Avoid_: prompt, instruction, rule

**Agent**:
Subagent at `agents/<role>.md` — isolated context for long artifact work. Maps to a **real org
role**, not 1:1 with a skill. **Principal** tier: `pm`, `designer`, `developer`, `tester`,
`techlead`. **`/align`** has no agent — grill is interactive in the main chat. Skills stay
playbooks; multiple skills per agent OK (`developer` → `/dev` + `/devops`; `techlead` → `/docs`,
`arch`, `/code-review`, `/arch-refactor`, `/devops`). Skill↔agent: `/reqs`→`pm`, `/design`→`designer`,
`/dev`→`developer`, `/e2e`→`tester`; `/docs`, `arch`, `/code-review`, `/arch-refactor`→`techlead`;
`/devops`→`developer` (exec) + `techlead` (SEV).
_Avoid_: subagent, bot, assistant (when referring to `agents/*.md` principal files), `*-agent` filename

## Pipeline

**Pipeline**:
The stage chain that turns ideas into shipped code: `/align` → `/reqs` or `/to-prd` → `/to-issues` → `/design` → `/dev` → `/code-review`; raw issues via `/triage`. Each stage produces artifacts the next stage consumes.
_Avoid_: workflow, process, flow

**Setup**:
One-time repo configuration for the pipeline — documentation language, issue tracker, domain docs layout, artifact paths. Invoke with `/setup`.
_Avoid_: bootstrap (when meaning repo config, not symlink install)

**Align**:
Align before you build — grill decisions, sharpen domain language, update `CONTEXT.md`. Invoke with `/align`.
_Avoid_: discovery, planning session

**Reqs**:
Discovery, enterprise PRD, user stories, acceptance criteria — draft in chat; does not publish. Invoke with `/reqs`
(user-invoked). Template: `skills/reqs/enterprise-prd-template.md`. Long sessions: `pm`. After align to ship lean
PRD → `/to-prd`.
_Avoid_: /pm (old invoke), PM (when meaning this skill — agent role stays `pm`), write PRD (when meaning `/to-prd`
publish), product management (generic)

**To PRD**:
Synthesize the current conversation into a lean PRD and publish to the issue tracker — no interview. Invoke with
`/to-prd` (user-invoked). Template: `skills/to-prd/lean-prd-template.md`.
_Avoid_: publish PRD (generic), enterprise discovery (when meaning `/reqs`)

**Design**:
Turn a PRD into an engineering-ready UI spec at `docs/design/<feature>.md`, mapped to `@polyms/core-ui`. Invoke with `/design`. Long sessions: `designer`.
_Avoid_: UX phase, UI spec (generic)

**Core UI**:
Design system library (`@polyms/core-ui`, Tailwind CSS 4) and matching `/core-ui` skill for composing primitives — not part of ai-kit; ships with the lib repo.
_Avoid_: component library (generic), shadcn

**Dev**:
Ship production code from spec — TDD, solution ladder, scope self-check, multi-slice status report, debugging.
Pre-merge review via `code-review`. Invoke with `/dev`. Long sessions: `developer`.
_Avoid_: implementation, coding phase

**Code review**:
Three-axis review skill (Standards + Spec + Simplify) since a pinned git fixed point — parallel sub-agents,
severity-tagged findings (🔴 blocker / 🟡 suggestion / 💭 nit). Diffs under 10 changed lines skip sub-agent
spawn and review inline instead. Model-invoked; auto-fires on "review PR", "review diff", "rà soát code",
"over-engineered", "cắt bớt". Invoke with `/code-review`. Long sessions: `techlead`.
_Avoid_: PR review (generic), lint check

**Docs**:
Developer-facing documentation — API reference, tutorials, integration/migration guides for shipped surfaces. Invoke with `/docs`. Long sessions: `techlead`. Does **not** own PRDs (`/reqs`) or feature code (`/dev`).
_Avoid_: technical writer (generic), README dump, /reqs (when meaning requirements)

**E2E**:
End-to-end test automation — Playwright (or repo harness) flake elimination, CI sharding, journey coverage, traces. Invoke with `/e2e`. Long sessions: **`tester`** (skill id `e2e`, agent id `tester`). Does **not** replace seam TDD (`/dev`) or deploy Knowledge fixes (`/devops`).
_Avoid_: QA (generic), tester skill (wrong id — use `/e2e`), unit test (when meaning seam TDD)

**Scope self-check**:
Pre-ship audit that every changed line is required by the stated task — surface temptations as follow-ups, do not expand the diff. Part of `/dev` ship checklist; see `skills/dev/scope-self-check.md`.
_Avoid_: YAGNI checklist (use solution ladder for build choices), minimal change engineer

**Status report**:
Multi-slice `/dev` progress template — phase, slice table, quality gates, one Next. See `skills/dev/status-report.md`. Skip for single-slice one-liners.
_Avoid_: standup notes (generic), orchestrator pipeline (agency-style autonomous spawn)

**DevOps**:
Deploy, CI, and infra ownership — **symptom → fix** via **Runbook** retrieval (CMS/MCP), filtered by **stack manifest**; SEV/status/post-mortem via skill templates. Model-invoked; auto-fires on a deploy/CI symptom reported cold (no `/dev` slice already in progress) — one surfacing mid-slice stays in deploy-aware `/dev`. Invoke with `/devops`. Primary executor: `developer`; SEV / infra ownership: `techlead`. Does **not** own architecture _why_ (ADR) or seam vocabulary (`arch`) or stack design guides (**Stack guide**).
_Avoid_: SRE (generic), ops runbook (when meaning the skill specifically), arch (when meaning module design)

**Incident templates**:
SEV matrix, stakeholder status update, blameless post-mortem, close checklist for `/devops`. Process artifacts — not live Knowledge fix recipes. See `skills/devops/incident-templates.md`.
_Avoid_: runbook (when meaning CMS symptom→fix), PagerDuty playbook (vendor-specific)

**Handoff**:
Transfer between pipeline stages — summary plus `## Next Step` (singular) pointing to the next
skill(s). Prefer **exactly one** `→ /skill`. When the fork is genuinely ambiguous or unavoidable,
allow **at most two** alternatives, each with a one-line when/why. Never a menu of 3+ or a
`|`-joined option list.
_Avoid_: handover, transition, Next Steps (plural heading), multi-skill pipe menus

**Triage**:
Move raw GitHub issues through a state machine — categorise, verify, grill, write agent briefs. Invoke with `/triage`.
_Avoid_: backlog grooming (when meaning the triage skill specifically)

**To Issues**:
Break an approved PRD or plan into vertical-slice GitHub issues. Invoke with `/to-issues`.
_Avoid_: issue splitting (generic)

**Arch**:
Model-invoked vocabulary skill for designing deep modules — seams, depth, leverage. Reads ADRs + **Stack guide** (CMS) for stack-specific design patterns; timeless vocabulary stays in `skills/arch/`. Does **not** own deploy incidents (**Runbook**) or apply config fixes (`devops`).
_Avoid_: codebase design (generic), architecture patterns (when meaning the `arch` skill), devops (when meaning deploy/CI fixes)

**Arch refactor**:
Maintenance scan for deepening opportunities — HTML report, then grill chosen candidate. Invoke with `/arch-refactor`.
_Avoid_: architecture review (generic), refactor (when meaning `/dev`)

## Artifacts

**Artifact**:
Structured output one stage creates and the next stage consumes — PRD, ADR, glossary entry, user story.
_Avoid_: output, deliverable, document

**PRD**:
Product Requirements Document — full spec for engineering and design review. In ai-kit: published to the issue tracker (often a `PRD: <feature>` issue).
_Avoid_: spec, requirements doc

**ADR**:
Architecture Decision Record — a hard-to-reverse **why** decision that needs context to understand.
Stored in `docs/adr/`. `/arch` and `/dev` read ADRs for constraints; **does not** host
symptom→fix — that is **Knowledge** (`intent: incident`).
_Avoid_: decision doc, RFC, runbook (when meaning deploy/CI incident fixes)

**Knowledge**:
Unified Ops CMS content store for agent retrieval — **Knowledge article** + **Knowledge chunk**
(`sortOrder` for display/agent reading order) + hybrid search (keyword + pgvector when
`OPENROUTER_API_KEY` is set). Intents: `incident`, `design`, `toolchain`. Postgres canonical;
public `/knowledge/*` (`/runbooks/*`, `/guides/*` redirect); MCP `search_knowledge` /
`get_knowledge` / `get_knowledge_chunk`. Audience: **`/dev`**, **`developer`**, **`/devops`**,
**`/arch`**, **`techlead`**.
_Avoid_: stack guide (when meaning the unified store), generic wiki, Notion

**Knowledge article**:
Container in **Knowledge** — id (e.g. `KN-001`, `RB-001`, `SG-001`), title, summary, `axisTags`,
primary **Knowledge intent**, optional checklist. Groups related chunks; not the embed unit.
_Avoid_: runbook (when meaning CMS container), stack guide (when meaning article)

**Knowledge chunk**:
Atomic retrieval unit for hybrid search — embed + rank target when embeddings configured.
Author-defined for config artifacts (verbatim), incidents (symptom/cause/fix/verify/
`triggerPhrases`), checklists; long prose sections may auto-sub-chunk at publish (paragraph
boundary + overlap). Filter by intent + **Stack manifest** axes before rank.
_Avoid_: drawer (generic), markdown blob, 800-char window on config files

**Knowledge intent**:
Classifier on article/chunk — e.g. `incident`, `design`, `toolchain`. Scopes retrieval before
vector search. Agent retrieval: [knowledge.md](docs/agents/knowledge.md).
_Avoid_: content type (when meaning separate CMS tables), tag (generic)

**Knowledge pointer**:
Setup/agent doc at `docs/agents/knowledge.md` — how agents retrieve **Knowledge** (MCP tools,
**Stack manifest** filter, confirm chunk before apply). Pointer only; no knowledge body in git.
Single agent SSOT for all intents (replaces former Runbook pointer + Stack guide pointer).
_Avoid_: knowledge index in git (when meaning live CMS content)

**Language pointer**:
Setup output at `docs/agents/language.md` — the fixed language for persistent written docs
(`CONTEXT.md`, ADRs, PRDs, design specs, `docs/agents/*.md`). Written by `/setup`; soft
dependency for `domain-modeling`, `reqs`/`to-prd`, `design`, `arch` — they match this language
or, absent the file, whatever doc they're already editing. Prose stays natural in that language;
only **pure-tech tokens** (invokes, protocols, identifiers, canonical glossary terms) stay
English — no mid-sentence language mix. Chat tone is unaffected — IDE/user rules, or opt-in
`.cursor/rules/agent-voice.mdc` from `/setup`.
_Avoid_: **Locale toggle** (kit-site UI language, not repo docs), i18n (generic), shipping a
always-on kit persona, treating ordinary adjectives as "tech terms" so PRDs become EN/VI collage

**Voice rule**:
Optional `/setup` output — `.cursor/rules/agent-voice.mdc` (`alwaysApply`); Claude Code uses
`.claude/rules/agent-voice.mdc` → symlink to that file. Default offline (no kit persona).
_Avoid_: `docs/agents/voice.md` (removed — was always-on dup with user rules)

**Runbook**:
Legacy label for **Knowledge** articles with `intent: incident` — **symptom → cause → fix →
verify** for deploy/CI/infra (ids often `RB-*`). Public `/runbooks/*` may alias `/knowledge/*`.
Canonical store is **Knowledge**; agents use **Knowledge pointer**, not git markdown.
_Avoid_: deploy doc (generic), design seams (→ **Knowledge intent** `design`), ADR, git markdown
as source of truth

**Deploy guide**:
Per-app quick start under `apps/*/DEPLOY.md` — env vars, local commands, project-specific paths.
Complements **Knowledge** incident articles; **does not** replace cross-cutting known issues.
Agents read deploy guide for app context, Knowledge for symptom match.
_Avoid_: runbook (when meaning cross-cutting traps), README deploy section (generic)

**Stack guide**:
Legacy label for **Knowledge** articles with `intent: design` — stack-combo design knowledge
(checklist + seam sections as **Knowledge chunk**s; ids often `SG-*`). Public `/guides/*` may
alias `/knowledge/*`. Timeless Polyms defaults stay in `skills/dev/stack-defaults.md`.
_Avoid_: symptom→fix (→ **Knowledge intent** `incident`), separate CMS content type
(post-migration), irreversible why (→ ADR)

**Stack profile**:
Declared tooling/deploy combination — e.g. TanStack Start + Vercel + pnpm Nx. Incident articles
cover deploy-correct config; design articles cover seams for the same axes. Written by `/setup`
to `docs/agents/stack-profile.md` (axes + optional Coverage notes from **Knowledge coverage**).
_Avoid_: stack doc (generic), single checklist duplicated across intents (author one intent per
item)

**Stack manifest**:
Per-repo record of stack axes — detected from repo files during `/setup`, user-confirmed,
written to `docs/agents/stack-profile.md`. Filters **Knowledge** search (`axes`); `/setup`
records **Knowledge coverage** gaps for intentional axis subsets (not the full axes list in one
shot). Ops `/ops/matrix` remains the human full-catalog view.
_Avoid_: stack.yaml (generic), tech stack file (when meaning setup output specifically)

**Knowledge coverage**:
MCP read tool `get_knowledge_coverage` — required non-empty `axes` subset + optional intents;
echo inputs; per intent `{ covered, articleIds }`. An article **covers** when
`axes ⊆ article.axisTags`; only **published** articles. Empty/blank `axes` or `intents: []` →
tool validation error; omit intents → all three.
OAuth any connected user. Soft-required for `/setup` (persist Coverage into stack-profile as
bootstrap via fixed per-intent axis heuristics), `/arch`, `/arch-refactor` — those two **re-call
MCP** for the subset under work; stack-profile notes are not live SSOT. Placeholder / kit-bleed
stripping on upsert stays **agent-owned**. Complements `search_knowledge`; does not replace it.
_Avoid_: `/ops/matrix` dump for agents, inventing seams when coverage already lists a hit,
server-side “strip apps/landing” as a complete authoring fix, trusting stale stack-profile
Coverage without re-calling MCP in `/arch` / `/arch-refactor`

**Ops CMS**:
Kit-site ops knowledge admin at `/ops/*` — canonical store is **Knowledge** (articles + chunks +
embeddings). Dimension matrix, axis tags, intent coverage. **Prisma + Postgres (Supabase)**.
OIDC resource server trusting [polyms.dev](https://polyms.dev/) SSO for write/admin; **public
read** at `/knowledge/*` and **MCP** at `/mcp` (rate-limited at edge). Content shape optimized
for **agent retrieval** — see **Ops CMS content shape**.
_Avoid_: admin panel (generic), Notion wiki (when meaning external tool), separate arch wiki
product

**Ops CMS content shape**:
Agent-first storage in Postgres — **Knowledge chunk** as embed unit; structured fields at
retrieval seams. Incident chunks: symptom/cause/fix/verify/`triggerPhrases`. Config chunks:
verbatim artifact + `artifactType`. Prose: author sections; auto-sub-chunk only when over publish
threshold. Hybrid search: filter `intent` + `axisTags` then vector rank. Seed data lives under
`apps/landing/prisma/` — not agent retrieval.
_Avoid_: single bodyMarkdown for all content, parsing markdown for symptom match, fixed-size
split on config files

**Catalog feature module**:
Vertical slice in `apps/landing/src/lib/<feature>/` — **Knowledge** module owns types, repository adapter, **service** (canonical read seam), **server functions** (web transport), and MCP tool definitions. Web routes import server functions; kit-site MCP handler at `/mcp` imports **service** in-process (same deploy boundary). No public REST catalog API. Agents retrieve via MCP at `ai-kit.polyms.dev/mcp`, not REST. _Avoid_: cross-cutting loaders, dual SSR/fetch paths, service logic in route handlers or MCP tool bodies.

**Feature file suffix**:
Dot-suffix naming inside a feature folder — `{feature}.{role}.ts` so grep and diffs distinguish roles at a glance. UI/routes import only `{feature}.fns.ts` (+ `{feature}.types.ts` for component props). Examples: `runbook.fns.ts`, `runbook.service.server.ts`, `runbook.repository.server.ts`, `runbook.catalog-search.ts`, `runbook.mcp.ts`. `{feature}.fns.ts` orchestrates; `{feature}.service.server.ts` is the read seam; repository and catalog-search are internal. Ops: `ops.auth.fns.ts`, `ops.cms.fns.ts`. _Avoid_: bare `fns.ts`, `search.ts`, kebab role files (`runbook-fns.ts`), lib-root `*-search.ts` for URL state.

**Glossary**:
Canonical domain vocabulary for the repo. Lives in `CONTEXT.md` — glossary only, no specs.
_Avoid_: CONTEXT, domain doc

**CONTEXT.md**:
Root glossary file — single source of truth for domain terms. Updated inline when terms resolve during `/align` or `domain-modeling`.
_Avoid_: context file, domain model file

**Domain modeling**:
Model-invoked skill that sharpens the domain model — challenge terms, probe edge cases, update `CONTEXT.md` inline, offer ADRs when warranted.
_Avoid_: domain design, terminology session

## Triage

**Triage role**:
A canonical label role in the triage state machine — either a **state** (`needs-triage`, `ready-for-agent`, …) or **category** (`bug`, `enhancement`). Mapped to tracker label strings in `docs/agents/triage-labels.md`.
_Avoid_: label, tag (when meaning triage roles specifically)

**Agent brief**:
Structured comment on a `ready-for-agent` issue or PR — the AFK contract `/dev` works from. Original issue body is context; the brief is authoritative.
_Avoid_: spec comment, triage notes

**ready-for-agent**:
Triage state role — issue fully specified with an agent brief attached; pick up with `/dev`.
_Avoid_: AFK-ready, agent-ready

## Authoring

**Craft**:
User-invoked skill for writing and editing ai-kit skills. Authoring vocabulary (predictability, sprawl, context load, pruning) lives in `skills/craft/glossary.md` — not duplicated here.
_Avoid_: skill writing, meta-skill

**Hard setup dependency**:
Skill that requires `docs/agents/*.md` from `/setup` — output is wrong without it (e.g. `/to-prd`, `/to-issues`, `/triage`). See ADR-0001.
_Avoid_: must run setup (when meaning hard dependency only)

**Soft setup dependency**:
Skill that reads `CONTEXT.md` / ADRs when present but works without them (e.g. `/dev`, `/reqs`).
_Avoid_: optional context

## Kit site

**Kit site**:
The static web app in this repo that introduces ai-kit to end users — hero, skill catalog, sample prompts, bootstrap CTA. Deployed separately from markdown docs; not the README.
_Avoid_: website, docs site (when meaning the kit site app)

**Landing page**:
The kit site's home screen — value proposition, quick start, and entry into the skill catalog.
_Avoid_: homepage (generic), marketing page

**Skill catalog**:
Browsable index of skills on the kit site — invoke name, description, status, domain tag, link to detail and sample prompt. Homepage grid and `/skills` share one overlay registry. Richer UX than the README catalog table.
_Avoid_: skill list, skills page (generic)

**Skill detail**:
Kit site page at `/skills/:slug` — invoke panel, badges, extended overlay copy, sample prompt (available only), agent panel, GitHub source. Single route for skills; no separate `/agents/*` pages.
_Avoid_: skill page (generic), agent detail page

**Sample prompt**:
Copy-paste example showing how to invoke a skill in chat — bilingual EN/VI where the skill supports it. Lives on the kit site; README may mirror for contributors.
_Avoid_: example prompt, starter prompt

**Content overlay**:
Curated metadata layered on `skills/*/SKILL.md` frontmatter — status, domain tag, sample prompts, agent hint, and kit-site detail fields (summary, whenToUse, pipeline, boundaries, agent panel). Frontmatter is base; overlay fills fields README maintains today that frontmatter lacks.
_Avoid_: generated content, skill config (generic)

**Planned skill**:
Skill or agent listed on the kit site before its `SKILL.md` or `agents/<role>.md` ships in the repo — overlay `status: planned`; detail page shows Planned badge, no sample prompt.
_Avoid_: roadmap item (generic), coming soon (UI label only)

**Locale toggle**:
Kit site control switching UI chrome between Vietnamese (default) and English (optional). Prompt samples remain bilingual EN/VI per skill regardless of toggle.
_Avoid_: i18n (when meaning the toggle specifically), language switcher (generic)

**Umami**:
Privacy-friendly analytics on the kit site — pageviews and optional custom events via Umami script; no cookie banner for basic tracking. Configured at build time via env. v1 events: `copy_prompt`, `pipeline_section_view`, `cta_quick_start`, `theme_toggle`, `command_palette_open`.
_Avoid_: GA, Google Analytics, tracking (generic)

**Theme toggle**:
Kit site control switching between dark (default) and light UI chrome; persists `localStorage` key `ai-kit-theme`. First visit respects `prefers-color-scheme` when unset.
_Avoid_: dark mode (generic), color scheme (generic)

**Font stack**:
Kit site typography — **Quicksand** for UI/display (loaded via `@polyms/core-ui/styles/_fonts.css`, same as core-ui setup); **JetBrains Mono** for invoke lines, prompts, and pipeline rail (app-owned `@font-face` or Google Fonts). Map to Tailwind `--font-sans` / `--font-mono` in `apps/landing/`.
_Avoid_: system font stack (when meaning kit site after font decision), web font (generic)

**Featured skill teaser**:
Compact landing strip below the hero — four entry-point commands (`/setup`, `/align`, `/reqs`, `/dev`) with one-line descriptions and links to skill detail; distinct from the hero terminal animation (pipeline path). Full catalog remains at `/skills`.
_Avoid_: top skills, skill highlights (generic)

**Default client router**:
Polyms `/dev` greenfield routing — **TanStack Router** (`@tanstack/react-router`) by default; **TanStack Start** when SSR or server routes are required. Match existing repo stack when already chosen.
_Avoid_: react-router-dom (greenfield default), page router (generic)

**Default client store**:
Polyms `/dev` greenfield client state — **Zustand** for UI chrome and cross-route state; shareable filters/tabs in **router search params**, not the store. Not Redux on greenfield.
_Avoid_: Redux (greenfield default), god store

**Kit site router**:
Client routing for the kit site SPA — TanStack Router (`@tanstack/react-router`) with typed routes and search params for catalog filters. Static deploy; no SSR.
_Avoid_: react-router (when meaning kit site stack), page router (generic)

**Kit site store**:
Zustand stores for kit site UI state — theme, locale, command palette open/close; persist theme/locale via `localStorage`. Catalog filter state lives in router search params, not the store.
_Avoid_: Redux, React Context (when meaning kit site global UI state)
