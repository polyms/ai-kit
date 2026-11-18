import { describe, expect, it, vi } from 'vitest'
import { skillProvider, RELEASES } from './provider.server'
import { createSkillProvider, extendSkill } from '../../../../../sdk/skill-provider'

describe('versioned skill provider', () => {
  it('loads only pinned starter paths', async () => {
    const upstream = vi.fn(async () => new Response('# instructions'))
    const response = await skillProvider({ name: 'reqs', version: '0.3.0' }, upstream)
    const data = await response.json()
    expect(response.status).toBe(200)
    expect(data.revision).toBe(RELEASES['0.3.0'])
    expect(upstream).toHaveBeenCalledTimes(data.starterPaths.length)
    expect(data.files.filter((file: {content?: string}) => file.content)).toHaveLength(data.starterPaths.length)
  })
  it('rejects invalid versions and paths before fetch', async () => {
    const upstream = vi.fn()
    expect((await skillProvider({ name: 'reqs', version: 'main' }, upstream)).status).toBe(404)
    expect((await skillProvider({ name: 'reqs', paths: ['../../secret'] }, upstream)).status).toBe(400)
    expect(upstream).not.toHaveBeenCalled()
  })
  it('returns manifest without fetching; fails closed on upstream errors', async () => {
    const upstream = vi.fn(async () => new Response('', { status: 404 }))
    expect((await skillProvider({ name: 'reqs', strategy: 'manifest' }, upstream)).status).toBe(200)
    expect(upstream).not.toHaveBeenCalled()
    expect((await skillProvider({ name: 'reqs' }, upstream)).status).toBe(502)
  })
  it('resolves a local domain extension over pinned core instructions', async () => {
    const client = createSkillProvider({
      endpoint: 'https://example.com',
      fetch: async (_url, init) => skillProvider(JSON.parse(String(init?.body)), async () => new Response('# core')),
    })
    const bundle = await client.getSkill('reqs', { version: '0.3.0' })
    const result = extendSkill(bundle, {
      name: 'product-reqs', extends: 'ai-kit/reqs@0.3.0', instructions: 'Preserve project IDs.',
    })
    expect(result.base).toBe(bundle)
    expect(result.domainInstructions).toBe('Preserve project IDs.')
    expect(() => extendSkill(bundle, { name: 'bad', extends: 'ai-kit/reqs@9.0.0', instructions: 'test' })).toThrow()
  })
})
