import { describe, expect, it } from 'vitest'
import {
  buildMcpProtectedResourceMetadata,
  buildMcpProtectedResourceMetadataResponse,
  buildOAuthResourcePreflightResponse,
} from './mcp.oauth-resource.server'

describe('mcp.oauth-resource.server', () => {
  it('builds metadata with MCP resource URL and read-only OIDC scopes', () => {
    process.env.OIDC_ISSUER = 'http://localhost:6200'
    const request = new Request('http://localhost:6300/.well-known/oauth-protected-resource/mcp')
    expect(buildMcpProtectedResourceMetadata(request)).toMatchObject({
      resource: 'http://localhost:6300/mcp',
      authorization_servers: ['http://localhost:6200'],
      scopes_supported: ['openid', 'profile', 'email', 'offline_access'],
    })
  })

  it('returns 400 when resource query param does not match', async () => {
    const request = new Request(
      'http://localhost:6300/.well-known/oauth-protected-resource?resource=http://evil/mcp'
    )
    const response = buildMcpProtectedResourceMetadataResponse(request)
    expect(response.status).toBe(400)
  })

  it('OPTIONS preflight returns 204 with CORS', () => {
    const response = buildOAuthResourcePreflightResponse()
    expect(response.status).toBe(204)
    expect(response.headers.get('Access-Control-Allow-Methods')).toContain('GET')
  })
})
