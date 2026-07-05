import type { Prisma } from '../../../prisma/schema/client.ts'
import { prisma } from '../db.server'
import type { KnownIssue, Runbook } from './runbook.types'

const publishedRunbookInclude = {
  knownIssues: { orderBy: { id: 'asc' as const } },
  stackGuide: { select: { id: true, slug: true, title: true, status: true } },
} as const

type RunbookRow = Prisma.RunbookGetPayload<{
  include: typeof publishedRunbookInclude
}>

function mapKnownIssue({
  runbookId: _runbookId,
  createdAt: _createdAt,
  updatedAt: _updatedAt,
  ...issue
}: Prisma.KnownIssueModel): KnownIssue {
  return issue
}

function mapRunbook(row: RunbookRow): Runbook {
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
