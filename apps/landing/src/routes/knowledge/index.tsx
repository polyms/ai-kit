import { createFileRoute } from '@tanstack/react-router'
import {
  KnowledgeIntentTabs,
  KnowledgeResultsSkeleton,
  KnowledgeResultsTable,
  KnowledgeSearch as KnowledgeSearchForm,
} from '../../components/knowledge'
import {
  defaultKnowledgeSearch,
  type KnowledgeSearch,
  searchKnowledgeFn,
} from '../../lib/knowledge/knowledge.fns'
import type { KnowledgeIntent } from '../../lib/knowledge/knowledge.types'
import { m } from '../../paraglide/messages.js'

const KNOWLEDGE_INTENTS = ['incident', 'design', 'toolchain'] as const

function parseIntent(value: unknown): KnowledgeIntent | undefined {
  return typeof value === 'string' && KNOWLEDGE_INTENTS.includes(value as KnowledgeIntent)
    ? (value as KnowledgeIntent)
    : undefined
}

export const Route = createFileRoute('/knowledge/')({
  validateSearch: (search: Record<string, unknown>): KnowledgeSearch => ({
    q: typeof search.q === 'string' ? search.q : '',
    intent: parseIntent(search.intent),
  }),
  loaderDeps: ({ search: { q, intent } }) => ({ q, intent }),
  loader: async ({ deps: { q, intent } }) => ({
    results: await searchKnowledgeFn({ data: { q, intent } }),
  }),
  component: KnowledgeIndexPage,
  pendingComponent: KnowledgeIndexPending,
})

function KnowledgeIndexPending() {
  return (
    <div className='knowledge-page page-x section-y mx-auto max-w-4xl'>
      <p className='label-mono'>{m.knowledge_kicker()}</p>
      <h1 className='h1 mt-2'>{m.knowledge_title()}</h1>
      <p className='mt-2 text-muted'>{m.knowledge_sub()}</p>
      <div className='mt-8'>
        <KnowledgeResultsSkeleton />
      </div>
    </div>
  )
}

function KnowledgeIndexPage() {
  const { q, intent } = Route.useSearch()
  const navigate = Route.useNavigate()
  const { results } = Route.useLoaderData()

  return (
    <div className='knowledge-page page-x section-y mx-auto max-w-4xl'>
      <p className='label-mono'>{m.knowledge_kicker()}</p>
      <h1 className='h1 mt-2'>{m.knowledge_title()}</h1>
      <p className='mt-2 text-muted'>{m.knowledge_sub()}</p>

      <div className='mt-8 space-y-5'>
        <KnowledgeSearchForm
          onQueryChange={next => {
            navigate({ search: (prev: KnowledgeSearch) => ({ ...prev, q: next }) })
          }}
          query={q}
        />
        <KnowledgeIntentTabs
          intent={intent}
          onIntentChange={next => {
            navigate({ search: (prev: KnowledgeSearch) => ({ ...prev, intent: next }) })
          }}
        />
      </div>

      <div className='mt-10 flex items-baseline gap-2'>
        <h2 className='h2'>{m.knowledge_results()}</h2>
        <span className='badge badge-light font-mono'>{results.length}</span>
      </div>
      <div className='mt-4'>
        <KnowledgeResultsTable
          empty={results.length === 0}
          onClear={() => {
            navigate({ search: () => defaultKnowledgeSearch })
          }}
          results={results}
        />
      </div>

      <p className='mt-8 text-muted text-sm'>
        {m.knowledge_fallback()}{' '}
        <a
          className='link link-primary'
          href='https://github.com/polyms/ai-kit/tree/main/docs/agents/knowledge.md'
          rel='noopener noreferrer'
          target='_blank'
        >
          docs/agents/knowledge.md
        </a>
      </p>
    </div>
  )
}
