import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { buildKN001, defaultRepoRoot } from '../../../prisma/kn-001-data'
import { TAILWIND_CONFIG_FILE } from '../../../prisma/seed-placeholders'
import { searchKnowledgeFromCatalog } from './knowledge.catalog-search'

const repoRoot = defaultRepoRoot()
const KN001 = buildKN001(repoRoot)
const catalog = [KN001]

describe('knowledge.catalog-search — KN-001 smoke test', () => {
  it('returns KN-001 config chunk ids for "biome prettier"', () => {
    const results = searchKnowledgeFromCatalog(catalog, { q: 'biome prettier' })
    const configIds = results.filter(r => r.type === 'chunk' && r.chunkType === 'config').map(r => r.id)
    expect(configIds).toContain('KN-001-biome-json')
    expect(configIds).toContain('KN-001-prettierrc')
  })

  it('never splits config chunks — each is a single chunk with no parentChunkId', () => {
    const configChunks = KN001.chunks.filter(c => c.chunkType === 'config')
    expect(configChunks.length).toBeGreaterThan(0)
    for (const chunk of configChunks) {
      expect(chunk.parentChunkId).toBeNull()
    }
  })

  it('indexes all seven KN-001 chunks when query is empty', () => {
    const results = searchKnowledgeFromCatalog(catalog, {})
    const chunkResults = results.filter(r => r.type === 'chunk')
    expect(chunkResults).toHaveLength(7)
  })

  it('biome.json chunk is sanitized from repo root (placeholder path, no kit bleed)', () => {
    const chunk = KN001.chunks.find(c => c.id === 'KN-001-biome-json')
    const rootBiome = readFileSync(join(repoRoot, 'biome.json'), 'utf8').trimEnd()
    expect(chunk?.body).not.toBe(rootBiome)
    expect(rootBiome).toContain('apps/landing')
    expect(chunk?.body).toContain('apps/{project}')
    expect(chunk?.body).not.toContain('apps/landing')
    expect(chunk?.body).not.toContain('__ORIGIN_POLYMS__')
  })

  it('vscode settings chunk uses placeholder for tailwind config path', () => {
    const chunk = KN001.chunks.find(c => c.id === 'KN-001-vscode-settings')
    const rootSettings = readFileSync(join(repoRoot, '.vscode/settings.json'), 'utf8').trimEnd()
    expect(chunk?.body).not.toBe(rootSettings)
    expect(chunk?.body).toContain(`"tailwindCSS.experimental.configFile": "${TAILWIND_CONFIG_FILE}"`)
    expect(chunk?.body).not.toContain('apps/landing')
  })
})
