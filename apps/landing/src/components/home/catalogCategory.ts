const CATEGORY_BY_SLUG: Record<string, string> = {
  research: 'RESEARCH',
  business: 'BUSINESS',
  task: 'TASK',
  bug: 'BUG',
  track: 'TRACK',
  plan: 'PLAN',
  qa: 'QA',
  comms: 'COMMS',
  review: 'REVIEW',
  release: 'RELEASE',
  setup: 'SETUP',
  align: 'ALIGN',
  reqs: 'REQS',
  design: 'DESIGN',
  dev: 'IMPL',
  craft: 'CRAFT',
  arch: 'ARCH',
  devops: 'OPS',
  'build-feature-map': 'MAP',
  docs: 'DOCS',
}

export function catalogCategory(slug: string): string {
  return CATEGORY_BY_SLUG[slug] ?? 'SKILL'
}

/** Display titles aligned with ui_kits/ai-kit-landing/Catalog.jsx */
export function catalogDisplayName(slug: string, name: string): string {
  const labels: Record<string, string> = {
    setup: 'Setup',
    align: 'Align',
    reqs: 'Reqs',
    design: 'Design',
    dev: 'Develop',
    docs: 'Docs',
    craft: 'Craft',
    arch: 'Arch',
    devops: 'DevOps',
  }
  return labels[slug] ?? name.charAt(0).toUpperCase() + name.slice(1)
}
