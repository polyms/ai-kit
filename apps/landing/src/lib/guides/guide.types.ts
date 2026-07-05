export type SeamSection = {
  title: string
  body: string
}

export type StackGuide = {
  id: string
  slug: string
  title: string
  summary: string
  audience: string
  axisTags: string[]
  designChecklist: string[]
  seamSections: SeamSection[]
  relatedRunbookId: string | null
  relatedRunbook?: {
    id: string
    slug: string
    title: string
  } | null
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
