import { getMcpOidcScopes, getMcpResourceUrl } from './mcp-auth.server'
import { getOidcIssuer } from './ops/oidc-config'

export type McpProtectedResourceMetadata = {
  resource: string
  authorization_servers: string[]
  bearer_methods_supported: string[]
  scopes_supported: string[]
}

export function buildMcpProtectedResourceMetadata(request: Request): McpProtectedResourceMetadata {
  const requestUrl = new URL(request.url)
  const issuer = getOidcIssuer().replace(/\/$/, '')

  return {
    resource: getMcpResourceUrl(requestUrl),
    authorization_servers: [issuer],
    bearer_methods_supported: ['header'],
    scopes_supported: [...getMcpOidcScopes()],
  }
}

export function buildMcpProtectedResourceMetadataResponse(request: Request): Response {
  const requestUrl = new URL(request.url)
  const resourceParam = requestUrl.searchParams.get('resource')
  const metadata = buildMcpProtectedResourceMetadata(request)

  if (resourceParam && resourceParam !== metadata.resource) {
    return Response.json(
      { error: 'invalid_target', error_description: 'Unknown resource' },
      { status: 400, headers: buildOAuthResourceCorsHeaders() }
    )
  }

  return Response.json(metadata, { headers: buildOAuthResourceCorsHeaders() })
}

export function buildOAuthResourcePreflightResponse(): Response {
  return new Response(null, {
    status: 204,
    headers: buildOAuthResourceCorsHeaders(),
  })
}

export function buildOAuthResourceCorsHeaders(): HeadersInit {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  }
}
