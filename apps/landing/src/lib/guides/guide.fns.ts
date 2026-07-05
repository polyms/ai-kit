import { createServerFn } from '@tanstack/react-start'
import type { StackGuide, StackGuideSearchResult } from './guide.types'

export type GuidesSearch = {
  q: string
}

export const defaultGuidesSearch: GuidesSearch = {
  q: '',
}

export const searchGuidesFn = createServerFn({ method: 'GET' })
  .validator((data: { q: string }) => data)
  .handler(async ({ data }): Promise<StackGuideSearchResult[]> => {
    const { searchStackGuides } = await import('./guide.service.server')
    return searchStackGuides({ q: data.q })
  })

export const getGuideFn = createServerFn({ method: 'GET' })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<StackGuide> => {
    const { getStackGuide } = await import('./guide.service.server')
    const guide = await getStackGuide(data.id)
    if (!guide) throw new Error('NOT_FOUND')
    return guide
  })
