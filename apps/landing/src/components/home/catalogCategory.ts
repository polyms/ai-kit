const CATEGORY_BY_SLUG: Record<string, string> = {
  setup: 'SETUP',
  align: 'ALIGN',
  reqs: 'REQS',
  'to-prd': 'PRD',
  'to-issues': 'PLAN',
  triage: 'TRIAGE',
  design: 'DESIGN',
  dev: 'IMPL',
  'code-review': 'AUDIT',
  craft: 'CRAFT',
  'arch-refactor': 'MAINT',
  arch: 'ARCH',
  devops: 'OPS',
  docs: 'DOCS',
  e2e: 'E2E',
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
    'to-prd': 'To PRD',
    'to-issues': 'To issues',
    triage: 'Triage',
    design: 'Design',
    dev: 'Develop',
    'code-review': 'Code review',
    docs: 'Docs',
    e2e: 'E2E',
    craft: 'Craft',
    'arch-refactor': 'Arch refactor',
    arch: 'Arch',
    devops: 'DevOps',
  }
  return labels[slug] ?? name.charAt(0).toUpperCase() + name.slice(1)
}
