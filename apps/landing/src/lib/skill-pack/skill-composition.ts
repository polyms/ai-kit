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

export type ContextRequirement = {
  key: string
  importance: 'required' | 'recommended' | 'optional'
  description: string
}

export const CONTEXT_PROTOCOL = 'docs/agents/context-contract.md'

export type KnowledgeHint = {
  intent: 'incident' | 'design' | 'toolchain'
  when: string
}

export const MEMORY_PROTOCOL = 'docs/agents/memory-protocol.md'

/** Semantic topic and applicability condition; not a provider query or permission. */
export type MemoryHint = {
  topic: string
  when: string
}

export type MemoryHints = {
  recall?: readonly MemoryHint[]
  capture?: readonly MemoryHint[]
}

export type SkillContract = {
  /** Alternative usable input kinds; the selected workflow determines actual prerequisites. */
  accepts: readonly ArtifactKind[]
  produces: readonly ArtifactKind[]
  readyWhen: string
  /** Advisory context needs; actual blockers depend on the requested outcome. */
  context: readonly ContextRequirement[]
  /** Conditional search hints for the existing Knowledge catalog, never mandatory calls. */
  knowledge?: readonly KnowledgeHint[]
  /** Optional experience-use hints. Never a prerequisite or automatic persistence. */
  memory?: MemoryHints
}

