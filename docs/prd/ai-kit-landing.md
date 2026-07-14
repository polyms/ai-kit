# PRD: Kit site — Landing page

| Field        | Value                                    |
| ------------ | ---------------------------------------- |
| Author       | pm                                       |
| Status       | Draft — Creative Direction addendum v1.1 |
| Version      | 1.1                                      |
| Last updated | 2026-07-03                               |
| Stakeholders | Polyms engineering, designer, developer  |

**Related artifacts:** [ADR-0002](../adr/0002-kit-site-static-vite-core-ui.md) · [Design spec (baseline)](../design/ai-kit-landing.md) · [CONTEXT.md](../../CONTEXT.md)

---

## 1. Executive Summary

**Kit site** (`ai-kit.polyms.dev`) là lớp end-user cho ai-kit — giúp kỹ sư fullstack / tech lead hiểu pipeline, browse
15 skill, copy sample prompt, và chạy bootstrap trong vài phút, không cần đọc README.

PRD v1.0 (pm) đã chốt scope chức năng và content completeness. **Addendum này (v1.1)** định hình **creative product direction**: landing hiện đại, phá cách, cảm giác **engineering artifact** — không phải template SaaS marketing.

Design spec hiện tại (`docs/design/ai-kit-landing.md`) quá **calm editorial** so với intent stakeholder. Designer cần revise spec theo addendum này; không được drop content để đổi aesthetic.

---

## 2. Problem Statement

### Background

ai-kit có README dày cho contributor; end-user cần browse UX tốt hơn — lọc skill, copy prompt, thấy full pipeline + principal agents. ADR-0002 đã lock stack (Nx `apps/landing`, Vite + React + `@polyms/core-ui`, VI-first, Umami).

### Problem

Landing page generic (gradient hero, 3 cột feature, copy marketing rỗng) sẽ **phản tín hiệu thương hiệu** «real engineering, not vibe coding». User không tin đây là công cụ cho kỹ sư Cursor — họ sẽ bounce trước khi copy prompt hoặc bootstrap.

### Opportunity

Một kit site có **personality rõ** — IDE/terminal-adjacent, slash-command discovery, pipeline như hệ thống sống — tăng engagement (scroll pipeline, copy prompt, time on site) và conversion bootstrap.

---

## 3. Goals & Success Metrics

| Goal                  | Metric                                        | Target (90 ngày post-launch)      | Measurement                                     |
| --------------------- | --------------------------------------------- | --------------------------------- | ----------------------------------------------- |
| Hiểu value prop nhanh | Bounce rate trang `/`                         | < 55%                             | Umami                                           |
| Khám phá pipeline     | Scroll depth tới section Pipeline             | ≥ 40% sessions                    | Umami scroll / section visibility event         |
| Dwell trên pipeline   | Time in viewport section Pipeline (median)    | ≥ 8s                              | Umami custom event (v1.1 creative — xem MoSCoW) |
| Skill discovery       | Click-through Landing → `/skills`             | ≥ 25% sessions                    | Umami                                           |
| Copy prompt           | Copy button clicks (detail + landing teasers) | ≥ 15% sessions có ≥1 copy         | Umami custom event                              |
| Bootstrap intent      | Click CTA Quick start hoặc copy clone block   | ≥ 10% sessions                    | Umami                                           |
| Locale                | EN toggle usage                               | Track % — không có target cứng v1 | Umami                                           |
| Accessibility         | WCAG 2.1 AA audit (manual + axe)              | Pass                              | QA checklist                                    |

### Non-goals

- SEO/SSR nâng cao (client-only v1 đủ — ADR-0002)
- Auth, accounts, newsletter signup
- Runtime Mermaid hoặc CMS
- Video demo, testimonials, pricing table

---

## 4. Users & Personas

### Primary persona

- **Who:** Kỹ sư fullstack / tech lead Polyms — dùng Cursor, quen slash command, ghét marketing fluff
- **Need:** Hiểu ai-kit trong 2–3 phút; biết invoke skill nào; copy prompt; clone + bootstrap
- **Pain today:** README dài; khó lọc skill; không thấy pipeline + agents trong một view

