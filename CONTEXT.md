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
Agent reaches the skill via `description` (e.g. `align-loop`, `domain-modeling`, `pm`). No `disable-model-invocation` flag.
_Avoid_: auto, automatic, agent-discovered

## Skills & Agents

**Skill**:
Workflow file at `skills/<name>/SKILL.md` — the agent reads and follows it in the same chat when you invoke `/pm`, `/dev`, etc.
_Avoid_: prompt, instruction, rule

**Agent**:
Subagent at `agents/<name>-agent.md` — isolated context for long tasks. **Principal** tier: `align-agent`, `pm-agent`, `design-agent`, `dev-agent` — one dedicated owner per pipeline stage. Reads the matching skill, then executes. Suffix `-agent` distinguishes from the skill (`pm` vs `pm-agent`).
_Avoid_: subagent, bot, assistant (when referring to `agents/*-agent.md` files)

## Pipeline

**Pipeline**:
The stage chain that turns ideas into shipped code: `/align` → `/pm` or `/to-prd` → `/to-issues` → `/design` → `/dev` → `/code-review`; raw issues via `/triage`. Each stage produces artifacts the next stage consumes.
_Avoid_: workflow, process, flow

**Setup**:
One-time repo configuration for the pipeline — issue tracker, domain docs layout, artifact paths. Invoke with `/setup`.
_Avoid_: bootstrap (when meaning repo config, not symlink install)

**Align**:
Align before you build — grill decisions, sharpen domain language, update `CONTEXT.md`. Invoke with `/align`.
_Avoid_: discovery, planning session

**PM**:
Turn ideas into engineering-ready specs — PRD, user stories, acceptance criteria. Invoke with `/pm`. May interview; uses full enterprise PRD template.
_Avoid_: product management (when meaning the `/pm` skill)

**To PRD**:
Synthesize the current conversation into a lean PRD and publish to the issue tracker — no interview. Invoke with `/to-prd`.
_Avoid_: publish PRD (generic), write PRD (when meaning `/pm` discovery workflow)

**Design**:
Turn a PRD into an engineering-ready UI spec at `docs/design/<feature>.md`, mapped to `@polyms/core-ui`. Invoke with `/design`. Long sessions: `design-agent`.
_Avoid_: UX phase, UI spec (generic)

**Core UI**:
Design system library (`@polyms/core-ui`, Tailwind CSS 4) and matching `/core-ui` skill for composing primitives — not part of ai-kit; ships with the lib repo.
_Avoid_: component library (generic), shadcn

**Dev**:
Ship production code from spec — TDD, debugging. Pre-merge review via `code-review`. Invoke with `/dev`.
_Avoid_: implementation, coding phase

**Code review**:
Two-axis review skill (Standards + Spec) since a pinned git fixed point — parallel sub-agents, side-by-side findings. Model-invoked; auto-fires on "review PR", "review diff", "rà soát code". Invoke with `/code-review`.
_Avoid_: PR review (generic), lint check

**Handoff**:
Transfer between pipeline stages — summary plus `## Next Step` pointing to exactly one next skill.
_Avoid_: handover, transition

**Triage**:
Move raw GitHub issues through a state machine — categorise, verify, grill, write agent briefs. Invoke with `/triage`.
_Avoid_: backlog grooming (when meaning the triage skill specifically)

**To Issues**:
Break an approved PRD or plan into vertical-slice GitHub issues. Invoke with `/to-issues`.
_Avoid_: issue splitting (generic)

**Arch**:
Model-invoked vocabulary skill for designing deep modules — other skills reach it when placing seams or deepening interfaces. Full glossary in `skills/arch/SKILL.md`.
_Avoid_: codebase design (generic), architecture patterns (when meaning the `arch` skill)

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
Architecture Decision Record — a hard-to-reverse decision that needs context to understand. Stored in `docs/adr/`.
_Avoid_: decision doc, RFC

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
Skill that reads `CONTEXT.md` / ADRs when present but works without them (e.g. `/dev`, `/pm`).
_Avoid_: optional context

## Kit site

**Kit site**:
The static web app in this repo that introduces ai-kit to end users — hero, skill catalog, sample prompts, bootstrap CTA. Deployed separately from markdown docs; not the README.
_Avoid_: website, docs site (when meaning the kit site app)

**Landing page**:
The kit site's home screen — value proposition, quick start, and entry into the skill catalog.
_Avoid_: homepage (generic), marketing page

**Skill catalog**:
Browsable index of skills on the kit site — invoke name, description, status, domain tag, link to detail and sample prompt. Richer UX than the README catalog table.
_Avoid_: skill list, skills page (generic)

**Sample prompt**:
Copy-paste example showing how to invoke a skill in chat — bilingual EN/VI where the skill supports it. Lives on the kit site; README may mirror for contributors.
_Avoid_: example prompt, starter prompt

**Content overlay**:
Curated metadata layered on `skills/*/SKILL.md` frontmatter — status, domain tag, sample prompts, agent hint. Frontmatter is base; overlay fills fields README maintains today that frontmatter lacks.
_Avoid_: generated content, skill config (generic)

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
Compact landing strip below the hero — four entry-point commands (`/setup`, `/align`, `/pm`, `/dev`) with one-line descriptions and links to skill detail; distinct from the hero terminal animation (pipeline path). Full catalog remains at `/skills`.
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
