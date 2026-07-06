import { encodeSignedOpsCookie, splitSignedOpsCookie } from './ops-signing.server'

const SESSION_COOKIE = 'ai-kit:session'
const SESSION_TTL_MS = 24 * 60 * 60 * 1000

export function createSessionToken(sub = 'ops-user'): string {
  return encodeSignedOpsCookie({ exp: Date.now() + SESSION_TTL_MS, sub })
}

export function getSessionSubFromRequest(request: Request): string | null {
  const cookie = request.headers.get('cookie') ?? ''
  const match = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`))
  const parts = splitSignedOpsCookie(match?.[1] ?? '')
  if (!parts) return null

  try {
    const data = JSON.parse(Buffer.from(parts.body, 'base64url').toString('utf8')) as {
      exp?: number
      sub?: string
    }
    if (typeof data.exp !== 'number' || data.exp <= Date.now()) return null
    return typeof data.sub === 'string' ? data.sub : null
  } catch {
    return null
  }
}

function verifySessionToken(token: string | null | undefined): boolean {
  if (!token) return false
  const parts = splitSignedOpsCookie(token)
  if (!parts) return false

  try {
    const data = JSON.parse(Buffer.from(parts.body, 'base64url').toString('utf8')) as {
      exp?: number
    }
    return typeof data.exp === 'number' && data.exp > Date.now()
  } catch {
    return false
  }
}

export function getSessionFromRequest(request: Request): boolean {
  const cookie = request.headers.get('cookie') ?? ''
  const match = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`))
  return verifySessionToken(match?.[1])
}

export function sessionCookieHeader(token: string): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_MS / 1000}${secure}`
}

export function clearSessionCookieHeader(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
}

export { SESSION_COOKIE }
