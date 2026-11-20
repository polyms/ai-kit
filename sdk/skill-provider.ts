/** Dependency-free server-side TypeScript client. Requires fetch (Node 22+). */
export type SkillFile = { path: string; rawUrl: string; content?: string }
export type SkillBundle = {
  schemaVersion: 1
  namespace: 'ai-kit'
  name: string
  version: string
  revision: string
  entry: string
  starterPaths: string[]
  contract: unknown
  files: SkillFile[]
}
export type SkillSelection = { version?: string } & (
  { strategy?: 'starter' | 'full' | 'manifest'; paths?: never } |
  { paths: string[]; strategy?: never }
)
export type ContextRequirement = {
  key: string
  importance: 'required' | 'recommended' | 'optional'
  description: string
}

export type DomainExtension = {
  name: string
  extends: `ai-kit/${string}@${string}`
  instructions: string
  /** Additive semantic needs only, not resolved business data. */
  context?: readonly ContextRequirement[]
}

export type CompositionCatalog = {
  protocol: { path: string }
  recipes: readonly {
    id: string; title: string; description: string; hostPack: string; path: string; skills: readonly string[]
  }[]
}
type Catalog = {
  schemaVersion: 1; version: string; revision: string; packs: unknown[]; composition?: CompositionCatalog
}
type ProviderOptions = {
  endpoint: string
  version?: string
  fetch?: typeof fetch
  maxEntries?: number
  latestTtlMs?: number
  timeoutMs?: number
}
const validVersion = /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(?:-[a-zA-Z0-9.-]+)?$/
const validName = /^[a-z][a-z0-9-]{0,63}$/

