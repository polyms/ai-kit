import type { KnowledgeArticle, KnowledgeChunk } from '../src/lib/knowledge/knowledge.types'
import { APP_ROOT } from './seed-placeholders'

const appRoot = APP_ROOT

const SG001_SEAMS = [
  {
    title: 'Routing seams',
    body: `Use TanStack Router file routes under \`${appRoot}/src/routes/\`. Shareable list/filter state lives in **router search params** — not client stores.

Loader functions call \`{feature}.fns.ts\` at the route boundary; page components stay thin. Commit \`routeTree.gen.ts\` in CI — do not strip route files via unanchored \`.vercelignore\` patterns.`,
  },
  {
    title: 'State & stores',
    body: `Zustand owns UI chrome only: theme, locale, overlays. Cross-route filter state belongs in the URL (\`?q=\`, \`?filter=\`).

Avoid duplicating URL state in a store — drift between address bar and store causes subtle bugs on refresh and share links.`,
  },
  {
    title: 'Module boundaries',
    body: `Split by **feature module** under \`${appRoot}/src/lib/<feature>/\` — dot-suffix files: \`{feature}.fns.ts\`, \`{feature}.service.server.ts\`, \`{feature}.repository.server.ts\` (e.g. \`knowledge.fns.ts\`).

UI/routes import only \`{feature}.fns.ts\` (+ \`{feature}.types.ts\` for props). Service is the read seam; MCP tools and server functions are transport adapters. No Prisma in components.`,
  },
] as const

const SG001_DATA = {
  id: 'SG-001',
  slug: 'vercel-tanstack-start-design-seams',
  title: 'Vercel + TanStack Start + Nx — design seams',
  summary:
    'Greenfield design conventions for TanStack Router + Start in a pnpm Nx monorepo on Vercel — routing, state, module boundaries.',
  axisTags: ['vercel', 'tanstack-start', 'tanstack-router', 'nitro', 'pnpm', 'nx', 'monorepo', 'zustand'],
  designChecklist: [
    `TanStack Router file routes under ${appRoot}/src/routes/ — typed routeTree`,
    'Shareable filters in router search params, not Zustand',
    'Zustand for UI chrome only (theme, locale, overlays)',
    'Loaders call {feature}.fns.ts at route boundary; thin page components',
    'Feature modules: {feature}.fns.ts → {feature}.service.server.ts → repository',
    'No Prisma client imports in React components',
    'MCP at /mcp imports service in-process — no public REST catalog API',
  ],
} as const

/** SG-001 — design Knowledge article (TanStack Start seams). */
export function buildSG001(): KnowledgeArticle {
  return {
    id: SG001_DATA.id,
    slug: SG001_DATA.slug,
    title: SG001_DATA.title,
    summary: SG001_DATA.summary,
    intent: 'design',
    axisTags: [...SG001_DATA.axisTags],
    checklist: [...SG001_DATA.designChecklist],
    chunks: SG001_SEAMS.map(
      (section, index): KnowledgeChunk => ({
        id: `${SG001_DATA.id}-seam-${index + 1}`,
        slug: `${SG001_DATA.slug}-seam-${index + 1}`,
        intent: 'design',
        chunkType: 'seam',
        title: section.title,
        body: section.body,
        axisTags: [...SG001_DATA.axisTags],
        symptom: null,
        cause: [],
        fix: [],
        verify: [],
        triggerPhrases: [],
        artifactFilename: null,
        artifactType: null,
        checklistItems: [],
        parentChunkId: null,
        partIndex: null,
        sortOrder: index,
      })
    ),
  }
}
