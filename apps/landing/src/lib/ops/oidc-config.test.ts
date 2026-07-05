import { afterEach, describe, expect, it } from 'vitest'
import { getOidcConfig, isOidcConfigured, sanitizeOpsReturnTo } from './oidc-config'

describe('oidc-config', () => {
  const envSnapshot = { ...process.env }

  afterEach(() => {
    process.env = { ...envSnapshot }
  })

  it('isOidcConfigured requires client id and secret', () => {
    delete process.env.OIDC_CLIENT_ID
    delete process.env.OIDC_CLIENT_SECRET
    expect(isOidcConfigured()).toBe(false)

    process.env.OIDC_CLIENT_ID = 'ai-kit-ops'
    expect(isOidcConfigured()).toBe(false)

    process.env.OIDC_CLIENT_SECRET = 'secret'
    expect(isOidcConfigured()).toBe(true)
  })

  it('builds polyms.dev authorize endpoints from OIDC_CLIENT_ID', () => {
    process.env.OIDC_CLIENT_ID = 'ai-kit-ops'
    process.env.OIDC_CLIENT_SECRET = 'secret'

    const config = getOidcConfig(new URL('http://localhost:6300/ops/login'))
    expect(config).not.toBeNull()
    expect(config?.clientId).toBe('ai-kit-ops')
    expect(config?.authorizationEndpoint).toBe('https://polyms.dev/api/auth/oauth2/authorize')
    expect(config?.redirectUri).toBe('http://localhost:6300/api/ops/auth/callback')
  })

  it('sanitizes returnTo to ops routes only', () => {
    expect(sanitizeOpsReturnTo('/ops/runbooks')).toBe('/ops/runbooks')
    expect(sanitizeOpsReturnTo('https://evil.test/ops/runbooks')).toBe('/ops/runbooks')
    expect(sanitizeOpsReturnTo('/runbooks')).toBe('/ops/runbooks')
  })
})
