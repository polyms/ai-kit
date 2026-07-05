import { getPgPool } from '../db.server'
import type { VectorSearchHit } from './knowledge.hybrid-search'
import type { KnowledgeIntent } from './knowledge.types'

function vectorLiteral(embedding: number[]): string {
  return `[${embedding.join(',')}]`
}

export async function updateChunkEmbedding(chunkId: string, embedding: number[]): Promise<void> {
  const pool = getPgPool()
  await pool.query(
    `UPDATE knowledge_chunks
     SET embedding = $1::vector, "updatedAt" = NOW()
     WHERE id = $2`,
    [vectorLiteral(embedding), chunkId]
  )
}

type VectorSearchParams = {
  intent?: KnowledgeIntent
  axes?: string[]
  limit?: number
}

export async function searchChunksByVector(
  queryEmbedding: number[],
  params: VectorSearchParams = {}
): Promise<VectorSearchHit[]> {
  const { intent, axes, limit = 20 } = params
  const pool = getPgPool()

  const values: unknown[] = [vectorLiteral(queryEmbedding), limit]
  let intentClause = ''
  let axisClause = ''

  if (intent) {
    values.push(intent)
    intentClause = `AND kc.intent = $${values.length}`
  }

  if (axes?.length) {
    values.push(axes)
    axisClause = `AND (kc."axisTags" && $${values.length}::text[] OR ka."axisTags" && $${values.length}::text[])`
  }

  const sql = `
    SELECT
      kc.id AS "chunkId",
      kc."articleId" AS "articleId",
      1 - (kc.embedding <=> $1::vector) AS similarity
    FROM knowledge_chunks kc
    INNER JOIN knowledge_articles ka ON ka.id = kc."articleId"
    WHERE ka.status = 'published'
      AND kc.embedding IS NOT NULL
      ${intentClause}
      ${axisClause}
    ORDER BY kc.embedding <=> $1::vector
    LIMIT $2
  `

  const result = await pool.query<VectorSearchHit>(sql, values)
  return result.rows
}

export async function countEmbeddedChunks(): Promise<number> {
  const pool = getPgPool()
  const result = await pool.query<{ count: string }>(
    'SELECT COUNT(*)::text AS count FROM knowledge_chunks WHERE embedding IS NOT NULL'
  )
  return Number(result.rows[0]?.count ?? 0)
}
