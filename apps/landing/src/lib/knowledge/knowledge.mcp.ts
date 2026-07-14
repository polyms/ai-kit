import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { isMcpAdmin, type McpAuthSession } from '../mcp-auth.server'
import {
  type ComputeKnowledgeCoverageParams,
  KnowledgeCoverageValidationError,
} from './knowledge.coverage'
import {
  DELETE_KNOWLEDGE_TOOL_DESCRIPTION,
  UPSERT_KNOWLEDGE_TOOL_DESCRIPTION,
} from './knowledge.mcp-authoring'
import {
  GET_KNOWLEDGE_CHUNK_TOOL_DESCRIPTION,
  GET_KNOWLEDGE_COVERAGE_TOOL_DESCRIPTION,
  GET_KNOWLEDGE_TOOL_DESCRIPTION,
  SEARCH_KNOWLEDGE_TOOL_DESCRIPTION,
} from './knowledge.mcp-retrieval'
import {
  deleteKnowledgeArticle,
  KnowledgeMutationValidationError,
  upsertKnowledgeArticle,
} from './knowledge.mutation.server'

const searchInputSchema = {
  q: z.string().optional().describe('Symptom, seam keyword, or toolchain topic'),
  intent: z
    .enum(['incident', 'design', 'toolchain'])
    .optional()
    .describe('Knowledge intent to scope results'),
  axes: z.array(z.string()).optional().describe('Stack manifest axis tags to filter by'),
  limit: z.number().int().positive().max(50).optional().describe('Max results (default 20)'),
}

const coverageInputSchema = {
  axes: z
    .array(z.string().trim().min(1))
    .min(1)
    .describe('Required non-empty axis subset — article covers when axes ⊆ article.axisTags'),
  intents: z
    .array(z.enum(['incident', 'design', 'toolchain']))
    .min(1)
    .optional()
    .describe('Intents to evaluate (omit for all three; empty array is invalid)'),
}

const idInputSchema = {
  id: z.string().describe('Knowledge article id or slug'),
}

const chunkIdInputSchema = {
  chunkId: z.string().describe('Knowledge chunk id or slug'),
}

const upsertChunkFieldDescriptions = {
  id: z.string().describe('Unique chunk id (e.g. KN-001-checklist)'),
  slug: z.string().describe('URL slug — lowercase kebab-case'),
  intent: z.enum(['incident', 'design', 'toolchain']).describe('Audience intent for this chunk'),
  chunkType: z
    .enum(['incident', 'seam', 'config', 'checklist', 'prose'])
    .describe('Chunk shape — config chunks hold verbatim artifacts'),
  title: z.string().describe('Chunk title'),
  body: z.string().describe('Main content — generic, no project-specific paths'),
  axisTags: z.array(z.string()).describe('Stack manifest tags, not repo names'),
  sortOrder: z.number().int().describe('Reading order — checklist/overview first (0)'),
}

const upsertInputSchema = {
  id: z.string().describe('Article id (e.g. KN-001)'),
  slug: z.string().describe('Article slug — lowercase kebab-case'),
  title: z.string().describe('Article title'),
  summary: z.string().describe('Short summary for search results'),
  intent: z
    .enum(['incident', 'design', 'toolchain'])
    .describe('Primary audience: incident=/devops, design=/arch, toolchain=/dev'),
  axisTags: z.array(z.string()).describe('Stack manifest tags for filtering'),
  checklist: z.array(z.string()).describe('Top-level checklist items shown on article index'),
  chunks: z
    .array(
      z.object({
        ...upsertChunkFieldDescriptions,
        symptom: z.string().nullable().optional(),
        cause: z.array(z.string()).optional(),
        fix: z.array(z.string()).optional(),
        verify: z.array(z.string()).optional(),
        triggerPhrases: z.array(z.string()).optional(),
        artifactFilename: z.string().nullable().optional(),
        artifactType: z.string().nullable().optional(),
        checklistItems: z.array(z.string()).optional(),
        parentChunkId: z.string().nullable().optional(),
        partIndex: z.number().int().nullable().optional(),
      })
    )
    .describe('Ordered chunks — replace all on upsert'),
}

const deleteInputSchema = {
  id: z.string().describe('Knowledge article id to delete'),
}

export type KnowledgeMcpToolContext = {
  session: McpAuthSession
}

type McpTextResult = {
  content: [{ type: 'text'; text: string }]
  isError?: boolean
}

