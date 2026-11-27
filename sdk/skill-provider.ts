/** Dependency-free server-side TypeScript client. Requires Node 24+ fetch. */
export type SkillFile = { path: string; rawUrl: string; content?: string }
export type ArtifactKind =
  | 'context' | 'requirements' | 'decision' | 'review-findings' | 'evidence'
  | 'ui-spec' | 'delivery-plan' | 'test-report' | 'release-readiness'
  | 'tracker-snapshot' | 'document' | 'defect' | 'work-item'
  | 'change-receipt' | 'test-plan' | 'message'

export type ContextRequirement = {
  key: string
  importance: 'required' | 'recommended' | 'optional'
  description: string
}
export type KnowledgeHint = { intent: 'incident' | 'design' | 'toolchain'; when: string }
export type MemoryHint = { topic: string; when: string }
export type MemoryHints = { recall?: readonly MemoryHint[]; capture?: readonly MemoryHint[] }
export type SkillContract = {
  accepts: readonly ArtifactKind[]
  produces: readonly ArtifactKind[]
  readyWhen: string
  context: readonly ContextRequirement[]
  knowledge?: readonly KnowledgeHint[]
  /** Semantic hints only; never memory storage, permission or a tool-call requirement. */
  memory?: MemoryHints
}
export type SkillPackSummary = {
  name: string
  skillRawUrl: string
  description: string
  useWhen: readonly string[]
  avoidWhen: string
  starterPaths: string[]
  relatedSkills: readonly string[]
  contract: SkillContract
}
export type CompositionCatalog = {
  protocol: { path: string }
  recipes: readonly {
    id: string; title: string; description: string; hostPack: string; path: string
    skills: readonly string[]
  }[]
}
export type SkillCatalog = {
  schemaVersion: 1
  version: string
  revision: string
  packs: SkillPackSummary[]
  composition?: CompositionCatalog
}
export type SkillBundle = {
  schemaVersion: 1
  namespace: 'ai-kit'
  name: string
  version: string
  revision: string
  entry: string
  starterPaths: string[]
  contract: SkillContract
  files: SkillFile[]
}
export type SkillSelection = { version?: string } & (
  { strategy?: 'starter' | 'full' | 'manifest'; paths?: never } |
  { paths: string[]; strategy?: never }
)
export type DomainExtension = {
  name: string
  extends: `ai-kit/${string}@${string}`
  instructions: string
  /** Additive semantic needs only, not resolved business data. */
  context?: readonly ContextRequirement[]
}
export type SkillProviderOptions = {
  endpoint: string
  version?: string
  fetch?: typeof fetch
  maxEntries?: number
  latestTtlMs?: number
  timeoutMs?: number
}

const validVersion = /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(?:-[a-zA-Z0-9.-]+)?$/
const validName = /^[a-z][a-z0-9-]{0,63}$/
const validSha = /^[a-f0-9]{40}$/
const validArtifact = new Set<string>([
  'context', 'requirements', 'decision', 'review-findings', 'evidence', 'ui-spec',
  'delivery-plan', 'test-report', 'release-readiness', 'tracker-snapshot',
  'document', 'defect', 'work-item', 'change-receipt', 'test-plan', 'message',
])
const nonempty = (value: unknown): value is string => typeof value === 'string' && !!value.trim()
const record = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
const strings = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(nonempty)
const unique = (items: readonly string[]) => new Set(items).size === items.length
const pathAllowed = (value: unknown): value is string =>
  nonempty(value) && value.length <= 512 && !value.includes('\\') &&
  !value.startsWith('/') && value.split('/').every(part => !!part && part !== '.' && part !== '..')
const validPaths = (value: unknown): value is string[] =>
  strings(value) && value.every(pathAllowed) && unique(value)
const rawUrl = (revision: string, path: string) =>
  'https://raw.githubusercontent.com/polyms/ai-kit/' + revision + '/' + path
const validContext = (value: unknown): value is ContextRequirement =>
  record(value) && typeof value.key === 'string' && validName.test(value.key) &&
  ['required', 'recommended', 'optional'].includes(String(value.importance)) &&
  nonempty(value.description)
