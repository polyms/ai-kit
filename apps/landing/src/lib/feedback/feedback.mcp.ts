import type { McpServer } from '@modelcontextprotocol/server'
import { z } from 'zod'

export const FEEDBACK_REPOSITORY = 'polyms/ai-kit'
export const FEEDBACK_CATEGORIES = [
  'skill', 'workflow', 'template', 'documentation', 'bug', 'suggestion', 'other',
] as const

export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number]
export type FeedbackInput = {
  description: string
  category?: FeedbackCategory
  summary?: string
  client?: string
  skill?: string
  expected?: string
  actual?: string
  example?: string
}

export const PREPARE_FEEDBACK_DESCRIPTION =
  'When a user voluntarily wants to give feedback about AI Kit, gather the small amount of useful context already in the chat and use this tool to draft a complete PUBLIC GitHub Issue in polyms/ai-kit. Show the title and body for the user to review and approve. AFTER explicit approval, if the AI client has a separately authenticated GitHub create_issue action, call it with the exact approved title/body and return its verified URL. Never use the AI Kit OAuth token for GitHub, silently publish, or claim a successful write without a GitHub response. Without a GitHub connector, offer the prefilledUrl returned by this tool, not a blank form. No benchmark, traces, files or full chat transcript required. Remind the user the GitHub Issue is public and contains only sanitized details.'

const inputSchema = z.object({
  description: z.string().trim().min(8).max(2500),
  category: z.enum(FEEDBACK_CATEGORIES).optional(),
  summary: z.string().trim().max(100).optional(),
  client: z.string().trim().max(80).optional(),
  skill: z.string().trim().max(100).optional(),
  expected: z.string().trim().max(800).optional(),
  actual: z.string().trim().max(800).optional(),
  example: z.string().trim().max(1200).optional(),
})

const sensitivePatterns = [
  /\b[a-z\d._%+-]+@[a-z\d.-]+\.[a-z]{2,}\b/i,
  /\b(?:github_pat_|ghp_|gho_|ghu_|ghs_|sk-(?:proj-)?)[a-z\d_-]{8,}\b/i,
  /\b(?:Authorization\s*:\s*(?:Bearer|Basic)|Bearer\s+[a-z\d._-]{12,})/i,
  /\b(?:password|passwd|api[_-]?key|client[_-]?secret)\s*[:=]\s*["']?\S{6,}/i,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
]

function sanitize(value: string): string {
  return value.trim().replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '')
    .replaceAll('<!--', '&lt;!--').replaceAll('-->', '--&gt;')
}
function appendSection(name: string, value?: string): string {
  return value?.trim() ? '\n## ' + name + '\n' + sanitize(value) + '\n' : ''
}
function likelySensitive(input: FeedbackInput): boolean {
  return Object.values(input).some(value =>
    typeof value === 'string' && sensitivePatterns.some(pattern => pattern.test(value))
  )
}

export function prepareFeedbackIssue(input: FeedbackInput) {
  const checked = inputSchema.safeParse(input)
  if (!checked.success) {
    return { status: 'invalid' as const, reason: 'Supply a short feedback description (8–2500 characters), using shorter optional fields.' }
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
  const heading = (value.summary || value.description).replace(/\s+/g, ' ').trim()
    .replace(/[#\[\]]/g, '').slice(0, 85) || 'Feedback'
  const title = '[Feedback][' + category + '] ' + heading
  const context = [
    value.client?.trim() ? '- AI client: ' + sanitize(value.client) : '',
    value.skill?.trim() ? '- AI Kit skill/workflow: ' + sanitize(value.skill) : '',
  ].filter(Boolean).join('\n')
  const body = [
    '## Feedback\n' + sanitize(value.description),
    '\n## Category\n' + category,
    context ? '\n## Context\n' + context : '',
    appendSection('Expected behavior', value.expected),
    appendSection('Observed behavior', value.actual),
    appendSection('Short sanitized example (optional)', value.example),
    '\n---\nVoluntary public AI Kit feedback. A maintainer will review this issue.',
  ].filter(Boolean).join('\n').trim()
  const url = new URL('https://github.com/polyms/ai-kit/issues/new')
  url.searchParams.set('title', title)
  url.searchParams.set('body', body)
  return {
    status: 'draft' as const,
    repository: FEEDBACK_REPOSITORY,
    public: true as const,
    requiresApproval: true as const,
    title,
    body,
    githubCreateIssue: { repository_full_name: FEEDBACK_REPOSITORY, title, body },
    prefilledUrl: url.toString().length < 6800 ? url.toString() : null,
    nextStep: 'Show the user the exact title/body and obtain explicit confirmation. Then call the separately authorized host GitHub create_issue tool, if available. Otherwise provide the prefilled URL. Never claim submission without a real returned issue URL.',
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
