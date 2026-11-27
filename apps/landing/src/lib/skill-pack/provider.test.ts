import { describe, expect, it, vi } from 'vitest'
import { skillProvider, RELEASES } from './provider.server'
import { createSkillProvider, extendSkill } from '../../../../../sdk/skill-provider'
import type { SkillBundle, SkillCatalog, SkillContract } from '../../../../../sdk/skill-provider'

describe('versioned snapshot provider', () => {
  it('loads only pinned starter paths', async () => {
    const response = await skillProvider({ name: 'reqs', version: '0.3.5' })
    const data = await response.json()
    expect(response.status).toBe(200)
    expect(data.revision).toBe(RELEASES['0.3.5'])
    expect(data.files.filter((file: {content?: string}) => file.content)).toHaveLength(data.starterPaths.length)
  })
  it('ships 0.3.5 environment-aware context and QA governance in pinned bundles', async () => {
    const reqs = await (await skillProvider({ name: 'reqs', version: '0.3.5' })).json()
    const protocol = reqs.files.find((file: { path: string }) => file.path === 'docs/agents/context-contract.md')
    expect(protocol?.content).toContain('Feature lifecycle and environment-aware context')
    expect(protocol?.content).toContain('Never substitute Dev evidence for Production')
    const qa = await (await skillProvider({ name: 'qa', version: '0.3.5' })).json()
    const workflow = qa.files.find((file: { path: string }) => file.path === 'skills/qa/SKILL.md')
    expect(workflow?.content).toContain('cannot self-approve')
    expect(protocol?.rawUrl).toBe(`https://raw.githubusercontent.com/polyms/ai-kit/${reqs.revision}/docs/agents/context-contract.md`)
    expect((await skillProvider({ version: '0.3.4' })).status).toBe(404)
  })
  it('retires the experimental skill snapshot', async () => {
    expect((await skillProvider({ version: '0.3.2' })).status).toBe(404)
    expect((await skillProvider({ name: 'plan', version: '0.3.2' })).status).toBe(404)
  })
  it('rejects invalid versions and paths', async () => {
    expect((await skillProvider({ name: 'reqs', version: 'main' })).status).toBe(404)
    expect((await skillProvider({ name: 'reqs', paths: ['../../secret'] })).status).toBe(400)
    expect((await skillProvider({ name: '__proto__' })).status).toBe(404)
  })
  it('resolves latest to only the new pinned release', async () => {
    const latest = await (await skillProvider({ version: 'latest' })).json()
    const pinned = await (await skillProvider({ version: '0.3.5' })).json()
    expect(latest.version).toBe('0.3.5')
    expect(pinned).toEqual(latest)
    expect(latest.composition.recipes).toHaveLength(5)
    expect(latest.composition.protocol.path).toBe('docs/agents/skill-composition.md')
    expect(latest.packs.find((p: { name: string }) => p.name === 'track').useWhen).toContain(
      'Check giúp a ticket quá hạn, đổi assignee; check ticket qua han'
    )
    expect(latest.packs.every((p: { contract: { context?: unknown } }) => Array.isArray(p.contract.context))).toBe(true)
    expect(Object.keys(RELEASES)).toEqual(['0.3.5'])
    expect((await skillProvider({ version: '0.3.4' })).status).toBe(404)
    expect((await skillProvider({ name: 'qa', version: '0.3.4' })).status).toBe(404)
    expect((await skillProvider({ version: '0.3.3' })).status).toBe(404)
    expect((await skillProvider({ name: 'design', version: '0.3.3' })).status).toBe(404)
    expect((await skillProvider({ version: '0.3.0' })).status).toBe(404)
    expect((await skillProvider({ version: '0.3.1' })).status).toBe(404)
    expect((await skillProvider({ name: 'reqs', version: '0.3.1' })).status).toBe(404)
  })
  it('passes new context metadata and guidance through the SDK and exact selection', async () => {
    const transport = vi.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
      if (init?.body) return skillProvider(JSON.parse(String(init.body)))
      const [, , version, name, file] = new URL(String(url)).pathname.split('/')
      if (version === 'latest.json') return skillProvider({ version: 'latest' })
      return skillProvider({ version, name, strategy: file?.replace('.json', '') })
    })
    const client = createSkillProvider({ endpoint: 'https://example.com', fetch: transport })
    const catalog = await client.list()
    expect(catalog.composition?.recipes.some(recipe => recipe.id === 'sprint-planning')).toBe(true)
    const bundle = await client.getSkill('plan')
    expect(bundle.version).toBe('0.3.5')
    expect(bundle.contract).toMatchObject({
      context: expect.arrayContaining([{ key: 'scope', importance: 'required', description: expect.any(String) }]),
    })
    const guidance = 'docs/agents/context-contract.md'
    expect(bundle.starterPaths).toContain(guidance)
    expect(bundle.files.find(file => file.path === guidance)?.content).toContain('# Context contract')
    const selected = await client.getSkill('plan', { paths: ['docs/agents/skill-composition.md'] })
    expect(selected.contract).toEqual(bundle.contract)
    expect(selected.files.filter(file => file.content)).toHaveLength(1)
    await expect(client.getSkill('plan', { version: '0.3.1' })).rejects.toThrow('404')
  })
  it('delivers optional P2 metadata and a lazy reference through the existing SDK', async () => {
    const transport = vi.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
      if (init?.body) return skillProvider(JSON.parse(String(init.body)))
      const [, , version, name, file] = new URL(String(url)).pathname.split('/')
      if (version === 'latest.json') return skillProvider({ version: 'latest' })
      return skillProvider({ version, name, strategy: file?.replace('.json', '') })
    })
    const client = createSkillProvider({ endpoint: 'https://example.com', fetch: transport })
    const catalog = await client.list()
    const pack = (catalog.packs as { name: string; contract: unknown }[]).find(item => item.name === 'plan')
    const base = await client.getSkill('plan')
    expect(base.version).toBe('0.3.5')
    expect(base.contract).toEqual(pack?.contract)
    expect(base.contract).toMatchObject({
      memory: {
        recall: expect.arrayContaining([{ topic: 'actual-effort', when: expect.any(String) }]),
        capture: expect.arrayContaining([{ topic: 'estimation-corrections', when: expect.any(String) }]),
      },
    })
    const path = 'docs/agents/memory-protocol.md'
    expect(base.starterPaths).not.toContain(path)
    expect(base.files.find(file => file.path === path)?.content).toBeUndefined()
    const selected = await client.getSkill('plan', { paths: [path] })
    expect(selected.files.find(file => file.path === path)?.content).toContain('# Memory Protocol')
    expect(selected.files.filter(file => file.content)).toHaveLength(1)
    expect(selected.contract).toEqual(base.contract)
    const calls = transport.mock.calls.length
    await client.getSkill('plan', { paths: [path] })
    expect(transport).toHaveBeenCalledTimes(calls)
    expect(extendSkill(base, {
      name: 'project-plan', extends: 'ai-kit/plan@0.3.5', instructions: 'Apply local planning policy.',
    }).base.contract).toEqual(base.contract)
    await expect(client.getSkill('plan', { version: '0.3.2' })).rejects.toThrow('404')
  })

  it('extends domain context additively without mutating core metadata', async () => {
    const bundle = await (await skillProvider({ name: 'plan', version: '0.3.5' })).json()
    const original = structuredClone(bundle.contract)
    const context = [{ key: 'project-policy', importance: 'required' as const, description: 'Local policy.' }]
    const extension = {
      name: 'project-plan',
      extends: 'ai-kit/plan@0.3.5' as const,
      instructions: 'Use local policy.',
      context,
    }
    const result = extendSkill(bundle, extension)
    expect(result.domainContext).toEqual(context)
    expect(result.domainContext).not.toBe(context)
    expect(result.base.contract).toEqual(original)
    expect(bundle.contract).toEqual(original)
    expect(() => extendSkill(bundle, { ...extension, context: [{ ...context[0], key: 'scope' }] })).toThrow('conflicting')
    expect(() => extendSkill(bundle, { ...extension, context: [...context, ...context] })).toThrow('conflicting')
    expect(() => extendSkill(bundle, { ...extension, context: [{ ...context[0], description: ' ' }] })).toThrow('conflicting')
    expect(() => extendSkill({ ...bundle, contract: {} }, extension)).toThrow('Core context contract unavailable')
  })
  it('delivers optional Polyms UI Kit only upon explicit selection', async () => {
    const starter = await (await skillProvider({ name: 'design', version: '0.3.5' })).json()
    const optional = starter.files.filter((file: { path: string }) => file.path.startsWith('.cursor/skills/ui-kit/'))
    expect(optional.length).toBeGreaterThan(0)
    expect(optional.every((file: { content?: string }) => file.content === undefined)).toBe(true)
    const path = optional[0].path
    const exact = await (await skillProvider({ name: 'design', version: '0.3.5', paths: [path] })).json()
    expect(exact.files.find((file: { path: string }) => file.path === path).content).toContain('@polyms/ui-kit')
  })
  it('returns manifest only', async () => {
    const data = await (await skillProvider({ name: 'reqs', strategy: 'manifest' })).json()
    expect(data.files.every((file: {content?: string}) => file.content === undefined)).toBe(true)
  })
  it('deduplicates startup calls, caches content and loads only missing references', async () => {
    const transport = vi.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
      if (init?.body) return skillProvider(JSON.parse(String(init.body)))
      const name = new URL(String(url)).pathname.split('/')[3]
      return skillProvider({ name, version: '0.3.5' })
    })
    const client = createSkillProvider({ endpoint: 'https://example.com', version: '0.3.5', fetch: transport })
    const [bundle] = await Promise.all([client.getSkill('reqs'), client.getSkill('reqs')])
    await client.getSkill('reqs')
    expect(transport).toHaveBeenCalledTimes(1)
    const path = 'skills/reqs/enterprise-prd-template.md'
    await client.getSkill('reqs', { paths: [path] })
    expect(JSON.parse(String(transport.mock.calls[1][1]?.body)).paths).toEqual([path])
    await client.getSkill('reqs', { paths: [path] })
    expect(transport).toHaveBeenCalledTimes(2)
    expect(extendSkill(bundle, {
      name: 'product-reqs', extends: 'ai-kit/reqs@0.3.5', instructions: 'Preserve project IDs.',
    }).base).toBe(bundle)
  })
  it('does not cache errors and isolates returned bundles', async () => {
    let attempts = 0
    const transport = vi.fn(async () => {
      attempts++
      return attempts === 1 ? new Response('', { status: 503 }) :
        skillProvider({ name: 'reqs', version: '0.3.5' })
    })
    const client = createSkillProvider({ endpoint: 'https://example.com', version: '0.3.5', fetch: transport })
    await expect(client.getSkill('reqs')).rejects.toThrow('503')
    const first = await client.getSkill('reqs')
    first.files[0].content = 'changed by caller'
    const second = await client.getSkill('reqs')
    expect(second.files[0].content).not.toBe('changed by caller')
    expect(transport).toHaveBeenCalledTimes(2)
  })
  it('refreshes latest catalog on demand after 30 minutes', async () => {
    let now = 1000
    const clock = vi.spyOn(Date, 'now').mockImplementation(() => now)
    const transport = vi.fn(async () => skillProvider({ version: 'latest' }))
    try {
      const client = createSkillProvider({ endpoint: 'https://example.com', fetch: transport })
      await client.list()
      now += 30 * 60_000 - 1
      await client.list()
      expect(transport).toHaveBeenCalledTimes(1)
      now += 1
      await client.list()
      expect(transport).toHaveBeenCalledTimes(2)
    } finally {
      clock.mockRestore()
    }
  })
})

