import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

const searchInputSchema = {
  q: z.string().optional().describe('Symptom, seam keyword, or toolchain topic'),
  intent: z
    .enum(['incident', 'design', 'toolchain'])
    .optional()
    .describe('Knowledge intent to scope results'),
  axes: z.array(z.string()).optional().describe('Stack manifest axis tags to filter by'),
  limit: z.number().int().positive().max(50).optional().describe('Max results (default 20)'),
}

const idInputSchema = {
  id: z.string().describe('Knowledge article id or slug'),
}

const chunkIdInputSchema = {
  chunkId: z.string().describe('Knowledge chunk id or slug'),
}

export function registerKnowledgeMcpTools(server: McpServer): void {
  server.registerTool(
    'search_knowledge',
    {
      description:
        'Search published Knowledge articles and chunks (incident, design, toolchain) by keyword, filtered by intent and stack manifest axes',
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
    'get_knowledge',
    {
      description: 'Get a published Knowledge article (with all chunks in sortOrder) by id or slug',
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
      description: 'Get a single Knowledge chunk and its parent article by chunk id or slug',
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
}
