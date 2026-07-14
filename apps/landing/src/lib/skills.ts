import { type SkillOverlay, skillOverlays } from '../content/overlay'
import { m } from '../paraglide/messages.js'

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
  'devops',
] as const

export type SkillDomain = SkillOverlay['domain']

export function domainLabel(domain: SkillDomain): string {
  switch (domain) {
    case 'repo-config':
      return m.domain_repoConfig()
    case 'alignment':
      return m.domain_alignment()
    case 'requirements':
      return m.domain_requirements()
    case 'triage':
      return m.domain_triage()
    case 'design':
      return m.domain_design()
    case 'implementation':
      return m.domain_implementation()
    case 'review':
      return m.domain_review()
    case 'authoring':
      return m.domain_authoring()
    case 'architecture':
      return m.domain_architecture()
    case 'devops':
      return m.domain_devops()
    case 'docs':
      return m.domain_docs()
    case 'e2e':
      return m.domain_e2e()
  }
}
