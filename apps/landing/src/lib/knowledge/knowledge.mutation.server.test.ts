import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { KnowledgeArticle } from './knowledge.types'

const prismaMock = vi.hoisted(() => ({
  knowledgeArticle: {
    upsert: vi.fn(),
    delete: vi.fn(),
  },
}))

const embedMock = vi.hoisted(() => vi.fn())

vi.mock('../db.server', () => ({
  prisma: prismaMock,
}))

vi.mock('./knowledge.embed-chunks.server', () => ({
  embedPublishedKnowledgeChunks: embedMock,
}))

import {
  deleteKnowledgeArticle,
  KnowledgeMutationValidationError,
  upsertKnowledgeArticle,
} from './knowledge.mutation.server'

function sampleArticle(overrides: Partial<KnowledgeArticle> = {}): KnowledgeArticle {
  return {
    id: 'KN-TEST',
    slug: 'kn-test',
    title: 'Test article',
    summary: 'Summary',
    intent: 'toolchain',
    axisTags: ['biome'],
    checklist: ['Step one'],
    chunks: [
      {
        id: 'KN-TEST-checklist',
        slug: 'kn-test-checklist',
        intent: 'toolchain',
        chunkType: 'checklist',
        title: 'Checklist',
        body: 'Do the thing',
        axisTags: ['biome'],
        symptom: null,
        cause: [],
        fix: [],
        verify: [],
        triggerPhrases: [],
        artifactFilename: null,
        artifactType: null,
        checklistItems: ['Step one'],
        parentChunkId: null,
        partIndex: null,
        sortOrder: 0,
      },
    ],
    ...overrides,
  }
}

describe('knowledge.mutation.server', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    prismaMock.knowledgeArticle.upsert.mockResolvedValue({})
    prismaMock.knowledgeArticle.delete.mockResolvedValue({})
    embedMock.mockResolvedValue(1)
  })

  it('upserts article with chunks and embeds', async () => {
    const article = sampleArticle()
    const result = await upsertKnowledgeArticle(article)

    expect(result.id).toBe('KN-TEST')
    expect(prismaMock.knowledgeArticle.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'KN-TEST' },
        create: expect.objectContaining({ status: 'published', chunks: { create: article.chunks } }),
        update: expect.objectContaining({
          status: 'published',
          chunks: { deleteMany: {}, create: article.chunks },
        }),
      })
    )
    expect(embedMock).toHaveBeenCalledWith('KN-TEST')
  })

  it('replaces chunks on update via deleteMany + create', async () => {
    const article = sampleArticle({
      chunks: [
        {
          ...sampleArticle().chunks[0]!,
          id: 'KN-TEST-v2',
          slug: 'kn-test-v2',
          sortOrder: 1,
        },
      ],
    })

    await upsertKnowledgeArticle(article)

    expect(prismaMock.knowledgeArticle.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({
          chunks: { deleteMany: {}, create: article.chunks },
        }),
      })
    )
  })

  it('deletes article and returns deleted true', async () => {
    const result = await deleteKnowledgeArticle('KN-TEST')
    expect(result).toEqual({ deleted: true, id: 'KN-TEST' })
    expect(prismaMock.knowledgeArticle.delete).toHaveBeenCalledWith({ where: { id: 'KN-TEST' } })
  })

  it('returns deleted false when article missing', async () => {
    prismaMock.knowledgeArticle.delete.mockRejectedValue({ code: 'P2025' })
    const result = await deleteKnowledgeArticle('MISSING')
    expect(result).toEqual({ deleted: false, id: 'MISSING' })
  })

  it('rejects malformed input missing id', async () => {
    const article = sampleArticle()
    const { id: _id, ...withoutId } = article
    await expect(upsertKnowledgeArticle(withoutId)).rejects.toBeInstanceOf(KnowledgeMutationValidationError)
  })

  it('rejects invalid intent', async () => {
    const article = sampleArticle({ intent: 'invalid' as KnowledgeArticle['intent'] })
    await expect(upsertKnowledgeArticle(article)).rejects.toBeInstanceOf(KnowledgeMutationValidationError)
  })

  it('rejects invalid chunkType', async () => {
    const article = sampleArticle({
      chunks: [{ ...sampleArticle().chunks[0]!, chunkType: 'bad' as never }],
    })
    await expect(upsertKnowledgeArticle(article)).rejects.toBeInstanceOf(KnowledgeMutationValidationError)
  })
})
