import { createFileRoute } from '@tanstack/react-router'
import { KnowledgeResultsTable, KnowledgeSearch as KnowledgeSearchForm } from '../../components/knowledge'
import { type KnowledgeSearch, searchKnowledgeFn } from '../../lib/knowledge/knowledge.fns'
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
})

function intentLabel(intent: KnowledgeIntent): string {
  switch (intent) {
    case 'incident':
      return m.knowledge_intent_incident()
    case 'design':
      return m.knowledge_intent_design()
    case 'toolchain':
      return m.knowledge_intent_toolchain()
  }
}

function KnowledgeIndexPage() {
  const { q, intent } = Route.useSearch()
  const navigate = Route.useNavigate()
  const { results } = Route.useLoaderData()

  return (
    <div className='knowledge-page page-x section-y mx-auto max-w-4xl border-line border-b'>
      <p className='label-mono'>{m.knowledge_kicker()}</p>
      <h1 className='h1 mt-2'>{m.knowledge_title()}</h1>
      <p className='mt-2 text-muted'>{m.knowledge_sub()}</p>

      {intent ? (
        <p className='mt-4 text-sm'>
          <span className='label-mono'>{m.knowledge_intent()}:</span>{' '}
          <span className='font-medium'>{intentLabel(intent)}</span>
        </p>
      ) : null}

      <div className='mt-8'>
        <KnowledgeSearchForm
          onQueryChange={next => {
            navigate({ search: (prev: KnowledgeSearch) => ({ ...prev, q: next }) })
          }}
          query={q}
        />
      </div>

      <h2 className='h2 mt-10'>
        {m.knowledge_results()} ({results.length})
      </h2>
      <div className='mt-4'>
        <KnowledgeResultsTable empty={results.length === 0} results={results} />
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
