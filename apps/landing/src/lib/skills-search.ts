export type SkillsSearch = {
  q: string
  invocation: 'all' | 'user' | 'model'
}

export const defaultSkillsSearch: SkillsSearch = {
  q: '',
  invocation: 'all',
}

/** Normalize partial / foreign search into a full SkillsSearch (for Link/navigate). */
export function mergeSkillsSearch(prev: Record<string, unknown> | SkillsSearch): SkillsSearch {
  return {
    q: typeof prev.q === 'string' ? prev.q : '',
    invocation: prev.invocation === 'user' || prev.invocation === 'model' ? prev.invocation : 'all',
  }
}
