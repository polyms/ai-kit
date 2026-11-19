import type { SkillPackName } from './skill-pack'

/** Advisory artifact vocabulary, not a schema for all document bodies. */
export const ARTIFACT_KINDS = [
  'context',
  'requirements',
  'decision',
  'review-findings',
  'evidence',
  'ui-spec',
  'delivery-plan',
  'test-report',
  'release-readiness',
  'tracker-snapshot',
  'document',
  'defect',
  'work-item',
  'change-receipt',
  'test-plan',
  'message',
] as const
export type ArtifactKind = (typeof ARTIFACT_KINDS)[number]

export type SkillContract = {
  /** Alternative usable input kinds; the selected workflow determines actual prerequisites. */
  accepts: readonly ArtifactKind[]
  produces: readonly ArtifactKind[]
  readyWhen: string
}

export const SKILL_CONTRACTS: Record<SkillPackName, SkillContract> = {
  research: {
    accepts: ['context', 'requirements', 'decision', 'review-findings'],
    produces: ['evidence'],
    readyWhen: 'Material claims have sources, dates and explicit evidence gaps.',
  },
  business: {
    accepts: ['context', 'evidence', 'requirements', 'review-findings'],
    produces: ['decision'],
    readyWhen: 'Options and assumptions are comparable; proposed and approved decisions are distinguished.',
  },
  reqs: {
    accepts: ['context', 'evidence', 'decision', 'review-findings', 'requirements'],
    produces: ['requirements'],
    readyWhen: 'Scope, rules and acceptance criteria are traceable; unresolved decisions are explicit.',
  },
  design: {
    accepts: ['context', 'requirements', 'ui-spec', 'review-findings'],
    produces: ['ui-spec', 'review-findings'],
    readyWhen:
      'Required screen states, constraints and handoff evidence are stated; unapproved design changes are flagged.',
  },
  docs: {
    accepts: [
      'context',
      'evidence',
      'decision',
      'requirements',
      'delivery-plan',
      'test-report',
      'release-readiness',
      'tracker-snapshot',
    ],
    produces: ['document'],
    readyWhen: 'The artifact is standalone and separates confirmed facts, decisions and pending work.',
  },
  task: {
    accepts: ['context', 'requirements', 'ui-spec', 'delivery-plan', 'review-findings', 'defect'],
    produces: ['work-item'],
    readyWhen: 'Each item has bounded scope, testable outcome and dependencies; write status is explicit.',
  },
  bug: {
    accepts: ['context', 'test-report', 'requirements', 'tracker-snapshot'],
    produces: ['defect'],
    readyWhen:
      'Observed and expected behaviors are separate; reproduction and impact are evidence-backed or unknown.',
  },
  track: {
    accepts: ['context', 'work-item', 'defect', 'tracker-snapshot', 'delivery-plan'],
    produces: ['tracker-snapshot', 'change-receipt'],
    readyWhen:
      'Targets and current fields are resolved; requested changes and verification are reported separately.',
  },
  plan: {
    accepts: ['context', 'requirements', 'work-item', 'tracker-snapshot', 'review-findings', 'decision'],
    produces: ['delivery-plan'],
    readyWhen: 'Effort and elapsed time reconcile with dependencies, capacity and uncertainty.',
  },
  qa: {
    accepts: ['context', 'requirements', 'ui-spec', 'work-item', 'defect', 'test-plan', 'test-report'],
    produces: ['test-plan', 'test-report'],
    readyWhen: 'Coverage gaps and execution evidence are distinct; unrun tests are never marked passed.',
  },
  comms: {
    accepts: [
      'context',
      'evidence',
      'decision',
      'document',
      'delivery-plan',
      'tracker-snapshot',
      'change-receipt',
      'release-readiness',
      'review-findings',
      'test-report',
    ],
    produces: ['message'],
    readyWhen:
      'The message preserves factual status, commitments and authorization; send status is explicit.',
  },
  review: {
    accepts: [
      'context',
      'evidence',
      'decision',
      'requirements',
      'ui-spec',
      'document',
      'work-item',
      'delivery-plan',
      'test-plan',
      'release-readiness',
    ],
    produces: ['review-findings'],
    readyWhen: 'Findings have evidence, severity, impact and actionable fixes; review is not approval.',
  },
  release: {
    accepts: ['context', 'tracker-snapshot', 'test-report', 'delivery-plan', 'review-findings'],
    produces: ['release-readiness'],
    readyWhen:
      'Gate statuses have actual evidence or explicit missing evidence; recommendation is not sign-off.',
  },
}

export const COMPOSITION_PROTOCOL = 'docs/agents/skill-composition.md'

export type WorkflowRecipe = {
  id: string
  title: string
  description: string
  /** Retrieval host only; it need not be executed first or at all. */
  hostPack: SkillPackName
  path: string
  /** Possible stages in suggested order; conditions live in the recipe. */
  skills: readonly SkillPackName[]
}

export const WORKFLOW_RECIPES: readonly WorkflowRecipe[] = [
  {
    id: 'product-development',
    title: 'Product development',
    description: 'Move from evidence or an agreed brief to requirements, delivery tasks and test coverage.',
    hostPack: 'reqs',
    path: 'workflows/product-development.md',
    skills: ['research', 'business', 'reqs', 'review', 'design', 'plan', 'task', 'qa'],
  },
  {
    id: 'bug-lifecycle',
    title: 'Bug lifecycle',
    description:
      'Record a defect, inspect its tracker state and verify a fix without inventing test results.',
    hostPack: 'bug',
    path: 'workflows/bug-lifecycle.md',
    skills: ['bug', 'track', 'qa', 'release'],
  },
  {
    id: 'business-decision',
    title: 'Business decision',
    description:
      'Evaluate alternatives, challenge assumptions and communicate a proposed or confirmed decision.',
    hostPack: 'business',
    path: 'workflows/business-decision.md',
    skills: ['research', 'business', 'review', 'comms'],
  },
  {
    id: 'sprint-planning',
    title: 'Sprint planning',
    description: 'Use current backlog and capacity to propose a feasible scope and work items.',
    hostPack: 'plan',
    path: 'workflows/sprint-planning.md',
    skills: ['track', 'review', 'plan', 'task'],
  },
  {
    id: 'release-readiness',
    title: 'Release readiness',
    description: 'Reconcile release scope, real QA evidence, readiness gates and stakeholder communication.',
    hostPack: 'release',
    path: 'workflows/release-readiness.md',
    skills: ['track', 'qa', 'release', 'comms'],
  },
]

export function compositionPaths(name: SkillPackName): string[] {
  return [
    COMPOSITION_PROTOCOL,
    ...WORKFLOW_RECIPES.filter(recipe => recipe.hostPack === name).map(recipe => recipe.path),
  ]
}

export function compositionCatalog() {
  return { protocol: { path: COMPOSITION_PROTOCOL }, recipes: WORKFLOW_RECIPES }
}
