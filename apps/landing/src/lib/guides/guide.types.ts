import type { Runbook as DbRunbook, StackGuide as DbStackGuide } from '../../../prisma/schema/client.ts'

export type SeamSection = {
  title: string
  body: string
}

export type StackGuide = Omit<DbStackGuide, 'status' | 'createdAt' | 'updatedAt' | 'seamSections'> & {
  seamSections: SeamSection[]
  relatedRunbook?: Pick<DbRunbook, 'id' | 'slug' | 'title'> | null
}

export type SearchStackGuidesParams = {
  q?: string
  axes?: string[]
  limit?: number
}

export type StackGuideSearchResult = {
  type: 'guide'
  id: string
  title: string
  match: string
  axisTags: string[]
}
