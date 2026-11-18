import { afterEach, describe, expect, it, vi } from 'vitest'
import { getMcpCurrentUser } from './mcp-me.server'

const session = { userId: 'u1', role: 'admin' }
const token = 'test-bearer'

function stubUserInfo(body: unknown, status = 200) {
  const fetcher = vi.fn(
    async () =>
      new Response(JSON.stringify(body), {
        status,
        headers: { 'content-type': 'application/json' },
      })
  )
  return fetcher as unknown as typeof fetch
}

afterEach(() => vi.restoreAllMocks())

describe('MCP me OIDC UserInfo', () => {
  it('resolves standard profile claims through UserInfo while retaining verified role', async () => {
    const fetcher = stubUserInfo({
      sub: 'u1',
      email: 'u1@example.com',
      email_verified: true,
      name: 'Example User',
      picture: 'https://example.com/photo.png',
      preferred_username: 'example',
      locale: 'en',
      internal_secret: 'not-exposed',
      role: 'superadmin',
    })
    await expect(getMcpCurrentUser(session, token, fetcher)).resolves.toEqual({
      userId: 'u1',
      email: 'u1@example.com',
      emailVerified: true,
      name: 'Example User',
      picture: 'https://example.com/photo.png',
      preferredUsername: 'example',
      locale: 'en',
      role: 'admin',
    })
    const [url, init] = vi.mocked(fetcher).mock.calls[0]
    expect(String(url)).toMatch(/\/api\/auth\/oauth2\/userinfo$/)
    expect(init?.headers).toEqual({
      Authorization: 'Bearer test-bearer',
      Accept: 'application/json',
    })
  })

  it('returns only verified identity when optional UserInfo claims are absent', async () => {
    await expect(getMcpCurrentUser({ userId: 'u1' }, token, stubUserInfo({ sub: 'u1' }))).resolves.toEqual({
      userId: 'u1',
    })
  })

  it('rejects a mismatching UserInfo subject', async () => {
    await expect(
      getMcpCurrentUser(
        session,
        token,
        stubUserInfo({
          sub: 'other',
          email: 'other@example.com',
        })
      )
    ).rejects.toThrow('OIDC UserInfo subject mismatch')
  })

  it('rejects upstream error responses', async () => {
    await expect(
      getMcpCurrentUser(session, token, stubUserInfo({ error: 'invalid_token' }, 401))
    ).rejects.toThrow('OIDC UserInfo request failed')
  })

  it('rejects malformed and non-object responses', async () => {
    await expect(getMcpCurrentUser(session, token, stubUserInfo(null))).rejects.toThrow(
      'Invalid OIDC UserInfo response'
    )
  })
})
