import type { SkillPackName } from '../../lib/skill-pack/skill-pack'

const CATEGORY_BY_SLUG = {
  research: 'RESEARCH',
  business: 'BUSINESS',
  task: 'TASK',
  bug: 'BUG',
  track: 'TRACK',
  plan: 'PLAN',
  qa: 'QA',
  e2e: 'E2E',
  comms: 'COMMS',
  review: 'REVIEW',
  'code-review': 'AUDIT',
  release: 'RELEASE',
  setup: 'SETUP',
  align: 'ALIGN',
  'align-loop': 'GRILL',
  'domain-modeling': 'DOMAIN',
  reqs: 'REQS',
  design: 'DESIGN',
  collab: 'COLLAB',
  dev: 'IMPL',
  craft: 'CRAFT',
  'arch-refactor': 'MAINT',
  arch: 'ARCH',
  devops: 'OPS',
  'build-feature-map': 'MAP',
  docs: 'DOCS',
} satisfies Record<SkillPackName, string>

export function catalogCategory(slug: string): string {
  return Object.hasOwn(CATEGORY_BY_SLUG, slug)
    ? CATEGORY_BY_SLUG[slug as SkillPackName]
    : 'SKILL'
}

/** Display titles aligned with ui_kits/ai-kit-landing/Catalog.jsx */
export function catalogDisplayName(slug: string, name: string): string {
  const labels: Record<string, string> = {
    setup: 'Setup',
    align: 'Align',
    'align-loop': 'Align loop',
    'domain-modeling': 'Domain modeling',
    reqs: 'Reqs',
    design: 'Design',
    collab: 'Collab',
    dev: 'Develop',
    'code-review': 'Code review',
    docs: 'Docs',
    e2e: 'E2E',
    craft: 'Craft',
    'arch-refactor': 'Arch refactor',
    arch: 'Arch',
    devops: 'DevOps',
    'build-feature-map': 'Build feature map',
    qa: 'QA',
  }
  return labels[slug] ?? name.charAt(0).toUpperCase() + name.slice(1)
}
