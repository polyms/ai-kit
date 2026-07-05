import { createFileRoute } from '@tanstack/react-router'
import { GuideResultsTable, GuideSearch } from '../../components/guides'
import { HomeSiteChrome } from '../../components/home/HomeSiteChrome'
import { searchGuidesFn } from '../../lib/guides/guide.fns'
import { m } from '../../paraglide/messages.js'

type GuidesSearch = {
  q: string
}

export const Route = createFileRoute('/guides/')({
  validateSearch: (search: Record<string, unknown>): GuidesSearch => ({
    q: typeof search.q === 'string' ? search.q : '',
  }),
  loaderDeps: ({ search: { q } }) => ({ q }),
  loader: async ({ deps: { q } }) => ({
    results: await searchGuidesFn({ data: { q } }),
  }),
  component: GuidesIndexPage,
})

function GuidesIndexPage() {
  const { q } = Route.useSearch()
  const navigate = Route.useNavigate()
  const { results } = Route.useLoaderData()

  return (
    <>
      <div className='guide-page page-x section-y mx-auto max-w-4xl border-line border-b'>
        <p className='label-mono'>{m.guides_kicker()}</p>
        <h1 className='h1 mt-2'>{m.guides_title()}</h1>
        <p className='mt-2 text-muted'>{m.guides_sub()}</p>

        <div className='mt-8'>
          <GuideSearch
            onQueryChange={next => {
              navigate({ search: prev => ({ ...prev, q: next }) })
            }}
            query={q}
          />
        </div>

        <h2 className='h2 mt-10'>
          {m.guides_results()} ({results.length})
        </h2>
        <div className='mt-4'>
          <GuideResultsTable empty={results.length === 0} results={results} />
        </div>
      </div>
      <HomeSiteChrome />
    </>
  )
}