### Secondary persona

- **Contributor mới:** Cần map skill ↔ agent ↔ artifact; catalog giúp onboard nhanh hơn đọc toàn bộ README

---

## 5. Baseline Functional Scope (không đổi — từ PRD v1.0)

Tham chiếu đầy đủ: `docs/design/ai-kit-landing.md`. Tóm tắt bắt buộc:

| Area      | Requirement                                                                                                    |
| --------- | -------------------------------------------------------------------------------------------------------------- |
| Routes    | `/`, `/skills`, `/skills/:invoke`, `/#quick-start`, `/quick-start` → redirect anchor                           |
| Locale    | VI default UI chrome; EN via locale toggle; `localStorage` `ai-kit-locale`; sample prompt luôn bilingual EN/VI |
| Content   | Hybrid frontmatter + overlay (`apps/landing/src/content/overlay.ts`)                                           |
| Analytics | Umami async/defer; env build-time; không PII                                                                   |
| Deploy    | GitHub Pages; CNAME `ai-kit.polyms.dev`                                                                        |
| States    | Mọi screen: loading, empty, error, success                                                                     |

---

## 6. Creative Direction Addendum

> **Mục đích:** Hướng sáng tạo cho designer revise `docs/design/ai-kit-landing.md`. Giữ **100% content checklist** (§6.3); thay **mood, layout, motion, metaphor** — không thay scope chức năng.

### 6.1 Brand Personality — «Terminal của pipeline»

| Dimension           | Là gì                                                                                                    | Không phải                                                       |
| ------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Voice**           | Peer kỹ sư — ngắn, quyết đoán, dùng thuật ngữ domain (`invoke`, `handoff`, `artifact`) khi có CONTEXT.md | Copywriter SaaS («revolutionize», «unlock», «seamless»)          |
| **Tone**            | Confident, slightly irreverent — «align trước khi build», «không vibe coding»                            | Corporate warm, startup bro, ho ho hào                           |
| **Visual metaphor** | IDE adjacency — command palette, status line, diff highlight, monospace cho invoke                       | Stock illustration team làm việc, gradient blob, isometric cloud |
| **Density**         | Information-rich — whitespace có chủ đích, không trống để «breathable»                                   | Sparse marketing với 3 bullet và hero 80vh                       |
| **Motion**          | Purposeful — pipeline «activate» khi scroll; copy flash như terminal feedback                            | Parallax decorative, floating particles, infinite marquee logo   |

**Tagline territory (VI-first, design chọn một):**

- «Kỹ năng agent cho **real engineering**» (giữ từ PRD v1)
- Hoặc sub hero mạnh hơn: «Align. Spec. Ship. — không phải vibe coding.»

**Những gì kit site KHÔNG BAO GIỜ là:**

- Generic SaaS landing (purple gradient hero, «Start free trial», social proof carousel)
- 3-column equal feature grid với icon line-art giống nhau
- Lorem-style benefit bullets không map tới skill thật
- «AI-powered» làm headline chính thay vì pipeline + skills
- Calm editorial / magazine layout làm default (đó là v0 design spec — **deprecated** cho creative v1)

### 6.2 Differentiation Thesis — Engineering artifact, not marketing fluff

**Luận điểm:** Kit site phải cảm giác như **artifact trong repo** — README nâng cấp thành interactive surface — không phải trang quảng cáo tách rời codebase.

