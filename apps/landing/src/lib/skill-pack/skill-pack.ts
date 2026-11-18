/** GitHub raw base for skill packs on `main`. Paths are repo-relative and have no leading slash. */
export const SKILL_PACK_RAW_BASE = 'https://raw.githubusercontent.com/polyms/ai-kit/refs/heads/main/'

export const REQS_SKILL_PATHS = [
  'skills/reqs/SKILL.md',
  'skills/reqs/enterprise-prd-template.md',
  'skills/reqs/business-requirements-template.md',
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

export const WORK_ARTIFACT_STANDARD = 'docs/agents/work-artifact-standard.md'

export const WORK_SKILL_PATHS = {
  research: ['skills/research/SKILL.md', 'skills/research/research-template.md'],
  business: ['skills/business/SKILL.md', 'skills/business/business-case-template.md'],
  docs: ['skills/docs/SKILL.md', 'skills/docs/business-doc-template.md'],
  task: ['skills/task/SKILL.md', 'skills/task/task-template.md'],
  bug: ['skills/bug/SKILL.md', 'skills/bug/bug-template.md'],
  track: ['skills/track/SKILL.md', 'skills/track/tracking-templates.md'],
  plan: ['skills/plan/SKILL.md', 'skills/plan/delivery-plan-template.md'],
  qa: ['skills/qa/SKILL.md', 'skills/qa/qa-templates.md'],
  comms: ['skills/comms/SKILL.md', 'skills/comms/communication-templates.md'],
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
}

export type SkillPackFile = {
  path: string
  rawUrl: string
}

export type SkillPackSummary = {
  name: SkillPackName
  skillRawUrl: string
  description: string
}

export type ReqsSkillPack = {
  name: 'reqs'
  files: SkillPackFile[]
}

export type DesignSkillPack = {
  name: 'design'
  files: SkillPackFile[]
  uiKit: SkillPackFile[]
}

export type WorkSkillPack = { name: WorkSkillName; files: SkillPackFile[] }
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
  }))
}

export function getSkillPack(name: string): SkillPack | null {
  if (name === 'reqs') {
    return { name: 'reqs', files: toFiles([...REQS_SKILL_PATHS, WORK_ARTIFACT_STANDARD]) }
  }
  if (name === 'design') {
    return {
      name: 'design',
      files: toFiles(DESIGN_SKILL_PATHS),
      uiKit: toFiles(UI_KIT_SKILL_PATHS),
    }
  }
  if (Object.hasOwn(WORK_SKILL_PATHS, name)) {
    const workName = name as WorkSkillName
    return { name: workName, files: toFiles([...WORK_SKILL_PATHS[workName], WORK_ARTIFACT_STANDARD]) }
  }
  return null
}
