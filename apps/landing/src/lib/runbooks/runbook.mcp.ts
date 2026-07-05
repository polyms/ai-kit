import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

const searchInputSchema = {
  q: z.string().optional().describe('Symptom, trigger phrase, or keyword'),
  axes: z.array(z.string()).optional().describe('Stack manifest axis tags to filter by'),
  limit: z.number().int().positive().max(50).optional().describe('Max results (default 20)'),
}

const idInputSchema = {
  id: z.string().describe('Runbook id or slug'),
}

const issueIdInputSchema = {
  issueId: z.string().describe('Known issue id or slug'),
}

export function registerRunbookMcpTools(server: McpServer): void {
  server.registerTool(
    'search_runbooks',
    {
      description: 'Search published runbooks and known issues by symptom or trigger phrase',
      inputSchema: searchInputSchema,
    },
    async ({ q, axes, limit }) => {
      const { searchRunbooks } = await import('./runbook.service.server')
      const results = await searchRunbooks({ q, axes, limit })
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(results, null, 2) }],
      }
    }
  )

  server.registerTool(
    'get_runbook',
    {
      description: 'Get a published runbook by id or slug',
      inputSchema: idInputSchema,
    },
    async ({ id }) => {
      const { getRunbook } = await import('./runbook.service.server')
      const runbook = await getRunbook(id)
      if (!runbook) {
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ error: 'NOT_FOUND', id }) }],
          isError: true,
        }
      }
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(runbook, null, 2) }],
      }
    }
  )

  server.registerTool(
    'get_runbook_issue',
    {
      description: 'Get a known issue and its parent runbook by issue id or slug',
      inputSchema: issueIdInputSchema,
    },
    async ({ issueId }) => {
      const { getIssue } = await import('./runbook.service.server')
      const found = await getIssue(issueId)
      if (!found) {
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ error: 'NOT_FOUND', issueId }) }],
          isError: true,
        }
      }
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(found, null, 2) }],
      }
    }
  )
}
