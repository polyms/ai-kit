import type { KnownIssue as PrismaKnownIssue, Runbook as PrismaRunbook } from '@prisma/client'
import { prisma } from '../db.server'
import type { KnownIssue, Runbook } from './runbook.types'

type RunbookWithIssues = PrismaRunbook & {
  knownIssues: PrismaKnownIssue[]
  stackGuide: { id: string; slug: string; title: string; status: string } | null
}

function mapKnownIssue(row: PrismaKnownIssue): KnownIssue {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    symptom: row.symptom,
    cause: row.cause,
    fix: row.fix,
    verify: row.verify,
    triggerPhrases: row.triggerPhrases,
    relatedFiles: row.relatedFiles,
    axisTags: row.axisTags,
  }
}

function mapRunbook(row: RunbookWithIssues): Runbook {
  const relatedStackGuide =
    row.stackGuide && row.stackGuide.status === 'published'
      ? { id: row.stackGuide.id, slug: row.stackGuide.slug, title: row.stackGuide.title }
      : null

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    audience: row.audience,
    axisTags: row.axisTags,
    relatedFiles: row.relatedFiles,
    stackProfileMarkdown: row.stackProfileMarkdown,
    greenfieldChecklist: row.greenfieldChecklist,
    knownIssues: row.knownIssues.map(mapKnownIssue),
    relatedStackGuide,
  }
}

const publishedRunbookInclude = {
  knownIssues: { orderBy: { id: 'asc' as const } },
  stackGuide: { select: { id: true, slug: true, title: true, status: true } },
} as const

export async function listRunbooksFromDb(): Promise<Runbook[]> {
  const rows = await prisma.runbook.findMany({
    where: { status: 'published' },
    include: publishedRunbookInclude,
    orderBy: { id: 'asc' },
  })
  return rows.map(mapRunbook)
}

export async function getRunbookFromDb(id: string): Promise<Runbook | undefined> {
  const row = await prisma.runbook.findFirst({
    where: {
      status: 'published',
      OR: [{ id }, { slug: id }],
    },
    include: publishedRunbookInclude,
  })
  return row ? mapRunbook(row) : undefined
}

export async function getIssueFromDb(
  id: string
): Promise<{ issue: KnownIssue; runbook: Runbook } | undefined> {
  const issueRow = await prisma.knownIssue.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: {
      runbook: { include: publishedRunbookInclude },
    },
  })

  if (issueRow?.runbook.status !== 'published') {
    return undefined
  }

  return {
    issue: mapKnownIssue(issueRow),
    runbook: mapRunbook(issueRow.runbook),
  }
}
