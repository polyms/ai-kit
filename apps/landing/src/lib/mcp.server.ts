import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { registerKnowledgeMcpTools } from './knowledge/knowledge.mcp'

function createOpsCmsMcpServer(): McpServer {
  const server = new McpServer({ name: 'ai-kit-ops-cms', version: __VERSION__ })
  registerKnowledgeMcpTools(server)
  return server
}

export async function handleMcpRequest(request: Request): Promise<Response> {
  const server = createOpsCmsMcpServer()
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  })
  await server.connect(transport)
  return transport.handleRequest(request)
}
