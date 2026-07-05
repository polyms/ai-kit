import { createFileRoute } from '@tanstack/react-router'
import { SkillCommandList } from '../../components/SkillCommandList'
import type { SkillsSearch } from '../../lib/skills-search'
import { m } from '../../paraglide/messages.js'

export const Route = createFileRoute('/skills/')({
  validateSearch: (search: Record<string, unknown>): SkillsSearch => ({
    q: typeof search.q === 'string' ? search.q : '',
    domain: typeof search.domain === 'string' ? search.domain : 'all',
    invocation: search.invocation === 'user' || search.invocation === 'model' ? search.invocation : 'all',
  }),
  component: SkillsPage,
})

function SkillsPage() {
  const { q, domain, invocation } = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <div className='page-x py-10 md:py-12'>
      <div className='mx-auto max-w-4xl'>
        <h1 className='h1'>{m.catalog_title()}</h1>
        <p className='mt-2 text-muted'>{m.catalog_sub()}</p>
        <div className='mt-8'>
          <SkillCommandList
            onSearchChange={next => {
              navigate({ search: prev => ({ ...prev, ...next }) })
            }}
            search={{ q, domain, invocation }}
          />
        </div>
      </div>
    </div>
  )
}
