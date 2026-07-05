import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

const searchInputSchema = {
  q: z.string().optional().describe('Design topic, seam keyword, or checklist phrase'),
  axes: z.array(z.string()).optional().describe('Stack manifest axis tags to filter by'),
  limit: z.number().int().positive().max(50).optional().describe('Max results (default 20)'),
}

const idInputSchema = {
  id: z.string().describe('Stack guide id or slug'),
}

export function registerGuideMcpTools(server: McpServer): void {
  server.registerTool(
    'search_stack_guides',
    {
      description: 'Search published stack guides by design topic or seam keyword',
      inputSchema: searchInputSchema,
    },
    async ({ q, axes, limit }) => {
      const { searchStackGuides } = await import('./guide.service.server')
      const results = await searchStackGuides({ q, axes, limit })
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(results, null, 2) }],
      }
    }
  )

  server.registerTool(
    'get_stack_guide',
    {
      description: 'Get a published stack guide by id or slug',
      inputSchema: idInputSchema,
    },
    async ({ id }) => {
      const { getStackGuide } = await import('./guide.service.server')
      const guide = await getStackGuide(id)
      if (!guide) {
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ error: 'NOT_FOUND', id }) }],
          isError: true,
        }
      }
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(guide, null, 2) }],
      }
    }
  )
}
