import { describe, expect, it } from 'vitest'
import { mergeHybridSearchResults } from './knowledge.hybrid-search'
import type { KnowledgeArticle } from './knowledge.types'

const article: KnowledgeArticle = {
  id: 'KN-001',
  slug: 'biome-prettier',
  title: 'Biome + Prettier',
  summary: 'Toolchain',
  intent: 'toolchain',
  axisTags: ['biome'],
  checklist: [],
  chunks: [
    {
      id: 'KN-001-biome-json',
      slug: 'kn-001-biome-json',
      intent: 'toolchain',
      chunkType: 'config',
      title: 'biome.json',
      body: '{}',
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
    {
      id: 'KN-001-rationale',
      slug: 'kn-001-rationale',
      intent: 'toolchain',
      chunkType: 'prose',
      title: 'Rationale',
      body: 'split formatters',
      axisTags: ['biome'],
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
  ],
}

describe('knowledge.hybrid-search', () => {
  it('boosts keyword hits when vector similarity matches the same chunk', () => {
    const keywordScored = [
      {
        type: 'chunk' as const,
        id: 'KN-001-biome-json',
        articleId: 'KN-001',
        title: 'biome.json',
        match: 'biome.json',
        intent: 'toolchain',
        chunkType: 'config',
        axisTags: ['biome'],
        score: 1,
      },
    ]

    const merged = mergeHybridSearchResults(
      keywordScored,
      [{ chunkId: 'KN-001-biome-json', articleId: 'KN-001', similarity: 0.8 }],
      [article],
      5
    )

    expect(merged[0]?.id).toBe('KN-001-biome-json')
  })

  it('adds vector-only chunk hits above the similarity threshold', () => {
    const merged = mergeHybridSearchResults(
      [],
      [{ chunkId: 'KN-001-rationale', articleId: 'KN-001', similarity: 0.9 }],
      [article],
      5
    )

    expect(merged).toHaveLength(1)
    expect(merged[0]?.id).toBe('KN-001-rationale')
    expect(merged[0]?.match).toContain('semantic')
  })

  it('drops vector-only hits below the similarity threshold', () => {
    const merged = mergeHybridSearchResults(
      [],
      [{ chunkId: 'KN-001-rationale', articleId: 'KN-001', similarity: 0.1 }],
      [article],
      5
    )

    expect(merged).toHaveLength(0)
  })
})
