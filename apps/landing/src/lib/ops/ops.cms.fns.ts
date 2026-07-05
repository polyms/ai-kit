import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { buildAxisCombos, countByIntent, type OpsKnowledgeRow } from './ops.types'
import { getSessionFromRequest } from './session.server'

function assertOpsSession(): void {
  const request = getRequest()
  if (!getSessionFromRequest(request)) {
    throw new Error('UNAUTHORIZED')
  }
}

export const listOpsKnowledgeFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<{ rows: OpsKnowledgeRow[] }> => {
    assertOpsSession()
    const { listOpsKnowledge } = await import('./ops-repository.server')
    return { rows: await listOpsKnowledge() }
  }
)

export const getOpsMatrixFn = createServerFn({ method: 'GET' }).handler(async () => {
  assertOpsSession()
  const { listOpsKnowledge } = await import('./ops-repository.server')
  const knowledge = await listOpsKnowledge()
  return {
    knowledge,
    knowledgeCombos: buildAxisCombos(knowledge),
    knowledgeIntentCoverage: countByIntent(knowledge),
  }
})