describe('SDK wire contract and resilience', () => {
  const version = '0.3.5'
  const endpoint = 'https://example.com'

  it('exposes concrete public contract and catalog types', async () => {
    const catalog: SkillCatalog = await createSkillProvider({
      endpoint, fetch: async () => skillProvider({ version }),
    }).list(version)
    const plan = catalog.packs.find(pack => pack.name === 'plan')
    expect(plan?.contract.context.find(item => item.key === 'scope')?.importance).toBe('required')
    const contract: SkillContract = plan!.contract
    expect(contract.memory?.recall?.find(hint => hint.topic === 'actual-effort')?.when).toBeTruthy()
  })

  it('rejects catalog corruption and never caches invalid responses', async () => {
    const source = await (await skillProvider({ version })).json() as SkillCatalog
    const invalid = [
      null,
      [],
      { ...source, packs: null },
      { ...source, packs: [...source.packs, source.packs[0]] },
      { ...source, packs: [{ ...source.packs[0], skillRawUrl: 'https://other.example/skill.md' }] },
      { ...source, packs: source.packs.map(pack => pack.name === 'plan'
        ? { ...pack, contract: { ...pack.contract, context: 'not-an-array' } } : pack) },
      { ...source, composition: { protocol: { path: '../escape.md' }, recipes: [] } },
    ]
    for (const body of invalid) {
      const client = createSkillProvider({ endpoint, fetch: async () => Response.json(body) })
      await expect(client.list(version)).rejects.toThrow()
    }
    let count = 0
    const client = createSkillProvider({ endpoint, fetch: async () => {
      count++
      return Response.json(count === 1 ? { ...source, packs: [] } : source)
    } })
    await expect(client.list(version)).rejects.toThrow('Invalid skill catalog')
    expect((await client.list(version)).version).toBe(version)
    expect(count).toBe(2)
  })

  it('rejects metadata drift between latest and pinned catalogs despite matching version and revision', async () => {
    const source = await (await skillProvider({ version })).json() as SkillCatalog
    const drift = {
      ...source,
      packs: source.packs.map((pack, index) =>
        index === 0 ? { ...pack, description: pack.description + ' stale' } : pack),
    }
    for (const order of ['latest-first', 'pinned-first']) {
      const transport = vi.fn(async (url: RequestInfo | URL) =>
        Response.json(new URL(String(url)).pathname.endsWith('/latest.json') ? source : drift))
      const client = createSkillProvider({ endpoint, fetch: transport })
      if (order === 'latest-first') {
        await client.list('latest')
        await expect(client.list(version)).rejects.toThrow('Immutable release catalog metadata changed')
      } else {
        await client.list(version)
        await expect(client.list('latest')).rejects.toThrow('Immutable release catalog metadata changed')
      }
    }
  })

  it('does not reject equivalent catalogs just because JSON key order differs', async () => {
    const source = await (await skillProvider({ version })).json() as SkillCatalog
    const reorderKeys = (value: unknown): unknown => Array.isArray(value)
      ? value.map(reorderKeys)
      : value !== null && typeof value === 'object'
        ? Object.fromEntries(Object.entries(value).reverse().map(([key, nested]) => [key, reorderKeys(nested)]))
        : value
    const client = createSkillProvider({
      endpoint,
      fetch: async (url: RequestInfo | URL) => Response.json(
        new URL(String(url)).pathname.endsWith('/latest.json') ? reorderKeys(source) : source),
    })
    const latest = await client.list('latest')
    const pinned = await client.list(version)
    expect(latest.revision).toBe(pinned.revision)
    expect(latest.packs).toHaveLength(pinned.packs.length)
  })

  it('rejects malformed bundles and untrusted reference URLs before returning data', async () => {
    const source = await (await skillProvider({ name: 'plan', version, strategy: 'full' })).json() as SkillBundle
    const invalid = [
      { ...source, name: 'review' },
      { ...source, contract: {} },
      { ...source, starterPaths: ['../secret.md'] },
      { ...source, files: 'not-an-array' },
      { ...source, files: [...source.files, source.files[0]] },
      { ...source, files: source.files.map((file, i) => i === 0
        ? { ...file, rawUrl: 'https://attacker.invalid/private' } : file) },
      { ...source, files: source.files.map((file, i) => i === 0
        ? { ...file, content: 42 } : file) },
    ]
    for (const body of invalid) {
      const client = createSkillProvider({ endpoint, version, fetch: async () => Response.json(body) })
      await expect(client.getSkill('plan')).rejects.toThrow()
    }
    const empty = { ...source, files: source.files.map(({ path, rawUrl }) => ({ path, rawUrl })) }
    await expect(createSkillProvider({ endpoint, version, fetch: async () => Response.json(empty) })
      .getSkill('plan')).rejects.toThrow('Incomplete skill bundle')
  })

  it('validates selections and endpoint configuration without sending a request', async () => {
    for (const url of ['http://example.com', 'https://alice:secret@example.com',
      'https://example.com/path', 'https://example.com/?token=secret']) {
      expect(() => createSkillProvider({ endpoint: url })).toThrow('Invalid skill provider endpoint')
    }
    const fetchFile = vi.fn(async () => new Response('', { status: 503 }))
    const client = createSkillProvider({ endpoint, version, fetch: fetchFile })
    await expect(client.getSkill('plan', { paths: ['../secret.md'] })).rejects.toThrow('Invalid skill path')
    await expect(client.getSkill('plan', { paths: ['a.md', 'a.md'] })).rejects.toThrow('Invalid skill path')
    await expect(client.getSkill('plan', { strategy: 'unknown' as 'starter' })).rejects.toThrow('Invalid skill path')
    expect(fetchFile).not.toHaveBeenCalled()
    expect(() => createSkillProvider({ endpoint, maxEntries: 0 })).toThrow('Invalid cache')
    expect(() => createSkillProvider({ endpoint, timeoutMs: 0 })).toThrow('Invalid cache')
  })

  it('handles HTTP and non-JSON failures without caching them', async () => {
    let calls = 0
    const source = await (await skillProvider({ name: 'plan', version, strategy: 'full' })).json()
    const transport = vi.fn(async () => {
      calls++
      if (calls === 1) return new Response('bad gateway', { status: 502 })
      if (calls === 2) return new Response('{oops', { headers: { 'content-type': 'application/json' } })
      return Response.json(source)
    })
    const client = createSkillProvider({ endpoint, version, fetch: transport })
    await expect(client.getSkill('plan')).rejects.toThrow('HTTP 502')
    await expect(client.getSkill('plan')).rejects.toThrow('Invalid skill provider JSON')
    expect((await client.getSkill('plan')).name).toBe('plan')
    expect(calls).toBe(3)
  })

  it('does not silently mix different manifests for the same immutable release', async () => {
    const source = await (await skillProvider({ name: 'plan', version, strategy: 'full' })).json() as SkillBundle
    const a = 'docs/agents/context-contract.md'
    const b = 'docs/agents/memory-protocol.md'
    let calls = 0
    const transport = vi.fn(async (_url: RequestInfo | URL, init?: RequestInit) => {
      calls++
      const paths: string[] = JSON.parse(String(init?.body)).paths
      const bundle = {
        ...source,
        contract: calls === 2 ? { ...source.contract, readyWhen: 'Tampered readiness' } : source.contract,
        files: source.files.map(file => paths.includes(file.path) ? file :
          { path: file.path, rawUrl: file.rawUrl }),
      }
      return Response.json(bundle)
    })
    const client = createSkillProvider({ endpoint, version, fetch: transport })
    await client.getSkill('plan', { paths: [a] })
    await expect(client.getSkill('plan', { paths: [b] })).rejects.toThrow('Immutable release changed')
  })

  it('merges simultaneously fetched references instead of losing the first completion', async () => {
    const source = await (await skillProvider({ name: 'plan', version, strategy: 'full' })).json() as SkillBundle
    const a = 'docs/agents/context-contract.md'
    const b = 'docs/agents/memory-protocol.md'
    let releaseFirst: (() => void) | undefined
    const waitFirst = new Promise<void>(resolve => { releaseFirst = resolve })
    const transport = vi.fn(async (_url: RequestInfo | URL, init?: RequestInit) => {
      const paths: string[] = JSON.parse(String(init?.body)).paths
      if (paths.includes(a)) await waitFirst
      return Response.json({
        ...source,
        files: source.files.map(file => paths.includes(file.path) ? file :
          { path: file.path, rawUrl: file.rawUrl }),
      })
    })
    const client = createSkillProvider({ endpoint, version, fetch: transport })
    const first = client.getSkill('plan', { paths: [a] })
    const second = client.getSkill('plan', { paths: [b] })
    await second
    releaseFirst!()
    await first
    const both = await client.getSkill('plan', { paths: [a, b] })
    expect(both.files.find(file => file.path === a)?.content).toContain('# Context contract')
    expect(both.files.find(file => file.path === b)?.content).toContain('# Memory Protocol')
    expect(transport).toHaveBeenCalledTimes(2)
  })

  it('rejects conflicting repeated content for the same release and path', async () => {
    const source = await (await skillProvider({ name: 'plan', version, strategy: 'full' })).json() as SkillBundle
    const a = 'docs/agents/context-contract.md'
    const b = 'docs/agents/memory-protocol.md'
    let requests = 0
    const transport = vi.fn(async (_url: RequestInfo | URL, init?: RequestInit) => {
      requests++
      const paths: string[] = JSON.parse(String(init?.body)).paths
      return Response.json({
        ...source,
        files: source.files.map(file =>
          file.path === a && requests === 2 ? { ...file, content: '# Tampered content' } :
            paths.includes(file.path) ? file : { path: file.path, rawUrl: file.rawUrl }),
      })
    })
    const client = createSkillProvider({ endpoint, version, fetch: transport })
    await client.getSkill('plan', { paths: [a] })
    await expect(client.getSkill('plan', { paths: [b] })).rejects.toThrow('Immutable release content changed')
  })
})

