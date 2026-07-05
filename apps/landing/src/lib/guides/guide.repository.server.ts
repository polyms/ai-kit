import type { Prisma, Runbook as PrismaRunbook, StackGuide as PrismaStackGuide } from '@prisma/client'
import { prisma } from '../db.server'
import type { SeamSection, StackGuide } from './guide.types'

type StackGuideWithRunbook = PrismaStackGuide & {
  relatedRunbook: Pick<PrismaRunbook, 'id' | 'slug' | 'title'> | null
}

function parseSeamSections(value: Prisma.JsonValue): SeamSection[] {
  if (!Array.isArray(value)) return []
  return value.flatMap(item => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return []
    const row = item as Record<string, unknown>
    if (typeof row.title !== 'string' || typeof row.body !== 'string') return []
    return [{ title: row.title, body: row.body }]
  })
}

function mapStackGuide(row: StackGuideWithRunbook): StackGuide {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    audience: row.audience,
    axisTags: row.axisTags,
    designChecklist: row.designChecklist,
    seamSections: parseSeamSections(row.seamSections),
    relatedRunbookId: row.relatedRunbookId,
    relatedRunbook: row.relatedRunbook,
  }
}

const publishedGuideInclude = {
  relatedRunbook: { select: { id: true, slug: true, title: true } },
} as const

export async function listStackGuidesFromDb(): Promise<StackGuide[]> {
  const rows = await prisma.stackGuide.findMany({
    where: { status: 'published' },
    include: publishedGuideInclude,
    orderBy: { id: 'asc' },
  })
  return rows.map(mapStackGuide)
}

export async function getStackGuideFromDb(id: string): Promise<StackGuide | undefined> {
  const row = await prisma.stackGuide.findFirst({
    where: {
      status: 'published',
      OR: [{ id }, { slug: id }],
    },
    include: publishedGuideInclude,
  })
  return row ? mapStackGuide(row) : undefined
}

export async function getStackGuideForRunbookFromDb(runbookId: string): Promise<StackGuide | undefined> {
  const row = await prisma.stackGuide.findFirst({
    where: {
      status: 'published',
      relatedRunbookId: runbookId,
    },
    include: publishedGuideInclude,
  })
  return row ? mapStackGuide(row) : undefined
}
