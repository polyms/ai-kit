import { createServerFn } from '@tanstack/react-start'
import type { KnownIssue, Runbook, SearchResultItem } from './runbook.types'

export type RunbooksSearch = {
  q: string
}

export const defaultRunbooksSearch: RunbooksSearch = {
  q: '',
}

export const searchRunbooksFn = createServerFn({ method: 'GET' })
  .validator((data: { q: string }) => data)
  .handler(async ({ data }): Promise<SearchResultItem[]> => {
    const { searchRunbooks } = await import('./runbook.service.server')
    return searchRunbooks({ q: data.q })
  })

export const getRunbookFn = createServerFn({ method: 'GET' })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<Runbook> => {
    const { getRunbook } = await import('./runbook.service.server')
    const runbook = await getRunbook(data.id)
    if (!runbook) throw new Error('NOT_FOUND')
    return runbook
  })

export const getRunbookIssueFn = createServerFn({ method: 'GET' })
  .validator((data: { issueId: string }) => data)
  .handler(async ({ data }): Promise<{ issue: KnownIssue; runbook: Runbook }> => {
    const { getIssue } = await import('./runbook.service.server')
    const found = await getIssue(data.issueId)
    if (!found) throw new Error('NOT_FOUND')
    return found
  })
