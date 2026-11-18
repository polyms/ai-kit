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
export type DomainExtension = {
  name: string
  extends: `ai-kit/${string}@${string}`
  instructions: string
}

export function createSkillProvider(options: { endpoint: string; fetch?: typeof fetch }) {
  const endpoint = new URL('/api/skills', options.endpoint)
  if (endpoint.protocol !== 'https:' && !(endpoint.protocol === 'http:' && endpoint.hostname === 'localhost')) {
    throw new Error('Skill provider must use HTTPS (localhost excepted)')
  }
  async function request<T>(body: object): Promise<T> {
    const response = await (options.fetch ?? fetch)(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body), signal: AbortSignal.timeout(30_000), redirect: 'error',
    })
    if (!response.ok) throw new Error('Skill provider failed: HTTP ' + response.status)
    const data = await response.json()
    if (data.schemaVersion !== 1) throw new Error('Unsupported skill provider schema')
    return data as T
  }
  return {
    list: (version = 'latest') => request<{ schemaVersion: 1; version: string; revision: string; packs: unknown[] }>({ version }),
    async getSkill(name: string, selection: SkillSelection = {}): Promise<SkillBundle> {
      const result = await request<SkillBundle>({ name, ...selection })
      if (result.namespace !== 'ai-kit' || result.name !== name ||
          (selection.version && selection.version !== 'latest' && result.version !== selection.version) ||
          !/^[a-f0-9]{40}$/.test(result.revision) || !Array.isArray(result.files)) {
        throw new Error('Invalid skill bundle identity')
      }
      return result
    },
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
  return {
    name: extension.name,
    base: bundle,
    domainInstructions: extension.instructions,
    policy: 'Apply core methodology and additive domain rules; do not override safety, core quality gates or user authorization. Report conflicts. No write permission is implied.',
  }
}
