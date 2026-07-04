export type RunbookAxisTag = string

export type KnownIssue = {
  id: string
  slug: string
  title: string
  symptom: string
  cause: string[]
  fix: string[]
  verify: string[]
  triggerPhrases: string[]
  relatedFiles: string[]
  axisTags: RunbookAxisTag[]
}

export type Runbook = {
  id: string
  slug: string
  title: string
  summary: string
  audience: string
  axisTags: RunbookAxisTag[]
  stackProfileMarkdown: string
  greenfieldChecklist: string[]
  knownIssues: KnownIssue[]
  relatedFiles: string[]
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
