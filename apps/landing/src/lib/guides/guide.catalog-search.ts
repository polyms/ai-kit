import type { SearchStackGuidesParams, StackGuide, StackGuideSearchResult } from './guide.types'

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

export function searchStackGuidesFromCatalog(
  guides: StackGuide[],
  params: SearchStackGuidesParams = {}
): StackGuideSearchResult[] {
  const { q = '', axes, limit = 20 } = params
  const results: Array<StackGuideSearchResult & { score: number }> = []

  for (const guide of guides) {
    const axisScore = axisIntersection(guide.axisTags, axes)
    if (axes?.length && axisScore === 0) continue

    if (q) {
      const seamText = guide.seamSections.map(s => `${s.title} ${s.body}`).join(' ')
      const text = [guide.title, guide.summary, ...guide.designChecklist, seamText, ...guide.axisTags].join(
        ' '
      )
      const score = scoreMatch(text, q) * axisScore
      if (score > 0.15) {
        results.push({
          type: 'guide',
          id: guide.id,
          title: guide.title,
          match: guide.summary,
          axisTags: guide.axisTags,
          score,
        })
      }
    } else {
      results.push({
        type: 'guide',
        id: guide.id,
        title: guide.title,
        match: guide.summary,
        axisTags: guide.axisTags,
        score: axisScore,
      })
    }
  }

  return results
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, limit)
    .map(({ score: _score, ...item }) => item)
}
