import { CONTEXT_PROTOCOL, compositionPaths, SKILL_CONTRACTS, type SkillContract } from './skill-composition'
import { SKILL_ROUTING } from './skill-routing'

/** GitHub raw base for skill packs on `main`. Paths are repo-relative and have no leading slash. */
export const SKILL_PACK_RAW_BASE = 'https://raw.githubusercontent.com/polyms/ai-kit/refs/heads/main/'

export const REQS_SKILL_PATHS = [
  'skills/reqs/SKILL.md',
  'skills/reqs/enterprise-prd-template.md',
  'skills/reqs/business-requirements-template.md',
  'skills/reqs/assumptions-and-change.md',
  'skills/reqs/prd-interview.md',
  'skills/reqs/user-story-guide.md',
] as const

export const DESIGN_SKILL_PATHS = [
  'skills/design/SKILL.md',
  'skills/design/BRIEF-INFERENCE.md',
  'skills/design/ANTI-SLOP.md',
  'skills/design/QUALITY-BAR.md',
  'skills/design/CSS-INTENT.md',
  'skills/design/VISUAL-ACCEPTANCE.md',
  'skills/design/design-spec-template.md',
  'skills/design/PREFLIGHT.md',
  'skills/design/REDESIGN.md',
] as const

export const DESIGN_REFERENCE_PATHS = [
  'docs/agents/client-compatibility.md',
  'skills/dev/visual-ship.md',
] as const

export const DOCS_REFERENCE_PATHS = ['docs/agents/client-compatibility.md'] as const

export const UI_KIT_SKILL_PATHS = [
  '.cursor/skills/ui-kit/SKILL.md',
  '.cursor/skills/ui-kit/brandkit.md',
  '.cursor/skills/ui-kit/button.md',
  '.cursor/skills/ui-kit/components.md',
  '.cursor/skills/ui-kit/css-utilities.md',
  '.cursor/skills/ui-kit/display.md',
  '.cursor/skills/ui-kit/field.md',
  '.cursor/skills/ui-kit/glossary.md',
  '.cursor/skills/ui-kit/inputs.md',
  '.cursor/skills/ui-kit/modal.md',
  '.cursor/skills/ui-kit/navigation.md',
  '.cursor/skills/ui-kit/overlays.md',
  '.cursor/skills/ui-kit/quality.md',
  '.cursor/skills/ui-kit/redesign.md',
  '.cursor/skills/ui-kit/setup.md',
  '.cursor/skills/ui-kit/theming.md',
] as const

export const REQS_REFERENCE_PATHS = [
  'skills/to-prd/lean-prd-template.md',
  'skills/setup/requirements.md',
  'skills/setup/language.md',
  'docs/agents/client-compatibility.md',
] as const

export const WORK_ARTIFACT_STANDARD = 'docs/agents/work-artifact-standard.md'

export const WORK_SKILL_PATHS = {
  research: [
    'skills/research/SKILL.md',
    'skills/research/research-template.md',
    'skills/research/evidence-guide.md',
  ],
  business: [
    'skills/business/SKILL.md',
    'skills/business/business-case-template.md',
    'skills/business/decision-templates.md',
  ],
  docs: ['skills/docs/SKILL.md', 'skills/docs/business-doc-template.md', 'skills/docs/work-records.md'],
  task: ['skills/task/SKILL.md', 'skills/task/task-template.md'],
  bug: ['skills/bug/SKILL.md', 'skills/bug/bug-template.md'],
  track: ['skills/track/SKILL.md', 'skills/track/tracking-templates.md'],
  plan: ['skills/plan/SKILL.md', 'skills/plan/delivery-plan-template.md'],
  qa: ['skills/qa/SKILL.md', 'skills/qa/qa-templates.md'],
  comms: ['skills/comms/SKILL.md', 'skills/comms/communication-templates.md'],
  review: ['skills/review/SKILL.md', 'skills/review/review-template.md'],
  release: ['skills/release/SKILL.md', 'skills/release/release-templates.md'],
} as const

export type WorkSkillName = keyof typeof WORK_SKILL_PATHS
export type SkillPackName = 'reqs' | 'design' | WorkSkillName

