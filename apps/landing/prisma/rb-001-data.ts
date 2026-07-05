import type { KnowledgeArticle, KnowledgeChunk } from '../src/lib/knowledge/knowledge.types'
import { APP_ROOT, DEV_ORIGIN, PROJECT, ROUTE_SEGMENT } from './seed-placeholders'

const appRoot = APP_ROOT

type IncidentSeed = {
  id: string
  slug: string
  title: string
  symptom: string
  cause: string[]
  fix: string[]
  verify: string[]
  triggerPhrases: string[]
  relatedFiles: string[]
  axisTags: string[]
}

function incidentChunk(issue: IncidentSeed, sortOrder: number): KnowledgeChunk {
  return {
    id: issue.id,
    slug: issue.slug,
    intent: 'incident',
    chunkType: 'incident',
    title: issue.title,
    body: issue.symptom,
    axisTags: issue.axisTags,
    symptom: issue.symptom,
    cause: issue.cause,
    fix: issue.fix,
    verify: issue.verify,
    triggerPhrases: issue.triggerPhrases,
    artifactFilename: null,
    artifactType: null,
    checklistItems: [],
    parentChunkId: null,
    partIndex: null,
    sortOrder,
  }
}

const RB001_DATA = {
  id: 'RB-001',
  slug: 'vercel-tanstack-start-monorepo',
  title: 'Vercel + TanStack Start + Nitro (pnpm Nx monorepo)',
  summary:
    'Vercel deploy/build for TanStack Start + Nitro in a pnpm Nx monorepo; GitHub Packages for @polyms/*; vercel build / dist / .output / SSR routing errors.',
  audience: 'devops-agent',
  axisTags: [
    'vercel',
    'tanstack-start',
    'nitro',
    'pnpm',
    'nx',
    'monorepo',
    'github-packages',
    'ssr',
    'build-output-api',
  ],
  relatedFiles: [
    'vercel.json',
    '.vercelignore',
    '.npmrc',
    'scripts/vercel-install.sh',
    `${appRoot}/vite.config.ts`,
    `${appRoot}/project.json`,
    `${appRoot}/DEPLOY.md`,
  ],
  stackProfileMarkdown: `### Outputs (two modes)

| Command | VERCEL | Output path | Purpose |
| --- | --- | --- | --- |
| pnpm build (local) | unset | ${appRoot}/.output/ | Local preview (pnpm preview) |
| vercel build / Vercel CI | 1 | repo root .vercel/output/ | Build Output API v3 for deploy |

Nitro **vercel** preset must be active when VERCEL=1. In a monorepo with Vercel root = repo root, Nitro output.dir must point to **../../.vercel/output** from ${appRoot}/.

### Build Output API layout (expected)

\`\`\`text
.vercel/output/
├── config.json          # routes include "dest": "/__server"
├── static/
│   └── assets/          # NOT static/static/
└── functions/
    └── __server.func/   # SSR handler — NOT under static/
\`\`\`

### config.json (minimal SSR check)

Must contain a catch-all route to the server function:

\`\`\`json
{ "src": "/(.*)", "dest": "/__server" }
\`\`\`

### Repo files (monorepo app)

| File | Role |
| --- | --- |
| vercel.json | framework: tanstack-start, custom install/build commands, **no** outputDirectory |
| scripts/vercel-install.sh | GitHub Packages auth before pnpm install |
| .vercelignore | Shrink upload; **root-anchored** patterns only |
| .npmrc | Scope registry only — **no** committed auth token |
| ${appRoot}/vite.config.ts | nitro preset vercel + monorepo output.dir when VERCEL=1 |`,
  greenfieldChecklist: [
    'Vercel Root Directory = repo root (or adjust Nitro output.dir relative to app package)',
    'vercel.json: framework: "tanstack-start", omit outputDirectory',
    `buildCommand runs nx build ${PROJECT} --skip-nx-cache (or separate cache key for Vercel builds)`,
    'installCommand sets GitHub Packages auth without mutating committed .npmrc',
    'Vercel env: GITHUB_TOKEN (PAT, read:packages) on Production + Preview',
    'Vercel env: DATABASE_URL (Postgres) when app reads CMS content at runtime',
    '.npmrc: @polyms:registry + registry.npmjs.org — no token in git',
    '.vercelignore: root-anchored patterns only (/docs/, /agents/) — bare segment/ matches nested app paths too',
    `${appRoot}/vite.config.ts: Nitro vercel preset + monorepo output.dir when VERCEL=1`,
    'Commit generated routeTree.gen.ts (or ensure route files are not stripped by ignore rules)',
    'Verify: rm -rf .vercel/output && vercel build → success; config.json has /__server',
  ],
  knownIssues: [
    {
      id: 'RB-001-01',
      slug: 'rb-001-01-github-packages-auth',
      title: 'GitHub Packages auth',
      symptom: 'pnpm install fails on Vercel for @polyms/core-ui; 401/404 from npm.pkg.github.com.',
      cause: [
        'Vercel does not expand GITHUB_TOKEN in a committed project .npmrc (pnpm 11+ ignores it for security).',
        'Appending tokens to .npmrc during install pollutes git and duplicates lines on retry.',
      ],
      fix: [
        'Vercel project env: GITHUB_TOKEN = GitHub PAT with read:packages (Production + Preview).',
        'installCommand: bash scripts/vercel-install.sh — exports token, sets user .npmrc auth, then pnpm install --frozen-lockfile.',
        'Committed .npmrc: registry + scope only.',
      ],
      verify: ['bash scripts/vercel-install.sh', '# install completes; no token lines added to ./.npmrc'],
      triggerPhrases: ['pnpm install @polyms', 'GITHUB_TOKEN', '401', '404', 'npm.pkg.github.com'],
      relatedFiles: ['.npmrc', 'scripts/vercel-install.sh', 'vercel.json'],
      axisTags: ['vercel', 'pnpm', 'github-packages', 'monorepo'],
    },
    {
      id: 'RB-001-02',
      slug: 'rb-001-02-nx-cache-vs-vercel-output',
      title: 'Nx cache vs Vercel output',
      symptom:
        'vercel build succeeds once, then fails with No Output Directory named "dist" (or empty/wrong .vercel/output/config.json).',
      cause: [
        `Nx cache hit from a prior local pnpm build where VERCEL was unset. That run restores ${appRoot}/.output/ but not repo root .vercel/output/. Vercel CLI then falls back to looking for dist.`,
      ],
      fix: [
        `vercel.json buildCommand must include --skip-nx-cache on nx build ${PROJECT}, or`,
        'Use a dedicated Nx target for Vercel whose inputs include VERCEL=1, or',
        'Run pnpm exec nx reset before debugging locally.',
      ],
      verify: [
        'rm -rf .vercel/output',
        'vercel build',
        'test -f .vercel/output/config.json',
        "grep -q '__server' .vercel/output/config.json",
      ],
      triggerPhrases: ['No Output Directory named "dist"', 'nx cache', 'vercel build'],
      relatedFiles: ['vercel.json', `${appRoot}/project.json`],
      axisTags: ['vercel', 'nx', 'monorepo', 'build-output-api'],
    },
    {
      id: 'RB-001-03',
      slug: 'rb-001-03-wrong-outputdirectory',
      title: 'Wrong outputDirectory',
      symptom:
        'No Output Directory named ".output" after build, or .vercel/output/static/static/assets/, or config.json routes everything to /404.html without dest: /__server.',
      cause: [
        'Setting outputDirectory in vercel.json makes Vercel CLI treat Nitro Build Output API tree as a static folder and wrap/copy it incorrectly.',
      ],
      fix: [
        'Remove outputDirectory from vercel.json.',
        `Let Nitro emit Build Output API directly to repo root .vercel/output/ (configure output.dir in ${appRoot}/vite.config.ts for monorepo).`,
        'Keep framework: "tanstack-start".',
      ],
      verify: [
        'rm -rf .vercel/output && vercel build',
        'find .vercel/output/static -maxdepth 2 -type d   # expect static/assets, NOT static/static',
        'grep \'"dest": "/__server"\' .vercel/output/config.json',
      ],
      triggerPhrases: [
        'No Output Directory named ".output"',
        'config.json dest __server',
        'nested static/static',
        'outputDirectory',
      ],
      relatedFiles: ['vercel.json', `${appRoot}/vite.config.ts`],
      axisTags: ['vercel', 'tanstack-start', 'nitro', 'ssr', 'build-output-api'],
    },
    {
      id: 'RB-001-04',
      slug: 'rb-001-04-vercelignore-excludes-app-routes',
      title: '.vercelignore excludes app routes',
      symptom: `TypeScript: "/${ROUTE_SEGMENT}/$id" not in route union. Or Vercel build passes but dynamic pages 404 / router tree missing routes.`,
      cause: [
        `Unanchored pattern (e.g. ${ROUTE_SEGMENT}/) in .vercelignore matches any directory with that name, including ${appRoot}/src/routes/${ROUTE_SEGMENT}/. TanStack Router regenerates a reduced route tree without those files.`,
      ],
      fix: [
        'Anchor ignore patterns to repo root only: /docs/, /agents/, /demo/',
        `Not bare ${ROUTE_SEGMENT}/ (matches everywhere under the upload tree).`,
      ],
      verify: [
        `${appRoot}/src/routes/${ROUTE_SEGMENT}/ present in deployment upload.`,
        `${appRoot}/src/routeTree.gen.ts includes /${ROUTE_SEGMENT}/$id.`,
        `pnpm exec tsc --noEmit in ${appRoot}/ passes.`,
      ],
      triggerPhrases: [
        'vercelignore route segment',
        'TypeScript route union missing',
        'routes missing on Vercel',
      ],
      relatedFiles: ['.vercelignore', `${appRoot}/src/routeTree.gen.ts`],
      axisTags: ['vercel', 'tanstack-start', 'monorepo'],
    },
    {
      id: 'RB-001-05',
      slug: 'rb-001-05-database-url-missing',
      title: 'DATABASE_URL missing at runtime',
      symptom:
        'CMS-backed routes (/knowledge/*, /ops/*) return 500 or empty; PrismaClientInitializationError in server logs.',
      cause: [
        'DATABASE_URL not set on Vercel or local .env for the Start app.',
        'Migrations or seed not applied to the Postgres instance.',
      ],
      fix: [
        'Set DATABASE_URL to Postgres URI on Vercel (Production + Preview) and in .env.local for local dev.',
        `From ${appRoot}/: pnpm db:migrate && pnpm db:seed after DATABASE_URL is configured.`,
        'Use Supabase pooled URI for serverless; direct URL for migrations if provider requires it.',
      ],
      verify: [
        `curl -s ${DEV_ORIGIN}/knowledge/RB-001 | head   # HTML, not 500`,
        `pnpm db:seed in ${appRoot}/ completes without error`,
      ],
      triggerPhrases: ['PrismaClientInitializationError', 'DATABASE_URL', 'knowledge 500', 'Invalid prisma'],
      relatedFiles: [`${appRoot}/.env.example`, `${appRoot}/prisma/schema.prisma`, 'vercel.json'],
      axisTags: ['vercel', 'tanstack-start', 'postgres', 'prisma'],
    },
    {
      id: 'RB-001-06',
      slug: 'rb-001-06-static-ci-output-mismatch',
      title: 'Static CI expects dist, Start uses Nitro build output',
      symptom:
        'GitHub Actions (or similar) uploads dist/ artifact but nx/vite build writes Nitro output — workflow green but deployed site 404.',
      cause: [
        'Deploy workflow written for static Vite SPA (dist/) before TanStack Start + Nitro adoption.',
        'Start/Nitro local preview and Vercel Build Output API use Nitro build dir or .vercel/output/, not dist/.',
      ],
      fix: [
        'Prefer Vercel with vercel.json for TanStack Start production deploy.',
        'Or update CI artifact path to match Start output (.vercel/output after vercel build, or Nitro preview dir).',
        `Remove stale dist/ upload steps referencing ${appRoot}/dist/.`,
      ],
      verify: [
        `ls ${appRoot}/.output/ after pnpm build   # exists`,
        `test ! -d ${appRoot}/dist || echo "dist/ is legacy — do not deploy"`,
      ],
      triggerPhrases: ['dist empty', 'GitHub Pages 404', 'nitro output vs dist', 'Start deploy workflow'],
      relatedFiles: ['.github/workflows/', 'vercel.json', `${appRoot}/project.json`],
      axisTags: ['tanstack-start', 'nitro', 'ci', 'github-actions'],
    },
    {
      id: 'RB-001-07',
      slug: 'rb-001-07-router-start-version-mismatch',
      title: 'TanStack Router vs Start version mismatch',
      symptom:
        'Build fails: cannot resolve ./ssr/server from @tanstack/react-router, or peer dependency warnings on react-router vs react-start.',
      cause: [
        '@tanstack/react-router version below @tanstack/react-start requirement (≥ 1.168 for SSR export).',
        'Legacy @tanstack/router-plugin still installed alongside Start — conflicting route generation.',
      ],
      fix: [
        `Align @tanstack/react-router with @tanstack/react-start peer range in ${appRoot}/package.json.`,
        'Remove @tanstack/router-plugin when Start is the bundler entry.',
        '@tanstack/react-start replaces router-plugin — entry is src/router.tsx + __root.tsx document shell.',
      ],
      verify: [`pnpm build in ${appRoot}/ succeeds`, 'No duplicate router-plugin in package.json'],
      triggerPhrases: ['ssr/server', 'react-router peer', 'router-plugin conflict', 'Start build fail'],
      relatedFiles: [`${appRoot}/package.json`, `${appRoot}/vite.config.ts`, `${appRoot}/src/router.tsx`],
      axisTags: ['tanstack-start', 'tanstack-router', 'ssr', 'nitro'],
    },
  ],
} as const

/** RB-001 — incident Knowledge article (Vercel + TanStack Start deploy). */
export function buildRB001(): KnowledgeArticle {
  const { knownIssues, stackProfileMarkdown, greenfieldChecklist, ...meta } = RB001_DATA
  return {
    id: meta.id,
    slug: meta.slug,
    title: meta.title,
    summary: meta.summary,
    intent: 'incident',
    axisTags: [...meta.axisTags],
    checklist: [...greenfieldChecklist],
    chunks: [
      {
        id: `${meta.id}-stack-profile`,
        slug: `${meta.slug}-stack-profile`,
        intent: 'incident',
        chunkType: 'prose',
        title: 'Stack profile',
        body: stackProfileMarkdown,
        axisTags: [...meta.axisTags],
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
        sortOrder: 0,
      },
      ...knownIssues.map((issue, index) => incidentChunk(issue, index + 1)),
    ],
  }
}

export { PROJECT } from './seed-placeholders'
