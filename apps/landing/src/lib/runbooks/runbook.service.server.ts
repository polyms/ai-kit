import { searchRunbooksFromCatalog } from './runbook.catalog-search'
import { getIssueFromDb, getRunbookFromDb, listRunbooksFromDb } from './runbook.repository.server'
import type { KnownIssue, Runbook, SearchResultItem, SearchRunbooksParams } from './runbook.types'

export async function listRunbooks(): Promise<Runbook[]> {
  return listRunbooksFromDb()
}

export async function getRunbook(id: string): Promise<Runbook | undefined> {
  return getRunbookFromDb(id)
}

export async function getIssue(id: string): Promise<{ issue: KnownIssue; runbook: Runbook } | undefined> {
  return getIssueFromDb(id)
}

export async function searchRunbooks(params: SearchRunbooksParams = {}): Promise<SearchResultItem[]> {
  const runbooks = await listRunbooksFromDb()
  return searchRunbooksFromCatalog(runbooks, params)
}
