import { createFileRoute } from '@tanstack/react-router'
import { clearSessionCookieHeader } from '../../../../lib/ops/session.server'

export const Route = createFileRoute('/api/ops/auth/logout')({
  server: {
    handlers: {
      POST: async () => {
        return new Response(null, {
          status: 302,
          headers: {
            Location: '/ops/login',
            'Set-Cookie': clearSessionCookieHeader(),
          },
        })
      },
    },
  },
})
