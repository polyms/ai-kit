import type { KnownIssue, Runbook, SearchResultItem, SearchRunbooksParams } from './runbook.types'

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

export function searchRunbooksFromCatalog(
  runbooks: Runbook[],
  params: SearchRunbooksParams = {}
): SearchResultItem[] {
  const { q = '', axes, limit = 20 } = params
  const results: Array<SearchResultItem & { score: number }> = []

  for (const runbook of runbooks) {
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

        let issueScore = 0
        let match = issue.symptom

        for (const phrase of issue.triggerPhrases) {
          const phraseScore = scoreMatch(phrase, q)
          if (phraseScore > issueScore) {
            issueScore = phraseScore * 2.5
            match = phrase
          }
        }

        const issueText = [issue.title, issue.symptom, ...issue.cause].join(' ')
        const textScore = scoreMatch(issueText, q)
        if (textScore > issueScore) {
          issueScore = textScore
          match = issue.symptom
        }

        const finalScore = issueScore * Math.max(axisScore, issueAxisScore)
        if (finalScore > 0.15) {
          results.push({
            ...issueToResult(issue, runbook.id, match),
            score: finalScore + 0.5,
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
