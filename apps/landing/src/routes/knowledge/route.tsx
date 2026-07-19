import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router'
import { startTransition } from 'react'
import { KnowledgeSidebar } from '../../components/knowledge'
import { type KnowledgeSearch, searchKnowledgeFn } from '../../lib/knowledge/knowledge.fns'
import { type KnowledgeIntent, parseKnowledgeIntent } from '../../lib/knowledge/knowledge.types'

export const Route = createFileRoute('/knowledge')({
  validateSearch: (search: Record<string, unknown>): KnowledgeSearch => ({
    q: typeof search.q === 'string' ? search.q : '',
    intent: parseKnowledgeIntent(typeof search.intent === 'string' ? search.intent : undefined),
  }),
  loaderDeps: ({ search: { q, intent } }) => ({ q, intent }),
  loader: async ({ deps: { q, intent } }) => ({
    results: await searchKnowledgeFn({ data: { q, intent } }),
  }),
  component: KnowledgeLayout,
  pendingComponent: KnowledgeLayoutPending,
})

function useKnowledgeNavHandlers() {
  const navigate = Route.useNavigate()
  const isPending = useRouterState({ select: s => s.isTransitioning })

  return {
    isPending,
    onIntentChange: (next: KnowledgeIntent | undefined) => {
      startTransition(() => {
        navigate({ search: (prev: KnowledgeSearch) => ({ ...prev, intent: next }) })
      })
    },
    onQueryChange: (next: string) => {
      startTransition(() => {
        navigate({ search: (prev: KnowledgeSearch) => ({ ...prev, q: next }) })
      })
    },
  }
}

function KnowledgeLayoutPending() {
  const { q, intent } = Route.useSearch()
  const { isPending, onIntentChange, onQueryChange } = useKnowledgeNavHandlers()

  return (
    <div className='flex h-dvh w-full overflow-hidden'>
      <KnowledgeSidebar
        intent={intent}
        isPending={isPending}
        onIntentChange={onIntentChange}
        onQueryChange={onQueryChange}
        q={q}
        results={undefined}
      />
      <main className='min-w-0 flex-1 overflow-y-auto' />
    </div>
  )
}

function KnowledgeLayout() {
  const { q, intent } = Route.useSearch()
  const { results } = Route.useLoaderData()
  const { isPending, onIntentChange, onQueryChange } = useKnowledgeNavHandlers()

  return (
    <div className='flex h-dvh w-full overflow-hidden'>
      <KnowledgeSidebar
        intent={intent}
        isPending={isPending}
        onIntentChange={onIntentChange}
        onQueryChange={onQueryChange}
        q={q}
        results={results}
      />
      <main className='min-w-0 flex-1 overflow-y-auto'>
        <Outlet />
      </main>
    </div>
  )
}
