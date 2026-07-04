import { describe, expect, it } from 'vitest'
import { getIssue, getRunbook, searchRunbooks } from './runbook-service'

describe('runbook-service', () => {
  it('returns RB-001-03 first when searching for .output symptom', () => {
    const results = searchRunbooks({ q: 'No Output Directory named ".output"' })
    expect(results.length).toBeGreaterThan(0)
    expect(results[0]?.type).toBe('issue')
    expect(results[0]?.id).toBe('RB-001-03')
  })

  it('filters by axis tags', () => {
    const results = searchRunbooks({ q: 'vercel build', axes: ['webpack'] })
    expect(results).toHaveLength(0)
  })

  it('gets runbook RB-001 with all known issues', () => {
    const runbook = getRunbook('RB-001')
    expect(runbook?.id).toBe('RB-001')
    expect(runbook?.knownIssues).toHaveLength(4)
  })

  it('gets issue RB-001-03 with verify steps', () => {
    const found = getIssue('RB-001-03')
    expect(found?.issue.id).toBe('RB-001-03')
    expect(found?.issue.verify.length).toBeGreaterThan(0)
    expect(found?.runbook.id).toBe('RB-001')
  })
})
