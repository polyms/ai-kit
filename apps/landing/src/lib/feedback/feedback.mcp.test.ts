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
    expect(link.searchParams.get('template')).toBe('feedback.yml')
    expect(link.searchParams.get('title')).toBe(result.title)
    expect(link.searchParams.get('feedback')).toContain('The plan skill asked again')
    expect(link.searchParams.get('feedback')).toContain('Expected: Use the provided team size.')
    expect(link.searchParams.get('category')).toBe('Workflow guidance / Quy trình')
    expect(link.searchParams.get('client')).toBe('ChatGPT')
    expect(link.searchParams.get('skill')).toBe('plan')
    expect(result.prefilledUrlTruncated).toBe(false)
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

  it('always provides a safe shortened fallback for lengthy Unicode feedback', () => {
    const message = 'Góp ý về quy trình và tài liệu chưa nhất quán. '
    const result = prepareFeedbackIssue({
      description: message.repeat(50).slice(0, 2400),
      example: 'Trường hợp tái hiện đã được làm sạch. '.repeat(30),
      expected: 'Mong đợi '.repeat(50),
      actual: 'Thực tế '.repeat(50),
    })
    expect(result.status).toBe('draft')
    if (result.status !== 'draft') return
    expect(result.prefilledUrlTruncated).toBe(true)
    expect(result.prefilledUrl.length).toBeLessThanOrEqual(6800)
    const link = new URL(result.prefilledUrl)
    expect(link.searchParams.get('template')).toBe('feedback.yml')
    expect(link.searchParams.get('feedback')).toContain('Shortened for GitHub URL length')
    expect(link.searchParams.get('feedback')).not.toBe(result.body)
    expect(result.body).toContain('## Expected behavior')
    expect(result.body).toContain('## Short sanitized example')
  })

  it('the registered MCP handler returns the same draft contract as direct use', async () => {
    const registerTool = vi.fn()
    registerFeedbackMcpTools({ registerTool } as never)
    const handler = registerTool.mock.calls[0]?.[2]
    expect(typeof handler).toBe('function')
    const response = await handler({ description: 'Add a workflow tutorial for newcomers.' })
    const body = JSON.parse(response.content[0].text)
    expect(body.status).toBe('draft')
    expect(body.githubCreateIssue.repository_full_name).toBe('polyms/ai-kit')
    expect(body.requiresApproval).toBe(true)
  })

  it('rejects empty descriptions and never claims an issue was published', () => {
    expect(prepareFeedbackIssue({ description: '' }).status).toBe('invalid')
    const result = prepareFeedbackIssue({ description: 'I want an optional extra template.' })
    expect(result.status).toBe('draft')
    expect(result).not.toHaveProperty('issueNumber')
    expect(result).not.toHaveProperty('submitted')
  })
})
