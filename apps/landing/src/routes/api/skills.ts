import { createFileRoute } from '@tanstack/react-router'
import { skillProvider } from '../../lib/skill-pack/provider.server'

export const Route = createFileRoute('/api/skills')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Only the public, repository-owned skill catalog is exposed. No Ops CMS or credentials.
        if (!request.headers.get('content-type')?.startsWith('application/json')) {
          return Response.json({ error: 'INVALID_REQUEST' }, { status: 415 })
        }
        try {
          const reader = request.body?.getReader()
          if (!reader) return Response.json({ error: 'INVALID_REQUEST' }, { status: 400 })
          const decoder = new TextDecoder()
          let body = ''
          let size = 0
          for (;;) {
            const { done, value } = await reader.read()
            if (done) break
            size += value.byteLength
            if (size > 16_384) {
              await reader.cancel()
              return Response.json({ error: 'REQUEST_TOO_LARGE' }, { status: 413 })
            }
            body += decoder.decode(value, { stream: true })
          }
          return await skillProvider(JSON.parse(body + decoder.decode()))
        } catch {
          return Response.json({ error: 'INVALID_REQUEST' }, { status: 400 })
        }
      },
    },
  },
})
