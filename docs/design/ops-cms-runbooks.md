# Design Spec: Ops CMS — Runbooks & Stack Guides (Public + Admin)

Output path: `docs/design/ops-cms-runbooks.md`

**Related:** [GitHub PRD #1](https://github.com/polyms/ai-kit/issues/1) · [CONTEXT.md](../../CONTEXT.md) ·
[Kit site spec](./ai-kit-landing.md) · [RB-001](https://ai-kit.polyms.dev/knowledge/RB-001) · seed
[`rb-001-data.ts`](../../apps/landing/prisma/rb-001-data.ts)

> **Post-ship note:** Agent retrieval SSOT is [knowledge.md](../agents/knowledge.md). Former
> `docs/agents/runbooks.md`, `docs/agents/stack-guides.md`, and git `docs/runbooks/*.md` were
> removed — live body is Ops CMS / Postgres only. Sections below describing those paths are
> historical design record.

> **Scope:** **Ops CMS** — two content types on Postgres (Supabase): **Runbook** (symptom → fix, audience `developer`) and **Stack guide** (design knowledge, audience `arch` / `/dev`). Phase **1a** public `/runbooks/*` (shipped) + Phase **1b** Runbook pointer alignment; Phase **2** Ops CMS `/ops/*` (OIDC write, runbook editors); Phase **3** Stack guide schema + `/guides/*` public + guide editors + dual-type matrix. Extends `apps/landing` router and chrome — **does not** redesign global kit site shell. Runbook and Stack guide **content** English-only v1; chrome follows existing locale toggle (VI/EN labels only). `docs/runbooks/*.md` = import snapshot only — **not** live sync, **not** agent retrieval target.

---

## 1. Brief

### BRIEF-INFERENCE table (mandatory)

| Dimension          | Question                        | Ops CMS answer                                                                                                                                                                             |
| ------------------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Industry**       | What world is the user in?      | DevOps / deploy-CI-ops **and** stack design — incident response, stack manifests, agent retrieval (`/devops`, `/arch`, `/dev`)                                                             |
| **Audience**       | Who judges "good" in 3 seconds? | On-call engineer under stress + **architect choosing seams for a stack combo** + ops author curating both types — anti-marketing, intent-first, RB-001 clarity tier                        |
| **Mood**           | One adjective + anti-mood       | **Utilitarian ops surface, incident- and design-readable** — not SaaS brochure, not purple-gradient AI landing                                                                             |
| **Motion depth**   | subtle / standard / emphasis    | **Subtle** everywhere — search debounce, table row highlight, publish toast; no hero animation on runbooks or guides                                                                       |
| **Layout family**  | Primary family                  | **Docs tool column + sticky local nav** (public); **dense admin shell + split editor** (ops) — not card grid landing                                                                       |
| **Focal moment**   | One viewport = one hero beat    | **Public runbook index:** symptom search + first result row; **Public guide index:** stack-axis search + first guide row; **Guide detail:** design checklist; **Ops editor:** live preview |
| **Density**        | sparse / balanced / dense       | **Dense** — tables, mono IDs, checklist rows; whitespace via seams not empty panels                                                                                                        |
| **Theme default**  | dark-first / light-first        | **Dark-first** — inherit kit site flash script + tokens; light toggle AA via core-ui semantic tokens only                                                                                  |
| **Reference tier** | Craft URLs                      | [tasteskill.dev](https://www.tasteskill.dev/) craft tier (typography/seams) + **RB-001 markdown** as runbook content layout reference                                                      |

### Brief lock

Ops CMS is the **live ops knowledge surface** on the kit site — two content types, one Postgres store. Humans discover deploy fixes by symptom at `/runbooks/*`; architects discover stack-combo design knowledge at `/guides/*`. Operators curate both at `/ops/*` with publish-on-save. Success = an engineer finds **RB-001-03** from “No Output Directory named `.output`” in under 30 seconds; an architect finds **SG-001** (when shipped) for the same axis combo and reads seam conventions without wading through symptom→fix; an ops author sees **coverage gaps per content type** in the dimension matrix before agents hit blind spots. Visual language stays kit-site dark-first with **docs/utilitarian** weight — no marketing hero on runbook or guide routes.

### §1a Domain model & content boundaries

Canonical vocabulary from [CONTEXT.md](../../CONTEXT.md) — **Artifacts** + **Pipeline** sections. Do not duplicate checklist items across Runbook and Stack guide; author **one intent per item**.

| Artifact / store                   | What it holds                                                                                                                          | Audience / retriever                        | Live source of truth                              | Agent retrieval?                             |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------- | -------------------------------------------- |
| **Runbook**                        | Symptom → cause → fix → verify; **Stack profile** + greenfield checklist for _deploy/build correctness_ (outputs, env, CI)             | **`developer`** via `/devops`               | **Ops CMS** Postgres → `/runbooks/*`, MCP         | **Yes** — filtered by **Stack manifest**     |
| **Stack guide**                    | Stack-combo **design knowledge**: greenfield checklist + seam conventions (routing, state, module boundaries) for _design correctness_ | **`arch`**, **`/dev`** (deploy-aware slice) | **Ops CMS** Postgres → `/guides/*` (planned), MCP | **Yes** — filtered by **Stack manifest**     |
| **ADR**                            | Irreversible **why** decisions                                                                                                         | `/arch`, `/dev`                             | `docs/adr/` git                                   | Read ADRs — **not** symptom→fix              |
| **Deploy guide**                   | Per-app quick start — env vars, local commands, app paths                                                                              | Humans, `/dev`                              | `apps/*/DEPLOY.md` git                            | App context only — not cross-cutting traps   |
| **Runbook pointer**                | How agents **retrieve** Runbooks (search API, stack manifest filter, confirm symptom)                                                  | `/devops`, deploy-aware `/dev`              | `docs/agents/runbooks.md` (setup output)          | Pointer only — no runbook body               |
| **Git markdown runbooks**          | Import snapshot / authoring reference                                                                                                  | Contributors                                | `docs/runbooks/*.md`                              | **No** — not live sync, not retrieval target |
| **`skills/dev/stack-defaults.md`** | Timeless Polyms greenfield defaults (Zustand, TanStack Router, etc.)                                                                   | `/dev`                                      | ai-kit skill file                                 | Timeless defaults — not stack-combo CMS      |

**Intent split (aligned):** Same **axis tags** can link sibling Runbook + Stack guide for a stack combo (e.g. vercel + tanstack-start + nx). Runbook greenfield items = deploy correctness; Stack guide checklist + prose = design correctness. **RB-001 split deferred:** keep RB-001 as-is in v1; **SG-001** authoring when `/guides/*` ships.

**Retrieval split (aligned):**

| Skill / artifact               | Retrieves                                    | Does NOT own                              |
| ------------------------------ | -------------------------------------------- | ----------------------------------------- |
| `/devops`                      | **Runbook** (filtered by **Stack manifest**) | ADR why, arch vocabulary, **Stack guide** |
| `/arch`                        | **Stack guide** + ADR                        | Deploy incidents, config fixes            |
| `/dev`                         | **Stack guide** when deploy-aware slice      | —                                         |
| ADR                            | `docs/adr/`                                  | symptom→fix                               |
| `skills/dev/stack-defaults.md` | Timeless Polyms greenfield defaults          | Stack-combo-specific CMS content          |

### §1b Quality bar

Per [QUALITY-BAR.md](../../skills/design/QUALITY-BAR.md) — borrow [tasteskill.dev](https://www.tasteskill.dev/) composition density and seam rhythm, not brand.

| Dimension            | Bar                                                                                                                                                                                                                                |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Visual reference** | [tasteskill.dev](https://www.tasteskill.dev/) — type scale, border seams, dark craft; **RB-001** — symptom index table, issue block structure; **Stack guide detail** — checklist + seam section rhythm (prose + mono callouts)    |
| **Craft intent**     | 3-level type scale (`.h1` page / `.h2` section / `.label-mono` IDs); **`max-w-4xl`** docs column public; **`max-w-7xl`** ops tables; **`border-b border-line`** section seams; search is largest interactive control on each index |
| **core-ui**          | Tables, Field, Button, Badge, Tabs, Modal — no raw `<input>`; invoke **`/core-ui`** before `/dev` (not attached this session)                                                                                                      |
| **Content**          | Copy from PRD + RB-001 + CONTEXT glossary — English body v1; no invented marketing fluff                                                                                                                                           |

**Borrow vs avoid:**

| Borrow                        | Apply here                                                     |
| ----------------------------- | -------------------------------------------------------------- |
| tasteskill section seams      | `border-b border-line` between runbook/guide sections          |
| RB-001 symptom index table    | Public runbook detail + ops runbook editor preview             |
| Kit site `page-x`, font stack | Quicksand UI + JetBrains Mono for IDs, triggers, verify blocks |
| Landing status-line header    | Add **Runbooks** + **Guides** nav items; same sticky header    |

**Do NOT borrow:** purple/blue gradient hero, equal-height feature cards, centered marketing hero, card soup grids.

---

## 2. Flows

### Primary flow — Public symptom discovery (Phase 1a — shipped)

```mermaid
flowchart TD
  Entry[Header Runbooks link or /runbooks] --> Index[/runbooks index]
  Index --> Search[Search symptom or trigger phrase]
  Search --> Results[Filtered runbook + issue rows]
  Results --> RBDetail[/runbooks/RB-001]
  RBDetail --> SymptomTable[Symptom index table]
  SymptomTable --> IssueDetail[/runbooks/issues/RB-001-03]
  IssueDetail --> Fix[Read cause → fix → verify]
  Fix --> Related[Related files + axis tags + sibling Stack guide link if exists]
```

### Primary flow — Public stack guide discovery (Phase 3)

```mermaid
flowchart TD
  Entry[Header Guides link or /guides] --> GIndex[/guides index]
  GIndex --> GSearch[Search by stack axis or design topic]
  GSearch --> GResults[Filtered Stack guide rows]
  GResults --> GDetail[/guides/SG-001]
  GDetail --> Checklist[Design checklist + seam sections]
  Checklist --> Sibling{Sibling Runbook?}
  Sibling -->|Yes| RBLink[Link → /runbooks/RB-001]
  Sibling -->|No| Done[Continue reading]
  RBLink --> RBDetail[/runbooks/RB-001]
```

### Agent retrieval — `/arch` (Stack guide)

```mermaid
flowchart TD
  ArchInvoke[/arch skill invoked] --> Manifest[Read Stack manifest from docs/agents/stack-profile.md]
  Manifest --> Filter[Filter axis tags from manifest]
  Filter --> Search[MCP or API guide search with type=stack_guide]
  Search --> Rank[Rank by axis overlap + topic]
  Rank --> Guide[Return Stack guide SG-NNN]
  Guide --> Seams[Author reads seam sections + design checklist]
  Seams --> ADR[Cross-check ADRs in docs/adr/]
  ADR --> NoRunbook[Does NOT fetch Runbook for deploy fixes]
```

### Agent retrieval — `/devops` (Runbook)

```mermaid
flowchart TD
  DevOpsInvoke[/devops skill invoked] --> Pointer[Read Runbook pointer docs/agents/runbooks.md]
  Pointer --> Manifest[Read Stack manifest]
  Manifest --> Filter[Filter axis tags from manifest]
  Filter --> Search[MCP or API runbook search with type=runbook]
  Search --> Rank[Rank by symptom/trigger match]
  Rank --> Confirm[Confirm symptom before fix]
  Confirm --> Runbook[Return Runbook RB-NNN or Known issue]
  Runbook --> FixApply[Apply cause → fix → verify]
  FixApply --> NoGuide[Does NOT fetch Stack guide or ADR for symptom→fix]
```

### Primary flow — Ops author publish Runbook (Phase 2)

```mermaid
flowchart TD
  OpsEntry[/ops] --> Gate{Session valid?}
  Gate -->|No| Login[/ops/login → polyms.dev OIDC]
  Login --> Gate
  Gate -->|Yes| List[/ops/runbooks]
  List --> Edit[/ops/runbooks/RB-001/edit]
  Edit --> Preview[Symptom index preview updates]
  Edit --> Save[Publish on save]
  Save --> Toast[Success toast + updated timestamp]
  List --> Matrix[/ops/matrix]
  Matrix --> Gap[Spot uncovered axis combo per content type]
  Gap --> Edit
```

### Primary flow — Ops author publish Stack guide (Phase 3)

```mermaid
flowchart TD
  OpsEntry[/ops] --> Gate{Session valid?}
  Gate -->|No| Login[/ops/login]
  Login --> Gate
  Gate -->|Yes| GList[/ops/guides]
  GList --> GNew[/ops/guides/new or /ops/guides/SG-001/edit]
  GNew --> GForm[Title, axis tags, design checklist, seam sections MD]
  GForm --> GPreview[Checklist + seam preview pane]
  GForm --> GSibling[Optional relatedRunbookId link]
  GNew --> GSave[Publish on save]
  GSave --> GToast[Success toast]
  GList --> Matrix[/ops/matrix — Stack guide column/tab]
  Matrix --> GGap[Gap cell for axis combo]
  GGap --> GNew
```

### Critical paths

- **Incident read:** Google/error log phrase → `/runbooks?q=…` → issue row → fix + verify commands copyable.
- **Runbook browse:** `/runbooks` → RB-001 → scroll **Stack profile** + greenfield checklist (deploy intent) → known issues.
- **Design read:** `/guides` → SG-001 → scroll design checklist + seam sections → optional sibling Runbook link.
- **Deep link:** `/runbooks/issues/RB-001-03` or `/runbooks/RB-001#rb-001-03` — both supported; canonical URL is `/runbooks/issues/$issueId`.
- **Guide deep link:** `/guides/SG-001` or `/guides/SG-001#routing-seams` — section anchors on seam headings.
- **Ops login:** Unauthenticated `/ops/*` → redirect `/ops/login` → polyms.dev SSO → return to intended route.
- **Session expired:** Stale token mid-edit → 401 banner + re-login CTA; unsaved draft preserved in `sessionStorage` where possible.
- **Matrix gap:** `/ops/matrix` → red/empty cell **per content type** → click → filtered list or create CTA for that type.
- **Locale:** VI/EN toggles chrome labels only; runbook and guide body stay English v1.

### Phasing

| Phase                | Routes / deliverables                                                                                                      | Auth                      | Status      |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ----------- |
| **1a (Should)**      | `/runbooks`, `/runbooks/$id`, `/runbooks/issues/$issueId` + Prisma/Supabase + RB-001 seed                                  | Public read, rate-limited | **Done**    |
| **1b (Should)**      | **Runbook pointer** alignment — update `docs/agents/runbooks.md`, `docs/runbooks/README.md`, `docs/agents/stack-guides.md` | Docs only                 | **Done**    |
| **2 (Must in spec)** | `/ops/*` runbook inventory — OIDC, runbook + issue editors, matrix (runbook column/tab only)                               | OIDC polyms.dev for write | Not shipped |
| **3 (Must in spec)** | Stack guide schema + `/guides/*` public + `/ops/guides/*` editors + matrix dual-type (Runbook \| Stack guide)              | Public read + OIDC write  | Not shipped |

---

## 3. Screen inventory

### Global chrome extension (kit site shell)

| Field | Value                                                                            |
| ----- | -------------------------------------------------------------------------------- |
| Goal  | Extend existing header/footer with Runbooks + Guides entries; reuse theme/locale |
| Entry | All routes including `/runbooks/*`, `/guides/*`, and `/ops/*`                    |
| Exit  | Runbooks index, Guides index, skills catalog, external GitHub                    |

**States:**

| State   | User sees                                                   | Action                         |
| ------- | ----------------------------------------------------------- | ------------------------------ |
| Loading | Header skeleton; footer placeholder                         | —                              |
| Empty   | N/A                                                         | —                              |
| Error   | Alert «Không tải được cấu hình site»                        | Reload                         |
| Success | Header + **Runbooks** + **Guides** nav + HomeSiteChrome FAB | Nav, theme, locale, ⌘K on home |

**Nav changes (v3.1 header pattern — `HomeHeader` / shared layout wrapper):**

| Item         | href            | Notes                                      |
| ------------ | --------------- | ------------------------------------------ |
| Overview     | `/#main`        | Unchanged                                  |
| Skills       | `/#catalog`     | Unchanged                                  |
| **Runbooks** | **`/runbooks`** | Between Skills and **Guides**              |
| **Guides**   | **`/guides`**   | **New** — between Runbooks and Quick start |
| Quick start  | `/#start`       | Unchanged                                  |
| GitHub       | external        | Unchanged                                  |

**Footer strip** (`page-x py-6 border-t border-line`):

Add links: **Runbooks** → `/runbooks` · **Guides** → `/guides` beside GitHub / MIT line.

**Layout note:** Public runbook and guide routes use same sticky header as kit site; **`HomeSiteChrome`** (fixed bottom-right locale + theme) remains on all public routes. **Hide ⌘K** on `/runbooks/*`, `/guides/*`, and `/ops/*` (skill palette irrelevant).

---

### §3.1 `/runbooks` — Runbook index (Phase 1a — shipped)

| Field | Value                                                           |
| ----- | --------------------------------------------------------------- |
| Goal  | Symptom-first discovery — find runbook or known issue by phrase |
| Entry | Header/footer Runbooks, direct URL, agent-shared links          |
| Exit  | Runbook detail, issue detail, external GitHub runbook source    |

**States:**

| State   | User sees                                                                  | Action                                    |
| ------- | -------------------------------------------------------------------------- | ----------------------------------------- |
| Loading | Search field disabled skeleton; 5 table row skeletons                      | —                                         |
| Empty   | «No runbooks match» + cleared search hint; if zero CMS data: setup message | Clear search; link GitHub `docs/runbooks` |
| Error   | Alert with retry — «Could not load runbooks»                               | Retry button                              |
| Success | Search input + results table (runbooks + matching issues)                  | Open row, refine search                   |

**Layout — symptom-first index (ASCII):**

```
┌─ RUNBOOKS INDEX — page-x max-w-4xl section-y border-b border-line — 100% width ─┐
│ .label-mono «RUNBOOKS»                                                            │
│ .h1 Runbooks                                                                      │
│ text-muted — Symptom → cause → fix → verify. Search by error message or trigger.  │
│                                                                                   │
│ ┌─ SEARCH — full width, focal control ─────────────────────────────────────────┐  │
│ │ Field.Control type=search  placeholder="No Output Directory named .output"   │  │
│ │ font-mono text-sm — debounce 300ms — ?q= in URL                              │  │
│ └──────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                   │
│ .h2 Results (N)                                                                   │
│ ┌─ Table — dense, no card wrapper ─────────────────────────────────────────────┐  │
│ │ Type │ ID           │ Match                                              │ Tags │  │
│ │ issue│ RB-001-03    │ No Output Directory named ".output"                │ vercel│ │
│ │ book │ RB-001       │ Vercel + TanStack Start + Nitro (pnpm Nx monorepo)│ …    │  │
│ └──────────────────────────────────────────────────────────────────────────────┘  │
│ Row hover: bg-surface-2/50 — click issue → /runbooks/issues/:id                  │
└───────────────────────────────────────────────────────────────────────────────────┘
```

**Behaviour:**

- Default sort: relevance when `q` present; otherwise runbook ID ascending.
- Issue rows show matched trigger/symptom snippet; runbook rows show title + tag chips.
- Rate-limit message (429): inline Alert — «Too many requests — try again in a minute».

---

### §3.2 `/runbooks/$id` — Runbook detail (Phase 1a — shipped)

| Field | Value                                                                         |
| ----- | ----------------------------------------------------------------------------- |
| Goal  | Read full runbook — stack profile, checklist, known issues index              |
| Entry | Index row, direct link `/runbooks/RB-001`, MCP-shared URLs                    |
| Exit  | Issue detail, back to index, sibling Stack guide (if linked), in-page anchors |

**States:**

| State   | User sees                                    | Action                |
| ------- | -------------------------------------------- | --------------------- |
| Loading | Title skeleton; symptom table skeleton       | —                     |
| Empty   | 404 — «Runbook not found» + link `/runbooks` | Return to index       |
| Error   | Alert + retry                                | Retry                 |
| Success | Full RB-001-shaped layout (see below)        | Navigate issues, copy |

**Layout — mirrors RB-001 structure:**

```
┌─ RUNBOOK DETAIL — page-x max-w-4xl ─────────────────────────────────────────────┐
│ Breadcrumb: Runbooks / RB-001                                                    │
│ .h1 RB-001: Vercel + TanStack Start + Nitro (pnpm Nx monorepo)                   │
│ Badge row: vercel · tanstack-start · nitro · pnpm · nx · monorepo                │
│ text-muted — audience: developer · Reference: ai-kit apps/landing             │
│ SiblingLink — «Stack guide SG-001 ↗» (if relatedRunbookId reverse link exists)   │
│                                                                                  │
│ ┌─ LOCAL NAV — sticky top-24 hidden md:block, w-[180px] float-right ──────────┐  │
│ │ On this page                                                                 │  │
│ │ · Symptom index                                                              │  │
│ │ · Stack profile                                                              │  │
│ │ · Greenfield checklist                                                       │  │
│ │ · Known issues                                                               │  │
│ └──────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
│ .h2 Symptom index                                                                │
│ Table: Symptom | Issue ID (link) — same rows as RB-001 markdown                  │
│                                                                                  │
│ .h2 Stack profile (correct state)                                                │
│ Prose tables + code blocks — rendered markdown/HTML from CMS                     │
│                                                                                  │
│ .h2 Greenfield checklist                                                         │
│ Checkbox list (read-only visual ✓) — deploy/build intent only                    │
│                                                                                  │
│ .h2 Known issues                                                                 │
│ Compact list: RB-001-NN title links → issue detail                                 │
│                                                                                  │
│ .h2 Debug commands (optional section if present in CMS)                          │
│ pre font-mono bg-surface border border-line rounded-lg p-4                        │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Anchor support:** Each known issue block on page has `id="rb-001-03"` slug for `#rb-001-03` deep links; canonical issue route still preferred for sharing.

---

### §3.3 `/runbooks/issues/$issueId` — Known issue detail (Phase 1a — shipped)

| Field | Value                                                    |
| ----- | -------------------------------------------------------- |
| Goal  | Execute fix — symptom, cause, fix, verify, related files |
| Entry | Symptom index link, search result, anchor redirect       |
| Exit  | Parent runbook, index, copy verify commands              |

**States:**

| State   | User sees                              | Action                         |
| ------- | -------------------------------------- | ------------------------------ |
| Loading | Issue ID skeleton + section skeletons  | —                              |
| Empty   | 404 — «Issue not found»                | `/runbooks`                    |
| Error   | Alert + retry                          | Retry                          |
| Success | Structured issue doc (RB-001-03 shape) | Copy code blocks, open runbook |

**Layout:**

```
┌─ ISSUE DETAIL — page-x max-w-4xl section-y ─────────────────────────────────────┐
│ Breadcrumb: Runbooks / RB-001 / RB-001-03                                         │
│ .label-mono RB-001-03                                                             │
│ .h1 Wrong outputDirectory                                                         │
│                                                                                   │
│ Trigger phrases (read-only chips):                                                │
│ [No Output Directory named ".output"] [config.json dest __server] …               │
│                                                                                   │
│ ┌─ ISSUE BLOCK — border-s-4 border-primary-700 ps-4 ──────────────────────────┐   │
│ │ .h2 Symptom — prose                                                          │   │
│ │ .h2 Cause — prose bullet list                                                │   │
│ │ .h2 Fix — ordered list                                                       │   │
│ │ .h2 Verify — pre blocks with copy button                                     │   │
│ └──────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                   │
│ .h2 Related files — mono list: vercel.json, apps/landing/vite.config.ts           │
│ .h2 Axis tags — Badge outline chips                                               │
│ Footer link: ← Back to RB-001                                                     │
└───────────────────────────────────────────────────────────────────────────────────┘
```

---

### §3.4 `/guides` — Stack guide index (Phase 3)

| Field | Value                                                      |
| ----- | ---------------------------------------------------------- |
| Goal  | Stack-combo design knowledge discovery — axis/topic search |
| Entry | Header/footer Guides, direct URL, `/arch` shared links     |
| Exit  | Guide detail, Runbooks index (cross-link), external GitHub |

**States:**

| State   | User sees                                                                    | Action                  |
| ------- | ---------------------------------------------------------------------------- | ----------------------- |
| Loading | Search field disabled skeleton; 5 table row skeletons                        | —                       |
| Empty   | «No stack guides match» + hint; if zero CMS data: «Stack guides coming soon» | Clear search            |
| Error   | Alert with retry — «Could not load stack guides»                             | Retry button            |
| Success | Search input + results table (Stack guides only)                             | Open row, refine search |

**Layout — design-focused index (ASCII):**

```
┌─ GUIDES INDEX — page-x max-w-4xl section-y border-b border-line — 100% width ───┐
│ .label-mono «STACK GUIDES»                                                        │
│ .h1 Stack guides                                                                  │
│ text-muted — Design seams, routing, state. Search by stack axis or topic.        │
│                                                                                   │
│ ┌─ SEARCH — full width, focal control ─────────────────────────────────────────┐  │
│ │ Field.Control type=search  placeholder="tanstack router zustand monorepo"      │  │
│ │ debounce 300ms — ?q= in URL — GuideSearch component                            │  │
│ └──────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                   │
│ Optional axis filter chips: vercel · tanstack-start · nx · pnpm (from URL ?axis=) │
│                                                                                   │
│ .h2 Results (N)                                                                   │
│ ┌─ Table — dense ──────────────────────────────────────────────────────────────┐  │
│ │ ID      │ Title                                    │ Axis tags      │ Match   │  │
│ │ SG-001  │ Vercel + TanStack Start design seams     │ vercel · ts …  │ routing │  │
│ └──────────────────────────────────────────────────────────────────────────────┘  │
│ Row hover: bg-surface-2/50 — click → /guides/:id                                  │
└───────────────────────────────────────────────────────────────────────────────────┘
```

**Behaviour:**

- Default sort: relevance when `q` present; otherwise guide ID ascending.
- **No Known issue rows** — guides are wiki pages, not incident docs.
- Focal beat = search field (parallel to runbooks index but design-oriented placeholder copy).

---

### §3.5 `/guides/$id` — Stack guide detail (Phase 3)

| Field | Value                                                      |
| ----- | ---------------------------------------------------------- |
| Goal  | Read design checklist + seam conventions for a stack combo |
| Entry | Index row, direct link `/guides/SG-001`, MCP-shared URLs   |
| Exit  | Sibling Runbook link, back to index, in-page seam anchors  |

**States:**

| State   | User sees                                      | Action            |
| ------- | ---------------------------------------------- | ----------------- |
| Loading | Title skeleton; checklist skeleton             | —                 |
| Empty   | 404 — «Stack guide not found» + link `/guides` | Return to index   |
| Error   | Alert + retry                                  | Retry             |
| Success | Checklist + seam sections (see below)          | Navigate sections |

**Layout:**

```
┌─ STACK GUIDE DETAIL — page-x max-w-4xl ─────────────────────────────────────────┐
│ Breadcrumb: Stack guides / SG-001                                                 │
│ .h1 SG-001: Vercel + TanStack Start + Nx — design seams                           │
│ Badge row: vercel · tanstack-start · nitro · pnpm · nx · monorepo                 │
│ text-muted — audience: arch · /dev deploy-aware slice                             │
│ SiblingLink — «Runbook RB-001 ↗» (deploy incidents for this stack combo)          │
│                                                                                   │
│ ┌─ LOCAL NAV — sticky top-24 hidden md:block ─────────────────────────────────┐   │
│ │ · Design checklist                                                           │   │
│ │ · Routing seams                                                              │   │
│ │ · State & stores                                                             │   │
│ │ · Module boundaries                                                          │   │
│ └──────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                   │
│ .h2 Design checklist — GuideChecklist (read-only ✓ on public)                    │
│ Items = design correctness only — e.g. router search params for filters,        │
│ Zustand for chrome not URL state, module depth — NOT duplicated from RB-001 deploy│
│                                                                                   │
│ .h2 Seam sections — SeamSection × N (markdown prose + mono callouts)              │
│ Each section: heading id slug, prose, optional code fence for convention          │
│                                                                                   │
│ .h2 Related Runbook — SiblingLink card if relatedRunbookId set                    │
└───────────────────────────────────────────────────────────────────────────────────┘
```

**Intent split example (RB-001 vs future SG-001):** RB-001 greenfield checklist item «Nitro vercel preset + output.dir when VERCEL=1» stays in Runbook; SG-001 counterpart might be «Route tree in `src/routes/` — catalog filters in search params not Zustand» — same axis tags, different intent.

---

### §3.6 `/ops` — Ops entry (Phase 2)

| Field | Value                            |
| ----- | -------------------------------- |
| Goal  | Authenticated entry to ops tools |
| Entry | Direct URL, bookmark             |
| Exit  | `/ops/runbooks` or login         |

**States:**

| State   | User sees                   | Action        |
| ------- | --------------------------- | ------------- |
| Loading | Spinner centered            | —             |
| Empty   | N/A                         | —             |
| Error   | OIDC config error Alert     | Contact admin |
| Success | Redirect to `/ops/runbooks` | —             |

---

### §3.7 `/ops/login` — OIDC entry (Phase 2)

| Field | Value                                         |
| ----- | --------------------------------------------- |
| Goal  | Sign in via polyms.dev SSO                    |
| Entry | Unauthenticated `/ops/*` redirect             |
| Exit  | Return URL after SSO; `/ops/runbooks` default |

**States:**

| State   | User sees                                | Action                         |
| ------- | ---------------------------------------- | ------------------------------ |
| Loading | «Redirecting to polyms.dev…» + spinner   | Wait                           |
| Empty   | N/A                                      | —                              |
| Error   | SSO failure Alert — config or network    | Retry login                    |
| Success | Auto-redirect (no manual success screen) | Lands on intended `/ops` route |

**Layout (error-only surface):**

```
┌─ page-x max-w-md mx-auto section-y text-center ─────────────────────────────────┐
│ .h1 Ops CMS                                                                       │
│ text-muted — Sign in with your Polyms account to edit runbooks and stack guides. │
│ Button primary — «Sign in with polyms.dev»                                        │
│ Error Alert if SSO fails                                                          │
└───────────────────────────────────────────────────────────────────────────────────┘
```

Minimal chrome: kit header without ops nav; no marketing bands.

---

### §3.8 `/ops/runbooks` — Runbook list (Phase 2)

| Field | Value                                          |
| ----- | ---------------------------------------------- |
| Goal  | Scan all runbooks — status, tags, last updated |
| Entry | `/ops` redirect, ops side nav                  |
| Exit  | Edit runbook, create new, matrix               |

**States:**

| State   | User sees                                   | Action              |
| ------- | ------------------------------------------- | ------------------- |
| Loading | Table skeleton                              | —                   |
| Empty   | «No runbooks yet» + Button «Create runbook» | `/ops/runbooks/new` |
| Error   | Alert + retry                               | Retry               |
| Success | Sortable table + toolbar                    | Edit, new, filter   |

**Layout — dense ops table:**

```
┌─ OPS SHELL — grid lg:grid-cols-[220px_1fr] min-h-screen ────────────────────────┐
│ SIDE NAV          │ MAIN — page-x max-w-7xl section-y                             │
│ · Runbooks (act)  │ .h1 Runbooks                    [+ New runbook]               │
│ · Stack guides    │ Field.Control search (filter table)                             │
│ · Matrix          │ Table: ID | Title | Status | Axis tags | Updated | Actions      │
│ · Sign out        │ Status Badge: draft | published                                 │
│                   │ Row actions: Edit · View public ↗                               │
└───────────────────┴───────────────────────────────────────────────────────────────┘
```

---

### §3.9 `/ops/runbooks/new` and `/ops/runbooks/$id/edit` — Runbook editor (Phase 2)

| Field | Value                                                                 |
| ----- | --------------------------------------------------------------------- |
| Goal  | Author runbook — title, slug, audience, checklist, tags, live preview |
| Entry | List new/edit actions                                                 |
| Exit  | Save → stay or list; cancel with unsaved confirm                      |

**States:**

| State   | User sees                                 | Action                     |
| ------- | ----------------------------------------- | -------------------------- |
| Loading | Form skeleton + preview skeleton          | —                          |
| Empty   | New runbook — blank form defaults         | Fill required fields       |
| Error   | Validation errors inline; API error Alert | Fix fields, retry save     |
| Success | Saved toast «Published» + updated preview | Continue edit, view public |

**Layout — split editor (lg+ 45/55):**

```
┌─ EDIT RUNBOOK — Ops shell ────────────────────────────────────────────────────────┐
│ .h1 Edit RB-001                                              [Save] [View public]│
│                                                                                  │
│ lg:grid-cols-[45%_55%] gap-6                                                     │
│ ┌─ FORM ─────────────────────┐  ┌─ PREVIEW — Symptom index ─────────────────┐  │
│ │ Field: Title               │  │ .label-mono PREVIEW                          │  │
│ │ Field: Slug (mono)         │  │ Symptom index table (live from issues)       │  │
│ │ Field: Audience            │  │ Stack profile excerpt (collapsed)            │  │
│ │ Textarea: Greenfield       │  │                                              │  │
│ │   checklist (line-based)   │  │                                              │  │
│ │ AxisTagPicker              │  │                                              │  │
│ │ Textarea: Stack profile MD │  │                                              │  │
│ │ Textarea: Debug commands   │  │                                              │  │
│ │ Field: relatedGuideId (opt)│  │ SiblingLink preview if set                   │  │
│ └────────────────────────────┘  └──────────────────────────────────────────────┘  │
│                                                                                  │
│ Section: Known issues — mini table + link «Add issue» → issue editor             │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Publish-on-save:** Single **Save** button (primary) — no separate draft/publish in v1; status always `published` on successful save.

---

### §3.10 `/ops/runbooks/$id/issues/new` and `/ops/issues/$id/edit` — Known issue editor (Phase 2)

| Field | Value                                                   |
| ----- | ------------------------------------------------------- |
| Goal  | Author known issue with stable ID, triggers, fix blocks |
| Entry | Runbook editor «Add issue»; list drill-down             |
| Exit  | Save → parent runbook edit; public issue URL            |

**States:**

| State   | User sees                                 | Action             |
| ------- | ----------------------------------------- | ------------------ |
| Loading | Form skeleton                             | —                  |
| Empty   | New issue — ID auto-suggested `RB-001-05` | Fill symptom first |
| Error   | Duplicate ID / validation Alert           | Fix ID             |
| Success | Toast «Issue saved» + link View public    | Continue           |

**Form fields:**

| Field           | Control                 | Notes                                             |
| --------------- | ----------------------- | ------------------------------------------------- |
| Stable ID       | Field.Control           | `RB-001-NN` pattern, mono, read-only after create |
| Symptom         | Textarea                | Required                                          |
| Cause           | Textarea                | Markdown bullets                                  |
| Fix             | Textarea                | Ordered list markdown                             |
| Verify          | Textarea                | Code blocks                                       |
| Trigger phrases | TriggerPhraseChips      | Add/remove chips                                  |
| Related files   | Textarea or multi Field | One path per line                                 |
| Axis tags       | AxisTagPicker           | Multi-select                                      |
| Parent runbook  | Select / read-only link | Set on create from context                        |

---

### §3.11 `/ops/guides` — Stack guide list (Phase 3)

| Field | Value                                              |
| ----- | -------------------------------------------------- |
| Goal  | Scan all Stack guides — status, tags, last updated |
| Entry | Ops side nav                                       |
| Exit  | Edit guide, create new, matrix                     |

**States:**

| State   | User sees                                    | Action            |
| ------- | -------------------------------------------- | ----------------- |
| Loading | Table skeleton                               | —                 |
| Empty   | «No stack guides yet» + «Create stack guide» | `/ops/guides/new` |
| Error   | Alert + retry                                | Retry             |
| Success | Sortable table + toolbar                     | Edit, new, filter |

**Layout:** Same ops shell as §3.8; side nav **Stack guides** active; table columns: ID | Title | Status | Axis tags | Related Runbook | Updated | Actions.

---

### §3.12 `/ops/guides/new` and `/ops/guides/$id/edit` — Stack guide editor (Phase 3)

| Field | Value                                                                      |
| ----- | -------------------------------------------------------------------------- |
| Goal  | Author Stack guide — design checklist, seam sections, sibling Runbook link |
| Entry | List new/edit actions                                                      |
| Exit  | Save → stay or list; cancel with unsaved confirm                           |

**States:**

| State   | User sees                                   | Action                     |
| ------- | ------------------------------------------- | -------------------------- |
| Loading | Form skeleton + preview skeleton            | —                          |
| Empty   | New guide — blank defaults; ID `SG-NNN`     | Fill required fields       |
| Error   | Validation errors; duplicate slug Alert     | Fix fields, retry save     |
| Success | Saved toast «Published» + checklist preview | Continue edit, view public |

**Layout — split editor (lg+ 45/55):**

```
┌─ EDIT STACK GUIDE — Ops shell ────────────────────────────────────────────────────┐
│ .h1 Edit SG-001                                              [Save] [View public]│
│                                                                                  │
│ lg:grid-cols-[45%_55%] gap-6                                                     │
│ ┌─ FORM ─────────────────────┐  ┌─ PREVIEW ────────────────────────────────┐  │
│ │ Field: Title               │  │ GuideChecklist preview (read-only)        │  │
│ │ Field: Slug (mono)         │  │ SeamSection excerpts (first 2 sections)   │  │
│ │ Field: Audience (arch)     │  │ SiblingLink if relatedRunbookId set       │  │
│ │ designChecklist[] editor   │  │                                           │  │
│ │   (line-based, reorder)    │  │                                           │  │
│ │ AxisTagPicker              │  │                                           │  │
│ │ seamSections MD (textarea) │  │                                           │  │
│ │ Select: relatedRunbookId   │  │                                           │  │
│ └────────────────────────────┘  └───────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

### §3.13 `/ops/matrix` — Dimension matrix coverage (Phase 2 → dual-type Phase 3)

| Field | Value                                                                       |
| ----- | --------------------------------------------------------------------------- |
| Goal  | See axis-combo coverage gaps **per content type** (Runbook and Stack guide) |
| Entry | Ops side nav                                                                |
| Exit  | Filtered list per type, create runbook or Stack guide for gap               |

**States:**

| State   | User sees                                 | Action                          |
| ------- | ----------------------------------------- | ------------------------------- |
| Loading | Grid skeleton                             | —                               |
| Empty   | «No axis data — add tags to content»      | Go to runbooks or guides        |
| Error   | Alert + retry                             | Retry                           |
| Success | Coverage grid — gaps highlighted per type | Click cell → drill-down by type |

**Layout — dual-type matrix (Phase 3 default: tabs):**

```
┌─ MATRIX — page-x max-w-7xl section-y ─────────────────────────────────────────────┐
│ .h1 Coverage matrix                                                               │
│ text-muted — Rows = axis combinations from Stack manifest. Gaps per content type. │
│                                                                                   │
│ Tabs: [Runbook] [Stack guide]  ← default UX; side-by-side columns = alt (§10)     │
│ Sub-tabs: By deploy · By framework · By monorepo                                  │
│                                                                                   │
│ ┌─ CoverageMatrixGrid — Runbook tab ──────────────────────────────────────────┐   │
│ │           │ RB-001 │ RB-002 │ …                                               │   │
│ │ vercel+nx │   ✓    │   —    │  ← gap: matrix-gap styling                     │   │
│ └───────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                   │
│ ┌─ CoverageMatrixGrid — Stack guide tab ────────────────────────────────────────┐   │
│ │           │ SG-001 │ SG-002 │ …                                               │   │
│ │ vercel+nx │   ✓    │   —    │                                                 │   │
│ └───────────────────────────────────────────────────────────────────────────────┘   │
│ Legend: ✓ covered · — gap · click gap → create runbook OR stack guide (context tab) │
└───────────────────────────────────────────────────────────────────────────────────┘
```

**Phase 2 interim:** Matrix shows **Runbook tab only** until Stack guide schema ships.

**Axis dimensions (v1):** linter, formatter, deploy, framework, monorepo — extensible via CMS config; labels from CONTEXT **Stack manifest** vocabulary.

---

### §3.14 Session expired / 401 unauthorized (Phase 2)

| Field | Value                                             |
| ----- | ------------------------------------------------- |
| Goal  | Recover from stale OIDC session without data loss |
| Entry | Any `/ops/*` API 401                              |
| Exit  | Re-login → return to editor                       |

**States:**

| State   | User sees                                                  | Action                                    |
| ------- | ---------------------------------------------------------- | ----------------------------------------- |
| Loading | N/A                                                        | —                                         |
| Empty   | N/A                                                        | —                                         |
| Error   | **Session expired** — Alert banner sticky top below header | «Sign in again» → `/ops/login?returnTo=…` |
| Success | Banner clears after re-auth                                | Resume edit                               |

**Unsaved draft:** On 401 during save, show Modal — «Session expired. Your edits are saved locally.» + Sign in CTA; persist form JSON to `sessionStorage` key `ops-draft:{route}`.

---

### §3.15 Content model sketch (design-level — Prisma)

Relationship to existing **Runbook** model in `apps/landing/prisma/schema.prisma`. Not a full migration spec — `/dev` owns schema details.

**Runbook (existing — Phase 1a shipped):** `id` (RB-001), `slug`, `title`, `summary`, `audience`, `axisTags`, `stackProfile` markdown, `greenfieldChecklist` string[], `debugCommands` markdown optional, `status`, `relatedGuideId` optional (Phase 3), timestamps; child **Known issue** records.

**StackGuide (new — Phase 3):**

| Field              | Type                     | Notes                                                                                   |
| ------------------ | ------------------------ | --------------------------------------------------------------------------------------- |
| `id`               | string                   | `SG-001` pattern — stable public ID                                                     |
| `slug`             | string                   | URL segment `/guides/$slug`                                                             |
| `title`            | string                   | Human title                                                                             |
| `summary`          | string                   | Index search snippet                                                                    |
| `audience`         | string                   | Default `arch`                                                                          |
| `axisTags`         | string[]                 | Same vocabulary as Runbook — enables matrix + sibling linking                           |
| `designChecklist`  | string[]                 | Design correctness items — **not** duplicated from Runbook deploy list                  |
| `seamSections`     | `{ title, body }[]` JSON | Agent-retrievable chunks — routing, state, module boundaries; **not** one markdown blob |
| `relatedRunbookId` | string?                  | Optional FK to Runbook — sibling link for same stack combo                              |
| `status`           | enum                     | `draft` \| `published` — v1 publish-on-save                                             |
| `createdAt`        | datetime                 | `@default(now())`                                                                       |
| `updatedAt`        | datetime                 | `@updatedAt`                                                                            |

**Cross-link:** Runbook may add optional `relatedGuideId` mirroring Stack guide's `relatedRunbookId` — UI shows **SiblingLink** on both public detail pages when either side is set.

---

## 4. Typography & visual system

Extends [kit site §4](./ai-kit-landing.md#4-typography--visual-system) — **reuse** `.display`, `.h1`, `.h2`, `.label-mono`, `.font-invoke`, `page-x`, `section-y`, dark flash script. Add runbook/guide/ops utilities below.

### 4.1 Type scale (inherit + ops additions)

| Role              | Class               | Size      | Usage                                       |
| ----------------- | ------------------- | --------- | ------------------------------------------- |
| Page title        | `.h1`               | 30→36px   | Runbook/guide title, ops page titles        |
| Section           | `.h2`               | 20→24px   | Symptom index, Stack profile, seam sections |
| Content ID        | `.label-mono`       | 12px caps | RB-001, SG-001, RB-001-03 labels            |
| Search / triggers | `.font-invoke`      | 14px mono | Search placeholder, trigger chips           |
| Verify blocks     | `font-mono text-sm` | 14px      | Code in `pre`                               |
| Table cell        | `text-sm`           | 14px      | Dense ops tables                            |

No `.display` on runbook or guide routes — utilitarian `.h1` only (**anti-slop:** no marketing hero type).

### 4.2 Surface rhythm

| Route group     | Width               | Surface                                     | Seams                        |
| --------------- | ------------------- | ------------------------------------------- | ---------------------------- |
| Public runbooks | `max-w-4xl mx-auto` | `bg-body`                                   | `border-b border-line` per § |
| Public guides   | `max-w-4xl mx-auto` | `bg-body`                                   | Same as runbooks             |
| Issue detail    | `max-w-4xl`         | `bg-body`; issue block `border-s-4 primary` | Same                         |
| Guide detail    | `max-w-4xl`         | `bg-body`; seam callout `bg-surface` inset  | Same                         |
| Ops list/matrix | `max-w-7xl`         | `bg-body`; side nav `bg-surface-2`          | Nav `border-r border-line`   |
| Ops editor      | `max-w-7xl`         | Form `bg-body`; preview `bg-surface` inset  | Preview `border border-line` |

**Section order (public runbook detail):** Symptom index → Stack profile → Greenfield checklist → Known issues → Debug commands (optional).

**Section order (public guide detail):** Design checklist → Seam sections → Related Runbook sibling link.

### 4.3 Layout shells

| Utility      | Definition                                                      |
| ------------ | --------------------------------------------------------------- |
| `page-x`     | `px-4 md:px-8 lg:px-12` — unchanged from kit site               |
| `section-y`  | `py-8 md:py-12` — slightly tighter than landing for docs        |
| `ops-shell`  | `lg:grid lg:grid-cols-[220px_1fr] min-h-[calc(100vh-3.5rem)]`   |
| `docs-aside` | `hidden md:block sticky top-24 w-44 ms-8 float-end` — local nav |

### 4.4 Custom CSS (`globals.css` `@layer components`)

```css
@layer components {
  .runbook-section {
    @apply border-line border-b py-8 scroll-mt-24;
  }
  .runbook-section__label {
    @apply label-mono mb-4;
  }
  .guide-section {
    @apply border-line border-b py-8 scroll-mt-24;
  }
  .issue-block {
    @apply border-primary-700 border-s-4 ps-4 py-2;
  }
  .seam-callout {
    @apply border-line rounded-lg border bg-surface p-4 font-mono text-sm;
  }
  .sibling-link {
    @apply border-line flex items-center gap-2 rounded-md border bg-surface-2/50 px-3 py-2 text-sm;
  }
  .ops-side-nav {
    @apply border-line border-r bg-surface-2/30 p-4;
  }
  .ops-side-nav__link {
    @apply block rounded-md px-3 py-2 text-sm text-muted hover:bg-surface-2 hover:text-fg;
  }
  .ops-side-nav__link--active {
    @apply bg-surface-2 font-semibold text-fg;
  }
  .matrix-gap {
    @apply border border-danger-500/40 bg-danger-500/10;
  }
  .matrix-covered {
    @apply bg-success-500/10 text-success-600;
  }
  .trigger-chip {
    @apply font-invoke rounded-md border border-line bg-surface px-2 py-0.5 text-xs;
  }
}
```

### 4.5 Theme

- **Dark-first:** Reuse kit site inline flash script in `index.html`.
- **Light mode:** core-ui semantic tokens only — verify table borders and matrix gap cells meet AA.
- **No** purple gradient, no hero bands on `/runbooks/*` or `/guides/*`.

### 4.6 Hero composition (public indexes — focal beat)

**Above the fold (no scroll):** 100% width `page-x max-w-4xl`; user sees `.label-mono` + `.h1` + one-line muted desc + **full-width search** (~60% of viewport height on mobile). **No** side-by-side marketing split. Focal = search field — identical pattern on `/runbooks` and `/guides` with different placeholder copy.

---

## 5. Component map

**Invoke `/core-ui` before `/dev`** — user has not attached this session; confirm `Field`, `Table`, `Modal`, `Tabs`, `Badge`, `Button`, `Select`, `Alert`, `Toast` APIs against `@polyms/core-ui` catalog.

| UI element             | core-ui primitive       | Variant / notes                                     |
| ---------------------- | ----------------------- | --------------------------------------------------- |
| Site header nav        | `NavigationMenu.Link`   | Add Runbooks + **Guides** items                     |
| Footer link            | `Link`                  | text-muted hover:text-fg                            |
| Locale + theme FAB     | `ToggleGroup`, `Button` | Reuse `HomeSiteChrome`                              |
| Symptom search         | `Field.Control`         | `type="search"`, mono, debounced — runbooks index   |
| **GuideSearch**        | `Field.Control`         | Same as symptom search; design-oriented placeholder |
| Results / index table  | `Table`                 | dense rows, clickable                               |
| Tag chips (public)     | `Badge`                 | `variant="outline"`                                 |
| Breadcrumb             | `Link` + `Text`         | Runbooks / RB-001 / … or Stack guides / SG-001      |
| **GuideChecklist**     | `List` or styled `ul`   | Read-only ✓ on public; editable lines in ops form   |
| **SeamSection**        | Prose + `Text`          | Markdown-rendered seam block with heading anchor    |
| **SiblingLink**        | `Link` + `Badge`        | Runbook ↔ Stack guide cross-nav card                |
| Copy verify block      | `Button`                | `variant="ghost" size="sm"` + toast                 |
| OIDC sign in           | `Button`                | `variant="primary"`                                 |
| Ops save               | `Button`                | `variant="primary"`, loading state                  |
| Ops cancel             | `Button`                | `variant="ghost"`                                   |
| New runbook / guide    | `Button`                | `variant="primary"`                                 |
| Form labels            | `Field.Label`           | paired with Control                                 |
| Title, slug, audience  | `Field.Control`         | slug: mono                                          |
| Markdown bodies        | `Textarea` or `Field`   | stack profile, seam sections — confirm `/core-ui`   |
| Status draft/published | `Badge`                 | success vs muted                                    |
| Matrix type tabs       | `Tabs`                  | Runbook \| Stack guide switcher + axis sub-tabs     |
| Unsaved / 401 modal    | `Modal`                 | focus trap, returnTo                                |
| Error / rate limit     | `Alert`                 | destructive / warning                               |
| Publish toast          | `Toast`                 | success tier                                        |
| Sign out               | `Button`                | `variant="ghost"` in side nav                       |

**Custom components** (compose core-ui — no parallel DS):

| Component             | Why custom                                     | Follow-up                                                   |
| --------------------- | ---------------------------------------------- | ----------------------------------------------------------- |
| `OpsShell`            | Side nav + main grid layout                    | `apps/landing/src/components/ops/`                          |
| `SymptomIndexTable`   | Linked issue ID column from CMS data           | Uses `Table`                                                |
| `GuideSearch`         | Stack guide index search + axis filter chips   | Uses `Field.Control` + `Badge`                              |
| `GuideChecklist`      | Design checklist render + ops line editor      | Uses list markup + `Field`                                  |
| `SeamSection`         | Markdown seam block with anchor id             | Uses prose renderer                                         |
| `SiblingLink`         | Runbook ↔ Stack guide cross-link card          | Uses `Link`, `Badge`                                        |
| `TriggerPhraseChips`  | Add/remove trigger strings                     | Uses `Badge` + `Field.Control`                              |
| `AxisTagPicker`       | Multi-select axis tags                         | Uses `ToggleGroup` or `Checkbox` group — confirm `/core-ui` |
| `CoverageMatrixGrid`  | 2D gap highlighting per content type           | CSS grid + `Button` cell                                    |
| `RunbookPreviewPane`  | Live symptom index from form state             | Uses `SymptomIndexTable`                                    |
| `GuidePreviewPane`    | Live checklist + seam excerpt from form state  | Uses `GuideChecklist`, `SeamSection`                        |
| `RunbookMarkdownBody` | Renders CMS markdown sections on public detail | May use existing markdown renderer                          |
| `DocsLocalNav`        | Sticky in-page section links                   | `Link` list                                                 |

---

## 6. Motion plan

| Transition            | Trigger         | Tier     | Reduced motion             |
| --------------------- | --------------- | -------- | -------------------------- |
| Search results update | debounced input | subtle   | instant swap, no fade      |
| Table row hover       | pointer enter   | subtle   | static bg change only      |
| Save toast            | publish success | subtle   | instant toast, no slide    |
| 401 banner enter      | API 401         | standard | instant show, no animation |
| Modal open (unsaved)  | cancel/401      | standard | instant open               |
| Matrix cell hover     | pointer enter   | subtle   | no scale transform         |
| Matrix tab switch     | Runbook ↔ Guide | subtle   | instant content swap       |

No hero motion on runbook or guide routes.

---

## 7. Responsive and accessibility

| Topic                  | Decision                                                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| Breakpoints            | **sm:** stacked ops editor (preview below form); matrix horizontal scroll                    |
|                        | **md+:** local nav visible on runbook/guide detail; ops split editor                         |
|                        | **lg+:** ops shell side nav fixed                                                            |
| Focus order            | Index: search → results table → pagination; Editor: title → slug → … → Save                  |
|                        | Modal traps focus; ESC closes non-destructive modals                                         |
| ARIA                   | Search: `aria-label="Search runbooks by symptom"` / `"Search stack guides by axis or topic"` |
|                        | Tables with `<caption>`; issue block: `role="region"` `aria-labelledby`                      |
|                        | Matrix: `aria-label="Coverage matrix"`; gap cells `aria-label` includes content type         |
| Keyboard               | Table rows Enter to navigate; ops side nav arrow keys optional                               |
| Color                  | Gaps use icon + text «Gap», not color alone; Badge + label for status                        |
| prefers-reduced-motion | All motion rows → instant state change                                                       |
| WCAG 2.1 AA            | Public + ops; verify contrast on `matrix-gap` and trigger chips in light                     |

---

## 8. Visual acceptance for `/dev`

**Reference:** [tasteskill.dev](https://www.tasteskill.dev/) — seam rhythm, dark craft; **RB-001 markdown** — runbook content hierarchy.

| Check          | Pass when                                                                                                       |
| -------------- | --------------------------------------------------------------------------------------------------------------- |
| Dark-first     | First paint dark; acceptance screenshots for `/runbooks`, `/guides`, `/ops/runbooks` in dark                    |
| Type scale     | `.h1` + `.h2` + `.label-mono` visible on indexes and detail pages                                               |
| Surface rhythm | ≥2 surfaces (`bg-body` + `bg-surface` preview or `bg-surface-2` ops nav)                                        |
| Focal beat     | Indexes: search dominates above fold; Runbook detail: symptom index first; Guide detail: design checklist first |
| core-ui        | No raw `<input>`; search uses `Field.Control`; ops save uses `Button`                                           |
| Anti-slop      | No §A violations — no card grid, no purple hero, no `.display` marketing on ops routes                          |
| RB-001 parity  | Public RB-001 page sections match runbook markdown order and table                                              |
| Sibling link   | When `relatedRunbookId` / `relatedGuideId` set, SiblingLink visible on both detail pages                        |
| Ops density    | Runbook list readable at 1280px without horizontal scroll except matrix                                         |

**P0 slices (implementation order):**

1. ~~**CSS/globals** — runbook-section, issue-block, ops-side-nav utilities~~ — **Phase 1a done**
2. ~~**Chrome** — header/footer Runbooks link; hide ⌘K on runbook routes~~ — **Phase 1a done**; **add Guides link + hide ⌘K on `/guides/*`** when Phase 3 ships
3. ~~**Phase 1a public runbooks** — `/runbooks` index + search → detail → issue detail~~ — **Done**
4. ~~**Phase 1b Runbook pointer**~~ — **Done** — `docs/agents/runbooks.md`, `docs/runbooks/README.md`, `docs/agents/stack-guides.md`
5. **Phase 2 ops shell** — OIDC gate + `/ops/runbooks` list
6. **Phase 2 editors** — runbook + issue forms + preview
7. **Phase 2 matrix** — coverage grid (Runbook tab only)
8. **401/session** — banner + draft Modal
9. **Phase 3 Stack guide schema** — Prisma StackGuide + seed SG-001 (when RB-001 split authored)
10. **Phase 3 public guides** — `/guides` index + `/guides/$id` + GuideSearch, GuideChecklist, SeamSection, SiblingLink
11. **Phase 3 ops guide editors** — `/ops/guides/*`
12. **Phase 3 matrix dual-type** — Runbook \| Stack guide tabs + gap cells per type

---

## 9. Pre-flight

Run [PREFLIGHT.md](../../skills/design/PREFLIGHT.md) — results:

### Spec completeness

- [x] Every screen has loading, empty, error, success — §3.1–§3.14
- [x] No TBD/TODO in spec body
- [x] Flows cover PRD critical paths — public search, guide discovery, `/arch` + `/devops` retrieval, ops publish, matrix, auth
- [x] Open questions listed §10

### core-ui alignment

- [x] Interactive elements map to core-ui or custom table with follow-up
- [x] No invented names duplicating core-ui primitives
- [x] Theme via core-ui semantic tokens
- [ ] `/core-ui` attached — **not this session**; flagged for `/dev`

### Anti-slop

- [x] BRIEF-INFERENCE table §1
- [x] Visual reference + measurable craft §1b
- [x] §4 CSS intent present
- [x] §8 visual acceptance present
- [x] §12 anti-pattern checklist below
- [x] Screen names use CONTEXT vocabulary (Runbook, Stack guide, Known issue, Ops CMS, Stack profile, Stack manifest, Deploy guide, Runbook pointer)
- [x] Layout specific to ops/docs — not landing copy-paste
- [x] Ops editor grid documented sm/md/lg

### Motion and accessibility

- [x] Reduced-motion fallbacks §6
- [x] Focus order §7
- [x] Error states actionable — retry, re-login, clear search

### Handoff

- [x] Saved at `docs/design/ops-cms-runbooks.md`
- [x] Next Step → `/dev` Phase 2 or `/to-issues` for vertical slices

---

## 10. Open questions

1. **Rate limit UX:** Show remaining quota in UI or opaque 429 only? Default: opaque 429 Alert (edge handles limits).
2. **Matrix row source:** Auto-generate axis combos from all tagged content only, or merge with stack manifest template rows? Default: union of manifest axes + tagged combos.
3. **Markdown editor:** Single textarea vs split WYSIWYG for stack profile / seam sections — v1 textarea + preview tab acceptable?
4. **Public checklist:** Interactive checkboxes for greenfield/design (localStorage) or read-only? Default: read-only public; interactive deferred.
5. **Ops role granularity:** Single polyms.dev SSO role for all `/ops/*` in v1, or editor vs admin split? Default: single role per PRD.
6. **RB-001 / SG-001 split timing:** Default: **defer SG-001** until `/guides/*` ships; keep RB-001 as-is in v1 (aligned).
7. **Matrix dual-type UX:** Tabs (Runbook \| Stack guide) vs side-by-side columns for same axis rows? Default: **tabs** in §3.13; side-by-side reserved for wide-desktop alt if `/dev` finds tabs hide comparison.
8. **MCP retrieval shape:** **Resolved** — MCP at `/mcp` (`ai-kit.polyms.dev/mcp`), Streamable HTTP (SDK default), shared edge rate limit. Per-feature MCP tools (`search_runbooks`, `search_stack_guides`, …) call catalog **service** in-process. No public REST `/api/runbooks/*` or `/api/guides/*`. See [docs/agents/ops-cms-mcp.md](../agents/ops-cms-mcp.md).

---

## 11. Analytics (optional — Umami)

Extend kit site events ([CONTEXT.md](../../CONTEXT.md) Umami):

| Event              | Trigger                                       |
| ------------------ | --------------------------------------------- |
| `runbook_search`   | Search submit / debounced query with results  |
| `runbook_view`     | `/runbooks/$id` mount                         |
| `issue_view`       | `/runbooks/issues/$issueId` mount             |
| **`guide_search`** | Search submit / debounced query on `/guides`  |
| **`guide_view`**   | `/guides/$id` mount                           |
| `ops_publish`      | Successful save on runbook/issue/guide editor |

Env-gated same as existing `VITE_UMAMI_*`.

---

## 12. Anti-slop appendix

### §A — Big bans (applicability)

| Ban                                        | Apply?          | Notes                                              |
| ------------------------------------------ | --------------- | -------------------------------------------------- |
| Centered hero + two buttons + subcopy      | **Yes — avoid** | Runbook/guide index uses search-first, no hero CTA |
| Equal-height card grid                     | **Yes — avoid** | Use tables and prose sections                      |
| `rounded-xl border bg-surface` every block | **Yes — avoid** | Section seams, one preview inset in editor only    |
| `max-w-6xl mx-auto` every section          | **Yes — avoid** | `max-w-4xl` public, `max-w-7xl` ops                |
| Purple/blue gradient hero                  | **Yes — avoid** | PRD explicit                                       |
| Wall of text in 70vh void                  | **Yes — avoid** | Dense tables + labeled sections                    |
| Light-gray-on-white sole theme             | N/A             | Dark-first inherited                               |
| Monospace labels without size contrast     | **Yes — avoid** | `.label-mono` paired with `.h2` sections           |
| Pipeline vertical list only                | N/A             | Not applicable                                     |

### §B — Composition rules

| Rule                             | How this spec satisfies                                                           |
| -------------------------------- | --------------------------------------------------------------------------------- |
| One focal beat per viewport      | Indexes = search; runbook detail = symptom table; guide detail = design checklist |
| Type scale ≥ 3 levels            | `.h1` / `.h2` / `.label-mono` + body                                              |
| Asymmetry                        | Ops editor 45/55 split; detail float local nav                                    |
| Foreground/background separation | ops side nav `bg-surface-2`, preview inset                                        |
| Dark-first preview               | §8 acceptance in dark                                                             |
| Designed empty space             | Empty states include CTA structure, not lone line                                 |
| Command metaphor                 | Mono IDs, trigger chips, verify `pre` blocks                                      |

---

## Next Step

→ **`/to-issues`** — vertical slices: (1) ~~Phase 1a public `/runbooks/*`~~ **done**, (2) Phase 1b Runbook pointer alignment, (3) Phase 2 Ops CMS shell + OIDC + runbook editors + matrix (runbook-only tab), (4) Phase 3 Stack guide schema + `/guides/*` public + guide editors + dual-type matrix, (5) session/401 handling. Then **`/dev`** on next open slice with **`/core-ui`** attached for component API confirmation.
