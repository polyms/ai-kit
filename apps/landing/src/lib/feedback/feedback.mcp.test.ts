import { describe, expect, it, vi } from 'vitest'
import { prepareFeedbackIssue, registerFeedbackMcpTools, PREPARE_FEEDBACK_DESCRIPTION } from './feedback.mcp'

describe('AI Kit feedback issue drafting and authorized handoff', () => {
  it('registers a draft tool and explicitly requires user approval for publishing', () => {
    const registerTool = vi.fn()
    registerFeedbackMcpTools({ registerTool } as never)
    expect(registerTool.mock.calls.map(call => call[0])).toEqual(['prepare_feedback_issue'])
    expect(PREPARE_FEEDBACK_DESCRIPTION).toContain('explicit approval')
    expect(PREPARE_FEEDBACK_DESCRIPTION).toContain('create_issue')
    expect(PREPARE_FEEDBACK_DESCRIPTION).toContain('Issues write access')
    expect(PREPARE_FEEDBACK_DESCRIPTION).toContain('do NOT automatically retry')
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

  const knowledge = {
    intent: 'incident' as const,
    disposition: 'new' as const,
    applicability: 'Example tool v2 on Linux; not tested elsewhere.',
    evidence: 'Synthetic fixture: verified exit 0; no production claim.',
    overlap: 'Searched generic symptom; no matching published article.',
  }
  const candidate = { description: 'A generic remediation with verification steps.', category: 'knowledge' as const, knowledge }

  it('drafts a distinct Knowledge candidate without publishing or changing legacy feedback', () => {
    const result = prepareFeedbackIssue(candidate)
    expect(result.status).toBe('draft')
    if (result.status !== 'draft') return
    expect(result.title).toBe('[Knowledge][incident] A generic remediation with verification steps.')
    expect(result.body).toContain('## Intent and disposition')
    expect(result.body).toContain('incident / new')
    expect(result.body).toContain(knowledge.applicability)
    expect(result.body).toContain(knowledge.evidence)
    expect(result.body).toContain(knowledge.overlap)
    expect(result.body).toContain('not CMS publication or a skill change')
    expect(result.githubCreateIssue).toEqual({ repository_full_name: 'polyms/ai-kit', title: result.title, body: result.body })
    expect(result.requiresApproval).toBe(true)
    const link = new URL(result.prefilledUrl)
    expect(link.searchParams.get('category')).toBe('Knowledge contribution / Đóng góp Knowledge')
    expect(link.searchParams.get('feedback')).toBe(result.body)
    expect(result.prefilledUrlTruncated).toBe(false)
    expect(result.nextStep).toContain('never call upsert_knowledge')
    expect(PREPARE_FEEDBACK_DESCRIPTION).toContain('skip if the user has not chosen to contribute')
    expect(PREPARE_FEEDBACK_DESCRIPTION).toContain('submission is separate')
  })

  it('includes optional context exactly once in the Knowledge fallback', () => {
    const result = prepareFeedbackIssue({ ...candidate, client: 'ChatGPT', skill: 'devops', example: 'Synthetic verification example.' })
    expect(result.status).toBe('draft')
    if (result.status !== 'draft') return
    const link = new URL(result.prefilledUrl)
    expect(link.searchParams.get('feedback')).toBe(result.body)
    expect(link.searchParams.has('client')).toBe(false)
    expect(link.searchParams.has('skill')).toBe(false)
    expect(link.searchParams.has('example')).toBe(false)
    expect(result.body).toContain('Synthetic verification example.')
  })

  it('requires contribution metadata and existing identity for updates, not new candidates', () => {
    expect(prepareFeedbackIssue({ description: candidate.description, category: 'knowledge' }).status).toBe('invalid')
    expect(prepareFeedbackIssue({ ...candidate, category: 'skill' }).status).toBe('invalid')
    expect(prepareFeedbackIssue({ ...candidate, knowledge: { ...knowledge, disposition: 'update' } }).status).toBe('invalid')
    expect(prepareFeedbackIssue({ ...candidate, knowledge: { ...knowledge, target: 'KN-001' } }).status).toBe('invalid')
    const update = prepareFeedbackIssue({ ...candidate, knowledge: { ...knowledge, disposition: 'update', target: 'KN-001', overlap: 'Existing article KN-001 needs correction.' } })
    expect(update.status).toBe('draft')
    if (update.status === 'draft') expect(update.body).toContain('KN-001')
  })

  it('checks sensitive content inside contribution metadata before drafting', () => {
    const secret = 'ghp_abcdefghijklmnopqrstuvwxyz1234'
    const result = prepareFeedbackIssue({ ...candidate, knowledge: { ...knowledge, evidence: 'Private token ' + secret } })
    expect(result.status).toBe('review_required')
    expect(JSON.stringify(result)).not.toContain(secret)
  })

  it('retains full Knowledge draft when fallback URL requires an excerpt', () => {
    const result = prepareFeedbackIssue({ ...candidate, description: 'Hướng dẫn kỹ thuật có thể dùng lại. '.repeat(60).slice(0, 2400), knowledge: { ...knowledge, evidence: 'Bằng chứng đã xác minh. '.repeat(60).slice(0, 1400) } })
    expect(result.status).toBe('draft')
    if (result.status !== 'draft') return
    expect(result.prefilledUrlTruncated).toBe(true)
    expect(result.prefilledUrl.length).toBeLessThanOrEqual(6800)
    const link = new URL(result.prefilledUrl)
    expect(link.searchParams.get('category')).toBe('Knowledge contribution / Đóng góp Knowledge')
    expect(link.searchParams.get('feedback')).toContain('Shortened for GitHub URL length')
    expect(result.body).toContain('## Evidence and provenance')
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
    const schema = registerTool.mock.calls[0]?.[1].inputSchema
    expect(schema.safeParse(candidate).success).toBe(true)
    const contribution = JSON.parse((await handler(candidate)).content[0].text)
    expect(contribution.title).toContain('[Knowledge][incident]')
    expect(contribution.requiresApproval).toBe(true)
  })

  it('rejects empty descriptions and never claims an issue was published', () => {
    expect(prepareFeedbackIssue({ description: '' }).status).toBe('invalid')
    const result = prepareFeedbackIssue({ description: 'I want an optional extra template.' })
    expect(result.status).toBe('draft')
    expect(result).not.toHaveProperty('issueNumber')
    expect(result).not.toHaveProperty('submitted')
    if (result.status === 'draft') {
      expect(result.nextStep).toContain('report the failure without retries')
    }
  })
})
