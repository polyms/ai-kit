import { createFileRoute } from '@tanstack/react-router'
import { HomeSiteChrome } from '../../components/home/HomeSiteChrome'
import { RunbookResultsTable, RunbookSearch } from '../../components/runbooks'
import { useT } from '../../lib/i18n'
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
  const t = useT()

  return (
    <>
      <div className='runbook-page page-x section-y mx-auto max-w-4xl border-line border-b'>
        <p className='label-mono'>{t('runbooks.kicker')}</p>
        <h1 className='h1 mt-2'>{t('runbooks.title')}</h1>
        <p className='mt-2 text-muted'>{t('runbooks.sub')}</p>

        <div className='mt-8'>
          <RunbookSearch
            query={q}
            onQueryChange={next => {
              navigate({ search: prev => ({ ...prev, q: next }) })
            }}
          />
        </div>

        <h2 className='h2 mt-10'>
          {t('runbooks.results')} ({results.length})
        </h2>
        <div className='mt-4'>
          <RunbookResultsTable results={results} empty={results.length === 0} />
        </div>

        <p className='mt-8 text-muted text-sm'>
          {t('runbooks.fallback')}{' '}
          <a
            href='https://github.com/polyms/ai-kit/tree/main/docs/runbooks'
            className='link link-primary'
            target='_blank'
            rel='noopener noreferrer'
          >
            docs/runbooks
          </a>
        </p>
      </div>
      <HomeSiteChrome />
    </>
  )
}
