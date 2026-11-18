import { describe, expect, it, vi } from 'vitest'
import { skillProvider, RELEASES } from './provider.server'
import { createSkillProvider, extendSkill } from '../../../../../sdk/skill-provider'

describe('versioned snapshot provider', () => {
  it('loads only pinned starter paths', async () => {
    const response = await skillProvider({ name: 'reqs', version: '0.3.0' })
    const data = await response.json()
    expect(response.status).toBe(200)
    expect(data.revision).toBe(RELEASES['0.3.0'])
    expect(data.files.filter((file: {content?: string}) => file.content)).toHaveLength(data.starterPaths.length)
  })
  it('rejects invalid versions and paths', async () => {
    expect((await skillProvider({ name: 'reqs', version: 'main' })).status).toBe(404)
    expect((await skillProvider({ name: 'reqs', paths: ['../../secret'] })).status).toBe(400)
    expect((await skillProvider({ name: '__proto__' })).status).toBe(404)
  })
  it('returns manifest only', async () => {
    const data = await (await skillProvider({ name: 'reqs', strategy: 'manifest' })).json()
    expect(data.files.every((file: {content?: string}) => file.content === undefined)).toBe(true)
  })
  it('deduplicates startup calls, caches content and loads only missing references', async () => {
    const transport = vi.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
      if (init?.body) return skillProvider(JSON.parse(String(init.body)))
      const name = new URL(String(url)).pathname.split('/')[3]
      return skillProvider({ name, version: '0.3.0' })
    })
    const client = createSkillProvider({ endpoint: 'https://example.com', version: '0.3.0', fetch: transport })
    const [bundle] = await Promise.all([client.getSkill('reqs'), client.getSkill('reqs')])
    await client.getSkill('reqs')
    expect(transport).toHaveBeenCalledTimes(1)
    const path = 'skills/reqs/enterprise-prd-template.md'
    await client.getSkill('reqs', { paths: [path] })
    expect(JSON.parse(String(transport.mock.calls[1][1]?.body)).paths).toEqual([path])
    await client.getSkill('reqs', { paths: [path] })
    expect(transport).toHaveBeenCalledTimes(2)
    expect(extendSkill(bundle, {
      name: 'product-reqs', extends: 'ai-kit/reqs@0.3.0', instructions: 'Preserve project IDs.',
    }).base).toBe(bundle)
  })
})
