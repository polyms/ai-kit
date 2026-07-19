import type {
  KnowledgeArticle,
  KnowledgeChunk,
  KnowledgeSearchResultItem,
  SearchKnowledgeParams,
} from './knowledge.types'

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

function articleToResult(article: KnowledgeArticle, match: string): KnowledgeSearchResultItem {
  return {
    type: 'article',
    id: article.id,
    title: article.title,
    match,
    intent: article.intent,
    axisTags: article.axisTags,
  }
}

function chunkToResult(chunk: KnowledgeChunk, articleId: string, match: string): KnowledgeSearchResultItem {
  return {
    type: 'chunk',
    id: chunk.id,
    articleId,
    slug: chunk.slug,
    title: chunk.title,
    match,
    intent: chunk.intent,
    chunkType: chunk.chunkType,
    axisTags: chunk.axisTags,
  }
}

function stripScores(
  results: Array<KnowledgeSearchResultItem & { score: number }>
): KnowledgeSearchResultItem[] {
  return results.map((result): KnowledgeSearchResultItem => {
    const { score: _score, ...item } = result
    return item
  })
}

export function scoreKnowledgeFromCatalog(
  articles: KnowledgeArticle[],
  params: SearchKnowledgeParams = {}
): Array<KnowledgeSearchResultItem & { score: number }> {
  const { q = '', intent, axes, limit = 20 } = params
  const results: Array<KnowledgeSearchResultItem & { score: number }> = []

  for (const article of articles) {
    if (intent && article.intent !== intent) continue

    const axisScore = axisIntersection(article.axisTags, axes)
    if (axes?.length && axisScore === 0) continue

    if (q) {
      const articleText = [article.title, article.summary, ...article.axisTags].join(' ')
      const articleScore = scoreMatch(articleText, q) * axisScore
      if (articleScore > 0.2) {
        results.push({ ...articleToResult(article, article.title), score: articleScore })
      }

      for (const chunk of article.chunks) {
        const chunkAxisScore = axisIntersection(chunk.axisTags, axes)
        if (axes?.length && chunkAxisScore === 0) continue

        let chunkScore = 0
        let match = chunk.title

        for (const phrase of chunk.triggerPhrases) {
          const phraseScore = scoreMatch(phrase, q)
          if (phraseScore > chunkScore) {
            chunkScore = phraseScore * 2.5
            match = phrase
          }
        }

        const chunkText = [
          chunk.title,
          chunk.body,
          chunk.symptom ?? '',
          ...chunk.cause,
          chunk.artifactFilename ?? '',
          ...chunk.checklistItems,
        ].join(' ')
        const textScore = scoreMatch(chunkText, q)
        if (textScore > chunkScore) {
          chunkScore = textScore
          match = chunk.symptom ?? chunk.title
        }

        const finalScore = chunkScore * Math.max(axisScore, chunkAxisScore)
        if (finalScore > 0.15) {
          results.push({ ...chunkToResult(chunk, article.id, match), score: finalScore + 0.5 })
        }
      }
    } else {
      results.push({ ...articleToResult(article, article.title), score: axisScore })
      for (const chunk of article.chunks) {
        const chunkAxisScore = axisIntersection(chunk.axisTags, axes)
        if (axes?.length && chunkAxisScore === 0) continue
        results.push({
          ...chunkToResult(chunk, article.id, chunk.title),
          score: chunkAxisScore,
        })
      }
    }
  }

  return results.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id)).slice(0, limit)
}

export function searchKnowledgeFromCatalog(
  articles: KnowledgeArticle[],
  params: SearchKnowledgeParams = {}
): KnowledgeSearchResultItem[] {
  return stripScores(scoreKnowledgeFromCatalog(articles, params))
}