export function createSkillProvider(options: ProviderOptions) {
  const endpoint = new URL(options.endpoint)
  if ((endpoint.protocol !== 'https:' && !(endpoint.protocol === 'http:' && endpoint.hostname === 'localhost')) ||
      endpoint.username || endpoint.password) throw new Error('Invalid skill provider endpoint')
  const limit = options.maxEntries ?? 32
  const ttl = options.latestTtlMs ?? 30 * 60_000
  const timeout = options.timeoutMs ?? 5000
  if (!Number.isInteger(limit) || limit < 1 || limit > 256 || !Number.isFinite(ttl) || ttl < 0 ||
      !Number.isFinite(timeout) || timeout < 1) throw new Error('Invalid cache or timeout options')
  const cache = new Map<string, SkillBundle>()
  const catalogs = new Map<string, { data: Catalog; expires: number }>()
  const pending = new Map<string, Promise<unknown>>()
  function dedup<T>(key: string, load: () => Promise<T>): Promise<T> {
    const existing = pending.get(key)
    if (existing) return existing as Promise<T>
    const task = load().finally(() => pending.delete(key))
    pending.set(key, task)
    return task
  }
  function remember<T>(map: Map<string, T>, key: string, value: T) {
    map.delete(key)
    map.set(key, value)
    if (map.size > limit) map.delete(map.keys().next().value!)
  }
  async function request<T>(path: string, body?: object): Promise<T> {
    const response = await (options.fetch ?? fetch)(new URL(path, endpoint), {
      ...(body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(timeout), redirect: 'error',
    })
    if (!response.ok) throw new Error('Skill provider failed: HTTP ' + response.status)
    const data = await response.json()
    if (data.schemaVersion !== 1) throw new Error('Unsupported skill provider schema')
    return data as T
  }
  async function list(version = options.version ?? 'latest'): Promise<Catalog> {
    if (version !== 'latest' && !validVersion.test(version)) throw new Error('Invalid version')
    const hit = catalogs.get(version)
    if (hit && hit.expires > Date.now()) return structuredClone(hit.data)
    const catalog = await dedup('catalog:' + version, async () => {
      const path = version === 'latest' ? '/skill-bundles/latest.json' : '/skill-bundles/' + version + '/catalog.json'
      const data = await request<Catalog>(path)
      if (!validVersion.test(data.version) || (version !== 'latest' && data.version !== version) ||
          !/^[a-f0-9]{40}$/.test(data.revision) || !Array.isArray(data.packs)) throw new Error('Invalid catalog')
      remember(catalogs, version, { data, expires: version === 'latest' ? Date.now() + ttl : Infinity })
      return data
    })
    return structuredClone(catalog)
  }
  async function getSkill(name: string, selection: SkillSelection = {}): Promise<SkillBundle> {
    if (!validName.test(name)) throw new Error('Invalid skill name')
    const requested = selection.version ?? options.version ?? 'latest'
    const version = requested === 'latest' ? (await list('latest')).version : requested
    if (!validVersion.test(version)) throw new Error('Invalid version')
    const strategy = selection.strategy ?? 'starter'
    const paths = selection.paths === undefined ? undefined : [...new Set(selection.paths)].sort()
    const key = version + '/' + name
    const wanted = (b: SkillBundle) => paths ?? (strategy === 'full' ? b.files.map(f => f.path) :
      strategy === 'manifest' ? [] : b.starterPaths)
    function validatePaths(b: SkillBundle) {
      if (wanted(b).some(path => !b.files.some(f => f.path === path))) throw new Error('Invalid skill path')
    }
    function project(b: SkillBundle) {
      validatePaths(b)
      const selected = new Set(wanted(b))
      return structuredClone({ ...b, files: b.files.map(f => selected.has(f.path) ? f : { path: f.path, rawUrl: f.rawUrl }) })
    }
    const hit = cache.get(key)
    if (hit) {
      validatePaths(hit)
      if (wanted(hit).every(path => hit.files.some(f => f.path === path && f.content?.trim()))) {
        remember(cache, key, hit)
        return project(hit)
      }
    }
    const missing = hit ? wanted(hit).filter(path => !hit.files.some(f => f.path === path && f.content?.trim())) : paths
    const requestKey = key + ':' + (missing === undefined ? strategy : JSON.stringify(missing))
    const bundle = await dedup(requestKey, async () => {
      const data = missing === undefined
        ? await request<SkillBundle>('/skill-bundles/' + key + '/' + strategy + '.json')
        : await request<SkillBundle>('/api/skills', { name, version, paths: missing })
      if (data.namespace !== 'ai-kit' || data.name !== name || data.version !== version ||
          !/^[a-f0-9]{40}$/.test(data.revision) || !Array.isArray(data.files) || !Array.isArray(data.starterPaths)) {
        throw new Error('Invalid skill bundle identity')
      }
      validatePaths(data)
      const expected = missing ?? wanted(data)
      if (expected.some(path => !data.files.some(f => f.path === path && f.content?.trim()))) {
        throw new Error('Incomplete skill bundle')
      }
      const previous = cache.get(key)
      if (previous && previous.revision !== data.revision) throw new Error('Immutable release changed')
      const merged = { ...data, files: data.files.map(f => f.content ? f :
        previous?.files.find(p => p.path === f.path && p.content) ?? f) }
      remember(cache, key, merged)
      return merged
    })
    return project(bundle)
  }
  return {
    list, getSkill,
    preload: async (names: string[], version = options.version ?? 'latest') => {
      const resolved = version === 'latest' ? (await list('latest')).version : version
      await Promise.all([...new Set(names)].map(name => getSkill(name, { version: resolved })))
    },
    clearCache: () => { cache.clear(); catalogs.clear() },
  }
}

/** Domain extensions are trusted local configuration, never arbitrary remote executable code. */
export function extendSkill(bundle: SkillBundle, extension: DomainExtension) {
  if (extension.extends !== 'ai-kit/' + bundle.name + '@' + bundle.version ||
      !/^[a-z][a-z0-9-]{0,63}$/.test(extension.name) || !extension.instructions.trim()) {
    throw new Error('Invalid domain extension')
  }
  if (!bundle.starterPaths.every(path => bundle.files.some(file => file.path === path && file.content?.trim()))) {
    throw new Error('Load starter content before extending')
  }
  const domainContext = extension.context ?? []
  if (!Array.isArray(domainContext)) throw new Error('Invalid domain context requirements')
  const core = bundle.contract as { context?: unknown } | null | undefined
  const coreContext = core?.context
  if (domainContext.length && !Array.isArray(coreContext)) throw new Error('Core context contract unavailable')
  const keys = new Set(Array.isArray(coreContext) ? coreContext.map(item => item?.key) : [])
  for (const item of domainContext) {
    if (!item || typeof item.key !== 'string' || !validName.test(item.key) || keys.has(item.key) ||
        !['required', 'recommended', 'optional'].includes(item.importance) ||
        typeof item.description !== 'string' || !item.description.trim()) {
      throw new Error('Invalid or conflicting domain context requirement')
    }
    keys.add(item.key)
  }
  return {
    name: extension.name,
    base: bundle,
    domainContext: structuredClone(domainContext),
    domainInstructions: extension.instructions,
    policy: 'Apply core methodology and additive domain rules/context; do not override safety, core requirements, quality gates or user authorization. Resolve private domain context locally. Report conflicts. No write permission is implied.',
  }
}
