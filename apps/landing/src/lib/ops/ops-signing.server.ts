import { createHmac, timingSafeEqual } from 'node:crypto'

const DEV_OPS_SESSION_SECRET = 'dev-insecure-ops-secret-change-me'

/** HMAC key for ops browser cookies (session + OAuth PKCE state). MCP auth uses JWT, not this. */
function getOpsSessionSecret(): string {
  const configured = process.env.OPS_SESSION_SECRET?.trim()
  if (configured) return configured
  if (import.meta.env.DEV) return DEV_OPS_SESSION_SECRET
  throw new Error('OPS_SESSION_SECRET is required for ops browser cookie signing')
}

export function signOpsCookiePayload(body: string): string {
  return createHmac('sha256', getOpsSessionSecret()).update(body).digest('base64url')
}

export function encodeSignedOpsCookie(value: unknown): string {
  const body = Buffer.from(JSON.stringify(value), 'utf8').toString('base64url')
  return `${body}.${signOpsCookiePayload(body)}`
}

export function splitSignedOpsCookie(token: string): { body: string } | null {
  const [body, signature] = token.split('.')
  if (!body || !signature) return null

  const expected = signOpsCookiePayload(body)
  try {
    const a = Buffer.from(signature)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  } catch {
    return null
  }

  return { body }
}
