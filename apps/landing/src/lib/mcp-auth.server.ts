import { createRemoteJWKSet, decodeJwt, jwtVerify } from 'jose'
import { getOidcIssuer } from './ops/oidc-config'

const DEFAULT_APP_URL = 'https://ai-kit.polyms.dev'
const MCP_RESOURCE_PATH = '/mcp'
/** offline_access — refresh tokens so MCP clients (Cursor) avoid re-auth on access-token expiry. */
const MCP_OIDC_SCOPES = ['openid', 'profile', 'email', 'offline_access'] as const
const MCP_ADMIN_ROLE = 'admin'

export class McpAuthError extends Error {
  readonly code = 'UNAUTHORIZED' as const

  constructor(message?: string) {
    super(message ?? 'UNAUTHORIZED')
    this.name = 'McpAuthError'
  }
}

export type McpAuthSession = {
  userId: string
  role?: string
}

let jwksIssuer: string | undefined
let jwks: ReturnType<typeof createRemoteJWKSet> | undefined

function getJwks(): ReturnType<typeof createRemoteJWKSet> {
  const issuer = getOidcIssuer().replace(/\/$/, '')
  if (!jwks || jwksIssuer !== issuer) {
    jwksIssuer = issuer
    jwks = createRemoteJWKSet(new URL(`${issuer}/api/auth/jwks`))
  }
  return jwks
}

export function getMcpOidcScopes(): readonly string[] {
  return MCP_OIDC_SCOPES
}

function expandLocalhostTwins(values: string[]): string[] {
  const result = new Set(values)
  for (const value of values) {
    try {
      const url = new URL(value)
      if (url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') continue
      const twin = new URL(url.toString())
      twin.hostname = url.hostname === 'localhost' ? '127.0.0.1' : 'localhost'
      const twinValue = url.pathname === '' || url.pathname === '/' ? twin.origin : twin.toString()
      result.add(twinValue)
    } catch {
      // not a URL
    }
  }
  return [...result]
}

export function getAcceptedMcpIssuers(): string[] {
  const issuer = getOidcIssuer().replace(/\/$/, '')
  return expandLocalhostTwins([issuer])
}

export function getAcceptedMcpAudiences(requestUrl: URL): string[] {
  const audiences = [getMcpResourceUrl(requestUrl), requestUrl.origin, getOidcIssuer().replace(/\/$/, '')]
  const configured = process.env.APP_URL?.trim()
  if (configured) {
    const base = configured.replace(/\/$/, '')
    audiences.push(base, new URL(MCP_RESOURCE_PATH, base).toString())
  }
  return expandLocalhostTwins(audiences)
}

function logMcpJwtVerifyFailure(
  token: string,
  acceptedIssuers: string[],
  acceptedAudiences: string[],
  error: unknown
): void {
  if (!import.meta.env.DEV) return
  try {
    const decoded = decodeJwt(token)
    console.error('[mcp-auth] JWT verify failed', {
      tokenIss: decoded.iss,
      tokenAud: decoded.aud,
      acceptedIssuers,
      acceptedAudiences,
      error: error instanceof Error ? error.message : String(error),
    })
  } catch {
    console.error('[mcp-auth] JWT verify failed (token not decodable JWT)', {
      acceptedIssuers,
      acceptedAudiences,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

export function isMcpAdmin(session: McpAuthSession): boolean {
  return session.role === MCP_ADMIN_ROLE
}

export function getAppUrl(requestUrl?: URL): string {
  const configured = process.env.APP_URL?.trim()
  if (configured) return configured.replace(/\/$/, '')
  if (requestUrl) return requestUrl.origin
  return DEFAULT_APP_URL
}

export function getMcpResourceUrl(requestUrl?: URL): string {
  const base = requestUrl?.origin ?? getAppUrl()
  return new URL(MCP_RESOURCE_PATH, base).toString()
}

export function getMcpProtectedResourceMetadataUrl(requestUrl: URL): string {
  return new URL('/.well-known/oauth-protected-resource/mcp', requestUrl.origin).toString()
}

export async function verifyMcpAccessToken(request: Request): Promise<McpAuthSession> {
  const header = request.headers.get('authorization')
  const token = header?.match(/^Bearer\s+(.+)$/i)?.[1]
  if (!token) {
    throw new McpAuthError('UNAUTHORIZED')
  }

  const requestUrl = new URL(request.url)
  const acceptedIssuers = getAcceptedMcpIssuers()
  const acceptedAudiences = getAcceptedMcpAudiences(requestUrl)

  try {
    const { payload } = await jwtVerify(token, getJwks(), {
      issuer: acceptedIssuers,
      audience: acceptedAudiences,
    })

    const sub = payload.sub
    if (!sub) {
      throw new McpAuthError('UNAUTHORIZED')
    }

    const claims = payload as { role?: unknown }

    return {
      userId: sub,
      role: typeof claims.role === 'string' ? claims.role : undefined,
    }
  } catch (error) {
    if (error instanceof McpAuthError) throw error
    logMcpJwtVerifyFailure(token, acceptedIssuers, acceptedAudiences, error)
    throw new McpAuthError('UNAUTHORIZED')
  }
}

/** Match soh-prompts — minimal header so Cursor OAuth discovery stays predictable. */
export function buildMcpWwwAuthenticateHeader(request: Request): string {
  const resourceMetadata = getMcpProtectedResourceMetadataUrl(new URL(request.url))
  return `Bearer resource_metadata="${resourceMetadata}", error="invalid_token"`
}

export function mcpUnauthorizedResponse(request: Request): Response {
  return new Response(
    JSON.stringify({
      jsonrpc: '2.0',
      error: { code: -32001, message: 'Unauthorized: provide a valid Bearer token.' },
      id: null,
    }),
    {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'WWW-Authenticate': buildMcpWwwAuthenticateHeader(request),
      },
    }
  )
}