const validHint = (value: unknown): value is MemoryHint =>
  record(value) && typeof value.topic === 'string' && validName.test(value.topic) &&
  nonempty(value.when)
const validContract = (value: unknown): value is SkillContract => {
  if (!record(value) || !strings(value.accepts) || !strings(value.produces) ||
    !value.accepts.length || !value.produces.length ||
    ![...value.accepts, ...value.produces].every(x => validArtifact.has(x)) ||
    !nonempty(value.readyWhen) || !Array.isArray(value.context) ||
    !value.context.length || !value.context.every(validContext) ||
    !unique(value.context.map(x => x.key))) return false
  if (value.knowledge !== undefined && (!Array.isArray(value.knowledge) ||
    !value.knowledge.every(x => record(x) &&
      ['incident', 'design', 'toolchain'].includes(String(x.intent)) && nonempty(x.when)))) return false
  if (value.memory !== undefined) {
    if (!record(value.memory)) return false
    for (const kind of ['recall', 'capture'] as const) {
      const hints = value.memory[kind]
      if (hints !== undefined && (!Array.isArray(hints) || !hints.every(validHint) ||
        !unique(hints.map((x: MemoryHint) => x.topic)))) return false
    }
  }
  return true
}
const validPack = (value: unknown): value is SkillPackSummary =>
  record(value) && typeof value.name === 'string' && validName.test(value.name) &&
  nonempty(value.description) && strings(value.useWhen) && value.useWhen.length > 0 &&
  nonempty(value.avoidWhen) && validPaths(value.starterPaths) && value.starterPaths.length > 0 &&
  strings(value.relatedSkills) && value.relatedSkills.every(x => validName.test(x)) &&
  validContract(value.contract) &&
  value.skillRawUrl === rawUrl(String(value.revision ?? ''), 'skills/' + value.name + '/SKILL.md') // validated with catalog revision below

function parseCatalog(data: unknown): SkillCatalog {
  if (!record(data) || data.schemaVersion !== 1 ||
    typeof data.version !== 'string' || !validVersion.test(data.version) ||
    typeof data.revision !== 'string' || !validSha.test(data.revision) ||
    !Array.isArray(data.packs) || data.packs.length === 0) throw new Error('Invalid skill catalog')
  const revision = data.revision
  const packs: unknown[] = data.packs
  if (!packs.every(pack => record(pack) && validPack({ ...pack, revision }))) {
    throw new Error('Invalid skill catalog')
  }
  const named = packs as SkillPackSummary[]
  if (!unique(named.map(pack => pack.name)) ||
    named.some(pack => pack.starterPaths[0] !== 'skills/' + pack.name + '/SKILL.md' ||
      pack.relatedSkills.some(name => !named.some(other => other.name === name)))) {
    throw new Error('Invalid skill catalog')
  }
  if (data.composition !== undefined) {
    const c = data.composition
    if (!record(c) || !record(c.protocol) || !pathAllowed(c.protocol.path) ||
      !Array.isArray(c.recipes) ||
      !c.recipes.every(recipe => record(recipe) && typeof recipe.id === 'string' &&
        validName.test(recipe.id) && nonempty(recipe.title) && nonempty(recipe.description) &&
        typeof recipe.hostPack === 'string' && named.some(pack => pack.name === recipe.hostPack) &&
        pathAllowed(recipe.path) && strings(recipe.skills) && recipe.skills.length > 0 &&
        recipe.skills.every((name: string) => named.some(pack => pack.name === name)))) {
      throw new Error('Invalid skill catalog')
    }
  }
  return data as unknown as SkillCatalog
}
function parseBundle(data: unknown, name: string, version: string): SkillBundle {
  if (!record(data) || data.schemaVersion !== 1 || data.namespace !== 'ai-kit' ||
    data.name !== name || data.version !== version ||
    typeof data.revision !== 'string' || !validSha.test(data.revision) ||
    data.entry !== 'skills/' + name + '/SKILL.md' ||
    !validPaths(data.starterPaths) || data.starterPaths.length === 0 ||
    data.starterPaths[0] !== data.entry || !validContract(data.contract) ||
    !Array.isArray(data.files) || data.files.length === 0) {
    throw new Error('Invalid skill bundle identity or structure')
  }
  const revision = data.revision
  const files: unknown[] = data.files
  if (!files.every(file => record(file) && pathAllowed(file.path) &&
      file.rawUrl === rawUrl(revision, file.path) &&
      (file.content === undefined || nonempty(file.content)))) {
    throw new Error('Invalid skill bundle identity or structure')
  }
  const named = files as SkillFile[]
  if (!unique(named.map(file => file.path)) ||
    !data.starterPaths.every(path => named.some(file => file.path === path))) {
    throw new Error('Invalid skill bundle identity or structure')
  }
  return data as unknown as SkillBundle
}
/** Compare complete JSON wire metadata; ignore object key order, not array order. */
function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return '[' + value.map(canonicalJson).join(',') + ']'
  if (record(value)) {
    return '{' + Object.keys(value).sort()
      .map(key => JSON.stringify(key) + ':' + canonicalJson(value[key])).join(',') + '}'
  }
  return JSON.stringify(value) ?? 'null'
}
function sameCatalog(a: SkillCatalog, b: SkillCatalog): boolean {
  return canonicalJson(a) === canonicalJson(b)
}

