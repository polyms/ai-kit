import { z } from 'zod'
import { prisma } from '../db.server'
import { embedPublishedKnowledgeChunks } from './knowledge.embed-chunks.server'
import type { KnowledgeArticle } from './knowledge.types'

const knowledgeIntentSchema = z.enum(['incident', 'design', 'toolchain'])
const knowledgeChunkTypeSchema = z.enum(['incident', 'seam', 'config', 'checklist', 'prose'])

const idSchema = z
  .string()
  .min(1)
  .regex(/^[A-Za-z0-9][A-Za-z0-9_-]*$/, 'id must be alphanumeric with optional _ or -')
const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase kebab-case')

export const knowledgeChunkInputSchema = z.object({
  id: idSchema,
  slug: slugSchema,
  intent: knowledgeIntentSchema,
  chunkType: knowledgeChunkTypeSchema,
  title: z.string().min(1),
  body: z.string(),
  axisTags: z.array(z.string()),
  symptom: z.string().nullable().optional().default(null),
  cause: z.array(z.string()).optional().default([]),
  fix: z.array(z.string()).optional().default([]),
  verify: z.array(z.string()).optional().default([]),
  triggerPhrases: z.array(z.string()).optional().default([]),
  artifactFilename: z.string().nullable().optional().default(null),
  artifactType: z.string().nullable().optional().default(null),
  checklistItems: z.array(z.string()).optional().default([]),
  parentChunkId: z.string().nullable().optional().default(null),
  partIndex: z.number().int().nullable().optional().default(null),
  sortOrder: z.number().int(),
})

export const knowledgeArticleInputSchema = z.object({
  id: idSchema,
  slug: slugSchema,
  title: z.string().min(1),
  summary: z.string().min(1),
  intent: knowledgeIntentSchema,
  axisTags: z.array(z.string()),
  checklist: z.array(z.string()),
  chunks: z.array(knowledgeChunkInputSchema).min(1),
})

export class KnowledgeMutationValidationError extends Error {
  readonly details: z.ZodIssue[]

  constructor(details: z.ZodIssue[]) {
    super('Knowledge article validation failed')
    this.name = 'KnowledgeMutationValidationError'
    this.details = details
  }
}

function parseArticleInput(article: unknown): KnowledgeArticle {
  const result = knowledgeArticleInputSchema.safeParse(article)
  if (!result.success) {
    throw new KnowledgeMutationValidationError(result.error.issues)
  }
  return result.data as KnowledgeArticle
}

function isPrismaNotFound(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === 'P2025'
  )
}

export async function upsertKnowledgeArticle(article: unknown): Promise<KnowledgeArticle> {
  const validated = parseArticleInput(article)
  const { chunks, ...articleFields } = validated

  await prisma.knowledgeArticle.upsert({
    where: { id: articleFields.id },
    create: {
      ...articleFields,
      status: 'published',
      chunks: { create: chunks },
    },
    update: {
      ...articleFields,
      status: 'published',
      chunks: { deleteMany: {}, create: chunks },
    },
  })

  await embedPublishedKnowledgeChunks(articleFields.id)

  return validated
}

export async function deleteKnowledgeArticle(id: string): Promise<{ deleted: boolean; id: string }> {
  try {
    await prisma.knowledgeArticle.delete({ where: { id } })
    return { deleted: true, id }
  } catch (error) {
    if (isPrismaNotFound(error)) {
      return { deleted: false, id }
    }
    throw error
  }
}
