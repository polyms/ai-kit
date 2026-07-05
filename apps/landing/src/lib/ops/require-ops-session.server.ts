import { getSessionFromRequest } from './session.server'

export function requireOpsSession(request: Request): Response | null {
  if (!getSessionFromRequest(request)) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }
  return null
}
