import type {
  KnowledgeArticle as DbKnowledgeArticle,
  KnowledgeChunk as DbKnowledgeChunk,
} from '../../../prisma/schema/client.ts'

export type KnowledgeIntent = 'incident' | 'design' | 'toolchain'

export type KnowledgeChunkType = 'incident' | 'seam' | 'config' | 'checklist' | 'prose'

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
