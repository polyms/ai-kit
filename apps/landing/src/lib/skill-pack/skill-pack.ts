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
  'skills/reqs/lean-prd-workflow.md',
  'skills/reqs/lean-prd-template.md',
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
  'docs/agents/portable-skills.md',
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
  'skills/align-loop/GRILL-FORMAT.md',
  'docs/agents/portable-skills.md',
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
  task: ['skills/task/SKILL.md', 'skills/task/task-template.md', 'skills/task/vertical-slicing.md', 'skills/task/vertical-slice-template.md'],
  bug: ['skills/bug/SKILL.md', 'skills/bug/bug-template.md'],
  track: ['skills/track/SKILL.md', 'skills/track/tracking-templates.md', 'skills/track/triage-workflow.md', 'skills/track/agent-brief.md', 'skills/track/out-of-scope.md'],
  plan: ['skills/plan/SKILL.md', 'skills/plan/delivery-plan-template.md'],
  qa: ['skills/qa/SKILL.md', 'skills/qa/qa-templates.md'],
  comms: ['skills/comms/SKILL.md', 'skills/comms/communication-templates.md'],
  review: ['skills/review/SKILL.md', 'skills/review/review-template.md'],
  release: ['skills/release/SKILL.md', 'skills/release/release-templates.md'],
} as const

export const PORTABLE_SKILL_STANDARD = 'docs/agents/portable-skills.md'
const REVIEW_FIX_PROTOCOL = 'docs/agents/review-fix-protocol.md'

export const ENGINEERING_SKILL_PATHS = {
  'align-loop': [
    'skills/align-loop/SKILL.md',
    'skills/align-loop/GRILL-FORMAT.md',
  ],
  'domain-modeling': [
    'skills/domain-modeling/SKILL.md',
    'skills/align-loop/GRILL-FORMAT.md',
    'skills/setup/domain.md',
    'skills/setup/context-format.md',
    'skills/setup/adr-format.md',
  ],
  'arch-refactor': [
    'skills/arch-refactor/SKILL.md',
    'skills/arch-refactor/HTML-REPORT.md',
    'skills/align-loop/GRILL-FORMAT.md',
    'skills/setup/stack-profile.md',
    'docs/agents/knowledge.md',
  ],
  'collab': [
    'skills/collab/SKILL.md',
    'skills/collab/inference-brief.md',
    'docs/agents/invocation.md',
    ...DESIGN_SKILL_PATHS,
    'skills/dev/visual-ship.md',
  ],
  'e2e': [
    'skills/e2e/SKILL.md',
    'docs/agents/invocation.md',
    'skills/dev/visual-ship.md',
    'skills/design/SKILL.md',
    'skills/design/BRIEF-INFERENCE.md',
    'skills/design/ANTI-SLOP.md',
    'skills/design/QUALITY-BAR.md',
    'skills/design/CSS-INTENT.md',
    'skills/design/VISUAL-ACCEPTANCE.md',
    'skills/design/design-spec-template.md',
    'skills/design/PREFLIGHT.md',
    'skills/design/REDESIGN.md',
  ],
  'code-review': [
    'skills/code-review/SKILL.md',
    'skills/code-review/standards-baseline.md',
    'skills/code-review/simplify-baseline.md',
    REVIEW_FIX_PROTOCOL,
  ],
  'devops': [
    'skills/devops/SKILL.md',
    'skills/devops/incident-templates.md',
    'docs/agents/knowledge.md',
    'docs/agents/ops-cms-mcp.md',
    'docs/agents/invocation.md',
  ],
  'setup': [
    'skills/setup/SKILL.md',
    'skills/setup/execution-profile.md',
    'docs/agents/knowledge.md',
    'docs/agents/ops-cms-mcp.md',
    'skills/setup/language.md',
    'skills/setup/issue-tracker-github.md',
    'skills/setup/issue-tracker-gitlab.md',
    'skills/setup/issue-tracker-local.md',
    'skills/setup/domain.md',
    'skills/setup/context-format.md',
    'skills/setup/adr-format.md',
    'skills/setup/triage-labels.md',
    'skills/setup/design.md',
    'skills/setup/requirements.md',
    'skills/setup/stack-profile.md',
    'skills/setup/voice-rule.mdc',
    'skills/build-feature-map/pointer-template.md',
    'skills/build-feature-map/repo-skill-template.md',
    'skills/build-feature-map/index-template.md',
  ],
  'align': [
    'skills/align/SKILL.md',
    'skills/align-loop/GRILL-FORMAT.md',
    'skills/setup/domain.md',
    'skills/setup/context-format.md',
    'skills/setup/adr-format.md',
  ],
  'arch': [
    'skills/arch/SKILL.md',
    'skills/arch/DEEPENING.md',
    'skills/arch/DESIGN-IT-TWICE.md',
    'skills/setup/stack-profile.md',
    'skills/dev/stack-defaults.md',
    'skills/align-loop/GRILL-FORMAT.md',
    'docs/agents/knowledge.md',
  ],
  'dev': [
    'skills/dev/SKILL.md',
    REVIEW_FIX_PROTOCOL,
    'skills/dev/tdd-guide.md',
    'skills/dev/solution-ladder.md',
    'skills/dev/characterization.md',
    'skills/dev/debug-loop.md',
    'skills/dev/scope-self-check.md',
    'skills/dev/stack-defaults.md',
    'skills/dev/status-report.md',
    'skills/dev/visual-ship.md',
    'docs/agents/knowledge.md',
    'docs/agents/invocation.md',
    'skills/design/SKILL.md',
    'skills/design/design-spec-template.md',
    'skills/design/PREFLIGHT.md',
    'skills/design/REDESIGN.md',
    'skills/design/ANTI-SLOP.md',
    'skills/design/BRIEF-INFERENCE.md',
    'skills/design/QUALITY-BAR.md',
    'skills/design/CSS-INTENT.md',
    'skills/design/VISUAL-ACCEPTANCE.md',
  ],
  'craft': [
    'skills/craft/SKILL.md',
    'skills/craft/glossary.md',
    'docs/agents/invocation.md',
    'docs/adr/0001-skill-setup-dependencies.md',
    'docs/agents/knowledge.md',
  ],
  'build-feature-map': [
    'skills/build-feature-map/SKILL.md',
    'skills/build-feature-map/feature-file-template.md',
    'skills/build-feature-map/repo-skill-template.md',
    'skills/build-feature-map/index-template.md',
    'skills/build-feature-map/pointer-template.md',
  ],
} as const

