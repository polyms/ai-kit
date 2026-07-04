export type SkillsSearch = {
  q: string
  domain: string
  invocation: 'all' | 'user' | 'model'
}

export const defaultSkillsSearch: SkillsSearch = {
  q: '',
  domain: 'all',
  invocation: 'all',
}
