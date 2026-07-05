import { createHmac, timingSafeEqual } from 'node:crypto'

const SESSION_COOKIE = 'ops_session'
const SESSION_TTL_MS = 24 * 60 * 60 * 1000

function sessionSecret(): string {
  return process.env.OPS_SESSION_SECRET ?? 'dev-insecure-ops-secret-change-me'
}

function sign(payload: string): string {
  return createHmac('sha256', sessionSecret()).update(payload).digest('base64url')
}

export function createSessionToken(sub = 'ops-user'): string {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + SESSION_TTL_MS, sub }), 'utf8').toString(
    'base64url'
  )
  return `${payload}.${sign(payload)}`
}

export function getSessionSubFromRequest(request: Request): string | null {
  const cookie = request.headers.get('cookie') ?? ''
  const match = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`))
  const token = match?.[1]
  if (!token || !verifySessionToken(token)) return null

  const [payload] = token.split('.')
  if (!payload) return null

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { sub?: string }
    return typeof data.sub === 'string' ? data.sub : null
  } catch {
    return null
  }
}

export function verifySessionToken(token: string | null | undefined): boolean {
  if (!token) return false
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return false

  const expected = sign(payload)
  try {
    const a = Buffer.from(signature)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false
  } catch {
    return false
  }

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
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
