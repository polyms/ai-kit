import { scoreKnowledgeFromCatalog, searchKnowledgeFromCatalog } from './knowledge.catalog-search'
import {
  type ComputeKnowledgeCoverageParams,
  computeKnowledgeCoverage,
  type KnowledgeCoverageResult,
} from './knowledge.coverage'
import { searchChunksByVector } from './knowledge.embedding.repository.server'
import { embedTexts, isEmbeddingEnabled } from './knowledge.embedding.server'
import { mergeHybridSearchResults } from './knowledge.hybrid-search'
import {
  getKnowledgeArticleFromDb,
  getKnowledgeChunkFromDb,
  listKnowledgeArticlesFromDb,
} from './knowledge.repository.server'
import type {
  KnowledgeArticle,
  KnowledgeChunk,
  KnowledgeSearchResultItem,
  SearchKnowledgeParams,
} from './knowledge.types'

export async function listKnowledge(): Promise<KnowledgeArticle[]> {
  return listKnowledgeArticlesFromDb()
}

export async function getKnowledgeArticle(id: string): Promise<KnowledgeArticle | undefined> {
  return getKnowledgeArticleFromDb(id)
}

export async function getKnowledgeChunk(
  id: string
): Promise<{ chunk: KnowledgeChunk; article: KnowledgeArticle } | undefined> {
  return getKnowledgeChunkFromDb(id)
}

export async function getKnowledgeCoverage(
  params: ComputeKnowledgeCoverageParams
): Promise<KnowledgeCoverageResult> {
  const articles = await listKnowledgeArticlesFromDb()
  return computeKnowledgeCoverage(articles, params)
}

export async function searchKnowledge(
  params: SearchKnowledgeParams = {}
): Promise<KnowledgeSearchResultItem[]> {
  const { q = '', limit = 20 } = params
  const articles = await listKnowledgeArticlesFromDb()
  const keywordScored = scoreKnowledgeFromCatalog(articles, { ...params, limit: limit * 2 })

  if (!q || !isEmbeddingEnabled()) {
    return searchKnowledgeFromCatalog(articles, params)
  }

  const queryVectors = await embedTexts([q])
  if (!queryVectors?.[0]) {
    return searchKnowledgeFromCatalog(articles, params)
  }

  const vectorHits = await searchChunksByVector(queryVectors[0], {
    intent: params.intent,
    axes: params.axes,
    limit: limit * 2,
  })

  if (vectorHits.length === 0) {
    return searchKnowledgeFromCatalog(articles, params)
  }

  return mergeHybridSearchResults(keywordScored, vectorHits, articles, limit)
}
