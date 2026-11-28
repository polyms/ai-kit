import type { McpServer } from '@modelcontextprotocol/server'
import { z } from 'zod'

export const FEEDBACK_REPOSITORY = 'polyms/ai-kit'
export const FEEDBACK_CATEGORIES = [
  'skill', 'workflow', 'template', 'documentation', 'bug', 'suggestion', 'other', 'knowledge',
] as const

export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number]
const knowledgeContributionSchema = z.object({
  intent: z.enum(['incident', 'design', 'toolchain']),
  disposition: z.enum(['new', 'update']),
  applicability: z.string().trim().min(1).max(1000),
  evidence: z.string().trim().min(1).max(1500),
  overlap: z.string().trim().min(1).max(1200),
  target: z.string().trim().min(1).max(200).optional(),
})

export type FeedbackInput = {
  description: string
  category?: FeedbackCategory
  summary?: string
  client?: string
  skill?: string
  expected?: string
  actual?: string
  example?: string
  /** Required only for the additive knowledge category. description is the proposed guidance. */
  knowledge?: z.input<typeof knowledgeContributionSchema>
}

export const PREPARE_FEEDBACK_DESCRIPTION =
  'When a user voluntarily wants to give feedback about AI Kit, gather the small amount of useful context already in the chat and use this tool to draft a complete PUBLIC GitHub Issue in polyms/ai-kit. Show the title and body for the user to review and approve. AFTER explicit approval, if the AI client has a separately authenticated GitHub create_issue action WITH Issues write access to polyms/ai-kit, call it with the exact approved title/body and return its verified URL. A connected GitHub app may lack permissions on that repository. On any authorization or creation failure, report the error, do NOT automatically retry, and offer the prefilled issue URL instead. Never use the AI Kit OAuth token for GitHub, silently publish, or claim a successful write without a GitHub response. Without a GitHub connector, offer the prefilledUrl returned by this tool, not a blank form. No benchmark, traces, files or full chat transcript required. Remind the user the GitHub Issue is public and contains only sanitized details. For a voluntary shared Knowledge contribution (not skill feedback), set category: knowledge; description is the proposed generic technical guidance, knowledge contains intent, new/update disposition, applicability including stack/version, verified evidence/provenance, overlap search findings or explicitly unverified overlap, and the live target ID/slug for updates. Sanitize before calling. This prepares a candidate draft for maintainer review; submission is separate and never writes the Knowledge CMS. Do not require contributions or invoke this tool just because a skill completes; skip if the user has not chosen to contribute.'

const inputSchema = z.object({
  description: z.string().trim().min(8).max(2500),
  category: z.enum(FEEDBACK_CATEGORIES).optional(),
  summary: z.string().trim().max(100).optional(),
  client: z.string().trim().max(80).optional(),
  skill: z.string().trim().max(100).optional(),
  expected: z.string().trim().max(800).optional(),
  actual: z.string().trim().max(800).optional(),
  example: z.string().trim().max(1200).optional(),
  knowledge: knowledgeContributionSchema.optional(),
})

const sensitivePatterns = [
  /\b[a-z\d._%+-]+@[a-z\d.-]+\.[a-z]{2,}\b/i,
  /\b(?:github_pat_|ghp_|gho_|ghu_|ghs_|sk-(?:proj-)?)[a-z\d_-]{8,}\b/i,
  /\b(?:Authorization\s*:\s*(?:Bearer|Basic)|Bearer\s+[a-z\d._-]{12,})/i,
  /\b(?:password|passwd|api[_-]?key|client[_-]?secret)\s*[:=]\s*["']?\S{6,}/i,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
]

function stripControls(value: string): string {
  return value.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '')
}
function sanitize(value: string): string {
  return stripControls(value.trim())
    .replaceAll('<!--', '&lt;!--').replaceAll('-->', '--&gt;')
}
function appendSection(name: string, value?: string): string {
  return value?.trim() ? '\n## ' + name + '\n' + sanitize(value) + '\n' : ''
}
function likelySensitive(input: FeedbackInput): boolean {
  return [...Object.values(input), ...Object.values(input.knowledge ?? {})].some(value =>
    typeof value === 'string' && sensitivePatterns.some(pattern => pattern.test(value) || pattern.test(stripControls(value)))
  )
}

