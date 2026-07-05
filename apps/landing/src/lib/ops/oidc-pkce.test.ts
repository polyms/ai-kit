import { describe, expect, it } from 'vitest'
import { buildAuthorizeUrl, createCodeChallenge, createCodeVerifier } from './oidc-pkce.server'

describe('oidc-pkce', () => {
  it('builds authorize URL with PKCE and OIDC_CLIENT_ID', () => {
    const verifier = createCodeVerifier()
    const url = new URL(
      buildAuthorizeUrl({
        authorizationEndpoint: 'https://polyms.dev/api/auth/oauth2/authorize',
        clientId: 'ai-kit-ops',
        redirectUri: 'http://localhost:6300/api/ops/auth/callback',
        state: 'state-123',
        codeChallenge: createCodeChallenge(verifier),
      })
    )

    expect(url.origin).toBe('https://polyms.dev')
    expect(url.searchParams.get('client_id')).toBe('ai-kit-ops')
    expect(url.searchParams.get('response_type')).toBe('code')
    expect(url.searchParams.get('code_challenge_method')).toBe('S256')
    expect(url.searchParams.get('code_challenge')).toBeTruthy()
  })
})
