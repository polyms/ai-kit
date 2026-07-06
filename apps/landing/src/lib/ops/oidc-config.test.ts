import { afterEach, describe, expect, it } from 'vitest'
import { getOidcConfig, getOidcIssuer, isOidcConfigured, sanitizeOpsReturnTo } from './oidc-config'

describe('oidc-config', () => {
  const envSnapshot = { ...process.env }

  afterEach(() => {
    process.env = { ...envSnapshot }
  })

  it('isOidcConfigured requires client id only', () => {
    delete process.env.OIDC_CLIENT_ID
    expect(isOidcConfigured()).toBe(false)

    process.env.OIDC_CLIENT_ID = 'ai-kit-ops'
    expect(isOidcConfigured()).toBe(true)
  })

  it('defaults issuer to polyms.dev when OIDC_ISSUER unset', () => {
    delete process.env.OIDC_ISSUER
    expect(getOidcIssuer()).toBe('https://polyms.dev')
  })

  it('uses OIDC_ISSUER when set', () => {
    process.env.OIDC_ISSUER = 'http://localhost:6200'
    expect(getOidcIssuer()).toBe('http://localhost:6200')
  })

  it('builds polyms.dev authorize endpoints from OIDC_CLIENT_ID', () => {
    process.env.OIDC_CLIENT_ID = 'ai-kit-ops'

    const config = getOidcConfig(new URL('http://localhost:6300/ops/login'))
    expect(config).not.toBeNull()
    expect(config?.clientId).toBe('ai-kit-ops')
    expect(config?.authorizationEndpoint).toBe('https://polyms.dev/api/auth/oauth2/authorize')
    expect(config?.redirectUri).toBe('http://localhost:6300/api/ops/auth/callback')
  })

  it('sanitizes returnTo to ops routes only', () => {
    expect(sanitizeOpsReturnTo('/ops/knowledge')).toBe('/ops/knowledge')
    expect(sanitizeOpsReturnTo('https://evil.test/ops/knowledge')).toBe('/ops/knowledge')
    expect(sanitizeOpsReturnTo('/knowledge')).toBe('/ops/knowledge')
    expect(sanitizeOpsReturnTo(undefined)).toBe('/ops/knowledge')
  })
})
