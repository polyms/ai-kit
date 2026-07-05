import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { buildAxisCombos, type OpsGuideRow, type OpsRunbookRow } from './ops.types'
import { getSessionFromRequest } from './session.server'

function assertOpsSession(): void {
  const request = getRequest()
  if (!getSessionFromRequest(request)) {
    throw new Error('UNAUTHORIZED')
  }
}

export const listOpsRunbooksFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<{ rows: OpsRunbookRow[] }> => {
    assertOpsSession()
    const { listOpsRunbooks } = await import('./ops-repository.server')
    return { rows: await listOpsRunbooks() }
  }
)

export const listOpsGuidesFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<{ rows: OpsGuideRow[] }> => {
    assertOpsSession()
    const { listOpsGuides } = await import('./ops-repository.server')
    return { rows: await listOpsGuides() }
  }
)

export const getOpsMatrixFn = createServerFn({ method: 'GET' }).handler(async () => {
  assertOpsSession()
  const { listOpsGuides, listOpsRunbooks } = await import('./ops-repository.server')
  const [runbooks, guides] = await Promise.all([listOpsRunbooks(), listOpsGuides()])
  return {
    runbooks,
    guides,
    runbookCombos: buildAxisCombos(runbooks),
    guideCombos: buildAxisCombos(guides),
  }
})
