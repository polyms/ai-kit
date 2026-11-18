import type { McpServer } from '@modelcontextprotocol/server'
import type { McpAuthSession } from './mcp-auth.server'
import { getOidcIssuer } from './ops/oidc-config'

type UserInfo = Record<string, unknown>

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

/**
 * Resolve the identity through the OIDC UserInfo endpoint using the already-verified
 * OAuth access token. Never return the token or forward unrecognized UserInfo claims.
 */
export async function getMcpCurrentUser(
  session: McpAuthSession,
  accessToken: string,
  fetcher: typeof fetch = fetch
) {
  const issuer = getOidcIssuer().replace(/\/$/, '')
  const response = await fetcher(`${issuer}/api/auth/oauth2/userinfo`, {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
    signal: AbortSignal.timeout(5000),
  })
  if (!response.ok) {
    throw new Error('OIDC UserInfo request failed')
  }

  const info: unknown = await response.json()
  if (!info || typeof info !== 'object' || Array.isArray(info)) {
    throw new Error('Invalid OIDC UserInfo response')
  }
  const claims = info as UserInfo
  if (claims.sub !== session.userId) {
    throw new Error('OIDC UserInfo subject mismatch')
  }

  // Expand this allowlist when additional identity claims are needed.
  return {
    userId: session.userId,
    ...(optionalString(claims.email) ? { email: claims.email as string } : {}),
    ...(typeof claims.email_verified === 'boolean'
      ? { emailVerified: claims.email_verified }
      : {}),
    ...(optionalString(claims.name) ? { name: claims.name as string } : {}),
    ...(optionalString(claims.picture) ? { picture: claims.picture as string } : {}),
    ...(optionalString(claims.preferred_username)
      ? { preferredUsername: claims.preferred_username as string }
      : {}),
    ...(optionalString(claims.locale) ? { locale: claims.locale as string } : {}),
    ...(session.role ? { role: session.role } : {}),
  }
}

export function registerMeMcpTool(
  server: McpServer,
  session: McpAuthSession,
  accessToken: string
): void {
  server.registerTool(
    'me',
    {
      description:
        'Get the authenticated AI Kit account profile from the OIDC UserInfo endpoint. Returns userId, available standard profile claims, and verified access-token role. No inputs required.',
    },
    async () => {
      try {
        const user = await getMcpCurrentUser(session, accessToken)
        return { content: [{ type: 'text' as const, text: JSON.stringify(user) }] }
      } catch {
        // Do not leak bearer tokens, upstream responses or sensitive diagnostics to the model.
        return {
          isError: true,
          content: [{ type: 'text' as const, text: 'Unable to retrieve verified account profile from SSO.' }],
        }
      }
    }
  )
}
