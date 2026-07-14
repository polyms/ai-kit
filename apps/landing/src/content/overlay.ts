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
  | 'docs'
  | 'e2e'

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
      downstream: '/align, /reqs, /triage, and the rest of the pipeline',
    },
    boundaries: 'Not bootstrap install — that is symlink setup. Not ongoing repo maintenance.',
  },
  {
    name: 'align',
    invoke: '/align',
    slug: 'align',
    description:
      'Align on a plan before building — relentless grill (design tree, lettered options), sharpen domain language, update CONTEXT.md and ADRs as you go.',
    status: 'available',
    invocation: 'user',
    domain: 'alignment',
    samplePrompt: '/align\n\nGrill kế hoạch [feature] — một câu một lần, chọn A/B/C/D.',
    footnote: 'Kèm align-loop + domain-modeling (model-invoked). Interactive grill — no subagent.',
    githubPath: 'skills/align/',
    summary:
      'Close the communication gap before `/reqs`, `/design`, or `/dev` — make implicit decisions explicit and land vocabulary in CONTEXT.md.',
    whenToUse:
      'Before `/reqs`, `/to-prd`, `/design`, or `/dev` when scope, terms, or trade-offs are still fuzzy.',
    pipeline: {
      upstream: 'Idea or rough plan',
      downstream: '/reqs or /to-prd → /design → /dev',
    },
    boundaries:
      'Not a PRD draft — that is `/reqs` (enterprise) or `/to-prd` (lean publish). Not implementation.',
  },
  {
    name: 'reqs',
    invoke: '/reqs',
    slug: 'reqs',
    description:
      'Requirements — discovery, enterprise PRD, user stories, acceptance criteria, scope, MVP, MoSCoW, RICE. Does not publish — after align use `/to-prd`.',
    status: 'available',
    invocation: 'user',
    domain: 'requirements',
    samplePrompt:
      '/reqs\n\nWrite an enterprise PRD for [feature].\nUsers: [who]. Success metric: [what]. Deadline: [when].',
    githubPath: 'skills/reqs/',
    relatedAgents: ['pm'],
    agentPanel: {
      role: 'PRINCIPAL PM',
      owns: ['PRD', 'user stories', 'acceptance criteria', 'scope'],
      invokeHint: 'Use the pm to write a PRD for [feature]',
    },
    summary:
      'Turn ideas into engineering-ready specs — enterprise PRD and stories in chat. Does not publish to the tracker.',
    whenToUse:
      'When you need discovery, enterprise PRD, prioritization, or stakeholder-ready requirements — not the post-align publish path.',
    pipeline: {
      upstream: '/align (recommended)',
      downstream: '/to-prd (to publish), /to-issues, /design, /dev',
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
      'Not discovery or scope negotiation — use `/reqs` when gaps remain. Requires `/setup` (hard dependency).',
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
      upstream: '/reqs or /to-prd',
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
    relatedAgents: ['designer'],
    agentPanel: {
      role: 'PRINCIPAL DESIGNER',
      owns: ['docs/design/', '@polyms/core-ui component maps'],
      invokeHint: 'Use the designer to spec UI from PRD #42',
    },
    summary:
      'Produce engineering-ready UI specs at `docs/design/<feature>.md` — flows, four states, a11y, and core-ui maps.',
    whenToUse: 'PRD exists and UI flows or screens need a spec before `/dev` ships.',
    pipeline: {
      upstream: '/align → /reqs or /to-prd',
      downstream: '/dev',
    },
    boundaries:
      'Not product scope rewrite (`/reqs`). Not code seams (`arch`). Not core-ui API docs (`/core-ui` in lib repo).',
  },
  {
    name: 'dev',
    invoke: '/dev',
    slug: 'dev',
    description: 'Fullstack implementation with TDD, solution ladder, scope self-check, and debugging.',
    status: 'available',
    invocation: 'model',
    domain: 'implementation',
    samplePrompt: '/dev\n\nImplement [feature] from PRD at docs/prd/feature-x.md',
    githubPath: 'skills/dev/',
    relatedAgents: ['developer'],
    agentPanel: {
      role: 'PRINCIPAL ENGINEER',
      owns: ['production code', 'TDD', 'solution ladder', 'scope self-check', 'status report', 'debugging'],
      invokeHint: 'Use the developer to implement [feature] from spec',
    },
    summary:
      'Ship production code from PRD, design spec, or agent brief — solution ladder then TDD at confirmed seams, scope self-check before done, status report on multi-slice work, tight debug loops.',
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
    description: 'Review code changes since a pinned git fixed point — Standards, Spec, and Simplify axes.',
    status: 'available',
    invocation: 'model',
    domain: 'review',
    samplePrompt: '/code-review\n\nReview diff since main.\nRà soát code trên branch này so với main.',
    githubPath: 'skills/code-review/',
    relatedAgents: ['techlead'],
    agentPanel: {
      role: 'PRINCIPAL TECH LEAD',
      owns: ['Standards', 'Spec', 'Simplify', 'pre-merge gate'],
      invokeHint: 'Use the techlead to review diff since main',
    },
    summary:
      'Three-axis review (Standards + Spec + Simplify) since a pinned git point — parallel sub-agents, findings tagged 🔴 blocker / 🟡 suggestion / 💭 nit.',
    whenToUse:
      'Before merge or when asked to review a branch, PR, or diff — including over-engineering cuts.',
    pipeline: {
      upstream: '/dev',
      downstream: 'Ship',
    },
    boundaries: 'Not lint-only or generic PR comment — pinned baseline; Spec optional; Simplify always runs.',
  },
  {
    name: 'docs',
    invoke: '/docs',
    slug: 'docs',
    description:
      'Developer-facing documentation — API reference, tutorials, integration guides, migration notes.',
    status: 'available',
    invocation: 'user',
    domain: 'docs',
    samplePrompt:
      '/docs\n\nWrite a tutorial: wire Cursor to the kit MCP and search Knowledge with intent: incident.',
    githubPath: 'skills/docs/',
    relatedAgents: ['techlead'],
    agentPanel: {
      role: 'PRINCIPAL TECH LEAD',
      owns: ['API reference', 'tutorials', 'integration guides', 'migration notes'],
      invokeHint: 'Use the techlead to [task]',
    },
    summary:
      'Developer-facing docs for shipped surfaces — verify examples against code; not PRDs or feature implementation.',
    whenToUse: 'Public/integrator docs after a surface ships, or when API/tutorial drift is found.',
    pipeline: {
      upstream: '/dev (shipped seam) or existing schema/MCP',
      downstream: 'Published docs path / optional `/e2e` how-to',
    },
    boundaries: 'Not `/reqs` requirements. Not `/dev` feature code. Not marketing copy.',
  },
  {
    name: 'e2e',
    invoke: '/e2e',
    slug: 'e2e',
    description: 'End-to-end test automation — Playwright flake, CI parallelization, journey suites, traces.',
    status: 'available',
    invocation: 'user',
    domain: 'e2e',
    samplePrompt:
      '/e2e\n\nPlaywright CI flakes on checkout journey — stabilize waits and quarantine with owner.',
    githubPath: 'skills/e2e/',
    relatedAgents: ['tester'],
    agentPanel: {
      role: 'PRINCIPAL TESTER',
      owns: ['Playwright suite', 'flake elimination', 'CI sharding', 'traces'],
      invokeHint: 'Use the tester to [task]',
    },
    summary:
      'E2E harness and CI test-job health — flakes, shards, journeys. Skill id `e2e`; agent id `tester`.',
    whenToUse: 'Flaky or slow E2E CI, new critical journey coverage, trace-driven triage of test jobs.',
    pipeline: {
      upstream: 'CI test failure or suite map',
      downstream: '/dev (product bug) · `/devops` (deploy) · `/code-review`',
    },
    boundaries:
      'Not seam TDD (`/dev`). Not deploy/build Knowledge fixes (`/devops`). Not pre-merge three-axis review.',
  },
  {
    name: 'craft',
    invoke: '/craft',
    slug: 'craft',
    description: 'Reference for writing and editing ai-kit skills — predictability, invocation, pruning.',
    status: 'available',
    invocation: 'user',
    domain: 'authoring',
    samplePrompt: '/craft\n\nReview skills/reqs/SKILL.md for sprawl and no-ops.',
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
    relatedAgents: ['techlead'],
    agentPanel: {
      role: 'PRINCIPAL TECH LEAD',
      owns: ['deepening scan', 'HTML report', 'grill candidate'],
      invokeHint: 'Use the techlead to scan for deepening opportunities',
    },
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
    relatedAgents: ['techlead'],
    agentPanel: {
      role: 'PRINCIPAL TECH LEAD',
      owns: ['seams', 'depth', 'leverage', 'design-it-twice'],
      invokeHint: 'Use the techlead to place seams for [module]',
    },
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
    description:
      'Deploy, CI, and infra — symptom → fix via Knowledge (`intent: incident`); SEV/post-mortem templates.',
    status: 'available',
    invocation: 'model',
    domain: 'devops',
    samplePrompt:
      '/devops\n\nVercel deploy failed on TanStack Start monorepo — search Knowledge (intent: incident) before changing config.',
    githubPath: 'skills/devops/',
    relatedAgents: ['developer', 'techlead'],
    agentPanel: {
      role: 'PRINCIPAL ENGINEER · TECH LEAD',
      owns: ['incident knowledge', 'stack profiles', 'deploy/CI fixes', 'SEV/post-mortem'],
      invokeHint: 'Use the developer to [symptom] — or techlead for SEV ownership',
    },
    summary:
      'Deploy, CI, and infra — retrieve Knowledge with `intent: incident`, apply symptom → cause → fix → verify, then close with SEV/status/post-mortem templates.',
    whenToUse:
      'Vercel/build failures, monorepo deploy traps, CI infra changes — search Knowledge (`intent: incident`) first.',
    pipeline: {
      upstream: 'App deploy docs (e.g. `apps/*/DEPLOY.md`)',
      downstream: 'Verified deploy/CI green state (+ post-mortem when SEV1/SEV2)',
    },
    boundaries:
      'Not application feature code — operational playbooks and infra config. Design seams → `/arch`; feature work → `/dev`.',
  },
]
