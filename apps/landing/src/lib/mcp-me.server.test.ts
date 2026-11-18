import { describe, expect, it } from 'vitest'
import { getMcpCurrentUser } from './mcp-me.server'

describe('MCP me tool identity', () => {
  it('returns identity claims from the verified session', () => {
    expect(getMcpCurrentUser({ userId: 'u1', email: 'u1@example.com', role: 'admin' })).toEqual({
      userId: 'u1',
      email: 'u1@example.com',
      role: 'admin',
    })
  })

  it('omits unavailable optional claims without inventing an account email', () => {
    expect(getMcpCurrentUser({ userId: 'u2' })).toEqual({ userId: 'u2' })
  })
})