| Pillar                   | Manifest trên landing                                                                                                                 | Liên kết «real engineering»                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| **Slash commands là UI** | Invoke `/reqs`, `/align` hiển thị như lệnh thật — monospace, prefix `/`, copy one-click                                               | Skill nhỏ, composable — user ở quyền điều khiển |
| **Pipeline là hệ thống** | Main path + triage branch như **living diagram** — stage highlight, artifact output labels (`PRD`, `docs/design/`, `ready-for-agent`) | Mỗi stage produce artifact next stage consume   |
| **Agents là principals** | 5 agent cards như «process owner» — owns field cụ thể; `/align` skill-only (grill tương tác)                                          | Handoff có lane; không relitigate downstream    |
| **Prompts là contract**  | Sample prompt blocks giống snippet trong terminal/chat — bilingual, không marketing rewrite                                           | Copy-paste = invoke thật trong Cursor           |
| **Dogfood core-ui**      | Component map từ `@polyms/core-ui` — site chứng minh design system                                                                    | Design every day — spec map tới primitives      |

**Anti-vibe-coding signal:** Mọi section phải trả lời «sau khi đọc, tôi biết **lệnh gì chạy tiếp**» — không chỉ «sản phẩm hay».

### 6.3 Content Completeness Checklist — KHÔNG ĐƯỢC DROP

Design creative **không được** hy sinh item nào dưới đây để đơn giản layout.

#### Landing page (`/`)

- [ ] Hero: value prop, 2 CTA (catalog + quick start)
- [ ] **5 Real engineering principles** (full list từ README — có thể layout bento, không được rút còn 3)
- [ ] **Pipeline — main path:** `Idea → /align → /reqs | /to-prd → /to-issues → /design → /dev → /code-review → ship`
- [ ] **Pipeline — triage branch:** `Raw issues → /triage → ready-for-agent → /dev → /code-review` (visual parallel, dashed)
- [ ] Pipeline nodes clickable → skill detail (trừ Idea, ship)
- [ ] Caption `/setup` một lần mỗi repo
- [ ] **5 principal agent cards:** pm, designer, developer, tester, techlead — vai trò, owns, link skill (`/align` = skill-only, no agent card)
- [ ] CTA band: catalog + quick start anchor

#### Skill catalog (`/skills`)

- [ ] **15 skills** đầy đủ (bảng invoke, name, status, invocation, domain):

  | Invoke           | Name                                           |
  | ---------------- | ---------------------------------------------- |
  | `/setup`         | setup                                          |
  | `/align`         | align (+ footnote align-loop, domain-modeling) |
  | `/reqs`          | reqs (`pm`)                                    |
  | `/to-prd`        | to-prd                                         |
  | `/to-issues`     | to-issues                                      |
  | `/triage`        | triage                                         |
  | `/design`        | design (`designer`)                            |
  | `/dev`           | dev (`developer`)                              |
  | `/code-review`   | code-review (`techlead`)                       |
  | `/docs`          | docs (`techlead`)                              |
  | `/e2e`           | e2e (`tester`)                                 |
  | `/craft`         | craft                                          |
  | `/arch-refactor` | arch-refactor (`techlead`)                     |
  | `/arch`          | arch (`techlead`)                              |
  | `/devops`        | devops (`developer` + `techlead`)              |

- [ ] Filters: search, domain single-select, invocation tabs (Tất cả | User-invoked | Model-invoked)
- [ ] URL query sync optional: `?domain=&invocation=`

#### Skill detail (`/skills/:invoke`)

- [ ] **11 sample prompt blocks** user-facing + **arch model-invoked hint** (không slash block — triggers list)
- [ ] Copy-to-clipboard + toast success/error + manual select fallback
- [ ] Agent hint khi có; GitHub link; breadcrumb

#### Quick start

- [ ] Clone + `pnpm bootstrap` code blocks (copy)
- [ ] Bootstrap path table (Cursor, Claude)
- [ ] Post-bootstrap steps (restart editor, `/setup`, link catalog)
- [ ] Manual setup accordion (`ln -sfn` examples)

#### Global

- [ ] Locale toggle VI | EN — UI chrome only; prompts bilingual
- [ ] Site shell: nav (Kỹ năng, Bắt đầu nhanh, GitHub), footer MIT · Polyms · Umami privacy
- [ ] Umami script async/defer; disabled khi env missing
- [ ] SEO meta per route (VI titles)
- [ ] a11y: skip link, focus order, WCAG AA, `prefers-reduced-motion`

