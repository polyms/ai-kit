import { describe, expect, it } from 'vitest'
import { searchKnowledgeFromCatalog } from './knowledge.catalog-search'
import type { KnowledgeArticle } from './knowledge.types'

const incidentArticle: KnowledgeArticle = {
  id: 'RB-001',
  slug: 'vercel-tanstack-start-monorepo',
  title: 'Vercel + TanStack Start + Nitro',
  summary: 'Deploy incidents for TanStack Start on Vercel',
  intent: 'incident',
  axisTags: ['vercel', 'tanstack-start'],
  checklist: [],
  chunks: [
    {
      id: 'RB-001-03',
      slug: 'rb-001-03-wrong-outputdirectory',
      intent: 'incident',
      chunkType: 'incident',
      title: 'Wrong outputDirectory',
      body: 'Removing outputDirectory from vercel.json fixes the Build Output API layout.',
      axisTags: ['vercel', 'nitro'],
      symptom: 'No Output Directory named ".output" after build.',
      cause: ['Setting outputDirectory makes Vercel CLI treat Nitro output as static.'],
      fix: ['Remove outputDirectory from vercel.json.'],
      verify: ['rm -rf .vercel/output && vercel build'],
      triggerPhrases: ['No Output Directory named ".output"', 'outputDirectory'],
      artifactFilename: null,
      artifactType: null,
      checklistItems: [],
      parentChunkId: null,
      partIndex: null,
      sortOrder: 0,
    },
  ],
}

const toolchainArticle: KnowledgeArticle = {
  id: 'KN-001',
  slug: 'biome-prettier-polyms-default',
  title: 'Biome + Prettier Polyms default',
  summary: 'Toolchain recipe for Biome + Prettier dual-tool split',
  intent: 'toolchain',
  axisTags: ['typescript', 'polyms-default', 'biome', 'prettier'],
  checklist: ['Install deps', 'Copy configs'],
  chunks: [
    {
      id: 'KN-001-rationale',
      slug: 'kn-001-rationale',
      intent: 'toolchain',
      chunkType: 'prose',
      title: 'Rationale',
      body: 'Biome handles JS/TS/CSS/HTML/JSON; Prettier handles MD/MDX/YAML.',
      axisTags: ['biome', 'prettier'],
      symptom: null,
      cause: [],
      fix: [],
      verify: [],
      triggerPhrases: [],
      artifactFilename: null,
      artifactType: null,
      checklistItems: [],
      parentChunkId: null,
      partIndex: null,
      sortOrder: 0,
    },
    {
      id: 'KN-001-biome-json',
      slug: 'kn-001-biome-json',
      intent: 'toolchain',
      chunkType: 'config',
      title: 'biome.json',
      body: '{ "formatter": { "enabled": true } }',
      axisTags: ['biome'],
      symptom: null,
      cause: [],
      fix: [],
      verify: [],
      triggerPhrases: [],
      artifactFilename: 'biome.json',
      artifactType: 'config',
      checklistItems: [],
      parentChunkId: null,
      partIndex: null,
      sortOrder: 0,
    },
  ],
}

const catalog = [incidentArticle, toolchainArticle]

describe('knowledge.catalog-search', () => {
  it('returns published chunks and articles scoped by axes when query is empty', () => {
    const results = searchKnowledgeFromCatalog(catalog, {})
    expect(results.some(r => r.id === 'RB-001')).toBe(true)
    expect(results.some(r => r.id === 'KN-001')).toBe(true)
    expect(results.some(r => r.id === 'KN-001-biome-json')).toBe(true)
  })

  it('filters by axis tags', () => {
    const results = searchKnowledgeFromCatalog(catalog, { axes: ['aws'] })
    expect(results).toHaveLength(0)
  })

  it('restricts results to the requested intent', () => {
    const results = searchKnowledgeFromCatalog(catalog, { intent: 'toolchain' })
    expect(results.every(r => r.intent === 'toolchain')).toBe(true)
    expect(results.some(r => r.id === 'RB-001')).toBe(false)
  })

  it('boosts incident triggerPhrases over generic body text for the same query', () => {
    const results = searchKnowledgeFromCatalog(catalog, { q: 'No Output Directory named ".output"' })
    expect(results[0]?.id).toBe('RB-001-03')
  })

  it('matches config chunks by artifact filename content', () => {
    const results = searchKnowledgeFromCatalog(catalog, { q: 'biome prettier' })
    expect(results.some(r => r.id === 'KN-001-biome-json')).toBe(true)
    expect(results.some(r => r.id === 'KN-001-rationale')).toBe(true)
  })

  it('respects limit', () => {
    const results = searchKnowledgeFromCatalog(catalog, { limit: 1 })
    expect(results).toHaveLength(1)
  })
})
