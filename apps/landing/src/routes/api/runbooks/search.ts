import { createFileRoute } from '@tanstack/react-router'
import { searchRunbooks } from '../../../lib/runbooks/runbook-service'

export const Route = createFileRoute('/api/runbooks/search')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const q = url.searchParams.get('q') ?? ''
        const axesParam = url.searchParams.getAll('axes')
        const axes =
          axesParam.length > 0
            ? axesParam.flatMap(value =>
                value
                  .split(',')
                  .map(s => s.trim())
                  .filter(Boolean)
              )
            : undefined
        const limitRaw = url.searchParams.get('limit')
        const limit = limitRaw ? Number.parseInt(limitRaw, 10) : 20
        return Response.json({
          results: searchRunbooks({ q, axes, limit: Number.isFinite(limit) ? limit : 20 }),
        })
      },
    },
  },
})
