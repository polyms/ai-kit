import { RUNBOOKS } from './rb-001-seed'
import type { KnownIssue, Runbook, SearchResultItem, SearchRunbooksParams } from './types'

function normalize(text: string): string {
  return text.toLowerCase().trim()
}

function scoreMatch(haystack: string, query: string): number {
  const h = normalize(haystack)
  const q = normalize(query)
  if (!q) return 0
  if (h.includes(q)) return q.length / Math.max(h.length, 1) + 1
  const tokens = q.split(/\s+/).filter(Boolean)
  let hits = 0
  for (const token of tokens) {
    if (h.includes(token)) hits += 1
  }
  return hits / tokens.length
}

function axisIntersection(tags: string[], axes?: string[]): number {
  if (!axes?.length) return 1
  const tagSet = new Set(tags.map(normalize))
  const matched = axes.filter(axis => tagSet.has(normalize(axis))).length
  return matched / axes.length
}

function issueToResult(issue: KnownIssue, runbookId: string, match: string): SearchResultItem {
  return {
    type: 'issue',
    id: issue.id,
    runbookId,
    title: issue.title,
    match,
    axisTags: issue.axisTags,
  }
}

function runbookToResult(runbook: Runbook, match: string): SearchResultItem {
  return {
    type: 'runbook',
    id: runbook.id,
    title: runbook.title,
    match,
    axisTags: runbook.axisTags,
  }
}

export function listRunbooks(): Runbook[] {
  return RUNBOOKS
}

export function getRunbook(id: string): Runbook | undefined {
  return RUNBOOKS.find(rb => rb.id === id || rb.slug === id)
}

export function getIssue(id: string): { issue: KnownIssue; runbook: Runbook } | undefined {
  for (const runbook of RUNBOOKS) {
    const issue = runbook.knownIssues.find(ki => ki.id === id || ki.slug === id)
    if (issue) return { issue, runbook }
  }
  return undefined
}

export function searchRunbooks(params: SearchRunbooksParams = {}): SearchResultItem[] {
  const { q = '', axes, limit = 20 } = params
  const results: Array<SearchResultItem & { score: number }> = []

  for (const runbook of RUNBOOKS) {
    const axisScore = axisIntersection(runbook.axisTags, axes)
    if (axes?.length && axisScore === 0) continue

    if (q) {
      const runbookText = [runbook.title, runbook.summary, ...runbook.axisTags].join(' ')
      const runbookScore = scoreMatch(runbookText, q) * axisScore
      if (runbookScore > 0.2) {
        results.push({ ...runbookToResult(runbook, runbook.title), score: runbookScore })
      }

      for (const issue of runbook.knownIssues) {
        const issueAxisScore = axisIntersection(issue.axisTags, axes)
        if (axes?.length && issueAxisScore === 0) continue
        const issueText = [issue.title, issue.symptom, ...issue.triggerPhrases, ...issue.cause].join(' ')
        const issueScore = scoreMatch(issueText, q) * Math.max(axisScore, issueAxisScore)
        if (issueScore > 0.15) {
          const match = issue.triggerPhrases.find(t => normalize(t).includes(normalize(q))) ?? issue.symptom
          results.push({
            ...issueToResult(issue, runbook.id, match),
            score: issueScore + 0.5,
          })
        }
      }
    } else {
      results.push({ ...runbookToResult(runbook, runbook.title), score: axisScore })
      for (const issue of runbook.knownIssues) {
        const issueAxisScore = axisIntersection(issue.axisTags, axes)
        if (axes?.length && issueAxisScore === 0) continue
        results.push({
          ...issueToResult(issue, runbook.id, issue.symptom),
          score: issueAxisScore,
        })
      }
    }
  }

  return results
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, limit)
    .map(({ score: _score, ...item }) => item)
}
