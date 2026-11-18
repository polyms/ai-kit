import type { McpServer } from '@modelcontextprotocol/server'

export const MCP_SERVER_NAME = 'ai-kit-ops-cms'

export type ServerInfo = {
  name: string
  version: string
  commit?: string
  environment?: string
}

/** Public, non-sensitive build identity; the landing package owns the release version. */
export function getMcpServerInfo(
  version: string,
  env: Pick<NodeJS.ProcessEnv, 'VERCEL_GIT_COMMIT_SHA' | 'VERCEL_ENV'> = process.env
): ServerInfo {
  const commit = env.VERCEL_GIT_COMMIT_SHA?.trim()
  const environment = env.VERCEL_ENV?.trim()
  return {
    name: MCP_SERVER_NAME,
    version,
    ...(commit ? { commit } : {}),
    ...(environment ? { environment } : {}),
  }
}

export function getMcpServerInstructions(info: ServerInfo): string {
  return `AI Kit MCP server ${info.name} version ${info.version}. Use server_info to verify the currently deployed server version and available build metadata. Use me for the authenticated user's profile.`
}

export function registerServerInfoMcpTool(server: McpServer, version: string): void {
  server.registerTool(
    'server_info',
    {
      description:
        'Get the currently running AI Kit MCP server identity, landing release version, and available deployment metadata (commit/environment). No inputs or user-profile lookup required.',
    },
    async () => ({
      content: [{ type: 'text' as const, text: JSON.stringify(getMcpServerInfo(version)) }],
    })
  )
}
