import type { SeamSection } from '../src/lib/guides/guide.types'
import { PROJECT } from './rb-001-data'

const appRoot = `apps/${PROJECT}`

export const SG001_SEAM_SECTIONS: SeamSection[] = [
  {
    title: 'Routing seams',
    body: `Use TanStack Router file routes under \`${appRoot}/src/routes/\`. Catalog filters (domain, status, search) live in **router search params** — shareable URLs, not Zustand.

Loader functions call \`{feature}.fns.ts\` at the route boundary; page components stay thin. Run \`routeTree.gen.ts\` in CI — do not strip route files via \`.vercelignore\` patterns without root anchor.`,
  },
  {
    title: 'State & stores',
    body: `Zustand owns UI chrome only: theme, locale, command palette. Cross-route filter state belongs in the URL (\`?domain=\`, \`?q=\`).

Avoid duplicating URL state in a store — drift between address bar and store causes subtle bugs on refresh and share links.`,
  },
  {
    title: 'Module boundaries',
    body: `Split by **catalog feature module** under \`${appRoot}/src/lib/<feature>/\` — dot-suffix files: \`runbook.fns.ts\`, \`runbook.service.server.ts\`, \`runbook.repository.server.ts\`.

UI/routes import only \`{feature}.fns.ts\` (+ \`{feature}.types.ts\` for props). Service is the read seam; MCP tools and server functions are transport adapters. No Prisma in components.`,
  },
]

export const SG001 = {
  id: 'SG-001',
  slug: 'vercel-tanstack-start-design-seams',
  title: 'Vercel + TanStack Start + Nx — design seams',
  summary:
    'Greenfield design conventions for TanStack Router + Start in a pnpm Nx monorepo on Vercel — routing, state, module boundaries.',
  audience: 'arch',
  axisTags: ['vercel', 'tanstack-start', 'tanstack-router', 'nitro', 'pnpm', 'nx', 'monorepo', 'zustand'],
  designChecklist: [
    `TanStack Router file routes under ${appRoot}/src/routes/ — typed routeTree`,
    'Catalog/shareable filters in router search params, not Zustand',
    'Zustand for UI chrome only (theme, locale, palette)',
    'Loaders call {feature}.fns.ts at route boundary; thin page components',
    'Catalog feature modules: {feature}.fns.ts → {feature}.service.server.ts → repository',
    'No Prisma client imports in React components',
    'MCP at /mcp imports service in-process — no public REST catalog API',
  ],
  seamSections: SG001_SEAM_SECTIONS,
  relatedRunbookId: 'RB-001',
  status: 'published' as const,
}
