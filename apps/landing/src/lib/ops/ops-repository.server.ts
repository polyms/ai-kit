import { prisma } from '../db.server'
import type { OpsKnowledgeRow } from './ops.types'

function serializeRow<T extends { updatedAt: Date }>(row: T): Omit<T, 'updatedAt'> & { updatedAt: string } {
  return {
    ...row,
    updatedAt: row.updatedAt.toISOString(),
  }
}

export async function listOpsKnowledge(): Promise<OpsKnowledgeRow[]> {
  const rows = await prisma.knowledgeArticle.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
      intent: true,
      axisTags: true,
      updatedAt: true,
    },
    orderBy: { id: 'asc' },
  })
  return rows.map(serializeRow)
}