function mcpAdminRequiredResult(): McpTextResult {
  return {
    content: [{ type: 'text', text: JSON.stringify({ error: 'ADMIN_REQUIRED' }) }],
    isError: true,
  }
}

export async function executeUpsertKnowledge(
  session: McpAuthSession,
  input: unknown
): Promise<McpTextResult> {
  if (!isMcpAdmin(session)) {
    return mcpAdminRequiredResult()
  }

  try {
    const article = await upsertKnowledgeArticle(input)
    return {
      content: [{ type: 'text', text: JSON.stringify({ article }, null, 2) }],
    }
  } catch (error) {
    if (error instanceof KnowledgeMutationValidationError) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: 'VALIDATION_ERROR', details: error.details }),
          },
        ],
        isError: true,
      }
    }
    throw error
  }
}

export async function executeDeleteKnowledge(
  session: McpAuthSession,
  input: { id: string }
): Promise<McpTextResult> {
  if (!isMcpAdmin(session)) {
    return mcpAdminRequiredResult()
  }

  const result = await deleteKnowledgeArticle(input.id)
  if (!result.deleted) {
    return {
      content: [{ type: 'text', text: JSON.stringify({ error: 'NOT_FOUND', id: input.id }) }],
      isError: true,
    }
  }
  return {
    content: [{ type: 'text', text: JSON.stringify({ deleted: true, id: input.id }) }],
  }
}

export async function executeGetKnowledgeCoverage(
  input: ComputeKnowledgeCoverageParams
): Promise<McpTextResult> {
  try {
    const { getKnowledgeCoverage } = await import('./knowledge.service.server')
    const coverage = await getKnowledgeCoverage(input)
    return {
      content: [{ type: 'text', text: JSON.stringify(coverage, null, 2) }],
    }
  } catch (error) {
    if (error instanceof KnowledgeCoverageValidationError) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: 'VALIDATION_ERROR', message: error.message }),
          },
        ],
        isError: true,
      }
    }
    throw error
  }
}

export function registerKnowledgeMcpTools(server: McpServer, context: KnowledgeMcpToolContext): void {
  const { session } = context

  server.registerTool(
    'search_knowledge',
    {
      description: SEARCH_KNOWLEDGE_TOOL_DESCRIPTION,
      inputSchema: searchInputSchema,
    },
    async ({ q, intent, axes, limit }) => {
      const { searchKnowledge } = await import('./knowledge.service.server')
      const results = await searchKnowledge({ q, intent, axes, limit })
      return {
        content: [{ type: 'text' as const, text: JSON.stringify({ results }, null, 2) }],
      }
    }
  )

  server.registerTool(
    'get_knowledge_coverage',
    {
      description: GET_KNOWLEDGE_COVERAGE_TOOL_DESCRIPTION,
      inputSchema: coverageInputSchema,
    },
    async ({ axes, intents }) => executeGetKnowledgeCoverage({ axes, intents })
  )

  server.registerTool(
    'get_knowledge',
    {
      description: GET_KNOWLEDGE_TOOL_DESCRIPTION,
      inputSchema: idInputSchema,
    },
    async ({ id }) => {
      const { getKnowledgeArticle } = await import('./knowledge.service.server')
      const article = await getKnowledgeArticle(id)
      if (!article) {
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ error: 'NOT_FOUND', id }) }],
          isError: true,
        }
      }
      return {
        content: [{ type: 'text' as const, text: JSON.stringify({ article }, null, 2) }],
      }
    }
  )

  server.registerTool(
    'get_knowledge_chunk',
    {
      description: GET_KNOWLEDGE_CHUNK_TOOL_DESCRIPTION,
      inputSchema: chunkIdInputSchema,
    },
    async ({ chunkId }) => {
      const { getKnowledgeChunk } = await import('./knowledge.service.server')
      const found = await getKnowledgeChunk(chunkId)
      if (!found) {
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ error: 'NOT_FOUND', chunkId }) }],
          isError: true,
        }
      }
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(found, null, 2) }],
      }
    }
  )

  server.registerTool(
    'upsert_knowledge',
    {
      description: UPSERT_KNOWLEDGE_TOOL_DESCRIPTION,
      inputSchema: upsertInputSchema,
    },
    async input => executeUpsertKnowledge(session, input)
  )

  server.registerTool(
    'delete_knowledge',
    {
      description: DELETE_KNOWLEDGE_TOOL_DESCRIPTION,
      inputSchema: deleteInputSchema,
    },
    async input => executeDeleteKnowledge(session, input)
  )
}