### 6.4 Experience Principles (cho designer)

1. **Pipeline là hệ thống sống, không phải diagram tĩnh**
   - Scroll hoặc hover-driven stage activation; artifact labels xuất hiện tại mỗi node (`CONTEXT.md`, `PRD`, `docs/design/`, agent brief).
   - Triage branch luôn visible song song — dashed connector, không ẩn trong tooltip.
   - Fallback reduced-motion: full diagram readable without animation.

2. **Prompts cảm giác như terminal commands**
   - Monospace, prompt prefix (`>` hoặc `/`), copy affordance prominent.
   - Không paraphrase marketing — mirror README bilingual blocks.

3. **Skill catalog như command palette**
   - Search-first mental model: «gõ `/` hoặc tên skill».
   - Card hierarchy: invoke lớn nhất → name → description → badges (status, invocation, domain).
   - Keyboard: `/` focus search khi ở catalog (Should have — xem MoSCoW).

4. **Bento có purpose, không decoration**
   - Asymmetric grid gom theo **nhóm domain** hoặc **pipeline stage** — mỗi cell có job (principle, agent, skill cluster).
   - Không bento 6 ô identical icon+title.

5. **Dark-first dev aesthetic — accessible**
   - Default theme: dark hoặc high-contrast (core-ui tokens); light toggle optional nếu core-ui hỗ trợ không tốn scope.
   - Contrast AA bắt buộc; không sacrifice readability cho «cool».

### 6.5 Creative Layout Direction (gợi ý — designer chốt chi tiết)

| Section     | Editorial v0 (deprecated)             | Creative v1 direction                                                                                                                    |
| ----------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Hero        | Centered H1 + 2 CTA, light whitespace | Asymmetric: H1 bold left + «terminal strip» right previewing `/align` hoặc mini pipeline; hoặc full-bleed dark với typographic scale lớn |
| Principles  | 3-col equal card grid                 | Bento — 1 principle hero-size + 4 smaller; hoặc vertical «manifest» list với invoke tags                                                 |
| Pipeline    | Static Mermaid/SVG in Card            | Scroll-scrubbed stage rail HOẶC interactive hover path; SVG build-time OK                                                                |
| Agents      | 5 equal cards                         | Flex wrap / bento với monospace «owns:» field nổi — pm, designer, developer, tester, techlead                                            |
| Catalog     | Standard card grid                    | Command-palette header + dense grid; invoke as primary visual                                                                            |
| Quick start | Linear steps                          | Step rail giống CI log hoặc numbered terminal blocks                                                                                     |

**Typography:** Display font cho H1 only (design chọn — geometric hoặc neo-grotesk bold); body giữ system/core-ui stack; invoke luôn monospace.

### 6.6 Anti-Patterns — Template slop (explicit ban list)

| #   | Anti-pattern                                      | Thay bằng                                                               |
| --- | ------------------------------------------------- | ----------------------------------------------------------------------- |
| 1   | Purple/blue gradient hero full-bleed              | Solid dark hoặc subtle noise texture; accent từ core-ui semantic tokens |
| 2   | 3-column «Features» với icon giống nhau           | Principles bento hoặc pipeline-anchored groups                          |
| 3   | «Trusted by» logo bar                             | Không có v1 — không invent social proof                                 |
| 4   | Generic «How it works» 1-2-3 với số tròn          | Pipeline diagram thật với skill invoke names                            |
| 5   | Stock photos / 3D illustrations                   | Không illustration — typography + diagram + code                        |
| 6   | «AI-powered» / «Supercharge» headline             | «Real engineering», «align, spec, ship»                                 |
| 7   | CTA «Get started free»                            | «Xem skill catalog», «Bắt đầu nhanh», «Sao chép»                        |
| 8   | Testimonial carousel                              | Không                                                                   |
| 9   | FAQ accordion 10 câu generic                      | Quick start + catalog đủ; FAQ defer                                     |
| 10  | Mermaid runtime client bundle cho decorative      | SVG build-time hoặc hand-coded `PipelineDiagram`                        |
| 11  | Giảm 15 skills xuống «top 6» trên landing         | Full catalog route; landing có thể teaser 4–6 + CTA «xem tất cả»        |
| 12  | Light editorial làm sole theme khi không có lý do | Dark-first hoặc high-contrast — phù hợp Cursor audience                 |

