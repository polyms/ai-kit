import type {
  KnownIssue as DbKnownIssue,
  Runbook as DbRunbook,
  StackGuide as DbStackGuide,
} from '../../../prisma/schema/client.ts'

export type RunbookAxisTag = string

export type KnownIssue = Omit<DbKnownIssue, 'runbookId' | 'createdAt' | 'updatedAt'>

export type Runbook = Omit<DbRunbook, 'status' | 'createdAt' | 'updatedAt'> & {
  knownIssues: KnownIssue[]
  relatedStackGuide?: Pick<DbStackGuide, 'id' | 'slug' | 'title'> | null
}

export type SearchResultItem =
  | {
      type: 'issue'
      id: string
      runbookId: string
      title: string
      match: string
      axisTags: RunbookAxisTag[]
    }
  | {
      type: 'runbook'
      id: string
      title: string
      match: string
      axisTags: RunbookAxisTag[]
    }

export type SearchRunbooksParams = {
  q?: string
  axes?: RunbookAxisTag[]
  limit?: number
}
