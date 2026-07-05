import { createHash, randomBytes } from 'node:crypto'

export function createOAuthState(): string {
  return randomBytes(24).toString('base64url')
}

export function createCodeVerifier(): string {
  return randomBytes(48).toString('base64url')
}

export function createCodeChallenge(verifier: string): string {
  return createHash('sha256').update(verifier).digest('base64url')
}

export function buildAuthorizeUrl(input: {
  authorizationEndpoint: string
  clientId: string
  redirectUri: string
  state: string
  codeChallenge: string
  scope?: string
}): string {
  const url = new URL(input.authorizationEndpoint)
  url.searchParams.set('client_id', input.clientId)
  url.searchParams.set('redirect_uri', input.redirectUri)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', input.scope ?? 'openid profile email')
  url.searchParams.set('state', input.state)
  url.searchParams.set('code_challenge', input.codeChallenge)
  url.searchParams.set('code_challenge_method', 'S256')
  return url.toString()
}
