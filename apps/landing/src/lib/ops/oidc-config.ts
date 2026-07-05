const DEFAULT_ISSUER = 'https://polyms.dev'

export type OidcConfig = {
  clientId: string
  clientSecret: string
  issuer: string
  authorizationEndpoint: string
  tokenEndpoint: string
  userinfoEndpoint: string
  redirectUri: string
}

export function getOidcIssuer(): string {
  return process.env.OIDC_ISSUER?.trim() || DEFAULT_ISSUER
}

export function getOidcRedirectUri(requestUrl: URL): string {
  const configured = process.env.OIDC_REDIRECT_URI?.trim()
  if (configured) return configured
  return new URL('/api/ops/auth/callback', requestUrl.origin).toString()
}

export function isOidcConfigured(): boolean {
  return Boolean(process.env.OIDC_CLIENT_ID?.trim() && process.env.OIDC_CLIENT_SECRET?.trim())
}

export function getOidcConfig(requestUrl: URL): OidcConfig | null {
  const clientId = process.env.OIDC_CLIENT_ID?.trim()
  const clientSecret = process.env.OIDC_CLIENT_SECRET?.trim()
  if (!clientId || !clientSecret) return null

  const issuer = getOidcIssuer().replace(/\/$/, '')

  return {
    clientId,
    clientSecret,
    issuer,
    authorizationEndpoint: `${issuer}/api/auth/oauth2/authorize`,
    tokenEndpoint: `${issuer}/api/auth/oauth2/token`,
    userinfoEndpoint: `${issuer}/api/auth/oauth2/userinfo`,
    redirectUri: getOidcRedirectUri(requestUrl),
  }
}

export function sanitizeOpsReturnTo(value: string | null | undefined): string {
  if (!value?.startsWith('/ops') || value.startsWith('//')) {
    return '/ops/runbooks'
  }
  return value
}
