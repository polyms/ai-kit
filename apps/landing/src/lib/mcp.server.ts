import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { registerKnowledgeMcpTools } from './knowledge/knowledge.mcp'
import {
  McpAuthError,
  type McpAuthSession,
  mcpUnauthorizedResponse,
  verifyMcpAccessToken,
} from './mcp-auth.server'

function createOpsCmsMcpServer(session: McpAuthSession): McpServer {
  const server = new McpServer({ name: 'ai-kit-ops-cms', version: __VERSION__ })
  registerKnowledgeMcpTools(server, { session })
  return server
}

export async function handleMcpRequest(request: Request): Promise<Response> {
  let session: McpAuthSession
  try {
    session = await verifyMcpAccessToken(request)
  } catch (error) {
    if (error instanceof McpAuthError) {
      return mcpUnauthorizedResponse(request)
    }
    throw error
  }

  const server = createOpsCmsMcpServer(session)
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  })
  await server.connect(transport)
  return transport.handleRequest(request)
}
