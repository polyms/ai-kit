import { describe, expect, it } from 'vitest'
import { searchStackGuidesFromCatalog } from './guide.catalog-search'
import type { StackGuide } from './guide.types'

const sampleGuide: StackGuide = {
  id: 'SG-001',
  slug: 'vercel-tanstack',
  title: 'Vercel TanStack design seams',
  summary: 'Routing and Zustand conventions for monorepo',
  audience: 'arch',
  axisTags: ['vercel', 'tanstack-router', 'zustand'],
  designChecklist: ['Router search params for filters'],
  seamSections: [{ title: 'Routing seams', body: 'Use TanStack Router file routes' }],
  relatedRunbookId: 'RB-001',
}

describe('searchStackGuidesFromCatalog', () => {
  it('returns all guides when query is empty', () => {
    const results = searchStackGuidesFromCatalog([sampleGuide], {})
    expect(results).toHaveLength(1)
    expect(results[0]?.id).toBe('SG-001')
  })

  it('matches query in seam sections', () => {
    const results = searchStackGuidesFromCatalog([sampleGuide], { q: 'zustand' })
    expect(results.some(r => r.id === 'SG-001')).toBe(true)
  })

  it('filters by axis tags', () => {
    const results = searchStackGuidesFromCatalog([sampleGuide], { axes: ['aws'] })
    expect(results).toHaveLength(0)
  })

  it('respects limit', () => {
    const guides = [sampleGuide, { ...sampleGuide, id: 'SG-002', slug: 'sg-002', title: 'Other' }]
    const results = searchStackGuidesFromCatalog(guides, { limit: 1 })
    expect(results).toHaveLength(1)
  })
})