### 6.7 MoSCoW — Creative v1 vs defer

#### Must Have (creative v1 = ship blocker)

| Item                                                             | Notes                                                                                 |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Dark-first hoặc high-contrast theme                              | core-ui tokens; AA contrast                                                           |
| Asymmetric hero + bold typography                                | Không centered generic                                                                |
| Pipeline interactive **hoặc** scroll-driven highlight            | Ít nhất hover/active stage; scroll-scrub nice-to-have nhưng stage activation bắt buộc |
| Full content checklist §6.3                                      | Non-negotiable                                                                        |
| Command-palette **visual language** cho catalog                  | Search prominent; invoke monospace                                                    |
| Sample prompt terminal styling                                   | Detail + any landing teasers                                                          |
| 4 agent cards với owns field                                     | Link skill                                                                            |
| Locale toggle VI/EN                                              |                                                                                       |
| Umami pageviews                                                  |                                                                                       |
| `prefers-reduced-motion` fallbacks                               |                                                                                       |
| Revise design spec mood từ «calm editorial» → creative brief này | designer deliverable                                                                  |

#### Should Have (v1 nếu không blow timeline)

| Item                                                                           | Notes                               |
| ------------------------------------------------------------------------------ | ----------------------------------- |
| Scroll-scrubbed pipeline progression                                           | Section pin + stage advance         |
| `/` keyboard shortcut focus search on catalog                                  | Global listener khi route `/skills` |
| Umami custom events: `copy_prompt`, `pipeline_section_view`, `cta_quick_start` | Không PII                           |
| Light theme toggle                                                             | Nếu core-ui switch trivial          |
| Landing teaser: 4–6 featured skills với copy                                   | Dẫn tới full catalog                |

#### Could Have (v1.1 post-launch)

| Item                                            | Notes                            |
| ----------------------------------------------- | -------------------------------- |
| Animated artifact «flow» between pipeline nodes | Particles/data — chỉ nếu perf OK |
| Sound/haptic on copy                            | Không khuyến nghị                |
| OG image generator per skill                    | SEO social                       |
| vi/en URL prefix `/en/skills`                   | ADR hiện tại: toggle only        |

#### Won't Have (v1)

| Item                               | Reason             |
| ---------------------------------- | ------------------ |
| SSR / prerender beyond static meta | ADR-0002           |
| CMS / MDX runtime                  | Overlay TS đủ      |
| User accounts, analytics dashboard | Scope              |
| 3D WebGL pipeline                  | Gimmick, a11y risk |
| Generic SaaS patterns §6.6         | Brand conflict     |

---

## 7. Functional Requirements (baseline — unchanged IDs)

| ID    | Requirement                                                            | Priority |
| ----- | ---------------------------------------------------------------------- | -------- |
| FR-01 | Landing hiển thị hero, 5 principles, pipeline (2 nhánh), 4 agents, CTA | P0       |
| FR-02 | Catalog 15 skills với filter search/domain/invocation                  | P0       |
| FR-03 | Skill detail với 11 prompts + arch hint, copy clipboard                | P0       |
| FR-04 | Quick start: clone, bootstrap, table, manual accordion                 | P0       |
| FR-05 | Locale toggle VI default, EN optional, prompts bilingual               | P0       |
| FR-06 | Umami async, env-gated                                                 | P0       |
| FR-07 | GitHub Pages deploy `ai-kit.polyms.dev`                                | P0       |
| FR-08 | Creative direction §6 — dark-first, non-template layout                | P0       |
| FR-09 | Pipeline stage interaction (hover hoặc scroll)                         | P0       |
| FR-10 | Umami custom events engagement                                         | P1       |

---

