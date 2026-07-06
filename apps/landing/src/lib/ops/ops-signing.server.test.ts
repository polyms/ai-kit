import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { encodeSignedOpsCookie, splitSignedOpsCookie } from './ops-signing.server'

describe('ops-signing.server', () => {
  const envSnapshot = { ...process.env }

  beforeEach(() => {
    process.env.OPS_SESSION_SECRET = 'test-ops-session-secret'
  })

  afterEach(() => {
    process.env = { ...envSnapshot }
  })

  it('round-trips signed ops cookie payloads', () => {
    const token = encodeSignedOpsCookie({ state: 'abc', exp: Date.now() + 60_000 })
    expect(splitSignedOpsCookie(token)?.body).toBe(token.split('.')[0])
    expect(splitSignedOpsCookie(`${token}x`)).toBeNull()
  })
})