export type EngineeringSkillName = keyof typeof ENGINEERING_SKILL_PATHS
const MANUAL_ENGINEERING_SKILLS: readonly EngineeringSkillName[] = ['setup', 'craft', 'build-feature-map', 'align', 'arch-refactor', 'e2e']

export type WorkSkillName = keyof typeof WORK_SKILL_PATHS

export const WORK_REFERENCE_PATHS: Partial<Record<WorkSkillName, readonly string[]>> = {
  docs: [...DOCS_REFERENCE_PATHS, PORTABLE_SKILL_STANDARD],
  research: ['docs/agents/client-compatibility.md', PORTABLE_SKILL_STANDARD],
  business: ['docs/agents/client-compatibility.md', PORTABLE_SKILL_STANDARD],
  bug: ['docs/agents/client-compatibility.md', PORTABLE_SKILL_STANDARD],
  plan: ['docs/agents/client-compatibility.md', PORTABLE_SKILL_STANDARD],
  comms: ['docs/agents/client-compatibility.md', PORTABLE_SKILL_STANDARD],
  release: ['docs/agents/client-compatibility.md', PORTABLE_SKILL_STANDARD],
  task: ['docs/agents/client-compatibility.md', PORTABLE_SKILL_STANDARD],
  track: ['docs/agents/client-compatibility.md', PORTABLE_SKILL_STANDARD, 'skills/align-loop/GRILL-FORMAT.md'],
  review: ['docs/agents/client-compatibility.md', PORTABLE_SKILL_STANDARD],
  qa: ['docs/agents/client-compatibility.md', PORTABLE_SKILL_STANDARD],
}
export type SkillPackName = 'reqs' | 'design' | WorkSkillName | EngineeringSkillName

