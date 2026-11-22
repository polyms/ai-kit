import snapshot from './release-snapshot.generated.json'

type File = { path: string; rawUrl: string; content: string }
type Bundle = { files: File[]; starterPaths: string[]; name: string; version: string; revision: string }
const releases: Record<string, { catalog: { version: string; revision: string }; bundles: Record<string, Bundle> }> = snapshot.releases
export const RELEASES = Object.fromEntries(Object.entries(releases).map(([version, release]) => [version, release.catalog.revision]))

/** Compatibility API for exact path selection. No runtime upstream requests. */
export async function skillProvider(input: unknown): Promise<Response> {
  const fail = (error: string, status: number) => Response.json({ error }, { status })
  if (!input || typeof input !== 'object' || Array.isArray(input)) return fail('INVALID_REQUEST', 400)
  const { name, version = 'latest', paths, strategy } = input as Record<string, unknown>
  const resolved = version === 'latest' ? snapshot.latest : version
  if (typeof resolved !== 'string' || !Object.hasOwn(releases, resolved)) return fail('VERSION_NOT_FOUND', 404)
  const { catalog, bundles } = releases[resolved]
  if (name === undefined) {
    if (paths !== undefined || strategy !== undefined) return fail('INVALID_REQUEST', 400)
    return Response.json(catalog)
  }
  if (typeof name !== 'string' || name.length > 64) return fail('INVALID_REQUEST', 400)
  if (!Object.hasOwn(bundles, name)) return fail('NOT_FOUND', 404)
  if (strategy !== undefined && strategy !== 'starter' && strategy !== 'full' && strategy !== 'manifest') {
    return fail('INVALID_REQUEST', 400)
  }
  if (paths !== undefined && (strategy !== undefined || !Array.isArray(paths) ||
      paths.length > 100 || paths.some(path => typeof path !== 'string'))) return fail('INVALID_PATHS', 400)
  const bundle = bundles[name]
  const selected = new Set<string>((paths as string[] | undefined) ??
    (strategy === 'full'
      ? bundle.files.filter(file => !file.path.startsWith('.cursor/skills/ui-kit/')).map(file => file.path)
      : strategy === 'manifest' ? [] : bundle.starterPaths))
  if ([...selected].some(path => !bundle.files.some(file => file.path === path))) return fail('INVALID_PATHS', 400)
  return Response.json({
    ...bundle,
    files: bundle.files.map(file => selected.has(file.path) ? file : { path: file.path, rawUrl: file.rawUrl }),
  })
}
