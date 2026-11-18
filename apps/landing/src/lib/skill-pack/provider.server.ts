import { getSkillPack, listSkillPacks } from './skill-pack'

/** Explicit reviewed release mapping. Never accept caller-supplied Git refs or URLs. */
export const RELEASES = {
  '0.3.0': 'b94b59a78dd0704d801a7097ddd4ced19ed2d2dc',
} as const
const latest = '0.3.0'
const base = 'https://raw.githubusercontent.com/polyms/ai-kit/'

export async function skillProvider(input: unknown, fetchFile: typeof fetch = fetch): Promise<Response> {
  const fail = (error: string, status: number) => Response.json({ error }, { status })
  if (!input || typeof input !== 'object' || Array.isArray(input)) return fail('INVALID_REQUEST', 400)
  const { name, version = 'latest', paths, strategy } = input as Record<string, unknown>
  if (typeof version !== 'string' || (version !== 'latest' && !Object.hasOwn(RELEASES, version))) {
    return fail('VERSION_NOT_FOUND', 404)
  }
  const resolved = version === 'latest' ? latest : version as keyof typeof RELEASES
  const revision = RELEASES[resolved]
  if (name === undefined) {
    if (paths !== undefined || strategy !== undefined) return fail('INVALID_REQUEST', 400)
    return Response.json({ schemaVersion: 1, version: resolved, revision, packs: listSkillPacks() })
  }
  if (typeof name !== 'string' || name.length > 64) return fail('INVALID_REQUEST', 400)
  const pack = getSkillPack(name)
  const summary = listSkillPacks().find(item => item.name === name)
  if (!pack || !summary) return fail('NOT_FOUND', 404)
  if (strategy !== undefined && strategy !== 'starter' && strategy !== 'full' && strategy !== 'manifest') {
    return fail('INVALID_REQUEST', 400)
  }
  if (paths !== undefined && (strategy !== undefined || !Array.isArray(paths) ||
      paths.length > 100 || paths.some(path => typeof path !== 'string'))) return fail('INVALID_PATHS', 400)
  const all = [...pack.files, ...(pack.name === 'design' ? pack.uiKit : [])]
  const selected = new Set<string>(paths as string[] | undefined ??
    (strategy === 'full' ? all.map(file => file.path) : strategy === 'manifest' ? [] : summary.starterPaths))
  if ([...selected].some(path => !all.some(file => file.path === path))) return fail('INVALID_PATHS', 400)
  try {
    const files = await Promise.all(all.map(async file => {
      const rawUrl = base + revision + '/' + file.path
      if (!selected.has(file.path)) return { path: file.path, rawUrl }
      const result = await fetchFile(rawUrl, { signal: AbortSignal.timeout(10_000), redirect: 'error' })
      if (!result.ok) throw new Error('Fetch failed')
      const content = await result.text()
      if (!content.trim() || content.length > 500_000) throw new Error('Invalid content')
      return { path: file.path, rawUrl, content }
    }))
    return Response.json({
      schemaVersion: 1, namespace: 'ai-kit', name, version: resolved, revision,
      entry: 'skills/' + name + '/SKILL.md', starterPaths: summary.starterPaths,
      contract: summary.contract, files,
    })
  } catch {
    return fail('FETCH_FAILED', 502)
  }
}
