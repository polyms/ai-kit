import { createFileRoute } from '@tanstack/react-router'
import {
  buildMcpProtectedResourceMetadataResponse,
  buildOAuthResourcePreflightResponse,
} from '../lib/mcp.oauth-resource.server'

export const Route = createFileRoute('/.well-known/oauth-protected-resource')({
  server: {
    handlers: {
      GET: async ({ request }) => buildMcpProtectedResourceMetadataResponse(request),
      OPTIONS: async () => buildOAuthResourcePreflightResponse(),
    },
  },
})
