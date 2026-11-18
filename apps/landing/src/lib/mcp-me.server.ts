import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { McpAuthSession } from './mcp-auth.server'

/** Return only identity claims from the already-verified MCP access token. */
export function getMcpCurrentUser(session: McpAuthSession) {
  return {
    userId: session.userId,
    ...(session.email ? { email: session.email } : {}),
    ...(session.role ? { role: session.role } : {}),
  }
}

export function registerMeMcpTool(server: McpServer, session: McpAuthSession): void {
  server.registerTool(
    'me',
    {
      description:
        'Get the currently authenticated AI Kit account from the verified OAuth access token. Returns userId, email (if present), and role (if present). No inputs required.',
    },
    async () => ({
      content: [{ type: 'text' as const, text: JSON.stringify(getMcpCurrentUser(session)) }],
    })
  )
}
