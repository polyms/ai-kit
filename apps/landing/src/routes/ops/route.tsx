import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getOpsSessionFn } from '../../lib/ops/ops.auth.fns'

export const Route = createFileRoute('/ops')({
  beforeLoad: async ({ location }) => {
    if (location.pathname === '/ops/login') return
    const session = await getOpsSessionFn()
    if (!session.ok) {
      throw redirect({
        to: '/ops/login',
        search: { returnTo: location.pathname },
      })
    }
  },
  component: OpsLayout,
})

function OpsLayout() {
  return <Outlet />
}
