import type {} from '@tanstack/react-start'
import { createFileRoute } from '@tanstack/react-router'
import { getIssue } from '../../../../lib/runbooks/runbook-service'

export const Route = createFileRoute('/api/runbooks/issues/$issueId')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const found = getIssue(params.issueId)
        if (!found) {
          return Response.json({ error: 'Issue not found' }, { status: 404 })
        }
        return Response.json({ runbookId: found.runbook.id, ...found.issue })
      },
    },
  },
})
