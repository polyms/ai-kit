import { createFileRoute } from '@tanstack/react-router'
import {
  buildMcpProtectedResourceMetadataResponse,
  buildOAuthResourcePreflightResponse,
} from '../lib/mcp.oauth-resource.server'

/** RFC 9728 path suffix — same metadata as root; matches Cursor `resource_metadata` URL. */
export const Route = createFileRoute('/.well-known/oauth-protected-resource/$')({
  server: {
    handlers: {
      GET: async ({ request }) => buildMcpProtectedResourceMetadataResponse(request),
      OPTIONS: async () => buildOAuthResourcePreflightResponse(),
    },
  },
})
