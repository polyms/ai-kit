import { Toggle, ToggleGroup, Toolbar } from '@polyms/ui-kit'
import { Link as RouterLink } from '@tanstack/react-router'
import { IconBookBookmark, IconMagnifier } from '../../lib/icons'
import type { KnowledgeIntent, KnowledgeSearchResultItem } from '../../lib/knowledge/knowledge.types'
import { m } from '../../paraglide/messages.js'
import { PolymsWordmark } from '../PolymsWordmark'
import { intentItemClass, intentLabel, KnowledgeSearch as KnowledgeSearchField } from './KnowledgeUi'

const INTENT_TOGGLE_VALUES = ['all', 'incident', 'design', 'toolchain'] as const

const SKELETON_ROW_IDS = ['a', 'b', 'c', 'd', 'e', 'f']

type ArticleResult = Extract<KnowledgeSearchResultItem, { type: 'article' }>
type ChunkResult = Extract<KnowledgeSearchResultItem, { type: 'chunk' }>

type ResultGroup = {
  articleId: string
  article: ArticleResult | undefined
  chunks: ChunkResult[]
}

function groupResults(results: KnowledgeSearchResultItem[]): ResultGroup[] {
  const groups = new Map<string, ResultGroup>()
  for (const row of results) {
    const articleId = row.type === 'article' ? row.id : row.articleId
    let group = groups.get(articleId)
    if (!group) {
      group = { articleId, article: undefined, chunks: [] }
      groups.set(articleId, group)
    }
    if (row.type === 'article') group.article = row
    else group.chunks.push(row)
  }
  return [...groups.values()]
}

function ArticleRow({ article }: { article: ArticleResult }) {
  return (
    <RouterLink
      activeOptions={{ exact: true, includeHash: false }}
      activeProps={{ className: 'bg-primary-100' }}
      className='flex items-start gap-2.5 rounded-xl px-3 py-2.5 no-underline transition-colors hover:bg-surface'
      from='/knowledge'
      params={{ id: article.id }}
      search={prev => prev}
      to='/knowledge/$id'
    >
      {({ isActive }) => (
        <>
          <span
            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${intentItemClass(article.intent)}`}
          >
            <IconBookBookmark aria-hidden size={16} />
          </span>
          <span className='min-w-0 flex-1'>
            <span
              className={`block truncate font-semibold text-sm ${isActive ? 'text-primary-700' : 'text-fg'}`}
            >
              {article.title}
            </span>
            <span className='mt-0.5 block truncate text-muted text-xs'>
              {intentLabel(article.intent)}
              {' · '}
              {article.match}
            </span>
          </span>
        </>
      )}
    </RouterLink>
  )
}

function ChunkRow({ chunk }: { chunk: ChunkResult }) {
  return (
    <RouterLink
      activeOptions={{ exact: true, includeHash: true }}
      activeProps={{ className: 'bg-primary-100' }}
      className='relative flex items-center rounded-lg py-1.5 ps-3 pe-2.5 no-underline transition-colors hover:bg-surface'
      from='/knowledge'
      hash={chunk.slug}
      params={{ id: chunk.articleId }}
      search={prev => prev}
      to='/knowledge/$id'
    >
      {({ isActive }) => (
        <>
          <span
            className={`absolute inset-s-0 top-1/2 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-body ${isActive ? 'bg-primary-600' : 'bg-line'}`}
          />
          <span
            className={`min-w-0 flex-1 truncate text-xs ${isActive ? 'font-semibold text-primary-700' : 'text-muted'}`}
          >
            {chunk.title}
          </span>
        </>
      )}
    </RouterLink>
  )
}

type KnowledgeSidebarProps = {
  q: string
  intent: KnowledgeIntent | undefined
  results: KnowledgeSearchResultItem[] | undefined
  isPending: boolean
  onQueryChange: (q: string) => void
  onIntentChange: (intent: KnowledgeIntent | undefined) => void
}

export function KnowledgeSidebar({
  q,
  intent,
  results,
  isPending,
  onQueryChange,
  onIntentChange,
}: KnowledgeSidebarProps) {
  return (
    <aside className='flex h-full w-full shrink-0 flex-col border-line border-e lg:w-88'>
      <div className='shrink-0 px-5 pt-6 pb-1'>
        <h1 className='font-bold font-display text-2xl tracking-tight'>{m.knowledge_title()}</h1>
        <p className='mt-1.5 text-muted text-sm leading-relaxed'>{m.knowledge_sub()}</p>
      </div>

      <div className='shrink-0 space-y-3 px-5 py-4'>
        <KnowledgeSearchField onQueryChange={onQueryChange} query={q} />

        <Toolbar
          aria-label={m.knowledge_intent()}
          className={`w-full transition-opacity ${isPending ? 'opacity-60' : ''}`}
          rounded
          variant='inline'
        >
          <ToggleGroup
            aria-label={m.knowledge_intent()}
            className='grid w-full grid-cols-4 gap-1'
            onValueChange={values => {
              const next = values[0]
              onIntentChange(next === 'all' ? undefined : (next as KnowledgeIntent))
            }}
            value={[intent ?? 'all']}
          >
            {INTENT_TOGGLE_VALUES.map(value => (
              <Toolbar.Button
                key={value}
                render={<Toggle className='toggle w-full justify-center px-1 text-xs' />}
                value={value}
              >
                {value === 'all' ? m.catalog_filterAll() : intentLabel(value)}
              </Toolbar.Button>
            ))}
          </ToggleGroup>
        </Toolbar>
      </div>

      <div className='h-px shrink-0 bg-line' />

      <div
        className={`min-h-0 flex-1 overflow-y-auto px-2 py-2 transition-opacity ${isPending ? 'opacity-60' : ''}`}
      >
        {results === undefined ? (
          <ul aria-label={m.knowledge_resultsCaption()} className='space-y-0.5' role='status'>
            {SKELETON_ROW_IDS.map(id => (
              <li className='flex items-start gap-2.5 px-3 py-2.5' key={id}>
                <div className='skeleton h-8 w-8 shrink-0 rounded-lg' />
                <div className='min-w-0 flex-1 space-y-1.5 py-0.5'>
                  <div className='skeleton h-3 w-3/5 rounded-md' />
                  <div className='skeleton h-2.5 w-4/5 rounded-md' />
                </div>
              </li>
            ))}
          </ul>
        ) : results.length === 0 ? (
          <div className='flex flex-col items-center gap-2 px-4 py-10 text-center'>
            <IconMagnifier aria-hidden className='text-muted' size={22} />
            <p className='text-muted text-xs'>{m.knowledge_empty()}</p>
          </div>
        ) : (
          <ul className='space-y-0.5'>
            {groupResults(results).map(group => (
              <li key={group.articleId}>
                {group.article ? <ArticleRow article={group.article} /> : null}
                {group.chunks.length > 0 ? (
                  <ul
                    className={group.article ? 'ms-7 mt-0.5 space-y-0.5 border-line border-s' : 'space-y-0.5'}
                  >
                    {group.chunks.map(chunk => (
                      <li key={chunk.id}>
                        <ChunkRow chunk={chunk} />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className='shrink-0 border-line border-t px-5 py-4'>
        <RouterLink className='flex items-center gap-2 no-underline' to='/'>
          <PolymsWordmark
            iconClassName='h-6 w-6 text-slate-500'
            textClassName='font-sans text-[15px] text-fg'
          />
        </RouterLink>
      </div>
    </aside>
  )
}
