import type { JWTPayload } from 'jose'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const jwtVerifyMock = vi.hoisted(() => vi.fn())

vi.mock('jose', () => ({
  createRemoteJWKSet: vi.fn(() => 'JWKS'),
  decodeJwt: vi.fn(() => ({})),
  jwtVerify: jwtVerifyMock,
}))

import {
  buildMcpWwwAuthenticateHeader,
  getAcceptedMcpAudiences,
  getAcceptedMcpIssuers,
  getMcpOidcScopes,
  getMcpResourceUrl,
  isMcpAdmin,
  mcpUnauthorizedResponse,
  verifyMcpAccessToken,
} from './mcp-auth.server'

describe('mcp-auth.server', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    delete process.env.APP_URL
    delete process.env.OIDC_ISSUER
  })

  it('isMcpAdmin checks role claim', () => {
    expect(isMcpAdmin({ userId: 'u1', role: 'admin' })).toBe(true)
    expect(isMcpAdmin({ userId: 'u1', role: 'user' })).toBe(false)
  })

  it('derives MCP resource URL from request origin', () => {
    const requestUrl = new URL('http://localhost:6300/mcp')
    expect(getMcpResourceUrl(requestUrl)).toBe('http://localhost:6300/mcp')
  })

  it('accepts polyms-sso audience variants', () => {
    process.env.OIDC_ISSUER = 'http://localhost:6200'
    process.env.APP_URL = 'http://localhost:6300'
    const requestUrl = new URL('http://localhost:6300/mcp')
    expect(getAcceptedMcpAudiences(requestUrl)).toEqual(
      expect.arrayContaining([
        'http://localhost:6300/mcp',
        'http://127.0.0.1:6300/mcp',
        'http://localhost:6200',
      ])
    )
  })

  it('returns session with role from valid JWT', async () => {
    jwtVerifyMock.mockResolvedValue({
      payload: {
        sub: 'admin-1',
        scope: 'openid profile email',
        role: 'admin',
      } satisfies JWTPayload,
    })

    const request = new Request('http://localhost:6300/mcp', {
      headers: { Authorization: 'Bearer valid-token' },
    })

    const session = await verifyMcpAccessToken(request)
    expect(session).toEqual({
      userId: 'admin-1',
      role: 'admin',
    })
  })

  it('throws UNAUTHORIZED when Bearer token missing', async () => {
    const request = new Request('http://localhost:6300/mcp')
    await expect(verifyMcpAccessToken(request)).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
    })
  })

  it('OIDC scopes for protected resource metadata', () => {
    expect([...getMcpOidcScopes()]).toEqual(['openid', 'profile', 'email'])
  })

  it('WWW-Authenticate for 401 is minimal', () => {
    const request = new Request('http://localhost:6300/mcp')
    const header = buildMcpWwwAuthenticateHeader(request)
    expect(header).toBe(
      'Bearer resource_metadata="http://localhost:6300/.well-known/oauth-protected-resource/mcp", error="invalid_token"'
    )
  })

  it('mcpUnauthorizedResponse returns JSON-RPC 401', async () => {
    const request = new Request('http://localhost:6300/mcp')
    const response = mcpUnauthorizedResponse(request)
    expect(response.status).toBe(401)
    const body = (await response.json()) as { error: { code: number } }
    expect(body.error.code).toBe(-32001)
  })

  it('accepts localhost/127.0.0.1 issuer twins', () => {
    process.env.OIDC_ISSUER = 'http://localhost:6200'
    expect(getAcceptedMcpIssuers()).toEqual(['http://localhost:6200', 'http://127.0.0.1:6200'])
  })
})
