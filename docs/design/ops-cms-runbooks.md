# Design Spec: Ops CMS and Runbooks (Public + Admin)

Output path: `docs/design/ops-cms-runbooks.md`

**Related:** [GitHub PRD #1](https://github.com/polyms/ai-kit/issues/1) · [CONTEXT.md](../../CONTEXT.md) · [Kit site spec](./ai-kit-landing.md) · [RB-001 reference](../runbooks/vercel-tanstack-start-monorepo.md)

> **Scope:** Phase 1 public `/runbooks/*` (read-only, CMS-backed) + Phase 2 Ops CMS `/ops/*` (OIDC write). Extends `apps/landing` router and chrome — **does not** redesign global kit site shell. Runbook **content** English-only v1; chrome follows existing locale toggle (VI/EN labels only).

---

## 1. Brief

### BRIEF-INFERENCE table (mandatory)

| Dimension          | Question                        | Ops CMS + Runbooks answer                                                                                                          |
| ------------------ | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Industry**       | What world is the user in?      | DevOps / deploy-CI-ops — incident response, stack manifests, agent retrieval                                                       |
| **Audience**       | Who judges "good" in 3 seconds? | On-call engineer under stress + ops author curating runbooks — anti-marketing, symptom-first, RB-001 clarity tier                  |
| **Mood**           | One adjective + anti-mood       | **Utilitarian ops surface, incident-readable** — not SaaS brochure, not purple-gradient AI landing                                 |
| **Motion depth**   | subtle / standard / emphasis    | **Subtle** everywhere — search debounce, table row highlight, publish toast; no hero animation on runbooks                         |
| **Layout family**  | Primary family                  | **Docs tool column + sticky local nav** (public); **dense admin shell + split editor** (ops) — not card grid landing               |
| **Focal moment**   | One viewport = one hero beat    | **Public index:** symptom search + first result row; **Runbook detail:** symptom index table; **Ops editor:** live symptom preview |
| **Density**        | sparse / balanced / dense       | **Dense** — tables, mono IDs, checklist rows; whitespace via seams not empty panels                                                |
| **Theme default**  | dark-first / light-first        | **Dark-first** — inherit kit site flash script + tokens; light toggle AA via core-ui semantic tokens only                          |
| **Reference tier** | Craft URLs                      | [tasteskill.dev](https://www.tasteskill.dev/) craft tier (typography/seams) + **RB-001 markdown** as content layout reference      |

### Brief lock

Runbooks move from git markdown to a **live ops knowledge surface** on the kit site: humans discover fixes by symptom at `/runbooks/*`; operators curate at `/ops/*` with publish-on-save. Success = an engineer finds **RB-001-03** from “No Output Directory named `.output`” in under 30 seconds, and an ops author sees **coverage gaps** in the dimension matrix before agents hit blind spots. Visual language stays kit-site dark-first with **docs/utilitarian** weight — no marketing hero on runbook routes.

### §1b Quality bar

Per [QUALITY-BAR.md](../../skills/design/QUALITY-BAR.md) — borrow [tasteskill.dev](https://www.tasteskill.dev/) composition density and seam rhythm, not brand.

| Dimension            | Bar                                                                                                                                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Visual reference** | [tasteskill.dev](https://www.tasteskill.dev/) — type scale, border seams, dark craft; **RB-001** — symptom index table, issue block structure                                                                                         |
| **Craft intent**     | 3-level type scale (`.h1` page / `.h2` section / `.label-mono` IDs); **`max-w-4xl`** docs column public; **`max-w-7xl`** ops tables; **`border-b border-line`** section seams; symptom search is largest interactive control on index |
| **core-ui**          | Tables, Field, Button, Badge, Tabs, Modal — no raw `<input>`; invoke **`/core-ui`** before `/dev` (not attached this session)                                                                                                         |
| **Content**          | Copy from PRD + RB-001 + CONTEXT glossary — English runbook body v1; no invented marketing fluff                                                                                                                                      |

**Borrow vs avoid:**

| Borrow                        | Apply here                                                     |
| ----------------------------- | -------------------------------------------------------------- |
| tasteskill section seams      | `border-b border-line` between runbook sections                |
| RB-001 symptom index table    | Public detail + ops editor preview — linked Issue IDs          |
| Kit site `page-x`, font stack | Quicksand UI + JetBrains Mono for IDs, triggers, verify blocks |
| Landing status-line header    | Add **Runbooks** nav item; same fixed/sticky header pattern    |

**Do NOT borrow:** purple/blue gradient hero, equal-height feature cards, centered marketing hero, card soup grids.

---

## 2. Flows

### Primary flow — Public symptom discovery (Phase 1)

```mermaid
flowchart TD
  Entry[Header Runbooks link or /runbooks] --> Index[/runbooks index]
  Index --> Search[Search symptom or trigger phrase]
  Search --> Results[Filtered runbook + issue rows]
  Results --> RBDetail[/runbooks/RB-001]
  RBDetail --> SymptomTable[Symptom index table]
  SymptomTable --> IssueDetail[/runbooks/issues/RB-001-03]
  IssueDetail --> Fix[Read cause → fix → verify]
  Fix --> Related[Related files + axis tags]
```

### Primary flow — Ops author publish (Phase 2)

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
  Matrix --> Gap[Spot uncovered axis combo]
  Gap --> Edit
```

### Critical paths

- **Incident read:** Google/error log phrase → `/runbooks?q=…` → issue row → fix + verify commands copyable.
- **Runbook browse:** `/runbooks` → RB-001 → scroll stack profile + greenfield checklist → known issues.
- **Deep link:** `/runbooks/issues/RB-001-03` or `/runbooks/RB-001#rb-001-03` — both supported; canonical URL is `/runbooks/issues/$issueId`.
- **Ops login:** Unauthenticated `/ops/*` → redirect `/ops/login` → polyms.dev SSO → return to intended route.
- **Session expired:** Stale token mid-edit → 401 banner + re-login CTA; unsaved draft preserved in `sessionStorage` where possible.
- **Matrix gap:** `/ops/matrix` → red/empty cell → click → filtered runbook list or create runbook CTA.
- **Locale:** VI/EN toggles chrome labels only; runbook body stays English v1.

### Phasing

| Phase                | Routes                                                    | Auth                      |
| -------------------- | --------------------------------------------------------- | ------------------------- |
| **1 (Should)**       | `/runbooks`, `/runbooks/$id`, `/runbooks/issues/$issueId` | Public read, rate-limited |
| **2 (Must in spec)** | `/ops/*` full inventory below                             | OIDC polyms.dev for write |

---

## 3. Screen inventory

### Global chrome extension (kit site shell)

| Field | Value                                                                 |
| ----- | --------------------------------------------------------------------- |
| Goal  | Extend existing header/footer with Runbooks entry; reuse theme/locale |
| Entry | All routes including new `/runbooks/*` and `/ops/*`                   |
| Exit  | Runbooks index, skills catalog, external GitHub                       |

**States:**

| State   | User sees                                      | Action                         |
| ------- | ---------------------------------------------- | ------------------------------ |
| Loading | Header skeleton; footer placeholder            | —                              |
| Empty   | N/A                                            | —                              |
| Error   | Alert «Không tải được cấu hình site»           | Reload                         |
| Success | Header + **Runbooks** nav + HomeSiteChrome FAB | Nav, theme, locale, ⌘K on home |

**Nav changes (v3.1 header pattern — `HomeHeader` / shared layout wrapper):**

| Item         | href            | Notes                                    |
| ------------ | --------------- | ---------------------------------------- |
| Overview     | `/#main`        | Unchanged                                |
| Skills       | `/#catalog`     | Unchanged                                |
| **Runbooks** | **`/runbooks`** | **New** — between Skills and Quick start |
| Quick start  | `/#start`       | Unchanged                                |
| GitHub       | external        | Unchanged                                |

**Footer strip** (`page-x py-6 border-t border-line`):

Add link: **Runbooks** → `/runbooks` beside GitHub / MIT line.

**Layout note:** Public runbook routes use same sticky header as kit site; **`HomeSiteChrome`** (fixed bottom-right locale + theme) remains on all public routes. **Hide ⌘K** on `/runbooks/*` and `/ops/*` (skill palette irrelevant).

---

### §3.1 `/runbooks` — Runbook index (Phase 1)

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

### §3.2 `/runbooks/$id` — Runbook detail (Phase 1)

| Field | Value                                                            |
| ----- | ---------------------------------------------------------------- |
| Goal  | Read full runbook — stack profile, checklist, known issues index |
| Entry | Index row, direct link `/runbooks/RB-001`, MCP-shared URLs       |
| Exit  | Issue detail, back to index, in-page anchors                     |

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
│ text-muted — audience: devops-agent · Reference: ai-kit apps/landing             │
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
│ Checkbox list (read-only visual ✓) — not interactive on public                   │
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

### §3.3 `/runbooks/issues/$issueId` — Known issue detail (Phase 1)

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

### §3.4 `/ops` — Ops entry (Phase 2)

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

### §3.5 `/ops/login` — OIDC entry (Phase 2)

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
│ text-muted — Sign in with your Polyms account to edit runbooks.                   │
│ Button primary — «Sign in with polyms.dev»                                        │
│ Error Alert if SSO fails                                                          │
└───────────────────────────────────────────────────────────────────────────────────┘
```

Minimal chrome: kit header without ops nav; no marketing bands.

---

### §3.6 `/ops/runbooks` — Runbook list (Phase 2)

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
│ · Matrix          │ Field.Control search (filter table)                             │
│ · Sign out        │ Table: ID | Title | Status | Axis tags | Updated | Actions      │
│                   │ Status Badge: draft | published                                 │
│                   │ Row actions: Edit · View public ↗                               │
└───────────────────┴───────────────────────────────────────────────────────────────┘
```

---

### §3.7 `/ops/runbooks/new` and `/ops/runbooks/$id/edit` — Runbook editor (Phase 2)

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
│ └────────────────────────────┘  └──────────────────────────────────────────────┘  │
│                                                                                  │
│ Section: Known issues — mini table + link «Add issue» → issue editor             │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Publish-on-save:** Single **Save** button (primary) — no separate draft/publish in v1; status always `published` on successful save.

---

### §3.8 `/ops/runbooks/$id/issues/new` and `/ops/issues/$id/edit` — Known issue editor (Phase 2)

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

### §3.9 `/ops/matrix` — Dimension matrix coverage (Phase 2)

| Field | Value                                         |
| ----- | --------------------------------------------- |
| Goal  | See axis-combo coverage gaps across runbooks  |
| Entry | Ops side nav                                  |
| Exit  | Filtered runbook list, create runbook for gap |

**States:**

| State   | User sees                             | Action                  |
| ------- | ------------------------------------- | ----------------------- |
| Loading | Grid skeleton                         | —                       |
| Empty   | «No axis data — add tags to runbooks» | Go to runbooks          |
| Error   | Alert + retry                         | Retry                   |
| Success | Coverage grid — gaps highlighted      | Click cell → drill-down |

**Layout:**

```
┌─ MATRIX — page-x max-w-7xl section-y ─────────────────────────────────────────────┐
│ .h1 Coverage matrix                                                               │
│ text-muted — Rows = axis combinations from stack manifest dimensions.             │
│                   Columns = runbooks. Gaps = no matching runbook.                 │
│                                                                                   │
│ Tabs: By deploy · By framework · By monorepo (filter row axis primary)            │
│                                                                                   │
│ ┌─ CoverageMatrixGrid — horizontal scroll on sm ──────────────────────────────┐   │
│ │           │ RB-001 │ RB-002 │ …                                               │   │
│ │ vercel+nx │   ✓    │   —    │  ← gap cell: bg-danger-500/10 border border-danger │
│ │ netlify   │   —    │   ✓    │                                               │   │
│ └───────────────────────────────────────────────────────────────────────────────┘   │
│ Legend: ✓ covered · — gap · click gap → suggest create runbook                    │
└───────────────────────────────────────────────────────────────────────────────────┘
```

**Axis dimensions (v1):** linter, formatter, deploy, framework, monorepo — extensible via CMS config; labels from CONTEXT **Stack manifest** vocabulary.

---

### §3.10 Session expired / 401 unauthorized (Phase 2)

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

## 4. Typography & visual system

Extends [kit site §4](./ai-kit-landing.md#4-typography--visual-system) — **reuse** `.display`, `.h1`, `.h2`, `.label-mono`, `.font-invoke`, `page-x`, `section-y`, dark flash script. Add runbook/ops utilities below.

### 4.1 Type scale (inherit + ops additions)

| Role              | Class               | Size      | Usage                              |
| ----------------- | ------------------- | --------- | ---------------------------------- |
| Page title        | `.h1`               | 30→36px   | Runbook title, ops page titles     |
| Section           | `.h2`               | 20→24px   | Symptom index, Stack profile, etc. |
| Runbook ID        | `.label-mono`       | 12px caps | RB-001, RB-001-03 labels           |
| Search / triggers | `.font-invoke`      | 14px mono | Search placeholder, trigger chips  |
| Verify blocks     | `font-mono text-sm` | 14px      | Code in `pre`                      |
| Table cell        | `text-sm`           | 14px      | Dense ops tables                   |

No `.display` on runbook routes — utilitarian `.h1` only (**anti-slop:** no marketing hero type).

### 4.2 Surface rhythm

| Route group     | Width               | Surface                                     | Seams                        |
| --------------- | ------------------- | ------------------------------------------- | ---------------------------- |
| Public runbooks | `max-w-4xl mx-auto` | `bg-body`                                   | `border-b border-line` per § |
| Issue detail    | `max-w-4xl`         | `bg-body`; issue block `border-s-4 primary` | Same                         |
| Ops list/matrix | `max-w-7xl`         | `bg-body`; side nav `bg-surface-2`          | Nav `border-r border-line`   |
| Ops editor      | `max-w-7xl`         | Form `bg-body`; preview `bg-surface` inset  | Preview `border border-line` |

**Section order (public detail):** Symptom index → Stack profile → Greenfield checklist → Known issues → Debug commands (optional).

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
  .issue-block {
    @apply border-primary-700 border-s-4 ps-4 py-2;
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
- **No** purple gradient, no hero bands on `/runbooks/*`.

### 4.6 Hero composition (public index — focal beat)

**Above the fold (no scroll):** 100% width `page-x max-w-4xl`; user sees `.label-mono` + `.h1` + one-line muted desc + **full-width search** (~60% of viewport height on mobile). **No** side-by-side marketing split. Focal = search field.

---

## 5. Component map

**Invoke `/core-ui` before `/dev`** — user has not attached this session; confirm `Field`, `Table`, `Modal`, `Tabs`, `Badge`, `Button`, `Select`, `Alert`, `Toast` APIs against `@polyms/core-ui` catalog.

| UI element             | core-ui primitive       | Variant / notes                                   |
| ---------------------- | ----------------------- | ------------------------------------------------- |
| Site header nav        | `NavigationMenu.Link`   | Add Runbooks item                                 |
| Footer link            | `Link`                  | text-muted hover:text-fg                          |
| Locale + theme FAB     | `ToggleGroup`, `Button` | Reuse `HomeSiteChrome`                            |
| Symptom search         | `Field.Control`         | `type="search"`, mono, debounced                  |
| Results / index table  | `Table`                 | dense rows, clickable                             |
| Tag chips (public)     | `Badge`                 | `variant="outline"`                               |
| Breadcrumb             | `Link` + `Text`         | Runbooks / RB-001 / …                             |
| Copy verify block      | `Button`                | `variant="ghost" size="sm"` + toast               |
| OIDC sign in           | `Button`                | `variant="primary"`                               |
| Ops save               | `Button`                | `variant="primary"`, loading state                |
| Ops cancel             | `Button`                | `variant="ghost"`                                 |
| New runbook            | `Button`                | `variant="primary"`                               |
| Form labels            | `Field.Label`           | paired with Control                               |
| Title, slug, audience  | `Field.Control`         | slug: mono                                        |
| Markdown bodies        | `Textarea` or `Field`   | stack profile, cause, fix — confirm in `/core-ui` |
| Status draft/published | `Badge`                 | success vs muted                                  |
| Axis filter tabs       | `Tabs`                  | matrix view switcher                              |
| Unsaved / 401 modal    | `Modal`                 | focus trap, returnTo                              |
| Error / rate limit     | `Alert`                 | destructive / warning                             |
| Publish toast          | `Toast`                 | success tier                                      |
| Sign out               | `Button`                | `variant="ghost"` in side nav                     |

**Custom components** (compose core-ui — no parallel DS):

| Component             | Why custom                                     | Follow-up                                                   |
| --------------------- | ---------------------------------------------- | ----------------------------------------------------------- |
| `OpsShell`            | Side nav + main grid layout                    | `apps/landing/src/components/ops/`                          |
| `SymptomIndexTable`   | Linked issue ID column from CMS data           | Uses `Table`                                                |
| `TriggerPhraseChips`  | Add/remove trigger strings                     | Uses `Badge` + `Field.Control`                              |
| `AxisTagPicker`       | Multi-select axis tags                         | Uses `ToggleGroup` or `Checkbox` group — confirm `/core-ui` |
| `CoverageMatrixGrid`  | 2D gap highlighting                            | CSS grid + `Button` cell                                    |
| `RunbookPreviewPane`  | Live symptom index from form state             | Uses `SymptomIndexTable`                                    |
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

No hero motion on runbook routes.

---

## 7. Responsive and accessibility

| Topic                  | Decision                                                                    |
| ---------------------- | --------------------------------------------------------------------------- |
| Breakpoints            | **sm:** stacked ops editor (preview below form); matrix horizontal scroll   |
|                        | **md+:** local nav visible on runbook detail; ops split editor              |
|                        | **lg+:** ops shell side nav fixed                                           |
| Focus order            | Index: search → results table → pagination; Editor: title → slug → … → Save |
|                        | Modal traps focus; ESC closes non-destructive modals                        |
| ARIA                   | Search: `aria-label="Search runbooks by symptom"`; tables with `<caption>`  |
|                        | Issue block: `role="region"` `aria-labelledby` symptom heading              |
|                        | Matrix: `aria-label="Runbook coverage matrix"`; gap cells `aria-label`      |
| Keyboard               | Table rows Enter to navigate; ops side nav arrow keys optional              |
| Color                  | Gaps use icon + text «Gap», not color alone; Badge + label for status       |
| prefers-reduced-motion | All motion rows → instant state change                                      |
| WCAG 2.1 AA            | Public + ops; verify contrast on `matrix-gap` and trigger chips in light    |

---

## 8. Visual acceptance for `/dev`

**Reference:** [tasteskill.dev](https://www.tasteskill.dev/) — seam rhythm, dark craft; **RB-001 markdown** — content hierarchy.

| Check          | Pass when                                                                                |
| -------------- | ---------------------------------------------------------------------------------------- |
| Dark-first     | First paint dark; acceptance screenshots for `/runbooks`, `/ops/runbooks` in dark        |
| Type scale     | `.h1` + `.h2` + `.label-mono` visible on index and RB-001 detail                         |
| Surface rhythm | ≥2 surfaces (`bg-body` + `bg-surface` preview or `bg-surface-2` ops nav)                 |
| Focal beat     | Index: search dominates above fold; Detail: symptom index table is first content section |
| core-ui        | No raw `<input>`; search uses `Field.Control`; ops save uses `Button`                    |
| Anti-slop      | No §A violations — no card grid, no purple hero, no `.display` marketing on runbooks     |
| RB-001 parity  | Public RB-001 page sections match runbook markdown order and table                       |
| Ops density    | Runbook list readable at 1280px without horizontal scroll except matrix                  |

**P0 slices (implementation order):**

1. **CSS/globals** — runbook-section, issue-block, ops-side-nav utilities
2. **Chrome** — header/footer Runbooks link; hide ⌘K on runbook routes
3. **Phase 1 public** — `/runbooks` index + search → `/runbooks/$id` → `/runbooks/issues/$issueId`
4. **Phase 2 ops shell** — OIDC gate + `/ops/runbooks` list
5. **Phase 2 editors** — runbook + issue forms + preview
6. **Phase 2 matrix** — coverage grid
7. **401/session** — banner + draft Modal

---

## 9. Pre-flight

Run [PREFLIGHT.md](https://github.com/polyms/ai-kit/blob/main/skills/design/PREFLIGHT.md) — results:

### Spec completeness

- [x] Every screen has loading, empty, error, success — §3.1–§3.10
- [x] No TBD/TODO in spec body
- [x] Flows cover PRD critical paths — public search, detail, ops publish, matrix, auth
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
- [x] Screen names use CONTEXT vocabulary (Runbook, Known issue, Ops CMS, Stack profile, Axis tags)
- [x] Layout specific to ops/docs — not landing copy-paste
- [x] Ops editor grid documented sm/md/lg

### Motion and accessibility

- [x] Reduced-motion fallbacks §6
- [x] Focus order §7
- [x] Error states actionable — retry, re-login, clear search

### Handoff

- [x] Saved at `docs/design/ops-cms-runbooks.md`
- [x] Next Step → `/to-issues` (recommended)

---

## 10. Open questions

1. **Rate limit UX:** Show remaining quota in UI or opaque 429 only? Default: opaque 429 Alert (edge handles limits).
2. **Matrix row source:** Auto-generate axis combos from all tagged runbooks only, or merge with stack manifest template rows? Default: union of manifest axes + tagged combos.
3. **Markdown editor:** Single textarea vs split WYSIWYG for stack profile — v1 textarea + preview tab acceptable?
4. **Public checklist:** Interactive checkboxes for greenfield (localStorage) or read-only? Default: read-only public; interactive deferred.
5. **Ops role granularity:** Single polyms.dev SSO role for all `/ops/*` in v1, or editor vs admin split? Default: single role per PRD.

---

## 11. Analytics (optional — Umami)

Extend kit site events ([CONTEXT.md](../../CONTEXT.md) Umami):

| Event            | Trigger                                      |
| ---------------- | -------------------------------------------- |
| `runbook_search` | Search submit / debounced query with results |
| `runbook_view`   | `/runbooks/$id` mount                        |
| `issue_view`     | `/runbooks/issues/$issueId` mount            |
| `ops_publish`    | Successful save on runbook/issue editor      |

Env-gated same as existing `VITE_UMAMI_*`.

---

## 12. Anti-slop appendix

### §A — Big bans (applicability)

| Ban                                        | Apply?          | Notes                                           |
| ------------------------------------------ | --------------- | ----------------------------------------------- |
| Centered hero + two buttons + subcopy      | **Yes — avoid** | Runbook index uses search-first, no hero CTA    |
| Equal-height card grid                     | **Yes — avoid** | Use tables and prose sections                   |
| `rounded-xl border bg-surface` every block | **Yes — avoid** | Section seams, one preview inset in editor only |
| `max-w-6xl mx-auto` every section          | **Yes — avoid** | `max-w-4xl` public, `max-w-7xl` ops             |
| Purple/blue gradient hero                  | **Yes — avoid** | PRD explicit                                    |
| Wall of text in 70vh void                  | **Yes — avoid** | Dense tables + labeled sections                 |
| Light-gray-on-white sole theme             | N/A             | Dark-first inherited                            |
| Monospace labels without size contrast     | **Yes — avoid** | `.label-mono` paired with `.h2` sections        |
| Pipeline vertical list only                | N/A             | Not applicable                                  |

### §B — Composition rules

| Rule                             | How this spec satisfies                           |
| -------------------------------- | ------------------------------------------------- |
| One focal beat per viewport      | Index = search; detail = symptom table            |
| Type scale ≥ 3 levels            | `.h1` / `.h2` / `.label-mono` + body              |
| Asymmetry                        | Ops editor 45/55 split; detail float local nav    |
| Foreground/background separation | ops side nav `bg-surface-2`, preview inset        |
| Dark-first preview               | §8 acceptance in dark                             |
| Designed empty space             | Empty states include CTA structure, not lone line |
| Command metaphor                 | Mono IDs, trigger chips, verify `pre` blocks      |

---

## Next Step

→ **`/to-issues`** (recommended) — split vertical slices: (1) Phase 1 public `/runbooks/*` + chrome nav, (2) Phase 2 Ops CMS shell + OIDC, (3) editors + matrix, (4) session/401 handling. Then **`/dev`** on Phase 1 slice with **`/core-ui`** attached for component API confirmation.
