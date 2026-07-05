import type { OidcConfig } from './oidc-config'
import {
  buildAuthorizeUrl,
  createCodeChallenge,
  createCodeVerifier,
  createOAuthState,
} from './oidc-pkce.server'
import {
  createOAuthStatePayload,
  encodeOAuthState,
  type OAuthStatePayload,
  oauthStateCookieHeader,
} from './oidc-state.server'

export type OidcTokenResponse = {
  access_token: string
  id_token?: string
  token_type?: string
  expires_in?: number
  refresh_token?: string
  scope?: string
}

export type OidcUserInfo = {
  sub: string
  email?: string
  name?: string
}

export function beginOidcLogin(
  config: OidcConfig,
  returnTo: string
): {
  authorizeUrl: string
  oauthStateCookie: string
} {
  const state = createOAuthState()
  const codeVerifier = createCodeVerifier()
  const payload = createOAuthStatePayload({ state, codeVerifier, returnTo })
  const authorizeUrl = buildAuthorizeUrl({
    authorizationEndpoint: config.authorizationEndpoint,
    clientId: config.clientId,
    redirectUri: config.redirectUri,
    state,
    codeChallenge: createCodeChallenge(codeVerifier),
  })

  return {
    authorizeUrl,
    oauthStateCookie: oauthStateCookieHeader(encodeOAuthState(payload)),
  }
}

export async function exchangeAuthorizationCode(
  config: OidcConfig,
  code: string,
  codeVerifier: string
): Promise<OidcTokenResponse> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: config.redirectUri,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code_verifier: codeVerifier,
  })

  const response = await fetch(config.tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`OIDC token exchange failed (${response.status}): ${detail}`)
  }

  return (await response.json()) as OidcTokenResponse
}

export async function fetchOidcUserInfo(config: OidcConfig, accessToken: string): Promise<OidcUserInfo> {
  const response = await fetch(config.userinfoEndpoint, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`OIDC userinfo failed (${response.status}): ${detail}`)
  }

  const data = (await response.json()) as OidcUserInfo
  if (!data.sub) {
    throw new Error('OIDC userinfo missing sub')
  }
  return data
}

export function assertOAuthCallbackState(
  stored: OAuthStatePayload | null,
  returnedState: string | null
): OAuthStatePayload {
  if (!stored || !returnedState || stored.state !== returnedState) {
    throw new Error('OIDC state mismatch')
  }
  return stored
}
