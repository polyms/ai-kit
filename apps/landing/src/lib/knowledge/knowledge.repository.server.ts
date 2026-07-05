import type { Prisma } from '../../../prisma/schema/client.ts'
import { prisma } from '../db.server'
import type { KnowledgeArticle, KnowledgeChunk } from './knowledge.types'

const publishedArticleInclude = {
  chunks: { orderBy: [{ sortOrder: 'asc' as const }, { id: 'asc' as const }] },
} as const

type KnowledgeArticleRow = Prisma.KnowledgeArticleGetPayload<{
  include: typeof publishedArticleInclude
}>

function mapChunk({
  articleId: _articleId,
  createdAt: _createdAt,
  updatedAt: _updatedAt,
  ...chunk
}: Prisma.KnowledgeChunkModel): KnowledgeChunk {
  return chunk
}

function mapArticle(row: KnowledgeArticleRow): KnowledgeArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    intent: row.intent,
    axisTags: row.axisTags,
    checklist: row.checklist,
    chunks: row.chunks.map(mapChunk),
  }
}

export async function listKnowledgeArticlesFromDb(): Promise<KnowledgeArticle[]> {
  const rows = await prisma.knowledgeArticle.findMany({
    where: { status: 'published' },
    include: publishedArticleInclude,
    orderBy: { id: 'asc' },
  })
  return rows.map(mapArticle)
}

export async function getKnowledgeArticleFromDb(id: string): Promise<KnowledgeArticle | undefined> {
  const row = await prisma.knowledgeArticle.findFirst({
    where: {
      status: 'published',
      OR: [{ id }, { slug: id }],
    },
    include: publishedArticleInclude,
  })
  return row ? mapArticle(row) : undefined
}

export async function getKnowledgeChunkFromDb(
  id: string
): Promise<{ chunk: KnowledgeChunk; article: KnowledgeArticle } | undefined> {
  const chunkRow = await prisma.knowledgeChunk.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: {
      article: { include: publishedArticleInclude },
    },
  })

  if (chunkRow?.article.status !== 'published') {
    return undefined
  }

  return {
    chunk: mapChunk(chunkRow),
    article: mapArticle(chunkRow.article),
  }
}