export const SKILL_CONTRACTS: Record<SkillPackName, SkillContract> = {
  'align-loop': {
    context: [{ key: 'target', importance: 'required', description: 'Requested outcome, target project and available approved decisions or evidence.' }],
    accepts: ["context","requirements","decision","evidence"],
    produces: ["decision"],
    readyWhen: "Decision tree is traversed one branch at a time; options, resolved decisions and remaining blockers are explicit.",
  },
  'domain-modeling': {
    context: [{ key: 'target', importance: 'required', description: 'Requested outcome, target project and available approved decisions or evidence.' }],
    accepts: ["context","requirements","decision","evidence"],
    produces: ["decision","document","change-receipt"],
    readyWhen: "Resolved terminology or ADR rationale is traceable; writes are verified or pending, and approval is not invented.",
  },
  'arch-refactor': {
    context: [{ key: 'target', importance: 'required', description: 'Requested outcome, target project and available approved decisions or evidence.' }],
    accepts: ["context","evidence","requirements","decision"],
    produces: ["review-findings","decision","document"],
    readyWhen: "Candidates cite actual source evidence, explain leverage/locality and test seams, and preserve unresolved decisions; report is not refactor approval.",
  },
  'collab': {
    context: [{ key: 'target', importance: 'required', description: 'Requested outcome, target project and available approved decisions or evidence.' }],
    accepts: ["context","requirements","decision","ui-spec","evidence"],
    produces: ["requirements","ui-spec","decision","document"],
    readyWhen: "Applicable packet gates pass or are explicitly blocked; no invented principal delegation, approvals, repository facts or implementation.",
  },
  'e2e': {
    context: [{ key: 'target', importance: 'required', description: 'Requested outcome, target project and available approved decisions or evidence.' }],
    accepts: ["context","requirements","test-plan","evidence","change-receipt"],
    produces: ["test-report","change-receipt"],
    readyWhen: "Harness changes and test-job outcomes are grounded in matching execution evidence; no QA approval inferred from automation results.",
  },
  'code-review': {
    context: [
      { key: 'review-target', importance: 'required', description: 'Exact repository, comparison/base and head revision or supplied source diff.' },
      { key: 'source-spec', importance: 'recommended', description: 'Originating approved requirement or issue and applicable coding standards; explicit gaps.' },
    ],
    accepts: ['context', 'evidence', 'requirements', 'work-item', 'change-receipt', 'decision'],
    produces: ['review-findings'],
    readyWhen: 'Standards, Spec and Simplify findings remain independent and evidence-grounded; missing specification or partial diff and merge blockers are explicit.',
  },
  'align': {
    context: [{ key: 'decision-goal', importance: 'required', description: 'Requested outcome, target project/revision, approved scope and relevant evidence.' }],
    accepts: ['context', 'requirements', 'decision'],
    produces: ['decision', 'document'],
    readyWhen: 'Selected workflow gates, decisions, evidence, and actual write or execution status are explicit.',
  },
  'arch': {
    context: [{ key: 'architecture-target', importance: 'required', description: 'Requested outcome, target project/revision, approved scope and relevant evidence.' }],
    accepts: ['context', 'decision', 'requirements', 'evidence'],
    produces: ['decision', 'document'],
    readyWhen: 'Module interface, seam, depth, locality and testability decisions are explicit and grounded in the target context.',
  },
  'dev': {
    context: [{ key: 'implementation-target', importance: 'required', description: 'Requested outcome, target project/revision, approved scope and relevant evidence.' }],
    accepts: ['context', 'requirements', 'ui-spec', 'work-item', 'defect', 'decision'],
    produces: ['change-receipt', 'test-report'],
    readyWhen: 'Selected workflow gates, decisions, evidence, and actual write or execution status are explicit.',
  },
  'craft': {
    context: [{ key: 'skill-target', importance: 'required', description: 'Requested outcome, target project/revision, approved scope and relevant evidence.' }],
    accepts: ['context', 'document', 'review-findings'],
    produces: ['document', 'review-findings'],
    readyWhen: 'Selected workflow gates, decisions, evidence, and actual write or execution status are explicit.',
  },
  'build-feature-map': {
    context: [{ key: 'feature-map-target', importance: 'required', description: 'Requested outcome, target project/revision, approved scope and relevant evidence.' }],
    accepts: ['context', 'requirements', 'evidence', 'ui-spec'],
    produces: ['document', 'change-receipt'],
    readyWhen: 'Selected workflow gates, decisions, evidence, and actual write or execution status are explicit.',
  },
  'devops': {
    context: [
      { key: 'incident', importance: 'required', description: 'Observed symptom, affected environment, revision and logs when available.' },
    ],
    accepts: ['context', 'evidence', 'defect'],
    produces: ['review-findings', 'change-receipt'],
    readyWhen: 'Diagnosis and actual verification are separate; missing evidence remains unverified.',
  },
  'setup': {
    context: [
      { key: 'project-target', importance: 'required', description: 'Confirmed project, existing configuration and available host tools.' },
    ],
    accepts: ['context', 'decision'],
    produces: ['document', 'change-receipt'],
    readyWhen: 'Canonical sources, routes and policies are confirmed or unknown; requested writes verified.',
  },
  research: {
    context: [
      { key: 'research-question', importance: 'required', description: 'Question and scope.' },
      {
        key: 'source-evidence',
        importance: 'recommended',
        description: 'Relevant sources, dates and existing evidence.',
      },
      {
        key: 'constraints',
        importance: 'recommended',
        description: 'Research boundaries and comparison criteria.',
      },
    ],
    accepts: ['context', 'requirements', 'decision', 'review-findings'],
    produces: ['evidence'],
    readyWhen: 'Material claims have sources, dates and explicit evidence gaps.',
  },
  business: {
    context: [
      { key: 'decision-goal', importance: 'required', description: 'Decision or business question.' },
      { key: 'business-rules', importance: 'recommended', description: 'Commercial rules and constraints.' },
      {
        key: 'cost-evidence',
        importance: 'recommended',
        description: 'Comparable cost, revenue or market evidence.',
      },
      { key: 'prior-decisions', importance: 'optional', description: 'Previous decisions and rationale.' },
    ],
    accepts: ['context', 'evidence', 'requirements', 'review-findings'],
    produces: ['decision'],
    readyWhen: 'Options and assumptions are comparable; proposed and approved decisions are distinguished.',
  },
  reqs: {
    memory: {
      recall: [
        {
          topic: 'prior-approved-decisions',
          when: 'Existing decisions or constraints may materially affect scope or acceptance criteria.',
        },
      ],
      capture: [
        {
          topic: 'confirmed-requirements-decisions',
          when: 'A durable decision is explicitly approved and not already recorded by its owner.',
        },
      ],
    },
    context: [
      { key: 'goal', importance: 'required', description: 'Requested outcome and affected actors.' },
      {
        key: 'scope',
        importance: 'recommended',
        description: 'Boundaries, business rules and known requirements.',
      },
      {
        key: 'prior-decisions',
        importance: 'recommended',
        description: 'Approved decisions and unresolved forks.',
      },
      {
        key: 'existing-artifacts',
        importance: 'optional',
        description: 'Existing requirements and evidence.',
      },
    ],
    accepts: ['context', 'evidence', 'decision', 'review-findings', 'requirements'],
    produces: ['requirements', 'change-receipt'],
    readyWhen: 'Scope, rules, acceptance and lean synthesis gates are traceable; actual publication and mirror status are explicit.',
  },
  design: {
    knowledge: [
      {
        intent: 'design',
        when: 'A technical stack seam affects the requested UI behavior; not generic visual design.',
      },
    ],
    context: [
      { key: 'goal', importance: 'required', description: 'Screen or interaction and its purpose.' },
      {
        key: 'requirements',
        importance: 'recommended',
        description: 'Approved behavior, states and acceptance criteria.',
      },
      {
        key: 'design-system',
        importance: 'recommended',
        description: 'Component library, visual constraints and brand.',
      },
      {
        key: 'existing-artifacts',
        importance: 'optional',
        description: 'Current screens and UI specifications.',
      },
    ],
    accepts: ['context', 'requirements', 'ui-spec', 'review-findings'],
    produces: ['ui-spec', 'review-findings'],
    readyWhen:
      'Required screen states, constraints and handoff evidence are stated; unapproved design changes are flagged.',
  },
  docs: {
    context: [
      { key: 'goal', importance: 'required', description: 'Document purpose, audience and format.' },
      {
        key: 'source-material',
        importance: 'recommended',
        description: 'Facts, artifacts and current documentation.',
      },
      { key: 'constraints', importance: 'optional', description: 'Destination conventions and language.' },
    ],
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
    knowledge: [
      {
        intent: 'toolchain',
        when: 'A task depends on an unknown organization-wide tooling recipe.',
      },
      {
        intent: 'design',
        when: 'A technical seam is material to the implementation scope.',
      },
    ],
    context: [
      { key: 'goal', importance: 'required', description: 'Requested work and expected outcome.' },
      {
        key: 'scope',
        importance: 'recommended',
        description: 'Boundaries, parent requirements and constraints.',
      },
      {
        key: 'dependencies',
        importance: 'recommended',
        description: 'Known dependencies, blockers and acceptance evidence.',
      },
      { key: 'prior-decisions', importance: 'optional', description: 'Relevant agreed decisions.' },
    ],
    accepts: ['context', 'requirements', 'ui-spec', 'delivery-plan', 'review-findings', 'defect'],
    produces: ['work-item'],
    readyWhen: 'Each item has bounded scope, testable outcome and dependencies; write status is explicit.',
  },
  bug: {
    memory: {
      recall: [
        {
          topic: 'similar-incidents',
          when: 'An observed symptom makes a past incident materially relevant to investigation.',
        },
      ],
      capture: [
        {
          topic: 'confirmed-reproduction-insights',
          when: 'Reproduction or root cause is verified and useful beyond this report.',
        },
      ],
    },
    knowledge: [
      {
        intent: 'incident',
        when: 'An observed deploy or CI symptom matches an unresolved diagnostic question.',
      },
    ],
    context: [
      {
        key: 'observed-behavior',
        importance: 'required',
        description: 'Reported symptom or actual behavior.',
      },
      {
        key: 'expected-behavior',
        importance: 'recommended',
        description: 'Expected behavior and its source, if known.',
      },
      {
        key: 'source-evidence',
        importance: 'recommended',
        description: 'Reproduction, environment, frequency and impact evidence.',
      },
      {
        key: 'prior-incidents',
        importance: 'optional',
        description: 'Relevant past defects or incident knowledge.',
      },
    ],
    accepts: ['context', 'test-report', 'requirements', 'tracker-snapshot'],
    produces: ['defect'],
    readyWhen:
      'Observed and expected behaviors are separate; reproduction and impact are evidence-backed or unknown.',
  },
  track: {
    context: [
      { key: 'goal', importance: 'required', description: 'Requested tracker operation or reporting scope.' },
      {
        key: 'current-state',
        importance: 'required',
        description: 'Current target records for reporting or mutation; otherwise bounded draft only.',
      },
      { key: 'constraints', importance: 'recommended', description: 'Workflow rules and requested filters.' },
    ],
    accepts: ['context', 'work-item', 'defect', 'tracker-snapshot', 'delivery-plan'],
    produces: ['tracker-snapshot', 'change-receipt', 'review-findings'],
    readyWhen:
      'Targets and current fields are resolved; requested changes and verification are reported separately.',
  },
  plan: {
    memory: {
      recall: [
        {
          topic: 'historical-estimates',
          when: 'Estimating comparable work with unresolved effort assumptions.',
        },
        {
          topic: 'actual-effort',
          when: 'Calibrating an estimate using comparable, verified delivery outcomes.',
        },
        {
          topic: 'previous-delivery-decisions',
          when: 'Prior decisions may constrain the current plan.',
        },
      ],
      capture: [
        {
          topic: 'estimation-corrections',
          when: 'Comparable actual effort is verified against an earlier estimate.',
        },
        {
          topic: 'planning-lessons',
          when: 'Observed outcomes support a reusable, scoped delivery lesson.',
        },
      ],
    },
    knowledge: [
      {
        intent: 'design',
        when: 'Unknown stack integration constraints materially affect the estimate.',
      },
    ],
    context: [
      {
        key: 'goal',
        importance: 'required',
        description: 'Delivery objective and requested estimate or plan.',
      },
      {
        key: 'scope',
        importance: 'required',
        description: 'Work boundaries or a bounded set of requirements.',
      },
      {
        key: 'dependencies',
        importance: 'recommended',
        description: 'Known dependencies and delivery constraints.',
      },
      {
        key: 'team-capacity',
        importance: 'recommended',
        description: 'Required for a feasible sprint or committed date, not effort-only estimates.',
      },
      {
        key: 'historical-effort',
        importance: 'optional',
        description: 'Relevant historical estimates or actual effort.',
      },
      {
        key: 'prior-decisions',
        importance: 'optional',
        description: 'Confirmed decisions and lessons affecting delivery.',
      },
    ],
    accepts: ['context', 'requirements', 'work-item', 'tracker-snapshot', 'review-findings', 'decision'],
    produces: ['delivery-plan'],
    readyWhen: 'Effort and elapsed time reconcile with dependencies, capacity and uncertainty.',
  },
  qa: {
    memory: {
      recall: [
        {
          topic: 'regression-history',
          when: 'Designing coverage for comparable affected behavior or a known regression risk.',
        },
      ],
      capture: [
        {
          topic: 'missed-coverage-lessons',
          when: 'Observed execution or defect evidence confirms a reusable coverage gap.',
        },
      ],
    },
    knowledge: [
      {
        intent: 'incident',
        when: 'A relevant incident verification recipe is needed for a deploy or CI regression.',
      },
    ],
    context: [
      {
        key: 'goal',
        importance: 'required',
        description: 'Requested test design, coverage or verification target.',
      },
      {
        key: 'requirements',
        importance: 'recommended',
        description: 'Expected behavior and acceptance criteria.',
      },
      {
        key: 'source-evidence',
        importance: 'recommended',
        description: 'Actual execution evidence is required to report a test result.',
      },
      {
        key: 'prior-incidents',
        importance: 'optional',
        description: 'Relevant regressions and past defects.',
      },
    ],
    accepts: ['context', 'requirements', 'ui-spec', 'work-item', 'defect', 'test-plan', 'test-report'],
    produces: ['test-plan', 'test-report'],
    readyWhen: 'Coverage gaps and execution evidence are distinct; unrun tests are never marked passed.',
  },
  comms: {
    context: [
      { key: 'goal', importance: 'required', description: 'Message purpose and audience.' },
      {
        key: 'source-material',
        importance: 'recommended',
        description: 'Facts, agreed decisions and actual status.',
      },
      {
        key: 'constraints',
        importance: 'recommended',
        description: 'Tone, channel, language and approved commitments.',
      },
    ],
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
    memory: {
      recall: [
        {
          topic: 'prior-review-findings',
          when: 'Prior findings may reveal a relevant recurring defect or constraint.',
        },
      ],
      capture: [
        {
          topic: 'preventive-review-lessons',
          when: 'Evidence supports a scoped preventive lesson, not merely an untested suggestion.',
        },
      ],
    },
    context: [
      { key: 'review-target', importance: 'required', description: 'Artifact or behavior being reviewed.' },
      {
        key: 'review-criteria',
        importance: 'recommended',
        description: 'Applicable requirements, standards and expected outcomes.',
      },
      { key: 'source-evidence', importance: 'recommended', description: 'Evidence supporting findings.' },
      {
        key: 'prior-decisions',
        importance: 'optional',
        description: 'Approved scope and relevant decisions.',
      },
    ],
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
    readyWhen: 'Artifact findings have evidence, severity, impact and actionable fixes; review is not approval.',
  },
  release: {
    knowledge: [
      {
        intent: 'incident',
        when: 'An unresolved deploy or CI symptom affects readiness.',
      },
      {
        intent: 'toolchain',
        when: 'A missing deployment tooling recipe affects a release gate.',
      },
    ],
    context: [
      { key: 'goal', importance: 'required', description: 'Release target, scope and environment.' },
      {
        key: 'current-state',
        importance: 'recommended',
        description: 'Current build, deployment and rollout state.',
      },
      {
        key: 'source-evidence',
        importance: 'recommended',
        description: 'QA, readiness and rollback evidence is required to claim a gate passed.',
      },
      {
        key: 'constraints',
        importance: 'recommended',
        description: 'Release gates, dependencies and approvals.',
      },
    ],
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
    CONTEXT_PROTOCOL,
    MEMORY_PROTOCOL,
    ...WORKFLOW_RECIPES.filter(recipe => recipe.hostPack === name).map(recipe => recipe.path),
  ]
}

export function compositionCatalog() {
  return { protocol: { path: COMPOSITION_PROTOCOL }, recipes: WORKFLOW_RECIPES }
}