## 8. Non-Functional Requirements

| Category      | Requirement                                                      |
| ------------- | ---------------------------------------------------------------- |
| Performance   | LCP < 2.5s trên 4G; Umami không block LCP                        |
| Accessibility | WCAG 2.1 AA; keyboard catalog; sr-only pipeline text alternative |
| i18n          | VI default chrome; EN toggle; glossary terms từ CONTEXT.md       |
| Security      | No PII in analytics; external links `rel="noopener"`             |
| Compatibility | Latest Chrome, Firefox, Safari, Edge; mobile usable              |

---

## 9. Assumptions

- `@polyms/core-ui` hỗ trợ dark theme hoặc semantic tokens đủ cho dark-first mà không fork lib
- Creative layout vẫn map được tới core-ui primitives (ADR dogfood)
- Designer revise `docs/design/ai-kit-landing.md` trước `/dev` — không code trước spec
- Content overlay maintain thủ công khi thêm skill (ADR-0002)

---

## 10. Risks & Mitigations

| Risk                                      | Impact | Mitigation                                                |
| ----------------------------------------- | ------ | --------------------------------------------------------- |
| Creative layout phá a11y                  | High   | Test sớm với axe; reduced-motion path; sr-only pipeline   |
| Dark-first conflict core-ui light default | Med    | Confirm tokens với `/core-ui`; theme provider app-level   |
| Scroll pipeline tốn dev                   | Med    | MoSCoW: hover activation Must; scroll-scrub Should        |
| «Phá cách» quá đà — khó đọc               | Med    | Content checklist audit; peer review với engineer persona |
| Custom events Umami chưa setup            | Low    | Pageviews Must; custom P1                                 |

---

## 11. Handoff Notes cho designer

1. Đọc **toàn bộ** addendum §6 trước khi sửa `docs/design/ai-kit-landing.md`.
2. **Replace** mood row «Calm editorial» → «Terminal/pipeline — dark-first, asymmetric, command-palette catalog».
3. Giữ screen inventory, flows, component map, overlay shape — **revise layout notes, motion plan, theme preset** theo §6.4–6.5.
4. Thêm section **Creative Direction** trong design spec trỏ về PRD này.
5. Pipeline: spec `PipelineDiagram` với interaction model (hover minimum; scroll optional).
6. Chạy anti-slop checklist §6.6 trước handoff `/dev`.
7. Pre-flight: xác nhận §6.3 content checklist tick đủ trong revised spec.

---

## Resolved decisions (stakeholder 2026-07-03)

| #   | Question             | Decision                                                                                                        |
| --- | -------------------- | --------------------------------------------------------------------------------------------------------------- |
| 1   | Theme                | **Dark default + light toggle** — both modes; persist `localStorage` `ai-kit-theme`                             |
| 2   | Pipeline interaction | **Full scroll-scrub** — stage activation on scroll + hover supplement                                           |
| 3   | Hero terminal strip  | **Live typing animation** — reduced-motion → static                                                             |
| 4   | Umami custom events  | **Ship v1** — `copy_prompt`, `pipeline_section_view`, `cta_quick_start`, `theme_toggle`, `command_palette_open` |

## Resolved decisions (stakeholder 2026-07-03)

| #   | Question        | Decision                                                            |
| --- | --------------- | ------------------------------------------------------------------- |
| 1   | Theme           | **Dark default + light toggle**                                     |
| 2   | Pipeline        | **Full scroll-scrub**                                               |
| 3   | Hero animation  | **Typewriter** `align → reqs → design → dev`                        |
| 4   | Umami events    | **Ship v1**                                                         |
| 5   | Font stack      | **Quicksand** (core-ui `_fonts.css`) + **JetBrains Mono** (app)     |
| 6   | Featured teaser | **Confirmed** — strip `setup` / `align` / `reqs` / `dev` below hero |

## Open Questions

_(none — ready for `/dev`)_

## Next Steps

→ **`/dev`** — scaffold `apps/landing/` per ADR-0002 + Command surface design spec.
