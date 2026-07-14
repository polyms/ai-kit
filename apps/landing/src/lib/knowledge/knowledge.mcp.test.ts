import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { KnowledgeArticle } from './knowledge.types'

const upsertMock = vi.hoisted(() => vi.fn())
const deleteMock = vi.hoisted(() => vi.fn())
const getCoverageMock = vi.hoisted(() => vi.fn())

vi.mock('./knowledge.mutation.server', () => ({
  upsertKnowledgeArticle: upsertMock,
  deleteKnowledgeArticle: deleteMock,
  KnowledgeMutationValidationError: class KnowledgeMutationValidationError extends Error {
    details = [{ message: 'invalid' }]
  },
}))

vi.mock('./knowledge.service.server', () => ({
  getKnowledgeCoverage: getCoverageMock,
}))

import { KnowledgeCoverageValidationError } from './knowledge.coverage'
import {
  executeDeleteKnowledge,
  executeGetKnowledgeCoverage,
  executeUpsertKnowledge,
  registerKnowledgeMcpTools,
} from './knowledge.mcp'

function sampleArticle(): KnowledgeArticle {
  return {
    id: 'KN-TEST',
    slug: 'kn-test',
    title: 'Test',
    summary: 'Summary',
    intent: 'toolchain',
    axisTags: [],
    checklist: [],
    chunks: [
      {
        id: 'KN-TEST-c1',
        slug: 'kn-test-c1',
        intent: 'toolchain',
        chunkType: 'prose',
        title: 'Body',
        body: 'Content',
        axisTags: [],
        symptom: null,
        cause: [],
        fix: [],
        verify: [],
        triggerPhrases: [],
        artifactFilename: null,
        artifactType: null,
        checklistItems: [],
        parentChunkId: null,
        partIndex: null,
        sortOrder: 0,
      },
    ],
  }
}

describe('knowledge.mcp write tools', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    upsertMock.mockResolvedValue(sampleArticle())
    deleteMock.mockResolvedValue({ deleted: true, id: 'KN-TEST' })
  })

  it('returns ADMIN_REQUIRED for upsert without admin role', async () => {
    const result = await executeUpsertKnowledge({ userId: 'u1' }, sampleArticle())
    expect(result.isError).toBe(true)
    expect(JSON.parse(result.content[0]!.text)).toEqual({ error: 'ADMIN_REQUIRED' })
    expect(upsertMock).not.toHaveBeenCalled()
  })

  it('upserts when session has admin role', async () => {
    const article = sampleArticle()
    const result = await executeUpsertKnowledge({ userId: 'u1', role: 'admin' }, article)
    expect(result.isError).toBeUndefined()
    expect(upsertMock).toHaveBeenCalledWith(article)
  })

  it('returns ADMIN_REQUIRED for delete without admin role', async () => {
    const result = await executeDeleteKnowledge({ userId: 'u1' }, { id: 'KN-TEST' })
    expect(result.isError).toBe(true)
    expect(JSON.parse(result.content[0]!.text)).toEqual({ error: 'ADMIN_REQUIRED' })
    expect(deleteMock).not.toHaveBeenCalled()
  })

  it('deletes with admin role', async () => {
    const result = await executeDeleteKnowledge({ userId: 'u1', role: 'admin' }, { id: 'KN-TEST' })
    expect(JSON.parse(result.content[0]!.text)).toEqual({ deleted: true, id: 'KN-TEST' })
  })
})

describe('knowledge.mcp get_knowledge_coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('registers get_knowledge_coverage for any OAuth user', () => {
    const registerTool = vi.fn()
    registerKnowledgeMcpTools({ registerTool } as never, { session: { userId: 'u1' } })
    const names = registerTool.mock.calls.map(call => call[0])
    expect(names).toContain('get_knowledge_coverage')
  })

  it('returns coverage JSON from the service', async () => {
    const coverage = {
      axes: ['vercel', 'tanstack-start', 'nitro'],
      intents: ['incident', 'design', 'toolchain'],
      byIntent: {
        incident: { covered: true, articleIds: ['RB-001'] },
        design: { covered: false, articleIds: [] },
        toolchain: { covered: false, articleIds: [] },
      },
    }
    getCoverageMock.mockResolvedValue(coverage)

    const result = await executeGetKnowledgeCoverage({
      axes: ['vercel', 'tanstack-start', 'nitro'],
    })

    expect(result.isError).toBeUndefined()
    expect(JSON.parse(result.content[0]!.text)).toEqual(coverage)
    expect(getCoverageMock).toHaveBeenCalledWith({
      axes: ['vercel', 'tanstack-start', 'nitro'],
    })
  })

  it('returns VALIDATION_ERROR when axes are empty', async () => {
    getCoverageMock.mockRejectedValue(
      new KnowledgeCoverageValidationError('axes is required and must be a non-empty string array')
    )

    const result = await executeGetKnowledgeCoverage({ axes: [] })

    expect(result.isError).toBe(true)
    expect(JSON.parse(result.content[0]!.text)).toEqual({
      error: 'VALIDATION_ERROR',
      message: 'axes is required and must be a non-empty string array',
    })
  })

  it('returns VALIDATION_ERROR when intents is an empty array', async () => {
    getCoverageMock.mockRejectedValue(
      new KnowledgeCoverageValidationError(
        'intents must be a non-empty array when provided (omit to evaluate all three)'
      )
    )

    const result = await executeGetKnowledgeCoverage({ axes: ['vercel'], intents: [] })

    expect(result.isError).toBe(true)
    expect(JSON.parse(result.content[0]!.text)).toEqual({
      error: 'VALIDATION_ERROR',
      message: 'intents must be a non-empty array when provided (omit to evaluate all three)',
    })
  })
})
