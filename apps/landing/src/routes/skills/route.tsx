import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router'
import { startTransition, useMemo } from 'react'
import { SkillsSidebar } from '../../components/skills'
import { filterSkills, getSkills } from '../../lib/skills'
import type { SkillsSearch } from '../../lib/skills-search'
import { useAppStore } from '../../stores/useAppStore'

export const Route = createFileRoute('/skills')({
  validateSearch: (search: Record<string, unknown>): SkillsSearch => ({
    q: typeof search.q === 'string' ? search.q : '',
    invocation: search.invocation === 'user' || search.invocation === 'model' ? search.invocation : 'all',
  }),
  component: SkillsLayout,
})

function useSkillsNavHandlers() {
  const navigate = Route.useNavigate()
  const isPending = useRouterState({ select: s => s.isTransitioning })

  return {
    isPending,
    onInvocationChange: (next: SkillsSearch['invocation']) => {
      startTransition(() => {
        navigate({ search: (prev: SkillsSearch) => ({ ...prev, invocation: next }) })
      })
    },
    onQueryChange: (next: string) => {
      startTransition(() => {
        navigate({ search: (prev: SkillsSearch) => ({ ...prev, q: next }) })
      })
    },
  }
}

function SkillsLayout() {
  const { q, invocation } = Route.useSearch()
  const locale = useAppStore(s => s.locale)
  const { isPending, onInvocationChange, onQueryChange } = useSkillsNavHandlers()

  const skills = useMemo(
    () =>
      filterSkills(getSkills(locale), {
        search: q,
        invocation,
      }),
    [q, invocation, locale]
  )

  return (
    <div className='flex h-dvh w-full overflow-hidden'>
      <SkillsSidebar
        invocation={invocation}
        isPending={isPending}
        onInvocationChange={onInvocationChange}
        onQueryChange={onQueryChange}
        q={q}
        skills={skills}
      />
      <main className='min-w-0 flex-1 overflow-y-auto'>
        <Outlet />
      </main>
    </div>
  )
}
