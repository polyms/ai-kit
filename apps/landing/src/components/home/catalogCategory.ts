const CATEGORY_BY_SLUG: Record<string, string> = {
  setup: 'SETUP',
  align: 'ALIGN',
  pm: 'DOCS',
  'to-prd': 'DOCS',
  'to-issues': 'PLAN',
  triage: 'TRIAGE',
  design: 'DESIGN',
  dev: 'IMPL',
  'code-review': 'AUDIT',
  craft: 'CRAFT',
  'arch-refactor': 'MAINT',
  arch: 'ARCH',
  devops: 'OPS',
}

export function catalogCategory(slug: string): string {
  return CATEGORY_BY_SLUG[slug] ?? 'SKILL'
}

/** Display titles aligned with ui_kits/ai-kit-landing/Catalog.jsx */
export function catalogDisplayName(slug: string, name: string): string {
  const labels: Record<string, string> = {
    setup: 'Setup',
    align: 'Align',
    pm: 'PM',
    'to-prd': 'To PRD',
    'to-issues': 'To issues',
    triage: 'Triage',
    design: 'Design',
    dev: 'Develop',
    'code-review': 'Code review',
    craft: 'Craft',
    'arch-refactor': 'Arch refactor',
    arch: 'Arch',
    devops: 'DevOps',
  }
  return labels[slug] ?? name.charAt(0).toUpperCase() + name.slice(1)
}
