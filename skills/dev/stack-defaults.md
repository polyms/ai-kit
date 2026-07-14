# Stack Defaults — Routing & State

Polyms `/dev` fallbacks when the repo or spec does not already choose a stack. **Match existing
project conventions when present.** Otherwise run MCP `search_knowledge` with `intent: design` and
`q` for the seam topic; use these tables **only when that search returns no match**. Do not hardcode
article ids — catalog content can change.

## Routing

| Situation                                         | Use                                                                                                                                           |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Greenfield client routing (default)               | [**TanStack Router**](https://tanstack.com/router) (`@tanstack/react-router`) — typed routes, `Link` / `useNavigate`, validated search params |
| User needs SSR, server routes, or fullstack React | [**TanStack Start**](https://tanstack.com/start) — includes TanStack Router                                                                   |
| Static SPA (Vite, no server)                      | Vite + TanStack Router                                                                                                                        |
| Existing app already on another router            | Keep repo stack — do not migrate without explicit ask                                                                                         |

**Greenfield anti-pattern:** do not default to `react-router-dom`.

### Seam examples

- `routeTree.tsx` / `createRouter` — route definitions and typed search params
- Route modules under `routes/` — page components wired to the tree
- Loader/search validation at the route boundary when filters affect data fetching

## State

| State kind                                                 | Where                                                                                                   |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| UI chrome, modals, theme, locale, cross-route client state | [**Zustand**](https://zustand.docs.pmnd.rs/) — small domain-split stores (`useUiStore`, `useAuthStore`) |
| Shareable filters, tabs, catalog query                     | **Router search params** — bookmarkable URLs, not Zustand                                               |
| Server/async data                                          | Route loaders (Start/Router) or existing data layer in the repo                                         |

**Anti-patterns:**

- Redux on greenfield when Zustand suffices
- God store — split by domain; keep stores small
- Duplicating URL state in Zustand (drift between store and address bar)

### Zustand conventions

- One store per concern; expose selectors/hooks (`useShallow` when needed)
- `persist` middleware for user preferences (theme, locale) — key namespaced per app
- Test store logic at the hook/selectors seam when behavior is non-trivial

## React

- Functional components + hooks (no class components unless error boundary)
- Type-safe, accessible, performance-focused
- UI primitives from `@polyms/core-ui` when implementing product UI — see `/core-ui` skill

## Quick decision

```
Need SSR or server handlers?  → TanStack Start
Else need client routes?      → TanStack Router (+ Vite for static SPA)
Client global UI state?       → Zustand
Filters in shareable URL?     → Router search params
```
