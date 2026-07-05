import { describe, expect, it } from 'vitest'
import { RB001 } from '../../../prisma/rb-001-data'
import { searchRunbooksFromCatalog } from './runbook.catalog-search'

const catalog = [RB001]

describe('runbook.catalog-search', () => {
  it('returns RB-001-03 first when searching for .output query', () => {
    const results = searchRunbooksFromCatalog(catalog, { q: '.output' })
    expect(results.length).toBeGreaterThan(0)
    expect(results[0]?.type).toBe('issue')
    expect(results[0]?.id).toBe('RB-001-03')
  })

  it('returns RB-001-03 for full outputDirectory symptom phrase', () => {
    const results = searchRunbooksFromCatalog(catalog, {
      q: 'No Output Directory named ".output"',
    })
    expect(results.some(r => r.id === 'RB-001-03')).toBe(true)
  })

  it('filters by axis tags', () => {
    const results = searchRunbooksFromCatalog(catalog, { q: 'vercel build', axes: ['webpack'] })
    expect(results).toHaveLength(0)
  })

  it('indexes RB-001 with seven known issues when query is empty', () => {
    const results = searchRunbooksFromCatalog(catalog, {})
    const issues = results.filter(r => r.type === 'issue')
    expect(issues.some(r => r.id === 'RB-001-03')).toBe(true)
    expect(issues).toHaveLength(7)
  })

  it('includes verify-related issue metadata for RB-001-03', () => {
    const issue = RB001.knownIssues.find(ki => ki.id === 'RB-001-03')
    expect(issue?.verify.length).toBeGreaterThan(0)
    expect(issue?.id).toBe('RB-001-03')
  })
})
