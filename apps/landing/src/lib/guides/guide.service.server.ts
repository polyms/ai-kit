import { searchStackGuidesFromCatalog } from './guide.catalog-search'
import { getStackGuideFromDb, listStackGuidesFromDb } from './guide.repository.server'
import type { SearchStackGuidesParams, StackGuide, StackGuideSearchResult } from './guide.types'

export async function listStackGuides(): Promise<StackGuide[]> {
  return listStackGuidesFromDb()
}

export async function getStackGuide(id: string): Promise<StackGuide | undefined> {
  return getStackGuideFromDb(id)
}

export async function searchStackGuides(
  params: SearchStackGuidesParams = {}
): Promise<StackGuideSearchResult[]> {
  const guides = await listStackGuidesFromDb()
  return searchStackGuidesFromCatalog(guides, params)
}
