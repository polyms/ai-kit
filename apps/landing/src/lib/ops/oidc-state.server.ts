import { createHmac, timingSafeEqual } from 'node:crypto'

const OAUTH_STATE_COOKIE = 'ops_oauth_state'
const OAUTH_STATE_TTL_MS = 10 * 60 * 1000

export type OAuthStatePayload = {
  state: string
  codeVerifier: string
  returnTo: string
  exp: number
}

function oauthStateSecret(): string {
  return process.env.OPS_SESSION_SECRET ?? 'dev-insecure-ops-secret-change-me'
}

function sign(payload: string): string {
  return createHmac('sha256', oauthStateSecret()).update(payload).digest('base64url')
}

export function encodeOAuthState(payload: OAuthStatePayload): string {
  const body = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
  return `${body}.${sign(body)}`
}

export function decodeOAuthState(token: string | null | undefined): OAuthStatePayload | null {
  if (!token) return null
  const [body, signature] = token.split('.')
  if (!body || !signature) return null

  const expected = sign(body)
  try {
    const a = Buffer.from(signature)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  } catch {
    return null
  }

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as OAuthStatePayload
    if (
      typeof payload.state !== 'string' ||
      typeof payload.codeVerifier !== 'string' ||
      typeof payload.returnTo !== 'string' ||
      typeof payload.exp !== 'number' ||
      payload.exp <= Date.now()
    ) {
      return null
    }
    return payload
  } catch {
    return null
  }
}

export function oauthStateCookieHeader(token: string): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${OAUTH_STATE_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${OAUTH_STATE_TTL_MS / 1000}${secure}`
}

export function clearOAuthStateCookieHeader(): string {
  return `${OAUTH_STATE_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
}

export function readOAuthStateFromRequest(request: Request): OAuthStatePayload | null {
  const cookie = request.headers.get('cookie') ?? ''
  const match = cookie.match(new RegExp(`${OAUTH_STATE_COOKIE}=([^;]+)`))
  return decodeOAuthState(match?.[1])
}

export function createOAuthStatePayload(input: {
  state: string
  codeVerifier: string
  returnTo: string
}): OAuthStatePayload {
  return {
    ...input,
    exp: Date.now() + OAUTH_STATE_TTL_MS,
  }
}

export { OAUTH_STATE_COOKIE }
