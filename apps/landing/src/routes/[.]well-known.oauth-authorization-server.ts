import { createFileRoute } from '@tanstack/react-router'
import { getMcpOidcScopes } from '../lib/mcp-auth.server'
import { getOidcIssuer } from '../lib/ops/oidc-config'

const CACHE_MAX_AGE_SECONDS = 300

const POLYMS_METADATA_PATHS = [
  '/.well-known/oauth-authorization-server',
  '/api/auth/.well-known/oauth-authorization-server',
] as const

/** MCP connect — OIDC scopes only on auth-server metadata; write gated by JWT `role` at tool layer. */
function filterMcpAuthorizationMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
  const oidcScopes = getMcpOidcScopes()
  return {
    ...metadata,
    scopes_supported: [...oidcScopes],
  }
}

async function fetchPolymsAuthorizationServerMetadata(): Promise<Record<string, unknown>> {
  const issuer = getOidcIssuer().replace(/\/$/, '')

  for (const path of POLYMS_METADATA_PATHS) {
    try {
      const response = await fetch(`${issuer}${path}`, {
        headers: { Accept: 'application/json' },
      })
      if (!response.ok) continue
      const metadata = (await response.json()) as Record<string, unknown>
      if (metadata.authorization_endpoint && metadata.token_endpoint) {
        return filterMcpAuthorizationMetadata(metadata)
      }
    } catch {
      // try next path
    }
  }

  return filterMcpAuthorizationMetadata({
    issuer,
    authorization_endpoint: `${issuer}/api/auth/oauth2/authorize`,
    token_endpoint: `${issuer}/api/auth/oauth2/token`,
    registration_endpoint: `${issuer}/api/auth/oauth2/register`,
    jwks_uri: `${issuer}/api/auth/jwks`,
    scopes_supported: [...getMcpOidcScopes()],
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
    code_challenge_methods_supported: ['S256'],
  })
}

export const Route = createFileRoute('/.well-known/oauth-authorization-server')({
  server: {
    handlers: {
      GET: async () => {
        const metadata = await fetchPolymsAuthorizationServerMetadata()
        return Response.json(metadata, {
          headers: {
            'Cache-Control': `public, max-age=${CACHE_MAX_AGE_SECONDS}`,
          },
        })
      },
    },
  },
})