export type SkillInvocationPolicy = {
  /** Native clients must preserve frontmatter/manual selection rules. */
  nativeInvocation: 'explicit' | 'model'
  /** Conversational MCP selects by intent; special workflows require a clearly requested outcome or bounded assignment. */
  mcpSelection: 'intent' | 'explicit-intent'
}

export function skillInvocationPolicy(name: SkillPackName): SkillInvocationPolicy {
  const explicitIntent = isEngineeringSkill(name) && MANUAL_ENGINEERING_SKILLS.includes(name)
  return {
    nativeInvocation: explicitIntent || name === 'reqs' || name === 'design' || name === 'docs' ? 'explicit' : 'model',
    mcpSelection: explicitIntent ? 'explicit-intent' : 'intent',
  }
}

const PACK_DESCRIPTIONS: Record<SkillPackName, string> = {
  'align-loop': "Decision-tree grilling, calibrated questioning and explicit decision branches",
  'domain-modeling': "Active domain vocabulary, glossary and ADR changes",
  'arch-refactor': "Evidence-led repository architecture assessment and deepening candidates",
  'collab': "Coordinate feature preparation across product, architecture and design before implementation",
  'e2e': "Browser automation harness, journey tests, flake elimination and CI sharding",
  reqs: 'Requirements discovery, enterprise and lean PRDs, stories and authorized publication',
  design: 'UI design specifications with optional Polyms UI Kit references',
  research: 'Evidence-based research and comparative analysis',
  business: 'Business cases, pricing, costs and decision analysis',
  docs: 'Business and technical documentation',
  task: 'Work tickets and dependency-ordered vertical slicing',
  bug: 'Evidence-based and reproducible defect reports',
  track: 'Ticket inspection, verified updates and engineering triage',
  plan: 'Effort estimation, delivery planning, capacity and dependencies',
  qa: 'Functional test design, UAT and environment-specific QA evidence',
  comms: 'Professional messages, client replies and stakeholder updates',
  review: 'Evidence-based artifact critique, gap analysis and assumption challenge',
  release: 'Go-live readiness, rollout, rollback and release notes',
  'code-review': 'Three-axis source code and PR review: Standards, Spec and Simplify',
  'devops': 'Evidence-based deploy, CI and infrastructure diagnosis',
  'setup': 'Project integration and execution profile configuration',
  'align': 'Combined plan alignment session using decision grilling and domain modeling',
  'arch': 'Deep-module architecture vocabulary, interface and seam design',
  'dev': 'Implementation from spec and disciplined debugging',
  'craft': 'Author, audit and improve AI skill methodology',
  'build-feature-map': 'Build and maintain project-owned behavior maps',
}

export type SkillPackFile = {
  path: string
  rawUrl: string
}

export type SkillPackSummary = SkillInvocationPolicy & {
  name: SkillPackName
  skillRawUrl: string
  description: string
  useWhen: readonly string[]
  avoidWhen: string
  starterPaths: string[]
  relatedSkills: readonly SkillPackName[]
  /** Legacy engineering-pack field; use nativeInvocation and mcpSelection for new clients. */
  invocation?: 'explicit' | 'model'
  contract: SkillContract
}

export type ReqsSkillPack = SkillInvocationPolicy & {
  name: 'reqs'
  contract: SkillContract
  files: SkillPackFile[]
}

export type DesignSkillPack = SkillInvocationPolicy & {
  name: 'design'
  contract: SkillContract
  files: SkillPackFile[]
  uiKit: SkillPackFile[]
}

export type WorkSkillPack = SkillInvocationPolicy & { name: WorkSkillName; contract: SkillContract; files: SkillPackFile[] }
export type EngineeringSkillPack = SkillInvocationPolicy & {
  name: EngineeringSkillName
  contract: SkillContract
  files: SkillPackFile[]
  invocation: 'explicit' | 'model'
}
export type SkillPack = ReqsSkillPack | DesignSkillPack | WorkSkillPack | EngineeringSkillPack

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
    ...skillInvocationPolicy(name),
    ...(isEngineeringSkill(name) ? { invocation: engineeringInvocation(name) } : {}),
  }))
}

