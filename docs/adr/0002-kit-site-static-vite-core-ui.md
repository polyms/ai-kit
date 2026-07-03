# ADR-0002: Kit site — Vite + React + core-ui, static deploy

## Status

Accepted

## Context

ai-kit needs a public-facing landing for end users — skill catalog, sample prompts, bootstrap path — separate from the contributor-oriented README. No web app exists in the repo today. `package.json` already depends on `@polyms/core-ui`; the design pipeline standardizes on that library. Hosting must suit an open-source repo (`polyms/ai-kit` on GitHub).

Alternatives considered:

| Option                 | Pros                                                        | Cons                                                   |
| ---------------------- | ----------------------------------------------------------- | ------------------------------------------------------ |
| Astro static           | Fast, content-focused                                       | Extra stack; core-ui is React — islands add complexity |
| Next.js                | Familiar, SSR                                               | Overkill for marketing/docs; heavier CI and hosting    |
| README/docs only       | Zero build                                                  | Poor browse/copy UX; duplicates effort for prompts     |
| Vite + React + core-ui | Dogfoods design system; dep already present; SPA sufficient | Client-only; SEO needs meta tags, not SSR              |

## Decision

1. **Monorepo:** Nx workspace + pnpm. Kit site app at `apps/landing/` (Nx project). Use Nx targets for build, lint, and deploy orchestration.
2. **Stack:** Vite + React + `@polyms/core-ui` (Tailwind CSS 4) in `apps/landing/`.
3. **Output:** Static build (`vite build` via Nx) — no SSR, no API routes.
4. **Deploy:** GitHub Pages from built `dist/`. Custom domain **`ai-kit.polyms.dev`** at v1 (CNAME + DNS).
5. **Content:** Hybrid — read `name` and `description` from skill frontmatter at build time where practical; **content overlay** (TypeScript in `apps/landing/`) for status, domain tags, sample prompts, and agent hints not in frontmatter today.
6. **Locale:** **VI first** — Vietnamese default UI chrome and copy; English optional via locale toggle. Prompt samples bilingual EN/VI per skill.
7. **MVP scope:** Full pipeline diagram + principal agent cards in v1 (not deferred).
8. **Analytics:** [Umami](https://umami.is/) — privacy-friendly script tag; no cookie banner required for basic pageview events. Site ID / script URL via env at build time. **v1 custom events:** `copy_prompt`, `pipeline_section_view`, `cta_quick_start`, `theme_toggle`, `command_palette_open` — no PII.
9. **Theme:** **Dark default + light toggle** — user can switch; persist preference in `localStorage` (`ai-kit-theme`); respect `prefers-color-scheme` on first visit when no saved preference.
10. **Pipeline interaction:** **Full scroll-scrub** — sticky rail with stage activation tied to scroll position; hover supplements scroll on desktop.
11. **Hero terminal strip:** **Live typing animation** — cycling invoke lines; `prefers-reduced-motion` → static final frame.
12. **Fonts:** **Quicksand** main (via core-ui `_fonts.css` + `--font-sans`); **JetBrains Mono** mono (app adds faces + `--font-mono`).
13. **Router:** [**TanStack Router**](https://tanstack.com/router) (`@tanstack/react-router`) — type-safe routes, search-param validation for catalog filters; static SPA on GitHub Pages (no SSR). Replace `react-router-dom` (not yet wired in app).
14. **Client state:** [**Zustand**](https://zustand.docs.pmnd.rs/) — UI chrome and cross-route UI state; `localStorage` persist middleware for theme + locale. Catalog filters live in **router search params** (shareable URLs), not Zustand. Aligns with `@polyms/core-ui` programmatic overlays (Modal/Offcanvas already use Zustand in consumer apps per `/core-ui` setup).

## Consequences

- `/design` and `/dev` implement against core-ui — the kit site demonstrates the same primitives as product UIs.
- README stays the deep reference for repo structure and contributors; kit site is the richer end-user layer (see alignment handoff).
- Authors must update overlay when adding skills or changing sample prompts until a codegen step exists.
- Nx adds workspace config (`nx.json`, project graph) — acceptable for future apps/packages in ai-kit.
- i18n requires translation files for VI (default) and EN (optional) — content overlay may key strings by locale.
- Umami script must not block LCP; load async/defer. No PII in custom events.
- Reversing to Next.js or Astro later is a rewrite of one app package, not the whole repo — acceptable scope if SEO or routing needs grow.
- TanStack Router adds route-tree codegen optional later; v1 uses explicit `routeTree` (~4 routes).
- Zustand stores stay small and domain-split — avoid a single god store; URL state for catalog filters prevents drift with design spec shareable `?domain=` links.
