import { createFileRoute } from '@tanstack/react-router'
import { beginOidcLogin } from '../../../../lib/ops/oidc.server'
import { getOidcConfig, isOidcConfigured, sanitizeOpsReturnTo } from '../../../../lib/ops/oidc-config'

export const Route = createFileRoute('/api/ops/auth/login')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!isOidcConfigured()) {
          return Response.json({ error: 'oidc_not_configured' }, { status: 503 })
        }

        const requestUrl = new URL(request.url)
        const config = getOidcConfig(requestUrl)
        if (!config) {
          return Response.json({ error: 'oidc_not_configured' }, { status: 503 })
        }

        const returnTo = sanitizeOpsReturnTo(requestUrl.searchParams.get('returnTo'))
        const { authorizeUrl, oauthStateCookie } = beginOidcLogin(config, returnTo)

        return new Response(null, {
          status: 302,
          headers: {
            Location: authorizeUrl,
            'Set-Cookie': oauthStateCookie,
          },
        })
      },
    },
  },
})
