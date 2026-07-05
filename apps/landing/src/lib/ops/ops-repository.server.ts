import { prisma } from '../db.server'
import type { OpsGuideRow, OpsRunbookRow } from './ops.types'

function serializeRow<T extends { updatedAt: Date }>(row: T): Omit<T, 'updatedAt'> & { updatedAt: string } {
  return {
    ...row,
    updatedAt: row.updatedAt.toISOString(),
  }
}

export async function listOpsRunbooks(): Promise<OpsRunbookRow[]> {
  const rows = await prisma.runbook.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
      axisTags: true,
      updatedAt: true,
    },
    orderBy: { id: 'asc' },
  })
  return rows.map(serializeRow)
}

export async function listOpsGuides(): Promise<OpsGuideRow[]> {
  const rows = await prisma.stackGuide.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
      axisTags: true,
      updatedAt: true,
    },
    orderBy: { id: 'asc' },
  })
  return rows.map(serializeRow)
}