function isEngineeringSkill(name: string): name is EngineeringSkillName {
  return Object.hasOwn(ENGINEERING_SKILL_PATHS, name)
}

function engineeringInvocation(name: EngineeringSkillName): 'explicit' | 'model' {
  return MANUAL_ENGINEERING_SKILLS.includes(name) ? 'explicit' : 'model'
}

/** Old workflow names resolve to canonical packs but never compete in the catalog. */
export const LEGACY_SKILL_ALIASES = {
  'to-prd': 'reqs',
  'to-issues': 'task',
  'triage': 'track',
} as const satisfies Record<string, SkillPackName>

export const LEGACY_WORKFLOW_PATHS = {
  'to-prd': 'skills/reqs/lean-prd-workflow.md',
  'to-issues': 'skills/task/vertical-slicing.md',
  triage: 'skills/track/triage-workflow.md',
} as const satisfies Record<keyof typeof LEGACY_SKILL_ALIASES, string>

/** Metadata only: the legacy name selects a branch, never grants action authority. */
export function legacyWorkflow(name: string) {
  if (!Object.hasOwn(LEGACY_SKILL_ALIASES, name)) return undefined
  const alias = name as keyof typeof LEGACY_SKILL_ALIASES
  const canonical = LEGACY_SKILL_ALIASES[alias]
  const workflowPath = LEGACY_WORKFLOW_PATHS[alias]
  return {
    requestedName: alias,
    canonical,
    workflowPath,
    starterPaths: [...new Set([...starterPaths(canonical), workflowPath])],
  }
}

export function canonicalSkillName(name: string): string {
  return Object.hasOwn(LEGACY_SKILL_ALIASES, name)
    ? LEGACY_SKILL_ALIASES[name as keyof typeof LEGACY_SKILL_ALIASES]
    : name
}

export function getSkillPack(name: string): SkillPack | null {
  name = canonicalSkillName(name)
  if (isEngineeringSkill(name)) {
    return {
      name,
      contract: SKILL_CONTRACTS[name],
      invocation: engineeringInvocation(name),
      ...skillInvocationPolicy(name),
      files: toFiles([
        ...ENGINEERING_SKILL_PATHS[name],
        PORTABLE_SKILL_STANDARD,
        'docs/agents/client-compatibility.md',
        WORK_ARTIFACT_STANDARD,
        ...compositionPaths(name),
      ]),
    }
  }
  if (name === 'reqs') {
    return {
      name: 'reqs',
      contract: SKILL_CONTRACTS.reqs,
      ...skillInvocationPolicy('reqs'),
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
      ...skillInvocationPolicy('design'),
      files: toFiles([...DESIGN_SKILL_PATHS, ...DESIGN_REFERENCE_PATHS, ...compositionPaths('design')]),
      uiKit: toFiles(UI_KIT_SKILL_PATHS),
    }
  }
  if (Object.hasOwn(WORK_SKILL_PATHS, name)) {
    const workName = name as WorkSkillName
    const references = WORK_REFERENCE_PATHS[workName] ?? []
    return {
      name: workName,
      contract: SKILL_CONTRACTS[workName],
      ...skillInvocationPolicy(workName),
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
  if (name === 'design') return [entry, CONTEXT_PROTOCOL, PORTABLE_SKILL_STANDARD]
  if (isEngineeringSkill(name)) {
    const paths = ENGINEERING_SKILL_PATHS[name]
    const core = name === 'setup' ? paths.slice(1, 2) : []
    return [entry, PORTABLE_SKILL_STANDARD, CONTEXT_PROTOCOL, WORK_ARTIFACT_STANDARD, ...core]
  }
  const paths = [entry, WORK_ARTIFACT_STANDARD, CONTEXT_PROTOCOL]
  paths.push(PORTABLE_SKILL_STANDARD)
  if (name !== 'reqs' && SKILL_ROUTING[name].starter === 'primary') {
    paths.push(WORK_SKILL_PATHS[name][1])
  }
  return paths
}
