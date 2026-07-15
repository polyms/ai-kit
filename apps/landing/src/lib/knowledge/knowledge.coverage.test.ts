import { describe, expect, it } from 'vitest'
import { computeKnowledgeCoverage, KnowledgeCoverageValidationError } from './knowledge.coverage'
import type { KnowledgeArticle } from './knowledge.types'

function article(
  partial: Pick<KnowledgeArticle, 'id' | 'intent' | 'axisTags'> &
    Partial<Pick<KnowledgeArticle, 'slug' | 'title' | 'summary'>>
): KnowledgeArticle {
  return {
    slug: partial.slug ?? partial.id.toLowerCase(),
    title: partial.title ?? partial.id,
    summary: partial.summary ?? '',
    checklist: [],
    chunks: [],
    ...partial,
  }
}

const fixtures: KnowledgeArticle[] = [
  article({
    id: 'RB-001',
    intent: 'incident',
    axisTags: ['vercel', 'tanstack-start', 'nitro', 'ssr'],
  }),
  article({
    id: 'RB-002',
    intent: 'incident',
    axisTags: ['vercel', 'pnpm'],
  }),
  article({
    id: 'SG-001',
    intent: 'design',
    axisTags: ['tanstack-start', 'zustand', 'nx'],
  }),
  article({
    id: 'KN-001',
    intent: 'toolchain',
    axisTags: ['biome', 'prettier', 'polyms-default'],
  }),
]

describe('computeKnowledgeCoverage', () => {
  it('marks an intent covered when axes ⊆ article.axisTags', () => {
    const result = computeKnowledgeCoverage(fixtures, {
      axes: ['vercel', 'tanstack-start', 'nitro'],
    })
    expect(result.axes).toEqual(['vercel', 'tanstack-start', 'nitro'])
    expect(result.intents).toEqual(['incident', 'design', 'toolchain'])
    expect(result.byIntent.incident).toEqual({
      covered: true,
      articleIds: ['RB-001'],
    })
    expect(result.byIntent.design).toEqual({ covered: false, articleIds: [] })
    expect(result.byIntent.toolchain).toEqual({ covered: false, articleIds: [] })
  })

  it('returns multiple matching article ids sorted', () => {
    const extras = [
      ...fixtures,
      article({
        id: 'RB-010',
        intent: 'incident',
        axisTags: ['vercel', 'tanstack-start', 'nitro', 'ci'],
      }),
    ]
    const result = computeKnowledgeCoverage(extras, {
      axes: ['vercel', 'tanstack-start'],
      intents: ['incident'],
    })
    expect(result.byIntent.incident).toEqual({
      covered: true,
      articleIds: ['RB-001', 'RB-010'],
    })
  })

  it('matches axis tags case-insensitively', () => {
    const result = computeKnowledgeCoverage(fixtures, {
      axes: ['Vercel', 'TanStack-Start', 'NITRO'],
      intents: ['incident'],
    })
    expect(result.byIntent.incident).toEqual({
      covered: true,
      articleIds: ['RB-001'],
    })
  })

  it('only evaluates requested intents', () => {
    const result = computeKnowledgeCoverage(fixtures, {
      axes: ['biome', 'prettier'],
      intents: ['toolchain'],
    })
    expect(result.intents).toEqual(['toolchain'])
    expect(result.byIntent).toEqual({
      toolchain: { covered: true, articleIds: ['KN-001'] },
    })
  })

  it('rejects empty axes', () => {
    expect(() => computeKnowledgeCoverage(fixtures, { axes: [] })).toThrow(KnowledgeCoverageValidationError)
    expect(() => computeKnowledgeCoverage(fixtures, { axes: [] })).toThrow(/axes/i)
  })

  it('rejects blank axes after trim', () => {
    for (const axes of [[''], ['  '], ['vercel', '']] as string[][]) {
      expect(() => computeKnowledgeCoverage(fixtures, { axes })).toThrow(KnowledgeCoverageValidationError)
      expect(() => computeKnowledgeCoverage(fixtures, { axes })).toThrow(/axes/i)
    }
  })

  it('rejects empty intents array (omit means all three)', () => {
    expect(() => computeKnowledgeCoverage(fixtures, { axes: ['vercel'], intents: [] })).toThrow(
      KnowledgeCoverageValidationError
    )
    expect(() => computeKnowledgeCoverage(fixtures, { axes: ['vercel'], intents: [] })).toThrow(/intents/i)
  })

  it('rejects missing axes', () => {
    expect(() => computeKnowledgeCoverage(fixtures, { axes: undefined as unknown as string[] })).toThrow(
      KnowledgeCoverageValidationError
    )
  })
})
