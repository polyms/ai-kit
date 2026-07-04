import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/quick-start')({
  beforeLoad: () => {
    throw redirect({ to: '/', hash: 'quick-start' })
  },
})
