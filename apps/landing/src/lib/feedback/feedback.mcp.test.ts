import { describe, expect, it, vi } from 'vitest'
import { prepareFeedbackIssue, registerFeedbackMcpTools, PREPARE_FEEDBACK_DESCRIPTION } from './feedback.mcp'

describe('AI Kit feedback issue drafting and authorized handoff', () => {
  it('registers a draft tool and explicitly requires user approval for publishing', () => {
    const registerTool = vi.fn()
    registerFeedbackMcpTools({ registerTool } as never)
    expect(registerTool.mock.calls.map(call => call[0])).toEqual(['prepare_feedback_issue'])
    expect(PREPARE_FEEDBACK_DESCRIPTION).toContain('explicit approval')
    expect(PREPARE_FEEDBACK_DESCRIPTION).toContain('create_issue')
  })

  it('returns fixed GitHub target, ready-to-file body and prefilled fallback', () => {
    const result = prepareFeedbackIssue({
      description: 'The plan skill asked again for the team size already in my prompt.',
      summary: 'Reuse known context in plan',
      category: 'workflow', client: 'ChatGPT', skill: 'plan',
      expected: 'Use the provided team size.', actual: 'Asked the same question again.',
    })
    expect(result.status).toBe('draft')
    if (result.status !== 'draft') return
    expect(result.public).toBe(true)
    expect(result.requiresApproval).toBe(true)
    expect(result.title).toBe('[Feedback][workflow] Reuse known context in plan')
    expect(result.body).toContain('## Expected behavior')
    expect(result.body).toContain('AI Kit skill/workflow: plan')
    expect(result.githubCreateIssue).toEqual({
      repository_full_name: 'polyms/ai-kit', title: result.title, body: result.body,
    })
    const link = new URL(result.prefilledUrl!)
    expect(link.pathname).toBe('/polyms/ai-kit/issues/new')
    expect(link.searchParams.get('title')).toBe(result.title)
    expect(link.searchParams.get('body')).toBe(result.body)
  })

  it('needs only natural language feedback, not a benchmark or tool logs', () => {
    const result = prepareFeedbackIssue({ description: 'Please add a clearer task template example.' })
    expect(result.status).toBe('draft')
    if (result.status !== 'draft') return
    expect(result.body).not.toContain('## Expected behavior')
  })

  it.each([
    'myname@company.example',
    'ghp_abcdefghijklmnopqrstuvwxyz1234',
    'sk-proj-abcdefghijklmnopqrstuvwxyz123',
    'Authorization: Bearer verylongprivatecredential',
    'password=supersecretword',
    '-----BEGIN PRIVATE KEY-----',
  ])('withholds likely sensitive content from public draft', secret => {
    const result = prepareFeedbackIssue({ description: 'My configuration included ' + secret })
    expect(result.status).toBe('review_required')
    expect(JSON.stringify(result)).not.toContain(secret)
  })

  it('rejects empty descriptions and never claims an issue was published', () => {
    expect(prepareFeedbackIssue({ description: '' }).status).toBe('invalid')
    const result = prepareFeedbackIssue({ description: 'I want an optional extra template.' })
    expect(result.status).toBe('draft')
    expect(result).not.toHaveProperty('issueNumber')
    expect(result).not.toHaveProperty('submitted')
  })
})
