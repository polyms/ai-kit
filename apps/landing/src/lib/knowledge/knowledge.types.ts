import type {
  KnowledgeArticle as DbKnowledgeArticle,
  KnowledgeChunk as DbKnowledgeChunk,
} from '../../../prisma/schema/client.ts'

export type KnowledgeIntent = 'incident' | 'design' | 'toolchain'

const KNOWLEDGE_INTENTS = new Set<string>(['incident', 'design', 'toolchain'] satisfies KnowledgeIntent[])

export function parseKnowledgeIntent(value: string | null | undefined): KnowledgeIntent | undefined {
  return value !== null && value !== undefined && KNOWLEDGE_INTENTS.has(value)
    ? (value as KnowledgeIntent)
    : undefined
}

export type KnowledgeChunk = Omit<DbKnowledgeChunk, 'articleId' | 'createdAt' | 'updatedAt'>

export type KnowledgeArticle = Omit<DbKnowledgeArticle, 'status' | 'createdAt' | 'updatedAt'> & {
  chunks: KnowledgeChunk[]
}

export type KnowledgeSearchResultItem =
  | {
      type: 'article'
      id: string
      title: string
      match: string
      intent: string
      axisTags: string[]
    }
  | {
      type: 'chunk'
      id: string
      articleId: string
      slug: string
      title: string
      match: string
      intent: string
      chunkType: string
      axisTags: string[]
    }

export type SearchKnowledgeParams = {
  q?: string
  intent?: KnowledgeIntent
  axes?: string[]
  limit?: number
}
