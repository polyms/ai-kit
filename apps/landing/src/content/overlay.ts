export type SkillStatus = 'available'
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

export type SkillOverlay = {
  name: string
  invoke: string
  slug: string
  description: string
  status: SkillStatus
  invocation: SkillInvocation
  domain: SkillDomain
  samplePrompt?: string
  agentHint?: string
  footnote?: string
  githubPath: string
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
    agentHint: 'Use the pm-agent to write a PRD for [feature]',
    githubPath: 'skills/pm/',
    relatedAgents: ['pm-agent'],
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
    agentHint: 'Use the design-agent to spec UI from PRD #42',
    githubPath: 'skills/design/',
    relatedAgents: ['design-agent'],
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
  },
]
