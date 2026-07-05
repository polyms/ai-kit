import { describe, expect, it } from 'vitest'
import { buildKN001 } from '../../../prisma/kn-001-data'
import { buildRB001 } from '../../../prisma/rb-001-data'
import { buildSG001 } from '../../../prisma/sg-001-data'

describe('knowledge seed articles', () => {
  it('builds RB-001 as incident Knowledge article', () => {
    const article = buildRB001()
    expect(article.id).toBe('RB-001')
    expect(article.intent).toBe('incident')
    const issueChunks = article.chunks.filter(c => c.chunkType === 'incident')
    expect(issueChunks.length).toBe(7)
    expect(issueChunks.some(c => c.id === 'RB-001-03')).toBe(true)
    expect(article.chunks[0]?.chunkType).toBe('prose')
    expect(article.chunks[0]?.sortOrder).toBe(0)
  })

  it('builds SG-001 as design Knowledge article', () => {
    const article = buildSG001()
    expect(article.id).toBe('SG-001')
    expect(article.intent).toBe('design')
    expect(article.chunks.filter(c => c.chunkType === 'seam')).toHaveLength(3)
    expect(article.chunks.map(c => c.sortOrder)).toEqual([0, 1, 2])
  })

  it('orders KN-001 with checklist first', () => {
    const article = buildKN001()
    expect(article.chunks[0]?.id).toBe('KN-001-checklist')
    expect(article.chunks[1]?.id).toBe('KN-001-rationale')
  })
})
