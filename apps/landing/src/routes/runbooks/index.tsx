import { createFileRoute } from '@tanstack/react-router'
import { HomeSiteChrome } from '../../components/home/HomeSiteChrome'
import { RunbookResultsTable, RunbookSearch } from '../../components/runbooks'
import { m } from '../../paraglide/messages.js'
import { searchRunbooks } from '../../lib/runbooks/runbook-service'

type RunbooksSearch = {
  q: string
}

export const Route = createFileRoute('/runbooks/')({
  validateSearch: (search: Record<string, unknown>): RunbooksSearch => ({
    q: typeof search.q === 'string' ? search.q : '',
  }),
  loaderDeps: ({ search: { q } }) => ({ q }),
  loader: ({ deps: { q } }) => ({
    results: searchRunbooks({ q }),
  }),
  component: RunbooksIndexPage,
})

function RunbooksIndexPage() {
  const { q } = Route.useSearch()
  const navigate = Route.useNavigate()
  const { results } = Route.useLoaderData()

  return (
    <>
      <div className='runbook-page page-x section-y mx-auto max-w-4xl border-line border-b'>
        <p className='label-mono'>{m.runbooks_kicker()}</p>
        <h1 className='h1 mt-2'>{m.runbooks_title()}</h1>
        <p className='mt-2 text-muted'>{m.runbooks_sub()}</p>

        <div className='mt-8'>
          <RunbookSearch
            onQueryChange={next => {
              navigate({ search: prev => ({ ...prev, q: next }) })
            }}
            query={q}
          />
        </div>

        <h2 className='h2 mt-10'>
          {m.runbooks_results()} ({results.length})
        </h2>
        <div className='mt-4'>
          <RunbookResultsTable empty={results.length === 0} results={results} />
        </div>

        <p className='mt-8 text-muted text-sm'>
          {m.runbooks_fallback()}{' '}
          <a
            className='link link-primary'
            href='https://github.com/polyms/ai-kit/tree/main/docs/runbooks'
            rel='noopener noreferrer'
            target='_blank'
          >
            docs/runbooks
          </a>
        </p>
      </div>
      <HomeSiteChrome />
    </>
  )
}
