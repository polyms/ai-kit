export type SkillStatus = 'available' | 'planned'
export type SkillInvocation = 'user' | 'model'
export type SkillDomain =
  | 'repo-config'
  | 'alignment'
  | 'requirements'
  | 'triage'
  | 'design'
  | 'implementation'
  | 'review'
  | 'authoring'
  | 'architecture'
  | 'devops'

export type AgentPanel = {
  role: string
  owns: string | string[]
  invokeHint: string
}

export type SkillPipeline =
  | string
  | {
      upstream?: string | string[]
      downstream?: string | string[]
    }

export type SkillOverlay = {
  name: string
  invoke: string
  slug: string
  description: string
  status: SkillStatus
  invocation: SkillInvocation
  domain: SkillDomain
  githubPath: string
  summary?: string
  whenToUse?: string
  pipeline?: SkillPipeline
  boundaries?: string
  agentPanel?: AgentPanel
  samplePrompt?: string
  footnote?: string
  relatedAgents?: string[]
}

export const GITHUB_REPO = 'https://github.com/polyms/ai-kit'

export const skillOverlays: SkillOverlay[] = [
  {
    name: 'setup',
    invoke: '/setup',
    slug: 'setup',
    description: 'Configure a repo for the ai-kit pipeline — issue tracker, domain docs, agent pointers.',
    status: 'available',
    invocation: 'user',
    domain: 'repo-config',
    samplePrompt: '/setup',
    githubPath: 'skills/setup/',
    summary:
      'One-time repo configuration so the ai-kit pipeline has issue tracker hooks, domain docs layout, and agent pointers.',
    whenToUse:
      'New repo or first time wiring ai-kit into a project. Run before `/to-prd`, `/to-issues`, or `/triage` (hard setup dependency).',
    pipeline: {
      upstream: 'Bootstrap (`bootstrap.sh`) — symlink skills into your editor',
      downstream: '/align, /pm, /triage, and the rest of the pipeline',
    },
    boundaries: 'Not bootstrap install — that is symlink setup. Not ongoing repo maintenance.',
  },
  {
    name: 'align',
    invoke: '/align',
    slug: 'align',
    description:
      'Align on a plan before building — relentless grill (design tree, A–D options), sharpen domain language, update CONTEXT.md and ADRs as you go.',
    status: 'available',
    invocation: 'user',
    domain: 'alignment',
    samplePrompt: '/align\n\nGrill kế hoạch [feature] — một câu một lần, chọn A/B/C/D.',
    footnote: 'Kèm align-loop + domain-modeling (model-invoked)',
    githubPath: 'skills/align/',
    relatedAgents: ['align-agent'],
    agentPanel: {
      role: 'PRINCIPAL ENGINEER',
      owns: ['CONTEXT.md', 'ADRs', 'alignment grill'],
      invokeHint: 'Use the align-agent to grill [plan or feature]',
    },
    summary:
      'Close the communication gap before PM, design, or dev — make implicit decisions explicit and land vocabulary in CONTEXT.md.',
    whenToUse:
      'Before `/pm`, `/to-prd`, `/design`, or `/dev` when scope, terms, or trade-offs are still fuzzy.',
    pipeline: {
      upstream: 'Idea or rough plan',
      downstream: '/pm or /to-prd → /design → /dev',
    },
    boundaries: 'Not a PRD draft or user-story list — that is `/pm`. Not implementation.',
  },
  {
    name: 'pm',
    invoke: '/pm',
    slug: 'pm',
    description:
      'Product management and requirements — PRDs, user stories, acceptance criteria, scope, MVP, MoSCoW, RICE.',
    status: 'available',
    invocation: 'model',
    domain: 'requirements',
    samplePrompt:
      '/pm\n\nWrite a PRD for [feature].\nUsers: [who]. Success metric: [what]. Deadline: [when].',
    githubPath: 'skills/pm/',
    relatedAgents: ['pm-agent'],
    agentPanel: {
      role: 'PRINCIPAL PM',
      owns: ['PRD', 'user stories', 'acceptance criteria', 'scope'],
      invokeHint: 'Use the pm-agent to write a PRD for [feature]',
    },
    summary:
      'Turn ideas into engineering-ready specs — PRD, stories, and acceptance criteria the team can build and review against.',
    whenToUse:
      'After `/align` when you need discovery, formal PRD, prioritization, or stakeholder-ready requirements.',
    pipeline: {
      upstream: '/align (recommended)',
      downstream: '/to-issues, /design, /dev',
    },
    boundaries:
      'Not a lean publish-from-chat PRD — use `/to-prd` for that. Not UI layout — that is `/design`.',
  },
  {
    name: 'to-prd',
    invoke: '/to-prd',
    slug: 'to-prd',
    description:
      'Synthesize the current conversation into a lean PRD and publish it to the issue tracker — no interview.',
    status: 'available',
    invocation: 'user',
    domain: 'requirements',
    samplePrompt: '/to-prd\n\nChốt PRD từ cuộc chat này — publish lên GitHub.',
    githubPath: 'skills/to-prd/',
    summary:
      'When the conversation is already aligned, synthesize it into a lean PRD and publish to the issue tracker — no PM interview.',
    whenToUse: 'After `/align` when decisions are settled and you want a published PRD issue quickly.',
    pipeline: {
      upstream: '/align',
      downstream: '/to-issues, /design',
    },
    boundaries:
      'Not discovery or scope negotiation — use `/pm` when gaps remain. Requires `/setup` (hard dependency).',
  },
  {
    name: 'to-issues',
    invoke: '/to-issues',
    slug: 'to-issues',
    description:
      'Break a plan, spec, or PRD into independently-grabbable GitHub issues using tracer-bullet vertical slices.',
    status: 'available',
    invocation: 'user',
    domain: 'requirements',
    samplePrompt: '/to-issues\n\nBẻ PRD #42 thành issues — vertical slices, publish lên GitHub.',
    githubPath: 'skills/to-issues/',
    summary:
      'Split an approved PRD or plan into vertical-slice GitHub issues agents can pick up independently.',
    whenToUse: 'PRD or plan is approved and you need tracker-ready work items.',
    pipeline: {
      upstream: '/pm or /to-prd',
      downstream: '/dev (via agent briefs or direct pickup)',
    },
    boundaries: 'Not triage of raw issues — that is `/triage`. Requires `/setup` (hard dependency).',
  },
  {
    name: 'triage',
    invoke: '/triage',
    slug: 'triage',
    description:
      'Move GitHub issues through a triage state machine — categorise, verify, grill if needed, write agent briefs.',
    status: 'available',
    invocation: 'user',
    domain: 'triage',
    samplePrompt:
      '/triage\n\nShow me what needs attention.\nPhân loại issue #42 — verify và viết agent brief.',
    githubPath: 'skills/triage/',
    summary:
      'Process raw GitHub issues through triage states — verify, grill when needed, attach agent briefs for `/dev`.',
    whenToUse: 'Backlog has unverified issues or you need `ready-for-agent` briefs before implementation.',
    pipeline: {
      upstream: 'Raw GitHub issues',
      downstream: '/dev → /code-review',
    },
    boundaries:
      'Not splitting a PRD into new issues — that is `/to-issues`. Requires `/setup` (hard dependency).',
  },
  {
    name: 'design',
    invoke: '/design',
    slug: 'design',
    description:
      'Turn a PRD or feature brief into an engineering-ready design spec mapped to @polyms/core-ui.',
    status: 'available',
    invocation: 'user',
    domain: 'design',
    samplePrompt: '/design\n\nThiết kế màn hình từ PRD #42 — spec giao diện.',
    githubPath: 'skills/design/',
    relatedAgents: ['design-agent'],
    agentPanel: {
      role: 'PRINCIPAL DESIGNER',
      owns: ['docs/design/', '@polyms/core-ui component maps'],
      invokeHint: 'Use the design-agent to spec UI from PRD #42',
    },
    summary:
      'Produce engineering-ready UI specs at `docs/design/<feature>.md` — flows, four states, a11y, and core-ui maps.',
    whenToUse: 'PRD exists and UI flows or screens need a spec before `/dev` ships.',
    pipeline: {
      upstream: '/align → /pm or /to-prd',
      downstream: '/dev',
    },
    boundaries:
      'Not product scope rewrite (`/pm`). Not code seams (`arch`). Not core-ui API docs (`/core-ui` in lib repo).',
  },
  {
    name: 'dev',
    invoke: '/dev',
    slug: 'dev',
    description: 'Fullstack implementation with TDD and disciplined debugging.',
    status: 'available',
    invocation: 'model',
    domain: 'implementation',
    samplePrompt: '/dev\n\nImplement [feature] from PRD at docs/prd/feature-x.md',
    githubPath: 'skills/dev/',
    relatedAgents: ['dev-agent'],
    agentPanel: {
      role: 'PRINCIPAL ENGINEER',
      owns: ['production code', 'TDD', 'debugging'],
      invokeHint: 'Use the dev-agent to implement [feature] from spec',
    },
    summary:
      'Ship production code from PRD, design spec, or agent brief — TDD at confirmed seams, tight debug loops.',
    whenToUse: 'Spec is ready (`ready-for-agent` issue, PRD, or `docs/design/`). Pick up vertical slices.',
    pipeline: {
      upstream: '/design or agent brief from `/triage`',
      downstream: '/code-review',
    },
    boundaries:
      'Not requirements or UI spec authoring. Pre-merge review is `code-review`, not part of the dev loop.',
  },
  {
    name: 'code-review',
    invoke: '/code-review',
    slug: 'code-review',
    description: 'Review code changes since a pinned git fixed point — Standards and Spec axes.',
    status: 'available',
    invocation: 'model',
    domain: 'review',
    samplePrompt: '/code-review\n\nReview diff since main.\nRà soát code trên branch này so với main.',
    githubPath: 'skills/code-review/',
    summary:
      'Two-axis review (Standards + Spec) since a pinned git point — parallel sub-agents, side-by-side findings.',
    whenToUse: 'Before merge or when asked to review a branch, PR, or diff.',
    pipeline: {
      upstream: '/dev',
      downstream: 'Ship',
    },
    boundaries: 'Not lint-only or generic PR comment — pinned baseline and spec axis required.',
  },
  {
    name: 'craft',
    invoke: '/craft',
    slug: 'craft',
    description: 'Reference for writing and editing ai-kit skills — predictability, invocation, pruning.',
    status: 'available',
    invocation: 'user',
    domain: 'authoring',
    samplePrompt: '/craft\n\nReview skills/pm/SKILL.md for sprawl and no-ops.',
    githubPath: 'skills/craft/',
    summary: 'Author and edit ai-kit skills — invocation rules, predictability, sprawl control, and pruning.',
    whenToUse: 'Creating or refactoring skills under `skills/` or `agents/`.',
    pipeline: {
      upstream: 'Skill or agent file to improve',
      downstream: 'Committed skill changes',
    },
    boundaries: 'Not product features in application repos — meta-authoring for ai-kit only.',
  },
  {
    name: 'arch-refactor',
    invoke: '/arch-refactor',
    slug: 'arch-refactor',
    description:
      'Scan codebase for deepening opportunities, present visual HTML report, then grill the candidate you pick.',
    status: 'available',
    invocation: 'user',
    domain: 'architecture',
    samplePrompt: '/arch-refactor\n\nRà soát kiến trúc — tìm chỗ deepen module.',
    githubPath: 'skills/arch-refactor/',
    summary: 'Maintenance scan for module deepening — HTML report, then grill the candidate you choose.',
    whenToUse: 'Refactor or architecture improvement pass on an existing codebase.',
    pipeline: {
      upstream: 'Codebase with deepening debt',
      downstream: '/align or `/dev` on chosen candidate',
    },
    boundaries:
      'Not greenfield architecture vocabulary — that is model-invoked `arch`. Not `/dev` implementation by default.',
  },
  {
    name: 'arch',
    invoke: '/arch',
    slug: 'arch',
    description:
      'Architecture vocabulary for deep modules — seam, depth, leverage, locality, design-it-twice.',
    status: 'available',
    invocation: 'model',
    domain: 'architecture',
    footnote: 'Model-invoked — agent reaches via description when placing seams.',
    githubPath: 'skills/arch/',
    summary:
      'Vocabulary for deep modules — seams, depth, leverage, locality. Other skills reach it when placing boundaries.',
    whenToUse:
      'Automatically when designing module seams or deepening interfaces; invoke explicitly for architecture discussions.',
    pipeline: {
      upstream: 'Implementation or design context',
      downstream: 'Informed `/dev` or `/design` decisions',
    },
    boundaries: 'Not visual UI design. Not the arch-refactor maintenance scan workflow.',
  },
  {
    name: 'devops',
    invoke: '/devops',
    slug: 'devops',
    description: 'Deploy, CI, and infra — symptom → fix via runbooks at `docs/runbooks/`.',
    status: 'planned',
    invocation: 'user',
    domain: 'devops',
    githubPath: 'skills/devops/',
    relatedAgents: ['devops-agent'],
    agentPanel: {
      role: 'PRINCIPAL DEVOPS',
      owns: ['runbooks', 'stack profiles', 'deploy/CI fixes'],
      invokeHint: 'Use the devops-agent to [symptom]',
    },
    summary:
      'Deploy, CI, and infra ownership — read runbooks first, apply symptom → cause → fix → verify before guessing config.',
    whenToUse:
      'Vercel/build failures, monorepo deploy traps, CI infra changes — after checking `docs/runbooks/`.',
    pipeline: {
      upstream: 'App deploy docs (e.g. `apps/*/DEPLOY.md`)',
      downstream: 'Verified deploy/CI green state',
    },
    boundaries:
      'Not application feature code — operational playbooks and infra config. Skill file not shipped yet (planned).',
  },
]
