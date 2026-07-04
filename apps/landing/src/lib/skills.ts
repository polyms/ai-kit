import { skillOverlays, type SkillOverlay } from '../content/overlay'

export function getSkills(): SkillOverlay[] {
  return skillOverlays
}

export function getSkillBySlug(slug: string): SkillOverlay | undefined {
  return skillOverlays.find(s => s.slug === slug)
}

export function filterSkills(
  skills: SkillOverlay[],
  query: {
    search?: string
    domain?: string
    invocation?: 'all' | 'user' | 'model'
  }
): SkillOverlay[] {
  const q = query.search?.trim().toLowerCase() ?? ''
  return skills.filter(skill => {
    if (query.domain && query.domain !== 'all' && skill.domain !== query.domain) {
      return false
    }
    if (query.invocation && query.invocation !== 'all' && skill.invocation !== query.invocation) {
      return false
    }
    if (!q) return true
    const haystack = [skill.invoke, skill.name, skill.description, skill.domain].join(' ').toLowerCase()
    return haystack.includes(q)
  })
}

export const domainOptions = [
  'all',
  'repo-config',
  'alignment',
  'requirements',
  'triage',
  'design',
  'implementation',
  'review',
  'authoring',
  'architecture',
] as const
