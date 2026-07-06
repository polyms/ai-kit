import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { KnowledgeArticle } from './knowledge.types'

const upsertMock = vi.hoisted(() => vi.fn())
const deleteMock = vi.hoisted(() => vi.fn())

vi.mock('./knowledge.mutation.server', () => ({
  upsertKnowledgeArticle: upsertMock,
  deleteKnowledgeArticle: deleteMock,
  KnowledgeMutationValidationError: class KnowledgeMutationValidationError extends Error {
    details = [{ message: 'invalid' }]
  },
}))

import { executeDeleteKnowledge, executeUpsertKnowledge } from './knowledge.mcp'

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
