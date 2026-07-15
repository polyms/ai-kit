import {
  type LocalizedString,
  type SkillOverlay,
  type SkillPipeline,
  skillOverlays,
} from '../content/overlay'
import { m } from '../paraglide/messages.js'
import type { Locale } from '../paraglide/runtime'

export type ResolvedSkillPipeline =
  | string
  | {
      upstream?: string | string[]
      downstream?: string | string[]
    }

export type ResolvedAgentPanel = {
  role: string
  owns: string | string[]
  invokeHint: string
}

export type ResolvedSkillOverlay = Omit<
  SkillOverlay,
  'description' | 'summary' | 'whenToUse' | 'pipeline' | 'boundaries' | 'footnote' | 'agentPanel'
> & {
  description: string
  summary?: string
  whenToUse?: string
  pipeline?: ResolvedSkillPipeline
  boundaries?: string
  footnote?: string
  agentPanel?: ResolvedAgentPanel
}

function isLocalizedRecord(value: unknown): value is Record<Locale, string> {
  return typeof value === 'object' && value !== null && 'vi' in value
}

function resolveText(value: LocalizedString, locale: Locale): string {
  return isLocalizedRecord(value) ? value[locale] : value
}

function resolveMulti(value: LocalizedString | LocalizedString[], locale: Locale): string | string[] {
  return Array.isArray(value) ? value.map(v => resolveText(v, locale)) : resolveText(value, locale)
}

function resolvePipeline(pipeline: SkillPipeline, locale: Locale): ResolvedSkillPipeline {
  if (typeof pipeline === 'string' || isLocalizedRecord(pipeline)) {
    return resolveText(pipeline, locale)
  }
  const resolved: { upstream?: string | string[]; downstream?: string | string[] } = {}
  if (pipeline.upstream !== undefined) resolved.upstream = resolveMulti(pipeline.upstream, locale)
  if (pipeline.downstream !== undefined) resolved.downstream = resolveMulti(pipeline.downstream, locale)
  return resolved
}

/** Resolves an overlay entry's localized prose fields for the given locale; identity fields pass through. */
export function getSkillCopy(skill: SkillOverlay, locale: Locale): ResolvedSkillOverlay {
  return {
    ...skill,
    description: resolveText(skill.description, locale),
    summary: skill.summary === undefined ? undefined : resolveText(skill.summary, locale),
    whenToUse: skill.whenToUse === undefined ? undefined : resolveText(skill.whenToUse, locale),
    pipeline: skill.pipeline === undefined ? undefined : resolvePipeline(skill.pipeline, locale),
    boundaries: skill.boundaries === undefined ? undefined : resolveText(skill.boundaries, locale),
    footnote: skill.footnote === undefined ? undefined : resolveText(skill.footnote, locale),
    agentPanel:
      skill.agentPanel === undefined
        ? undefined
        : {
            ...skill.agentPanel,
            role: resolveText(skill.agentPanel.role, locale),
            invokeHint: resolveText(skill.agentPanel.invokeHint, locale),
          },
  }
}

export function getSkills(locale: Locale): ResolvedSkillOverlay[] {
  return skillOverlays.map(skill => getSkillCopy(skill, locale))
}

export function getSkillBySlug(slug: string, locale: Locale): ResolvedSkillOverlay | undefined {
  const skill = skillOverlays.find(s => s.slug === slug)
  return skill === undefined ? undefined : getSkillCopy(skill, locale)
}

export function filterSkills(
  skills: ResolvedSkillOverlay[],
  query: {
    search?: string
    domain?: string
    invocation?: 'all' | 'user' | 'model'
  }
): ResolvedSkillOverlay[] {
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
  'docs',
  'e2e',
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
