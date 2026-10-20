/** GitHub raw base for skill packs on `main`. Paths are repo-relative and have no leading slash. */
export const SKILL_PACK_RAW_BASE = 'https://raw.githubusercontent.com/polyms/ai-kit/refs/heads/main/'

export const REQS_SKILL_PATHS = [
  'skills/reqs/SKILL.md',
  'skills/reqs/enterprise-prd-template.md',
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

export type SkillPackName = 'reqs' | 'design'

export type SkillPackFile = {
  path: string
  rawUrl: string
}

export type SkillPackSummary = {
  name: SkillPackName
  skillRawUrl: string
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

export type SkillPack = ReqsSkillPack | DesignSkillPack

export function skillPackRawUrl(path: string): string {
  return `${SKILL_PACK_RAW_BASE}${path}`
}

function toFiles(paths: readonly string[]): SkillPackFile[] {
  return paths.map(path => ({ path, rawUrl: skillPackRawUrl(path) }))
}

export function listSkillPacks(): SkillPackSummary[] {
  return [
    { name: 'reqs', skillRawUrl: skillPackRawUrl('skills/reqs/SKILL.md') },
    { name: 'design', skillRawUrl: skillPackRawUrl('skills/design/SKILL.md') },
  ]
}

export function getSkillPack(name: string): SkillPack | null {
  if (name === 'reqs') {
    return { name: 'reqs', files: toFiles(REQS_SKILL_PATHS) }
  }
  if (name === 'design') {
    return {
      name: 'design',
      files: toFiles(DESIGN_SKILL_PATHS),
      uiKit: toFiles(UI_KIT_SKILL_PATHS),
    }
  }
  return null
}