const PACK_DESCRIPTIONS: Record<SkillPackName, string> = {
  reqs: 'Business and product requirements, PRDs, user stories and acceptance criteria',
  design: 'UI design specifications and UI Kit guidance',
  research: 'Evidence-based research and comparative analysis',
  business: 'Business cases, pricing, costs and decision analysis',
  docs: 'Business and technical documentation',
  task: 'Actionable, testable work tickets',
  bug: 'Evidence-based and reproducible defect reports',
  track: 'Ticket inspection, backlog summaries and verified work-item updates',
  plan: 'Effort estimation, delivery planning, capacity and dependencies',
  qa: 'Functional test design, requirements coverage and QA evidence',
  comms: 'Professional messages, client replies and stakeholder updates',
  review: 'Evidence-based artifact review, gap analysis and assumption challenge',
  release: 'Go-live readiness, rollout, rollback and release notes',
}

export type SkillPackFile = {
  path: string
  rawUrl: string
}

export type SkillPackSummary = {
  name: SkillPackName
  skillRawUrl: string
  description: string
  useWhen: readonly string[]
  avoidWhen: string
  starterPaths: string[]
  relatedSkills: readonly SkillPackName[]
  contract: SkillContract
}

export type ReqsSkillPack = {
  name: 'reqs'
  contract: SkillContract
  files: SkillPackFile[]
}

export type DesignSkillPack = {
  name: 'design'
  contract: SkillContract
  files: SkillPackFile[]
  uiKit: SkillPackFile[]
}

export type WorkSkillPack = { name: WorkSkillName; contract: SkillContract; files: SkillPackFile[] }
export type SkillPack = ReqsSkillPack | DesignSkillPack | WorkSkillPack

export function skillPackRawUrl(path: string): string {
  return `${SKILL_PACK_RAW_BASE}${path}`
}

function toFiles(paths: readonly string[]): SkillPackFile[] {
  return paths.map(path => ({ path, rawUrl: skillPackRawUrl(path) }))
}

export function listSkillPacks(): SkillPackSummary[] {
  return (Object.keys(PACK_DESCRIPTIONS) as SkillPackName[]).map(name => ({
    name,
    skillRawUrl: skillPackRawUrl(`skills/${name}/SKILL.md`),
    description: PACK_DESCRIPTIONS[name],
    useWhen: SKILL_ROUTING[name].useWhen,
    avoidWhen: SKILL_ROUTING[name].avoidWhen,
    starterPaths: starterPaths(name),
    relatedSkills: SKILL_ROUTING[name].relatedSkills,
    contract: SKILL_CONTRACTS[name],
  }))
}

export function getSkillPack(name: string): SkillPack | null {
  if (name === 'reqs') {
    return {
      name: 'reqs',
      contract: SKILL_CONTRACTS.reqs,
      files: toFiles([
        ...REQS_SKILL_PATHS,
        ...REQS_REFERENCE_PATHS,
        WORK_ARTIFACT_STANDARD,
        ...compositionPaths('reqs'),
      ]),
    }
  }
  if (name === 'design') {
    return {
      name: 'design',
      contract: SKILL_CONTRACTS.design,
      files: toFiles([...DESIGN_SKILL_PATHS, ...DESIGN_REFERENCE_PATHS, ...compositionPaths('design')]),
      uiKit: toFiles(UI_KIT_SKILL_PATHS),
    }
  }
  if (Object.hasOwn(WORK_SKILL_PATHS, name)) {
    const workName = name as WorkSkillName
    const references = workName === 'docs' ? DOCS_REFERENCE_PATHS : []
    return {
      name: workName,
      contract: SKILL_CONTRACTS[workName],
      files: toFiles([
        ...WORK_SKILL_PATHS[workName],
        ...references,
        WORK_ARTIFACT_STANDARD,
        ...compositionPaths(workName),
      ]),
    }
  }
  return null
}

/** First request: entry point, applicable shared standard and default template for short workflows. */
export function starterPaths(name: SkillPackName): string[] {
  const entry = `skills/${name}/SKILL.md`
  if (name === 'design') return [entry, CONTEXT_PROTOCOL]
  const paths = [entry, WORK_ARTIFACT_STANDARD, CONTEXT_PROTOCOL]
  if (name !== 'reqs' && SKILL_ROUTING[name].starter === 'primary') {
    paths.push(WORK_SKILL_PATHS[name][1])
  }
  return paths
}
