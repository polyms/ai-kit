import { createFileRoute } from '@tanstack/react-router'
import {
  assertOAuthCallbackState,
  exchangeAuthorizationCode,
  fetchOidcUserInfo,
} from '../../../../lib/ops/oidc.server'
import { getOidcConfig, sanitizeOpsReturnTo } from '../../../../lib/ops/oidc-config'
import { clearOAuthStateCookieHeader, readOAuthStateFromRequest } from '../../../../lib/ops/oidc-state.server'
import { createSessionToken, sessionCookieHeader } from '../../../../lib/ops/session.server'

export const Route = createFileRoute('/api/ops/auth/callback')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const requestUrl = new URL(request.url)
        const oauthError = requestUrl.searchParams.get('error')
        const returnToBase = '/ops/login'

        if (oauthError) {
          const description = requestUrl.searchParams.get('error_description') ?? oauthError
          return new Response(null, {
            status: 302,
            headers: {
              Location: `${returnToBase}?error=${encodeURIComponent(description)}`,
              'Set-Cookie': clearOAuthStateCookieHeader(),
            },
          })
        }

        const config = getOidcConfig(requestUrl)
        if (!config) {
          return new Response(null, {
            status: 302,
            headers: {
              Location: `${returnToBase}?error=${encodeURIComponent('OIDC is not configured')}`,
            },
          })
        }

        try {
          const stored = assertOAuthCallbackState(
            readOAuthStateFromRequest(request),
            requestUrl.searchParams.get('state')
          )
          const code = requestUrl.searchParams.get('code')
          if (!code) {
            throw new Error('OIDC callback missing code')
          }

          const tokens = await exchangeAuthorizationCode(config, code, stored.codeVerifier)
          const user = await fetchOidcUserInfo(config, tokens.access_token)
          const sessionToken = createSessionToken(user.sub)
          const destination = sanitizeOpsReturnTo(stored.returnTo)
          const headers = new Headers({ Location: destination })
          headers.append('Set-Cookie', sessionCookieHeader(sessionToken))
          headers.append('Set-Cookie', clearOAuthStateCookieHeader())

          return new Response(null, {
            status: 302,
            headers,
          })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'OIDC callback failed'
          const headers = new Headers({
            Location: `${returnToBase}?error=${encodeURIComponent(message)}`,
          })
          headers.append('Set-Cookie', clearOAuthStateCookieHeader())

          return new Response(null, {
            status: 302,
            headers,
          })
        }
      },
    },
  },
})