// Release candidate smoke: clearing cache must not let an old request overwrite a fresh result.
describe('SDK clearCache in-flight isolation', () => {
  it('discards stale pending cache writes without discarding new results', async () => {
    const version = '0.3.5'
    const source = await (await skillProvider({ name: 'plan', version, strategy: 'full' })).json() as SkillBundle
    const a = 'docs/agents/context-contract.md'
    let finishOld: (() => void) | undefined
    const gate = new Promise<void>(resolve => { finishOld = resolve })
    let calls = 0
    const transport = vi.fn(async () => {
      calls++
      const call = calls
      if (call === 1) await gate
      return Response.json({
        ...source,
        files: source.files.map(file => file.path === a
          ? { ...file, content: call === 1 ? '# Old content' : '# Fresh content' }
          : { path: file.path, rawUrl: file.rawUrl }),
      })
    })
    const client = createSkillProvider({ endpoint: 'https://example.com', version, fetch: transport })
    const pending = client.getSkill('plan', { paths: [a] })
    client.clearCache()
    const fresh = await client.getSkill('plan', { paths: [a] })
    expect(fresh.files.find(file => file.path === a)?.content).toBe('# Fresh content')
    finishOld!()
    await pending
    const again = await client.getSkill('plan', { paths: [a] })
    expect(again.files.find(file => file.path === a)?.content).toBe('# Fresh content')
    expect(calls).toBe(2)
  })
})
