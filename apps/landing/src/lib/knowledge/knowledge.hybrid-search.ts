import type { KnowledgeArticle, KnowledgeSearchResultItem } from './knowledge.types'

const HYBRID_VECTOR_BOOST = 1.5
const HYBRID_VECTOR_MIN_SCORE = 0.28

export type VectorSearchHit = {
  chunkId: string
  articleId: string
  similarity: number
}

export type ScoredKnowledgeResult = KnowledgeSearchResultItem & { score: number }

/** Merge keyword catalog scores with pgvector cosine similarity on chunks. */
export function mergeHybridSearchResults(
  keywordScored: ScoredKnowledgeResult[],
  vectorHits: VectorSearchHit[],
  articles: KnowledgeArticle[],
  limit: number
): KnowledgeSearchResultItem[] {
  const articleById = new Map(articles.map(article => [article.id, article]))
  const merged = new Map<string, ScoredKnowledgeResult>()

  for (const item of keywordScored) {
    merged.set(item.id, { ...item })
  }

  for (const hit of vectorHits) {
    const article = articleById.get(hit.articleId)
    const chunk = article?.chunks.find(c => c.id === hit.chunkId)
    if (!chunk) continue

    const boost = hit.similarity * HYBRID_VECTOR_BOOST
    const existing = merged.get(hit.chunkId)

    if (existing) {
      merged.set(hit.chunkId, {
        ...existing,
        score: existing.score + boost,
      })
      continue
    }

    if (hit.similarity < HYBRID_VECTOR_MIN_SCORE) continue

    merged.set(hit.chunkId, {
      type: 'chunk',
      id: chunk.id,
      articleId: hit.articleId,
      slug: chunk.slug,
      title: chunk.title,
      match: `semantic (${hit.similarity.toFixed(2)})`,
      intent: chunk.intent,
      chunkType: chunk.chunkType,
      axisTags: chunk.axisTags,
      score: boost,
    })
  }

  return [...merged.values()]
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, limit)
    .map(({ score: _score, ...item }) => item)
}
