import { createServerFn } from '@tanstack/react-start'
import type {
  KnowledgeArticle,
  KnowledgeChunk,
  KnowledgeIntent,
  KnowledgeSearchResultItem,
} from './knowledge.types'

export type KnowledgeSearch = {
  q: string
  intent?: KnowledgeIntent
}

export const defaultKnowledgeSearch: KnowledgeSearch = {
  q: '',
}

export const searchKnowledgeFn = createServerFn({ method: 'GET' })
  .validator((data: KnowledgeSearch) => data)
  .handler(async ({ data }): Promise<KnowledgeSearchResultItem[]> => {
    const { searchKnowledge } = await import('./knowledge.service.server')
    return searchKnowledge({ q: data.q, intent: data.intent })
  })

export const getKnowledgeArticleFn = createServerFn({ method: 'GET' })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<KnowledgeArticle> => {
    const { getKnowledgeArticle } = await import('./knowledge.service.server')
    const article = await getKnowledgeArticle(data.id)
    if (!article) throw new Error('NOT_FOUND')
    return article
  })

export const getKnowledgeChunkFn = createServerFn({ method: 'GET' })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<{ chunk: KnowledgeChunk; article: KnowledgeArticle }> => {
    const { getKnowledgeChunk } = await import('./knowledge.service.server')
    const found = await getKnowledgeChunk(data.id)
    if (!found) throw new Error('NOT_FOUND')
    return found
  })
