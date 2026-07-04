import type { Runbook } from './types'

export const RB001: Runbook = {
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
    'apps/landing/vite.config.ts',
    'apps/landing/project.json',
    'apps/landing/DEPLOY.md',
  ],
  stackProfileMarkdown: `### Outputs (two modes)

| Command | VERCEL | Output path | Purpose |
| --- | --- | --- | --- |
| pnpm build (local) | unset | apps/landing/.output/ | Local preview (pnpm preview) |
| vercel build / Vercel CI | 1 | repo root .vercel/output/ | Build Output API v3 for deploy |

Nitro **vercel** preset must be active when VERCEL=1. In a monorepo with Vercel root = repo root, Nitro output.dir must point to **../../.vercel/output** from apps/landing/.

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

### Repo files (ai-kit)

| File | Role |
| --- | --- |
| vercel.json | framework: tanstack-start, custom install/build commands, **no** outputDirectory |
| scripts/vercel-install.sh | GitHub Packages auth before pnpm install |
| .vercelignore | Shrink upload; **root-anchored** patterns only |
| .npmrc | Scope registry only — **no** committed auth token |
| apps/landing/vite.config.ts | nitro preset vercel + monorepo output.dir when VERCEL=1 |`,
  greenfieldChecklist: [
    'Vercel Root Directory = repo root (or adjust Nitro output.dir relative to app package)',
    'vercel.json: framework: "tanstack-start", omit outputDirectory',
    'buildCommand runs Nx/app build with --skip-nx-cache (or separate cache key for Vercel builds)',
    'installCommand sets GitHub Packages auth without mutating committed .npmrc',
    'Vercel env: GITHUB_TOKEN (PAT, read:packages) on Production + Preview',
    '.npmrc: @polyms:registry + registry.npmjs.org — no token in git',
    '.vercelignore: /skills/, /docs/, /agents/ — leading / so apps/*/src/routes/skills/ is not excluded',
    'vite.config.ts: Nitro vercel preset + monorepo output.dir when VERCEL=1',
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
        'Nx cache hit from a prior local pnpm build where VERCEL was unset. That run restores apps/landing/.output/ but not repo root .vercel/output/. Vercel CLI then falls back to looking for dist.',
      ],
      fix: [
        'vercel.json buildCommand must include --skip-nx-cache on the Nx build, or',
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
      relatedFiles: ['vercel.json', 'apps/landing/project.json'],
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
        'Let Nitro emit Build Output API directly to repo root .vercel/output/ (configure output.dir in vite.config.ts for monorepo).',
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
      relatedFiles: ['vercel.json', 'apps/landing/vite.config.ts'],
      axisTags: ['vercel', 'tanstack-start', 'nitro', 'ssr', 'build-output-api'],
    },
    {
      id: 'RB-001-04',
      slug: 'rb-001-04-vercelignore-excludes-app-routes',
      title: '.vercelignore excludes app routes',
      symptom:
        'TypeScript: "/skills/$slug" not in route union (only /, /quick-start). Or Vercel build passes but skill pages 404 / router tree missing routes.',
      cause: [
        'Pattern skills/ in .vercelignore matches any directory named skills, including apps/landing/src/routes/skills/. TanStack Router regenerates a reduced route tree without those files.',
      ],
      fix: [
        'Anchor ignore patterns to repo root only: /skills/, /agents/, /docs/, /demo/',
        'Not skills/ (matches everywhere).',
      ],
      verify: [
        'apps/landing/src/routes/skills/ present in deployment upload.',
        'apps/landing/src/routeTree.gen.ts includes /skills/$slug.',
        'pnpm exec tsc --noEmit in apps/landing/ passes.',
      ],
      triggerPhrases: ['vercelignore skills', 'TypeScript route /skills/$slug', 'routes missing on Vercel'],
      relatedFiles: ['.vercelignore', 'apps/landing/src/routeTree.gen.ts'],
      axisTags: ['vercel', 'tanstack-start', 'monorepo'],
    },
  ],
}

export const RUNBOOKS: Runbook[] = [RB001]
