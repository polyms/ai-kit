import { prisma } from '../db.server'
import { chunkToEmbedText } from './knowledge.chunk-text'
import { updateChunkEmbedding } from './knowledge.embedding.repository.server'
import { embedTexts, isEmbeddingEnabled } from './knowledge.embedding.server'
import type { KnowledgeChunk } from './knowledge.types'

const EMBED_BATCH_SIZE = 32

type ChunkRow = KnowledgeChunk & { articleId: string }

async function listPublishedChunks(articleId?: string): Promise<ChunkRow[]> {
  const rows = await prisma.knowledgeChunk.findMany({
    where: {
      article: {
        status: 'published',
        ...(articleId ? { id: articleId } : {}),
      },
    },
    orderBy: { id: 'asc' },
  })

  return rows.map(({ articleId, createdAt: _c, updatedAt: _u, ...chunk }) => ({
    ...chunk,
    articleId,
  }))
}

/** Embed and persist vectors for published chunks (seed / publish hook). No-op when provider disabled. */
export async function embedPublishedKnowledgeChunks(articleId?: string): Promise<number> {
  if (!isEmbeddingEnabled()) {
    console.log('Knowledge embeddings skipped — set OPENROUTER_API_KEY to enable hybrid search')
    return 0
  }

  const chunks = await listPublishedChunks(articleId)
  let embedded = 0

  for (let i = 0; i < chunks.length; i += EMBED_BATCH_SIZE) {
    const batch = chunks.slice(i, i + EMBED_BATCH_SIZE)
    const texts = batch.map(chunk => chunkToEmbedText(chunk))
    const vectors = await embedTexts(texts)
    if (!vectors) break

    await Promise.all(
      batch.map(async (chunk, index) => {
        const vector = vectors[index]
        if (!vector) return
        await updateChunkEmbedding(chunk.id, vector)
        embedded += 1
      })
    )
  }

  console.log(`Embedded ${embedded} knowledge chunk(s)${articleId ? ` for ${articleId}` : ''}`)
  return embedded
}
