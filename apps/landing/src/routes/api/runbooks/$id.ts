import { createFileRoute } from '@tanstack/react-router'
import { getRunbook } from '../../../lib/runbooks/runbook-service'

export const Route = createFileRoute('/api/runbooks/$id')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const runbook = getRunbook(params.id)
        if (!runbook) {
          return Response.json({ error: 'Runbook not found' }, { status: 404 })
        }
        return Response.json(runbook)
      },
    },
  },
})
