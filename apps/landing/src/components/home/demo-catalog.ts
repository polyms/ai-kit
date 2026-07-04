/** Static skill list — pixel-matched to demo/Catalog.jsx */
export type DemoCatalogStatus = 'available' | 'planned'

export type DemoCatalogItem = {
  invoke: string
  name: string
  status: DemoCatalogStatus
  domain: string
}

export const DEMO_CATALOG_ITEMS: DemoCatalogItem[] = [
  {
    invoke: '/setup',
    name: 'setup',
    status: 'available',
    domain: 'Repo config — issue tracker, domain docs, pipeline',
  },
  {
    invoke: '/align',
    name: 'align + align-loop + domain-modeling',
    status: 'available',
    domain: 'Alignment (user + auto-discovery), domain language, CONTEXT.md',
  },
  {
    invoke: '/pm',
    name: 'pm',
    status: 'available',
    domain: 'Requirements, PRD, user stories, prioritization',
  },
  {
    invoke: '/to-prd',
    name: 'to-prd',
    status: 'available',
    domain: 'Synthesize conversation into lean PRD, publish to GitHub Issues',
  },
  {
    invoke: '/to-issues',
    name: 'to-issues',
    status: 'available',
    domain: 'Break PRD/plan into vertical-slice GitHub issues',
  },
  {
    invoke: '/triage',
    name: 'triage',
    status: 'available',
    domain: 'Triage backlog — verify, grill, agent briefs, ready-for-agent',
  },
  {
    invoke: '/ux',
    name: 'ux',
    status: 'planned',
    domain: 'UI/UX flows, wireframes, design specs, a11y',
  },
  {
    invoke: '/dev',
    name: 'dev',
    status: 'available',
    domain: 'Fullstack implementation, TDD, debugging',
  },
  {
    invoke: '/code-review',
    name: 'code-review',
    status: 'available',
    domain: 'Two-axis review — Standards + Spec, parallel sub-agents',
  },
  {
    invoke: '/craft',
    name: 'craft',
    status: 'available',
    domain: 'Authoring and editing skills — predictability, pruning',
  },
]
