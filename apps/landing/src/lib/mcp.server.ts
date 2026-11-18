import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { registerKnowledgeMcpTools } from './knowledge/knowledge.mcp'
import {
  McpAuthError,
  type McpAuthSession,
  mcpUnauthorizedResponse,
  verifyMcpAccessToken,
} from './mcp-auth.server'
import { registerSkillPackMcpTools } from './skill-pack/skill-pack.mcp'
import { registerMeMcpTool } from './mcp-me.server'
import { getMcpServerInfo, getMcpServerInstructions, registerServerInfoMcpTool } from './mcp-server-info.server'

function createOpsCmsMcpServer(session: McpAuthSession, accessToken: string): McpServer {
  const serverInfo = getMcpServerInfo(__VERSION__)
  const server = new McpServer(
    { name: serverInfo.name, version: serverInfo.version },
    { instructions: getMcpServerInstructions(serverInfo) }
  )
  registerServerInfoMcpTool(server, __VERSION__)
  registerMeMcpTool(server, session, accessToken)
  registerKnowledgeMcpTools(server, { session })
  registerSkillPackMcpTools(server)
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

  // Only pass the verified bearer token to the server-side UserInfo lookup.
  // Never expose it in MCP tool output.
  const accessToken = request.headers.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1]
  if (!accessToken) return mcpUnauthorizedResponse(request)

  const server = createOpsCmsMcpServer(session, accessToken)
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  })
  await server.connect(transport)
  return transport.handleRequest(request)
}
