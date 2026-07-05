/** Shared path placeholders for CMS seed content — substitute per target repo. */

/** Nx app folder name under `apps/` (e.g. `landing`, `web`). */
export const PROJECT = '{project}'

/** App package root — always use instead of a concrete app folder. */
export const APP_ROOT = `apps/${PROJECT}`

/** Local dev server — port varies per app. */
export const DEV_ORIGIN = 'http://localhost:{port}'

/** Tailwind IntelliSense entry path — substitute per app layout. */
export const TAILWIND_CONFIG_FILE = '{your tailwindCSS configFile}'

/** Example dynamic route segment for .vercelignore / route-tree issues. */
export const ROUTE_SEGMENT = '{route}'

export const FORBIDDEN_SEED_LITERALS = [
  'apps/landing',
  'localhost:6300',
  '/runbooks/',
  '/guides/',
  '/quick-start',
  '/skills/$slug',
  'src/routes/skills',
] as const

/** Fail fast when seed prose still embeds repo-specific paths. */
export function assertNoForbiddenSeedLiterals(text: string, label: string): void {
  for (const literal of FORBIDDEN_SEED_LITERALS) {
    if (text.includes(literal)) {
      throw new Error(
        `Seed ${label} contains repo-specific literal "${literal}" — use placeholders from seed-placeholders.ts`
      )
    }
  }
}

export function collectSeedText(
  articles: Array<{
    summary: string
    checklist: string[]
    chunks: Array<{
      body: string
      title: string
      symptom: string | null
      cause: string[]
      fix: string[]
      verify: string[]
      checklistItems: string[]
      chunkType?: string
    }>
  }>
): string {
  return JSON.stringify(articles)
}

/** CMS-authored prose only — skips verbatim config chunk bodies read from the repo at seed time. */
export function collectAuthoringSeedText(articles: Parameters<typeof collectSeedText>[0]): string {
  return JSON.stringify(
    articles.map(article => ({
      ...article,
      chunks: article.chunks.map(chunk => (chunk.chunkType === 'config' ? { ...chunk, body: '' } : chunk)),
    }))
  )
}