function sameManifest(a: SkillBundle, b: SkillBundle) {
  return a.revision === b.revision && a.entry === b.entry &&
    JSON.stringify(a.contract) === JSON.stringify(b.contract) &&
    JSON.stringify(a.starterPaths) === JSON.stringify(b.starterPaths) &&
    JSON.stringify(a.files.map(({ path, rawUrl: url }) => [path, url])) ===
      JSON.stringify(b.files.map(({ path, rawUrl: url }) => [path, url]))
}
export function createSkillProvider(options: SkillProviderOptions) {
  const endpoint = new URL(options.endpoint)
  if ((endpoint.protocol !== 'https:' &&
      !(endpoint.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(endpoint.hostname))) ||
      endpoint.username || endpoint.password || endpoint.pathname !== '/' ||
      endpoint.search || endpoint.hash) throw new Error('Invalid skill provider endpoint')
  const limit = options.maxEntries ?? 32
  const ttl = options.latestTtlMs ?? 30 * 60_000
  const timeout = options.timeoutMs ?? 5000
  if (!Number.isInteger(limit) || limit < 1 || limit > 256 || !Number.isFinite(ttl) || ttl < 0 ||
      !Number.isFinite(timeout) || timeout < 1) throw new Error('Invalid cache or timeout options')
  const cache = new Map<string, SkillBundle>()
  const catalogs = new Map<string, { data: SkillCatalog; expires: number }>()
  const pending = new Map<string, Promise<unknown>>()
  let generation = 0
  function dedup<T>(key: string, load: () => Promise<T>): Promise<T> {
    const existing = pending.get(key)
    if (existing) return existing as Promise<T>
    const task = load().finally(() => { if (pending.get(key) === task) pending.delete(key) })
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
    let data: unknown
    try { data = await response.json() } catch { throw new Error('Invalid skill provider JSON') }
    if (!record(data)) throw new Error('Invalid skill provider response')
    if (data.schemaVersion !== 1) throw new Error('Unsupported skill provider schema')
    return data as T
  }
  async function list(version = options.version ?? 'latest'): Promise<SkillCatalog> {
    if (version !== 'latest' && !validVersion.test(version)) throw new Error('Invalid version')
    const startedGeneration = generation
    const hit = catalogs.get(version)
    if (hit && hit.expires > Date.now()) return structuredClone(hit.data)
    const catalog = await dedup('catalog:' + version, async () => {
      const path = version === 'latest' ? '/skill-bundles/latest.json' : '/skill-bundles/' + version + '/catalog.json'
      const data = parseCatalog(await request<unknown>(path))
      if (version !== 'latest' && data.version !== version) throw new Error('Invalid catalog version')
      // The mutable latest alias and the immutable pinned URL must describe the
      // same complete catalog for a given version. Equal revision/count alone is
      // insufficient: a stale proxy can return a different contract or recipe.
      const pinned = catalogs.get(data.version)?.data
      const latest = catalogs.get('latest')?.data
      const peers = version === 'latest' ? [pinned] :
        [pinned, latest?.version === data.version ? latest : undefined]
      if (peers.some(peer => peer && !sameCatalog(peer, data))) {
        throw new Error('Immutable release catalog metadata changed')
      }
      if (startedGeneration === generation) {
        remember(catalogs, version, { data, expires: version === 'latest' ? Date.now() + ttl : Infinity })
      }
      return data
    })
    return structuredClone(catalog)
  }
  async function getSkill(name: string, selection: SkillSelection = {}): Promise<SkillBundle> {
    if (!validName.test(name)) throw new Error('Invalid skill name')
    const requested = selection.version ?? options.version ?? 'latest'
    if (requested !== 'latest' && !validVersion.test(requested)) throw new Error('Invalid version')
    const resolvedCatalog = requested === 'latest' ? await list('latest') : null
    const version = resolvedCatalog?.version ?? requested
    const strategy = selection.strategy ?? 'starter'
    if (!['starter', 'full', 'manifest'].includes(strategy) ||
      (selection.paths !== undefined && (!validPaths(selection.paths) || selection.paths.length > 100)) ||
      (selection.paths !== undefined && selection.strategy !== undefined)) throw new Error('Invalid skill path or strategy')
    const paths = selection.paths === undefined ? undefined : [...selection.paths].sort()
    const key = version + '/' + name
    const startedGeneration = generation
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
      if (resolvedCatalog && hit.revision !== resolvedCatalog.revision) throw new Error('Immutable release changed')
      validatePaths(hit)
      if (wanted(hit).every(path => hit.files.some(f => f.path === path && f.content?.trim()))) {
        remember(cache, key, hit)
        return project(hit)
      }
    }
    const missing = hit ? wanted(hit).filter(path => !hit.files.some(f => f.path === path && f.content?.trim())) : paths
    const requestKey = key + ':' + (missing === undefined ? strategy : JSON.stringify(missing))
    const bundle = await dedup(requestKey, async () => {
      const data = parseBundle(missing === undefined
        ? await request<unknown>('/skill-bundles/' + key + '/' + strategy + '.json')
        : await request<unknown>('/api/skills', { name, version, paths: missing }), name, version)
      if (resolvedCatalog && data.revision !== resolvedCatalog.revision) throw new Error('Immutable release changed')
      const pinnedCatalog = catalogs.get(version)?.data
      if (pinnedCatalog && pinnedCatalog.revision !== data.revision) throw new Error('Immutable release changed')
      const expectedPack = resolvedCatalog?.packs.find(pack => pack.name === name) ??
        pinnedCatalog?.packs.find(pack => pack.name === name)
      if (expectedPack &&
        (JSON.stringify(data.contract) !== JSON.stringify(expectedPack.contract) ||
         JSON.stringify(data.starterPaths) !== JSON.stringify(expectedPack.starterPaths))) {
        throw new Error('Catalog and bundle metadata mismatch')
      }
      validatePaths(data)
      const expected = missing ?? wanted(data)
      if (expected.some(path => !data.files.some(f => f.path === path && f.content?.trim()))) {
        throw new Error('Incomplete skill bundle')
      }
      // A request started before clearCache() may resolve to its caller, but it
      // must not compare against or overwrite the new cache generation.
      const previous = startedGeneration === generation ? cache.get(key) : undefined
      if (previous && !sameManifest(previous, data)) throw new Error('Immutable release changed')
      const merged: SkillBundle = { ...data, files: data.files.map(file => {
        const old = previous?.files.find(item => item.path === file.path)
        if (old?.content && file.content && old.content !== file.content) {
          throw new Error('Immutable release content changed')
        }
        return file.content ? file : old?.content ? old : file
      }) }
      if (startedGeneration === generation) remember(cache, key, merged)
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
    clearCache: () => { generation++; cache.clear(); catalogs.clear(); pending.clear() },
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
  const coreContext = bundle.contract?.context
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