export function prepareFeedbackIssue(input: FeedbackInput) {
  const checked = inputSchema.safeParse(input)
  if (!checked.success) {
    return { status: 'invalid' as const, reason: input.category === 'knowledge'
      ? 'Supply a description (8–2500 characters) and valid Knowledge metadata; shorten optional fields if necessary.'
      : 'Supply a short feedback description (8–2500 characters), using shorter optional fields.' }
  }
  const value = checked.data
  if (likelySensitive(value)) {
    return {
      status: 'review_required' as const,
      reason: 'Potential sensitive content was detected; the tool has not drafted a public issue.',
      nextStep: 'Ask the user to redact or paraphrase the private content without echoing it.',
    }
  }

  const category = value.category ?? 'other'
  const contribution = value.knowledge
  if ((category === 'knowledge') !== (contribution !== undefined) ||
      (contribution?.disposition === 'update' && !contribution.target) ||
      (contribution?.disposition === 'new' && contribution.target !== undefined) ||
      (contribution && [value.description, contribution.applicability, contribution.evidence, contribution.overlap,
        ...(contribution.target === undefined ? [] : [contribution.target])].some(field => !stripControls(field).trim()))) {
    return { status: 'invalid' as const, reason: 'Knowledge contributions require category: knowledge and intent, disposition, applicability, evidence and overlap; provide an existing target only for updates.' }
  }
  const heading = (contribution ? sanitize(value.summary || value.description) : (value.summary || value.description)).replace(/\s+/g, ' ').trim()
    .replace(/[#\[\]]/g, '').slice(0, 85) || 'Feedback'
  const title = contribution ? '[Knowledge][' + contribution.intent + '] ' + heading : '[Feedback][' + category + '] ' + heading
  const context = [
    value.client?.trim() ? '- AI client: ' + sanitize(value.client) : '',
    value.skill?.trim() ? '- AI Kit skill/workflow: ' + sanitize(value.skill) : '',
  ].filter(Boolean).join('\n')
  const body = contribution ? [
    '## Knowledge contribution\n' + sanitize(value.description),
    '\n## Intent and disposition\n' + contribution.intent + ' / ' + contribution.disposition,
    appendSection('Existing target (ID/slug)', contribution.target),
    appendSection('Applicability (stack, versions, limitations)', contribution.applicability),
    appendSection('Evidence and provenance (sanitized)', contribution.evidence),
    appendSection('Overlap check (queries, matches or unverified)', contribution.overlap),
    context ? '\n## Context (optional)\n' + context : '',
    appendSection('Expected behavior (optional)', value.expected),
    appendSection('Observed behavior (optional)', value.actual),
    appendSection('Short sanitized example (optional)', value.example),
    '\n---\nPublic Knowledge candidate for maintainer review only. This issue is not CMS publication or a skill change.',
  ].filter(Boolean).join('\n').trim() : [
    '## Feedback\n' + sanitize(value.description),
    '\n## Category\n' + category,
    context ? '\n## Context\n' + context : '',
    appendSection('Expected behavior', value.expected),
    appendSection('Observed behavior', value.actual),
    appendSection('Short sanitized example (optional)', value.example),
    '\n---\nVoluntary public AI Kit feedback. A maintainer will review this issue.',
  ].filter(Boolean).join('\n').trim()
  // GitHub Issue Forms prefill custom fields by their YAML ids, rather than
  // treating a body= parameter as a form textarea. Keep this fallback aligned
  // with .github/ISSUE_TEMPLATE/feedback.yml.
  const formCategory: Record<FeedbackCategory, string> = {
    skill: 'Skill discovery / Chọn skill',
    workflow: 'Workflow guidance / Quy trình',
    template: 'Template / Mẫu tài liệu',
    documentation: 'Documentation / Hướng dẫn',
    bug: 'Bug / Lỗi',
    suggestion: 'Suggestion / Đề xuất',
    other: 'Other / Khác',
    knowledge: 'Knowledge contribution / Đóng góp Knowledge',
  }
  const formFeedback = contribution ? body : [
    value.description,
    value.expected ? 'Expected: ' + value.expected : '',
    value.actual ? 'Observed: ' + value.actual : '',
  ].filter(Boolean).join('\n\n')
  const formClient = ['ChatGPT', 'Cursor', 'Claude', 'Codex'].includes(value.client ?? '')
    ? value.client : value.client ? 'Other' : undefined
  function createFormUrl(feedback: string, includeOptional: boolean): string {
    const url = new URL('https://github.com/polyms/ai-kit/issues/new')
    url.searchParams.set('template', 'feedback.yml')
    url.searchParams.set('title', title)
    url.searchParams.set('feedback', feedback)
    url.searchParams.set('category', formCategory[category])
    // Knowledge's complete draft already includes optional context/example.
    if (includeOptional && !contribution && formClient) url.searchParams.set('client', formClient)
    if (includeOptional && !contribution && value.skill) url.searchParams.set('skill', value.skill)
    if (includeOptional && !contribution && value.example) url.searchParams.set('example', value.example)
    return url.toString()
  }
  let prefilledUrl = createFormUrl(formFeedback, true)
  let prefilledUrlTruncated = false
  if (prefilledUrl.length > 6800) {
    // Never return null: long Vietnamese text is percent-encoded and can exceed
    // browser URL limits. Fall back to a short, plainly labeled excerpt.
    prefilledUrlTruncated = true
    const excerpt = (contribution ? 'Knowledge candidate: ' + contribution.intent + ' / ' + contribution.disposition + '\n\n' : '') + Array.from(value.description).slice(0, 200).join('')
    prefilledUrl = createFormUrl(
      excerpt + '\n\n[Shortened for GitHub URL length. Review the full draft in the AI conversation.]',
      false,
    )
  }
  return {
    status: 'draft' as const,
    repository: FEEDBACK_REPOSITORY,
    public: true as const,
    requiresApproval: true as const,
    title,
    body,
    githubCreateIssue: { repository_full_name: FEEDBACK_REPOSITORY, title, body },
    prefilledUrl,
    prefilledUrlTruncated,
    nextStep: 'Show the user the exact title/body and obtain explicit confirmation. Then call the separately authorized host GitHub create_issue tool only if it has Issues write access to polyms/ai-kit. If access is absent or creation fails, report the failure without retries and provide the prefilled GitHub Issue Form URL. If prefilledUrlTruncated is true, clearly explain that the link contains an excerpt and the full approved draft is available in chat. The user still needs to check public-consent and possibly category on GitHub. Never claim submission without a real returned issue URL.' + (contribution ? ' This issue requests maintainer review only; never call upsert_knowledge on behalf of a contributor or report CMS publication.' : ''),
  }
}

export function registerFeedbackMcpTools(server: McpServer): void {
  server.registerTool(
    'prepare_feedback_issue',
    {
      description: PREPARE_FEEDBACK_DESCRIPTION,
      inputSchema,
    },
    async input => ({
      content: [{ type: 'text' as const, text: JSON.stringify(prepareFeedbackIssue(input)) }],
    })
  )
}
