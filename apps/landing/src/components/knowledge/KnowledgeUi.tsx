import { Breadcrumb, Field, Tabs } from '@polyms/core-ui'
import { Link as RouterLink } from '@tanstack/react-router'
import { IconMagnifier } from '../../lib/icons'
import { defaultKnowledgeSearch } from '../../lib/knowledge/knowledge.fns'
import type {
  KnowledgeChunk,
  KnowledgeIntent,
  KnowledgeSearchResultItem,
} from '../../lib/knowledge/knowledge.types'
import { m } from '../../paraglide/messages.js'

export function intentLabel(intent: string): string {
  switch (intent) {
    case 'incident':
      return m.knowledge_intent_incident()
    case 'design':
      return m.knowledge_intent_design()
    case 'toolchain':
      return m.knowledge_intent_toolchain()
    default:
      return intent
  }
}

export function chunkTypeLabel(chunkType: string): string {
  switch (chunkType) {
    case 'incident':
      return m.knowledge_chunkType_incident()
    case 'seam':
      return m.knowledge_chunkType_seam()
    case 'config':
      return m.knowledge_chunkType_config()
    case 'checklist':
      return m.knowledge_chunkType_checklist()
    case 'prose':
      return m.knowledge_chunkType_prose()
    default:
      return chunkType
  }
}

type KnowledgeSearchProps = {
  query: string
  onQueryChange: (q: string) => void
}

export function KnowledgeSearch({ query, onQueryChange }: KnowledgeSearchProps) {
  return (
    <div className='relative'>
      <Field className='w-full' name='knowledge-search'>
        <Field.Label className='sr-only'>{m.knowledge_searchLabel()}</Field.Label>
        <Field.Control
          aria-label={m.knowledge_searchLabel()}
          autoComplete='off'
          className='min-h-11 ps-10 font-mono text-sm'
          debounce={300}
          onChange={e => onQueryChange(e.target.value)}
          placeholder={m.knowledge_searchPlaceholder()}
          type='search'
          value={query}
        />
      </Field>
      <IconMagnifier
        aria-hidden
        className='pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted'
        size={18}
      />
    </div>
  )
}

const INTENT_TAB_VALUES = ['all', 'incident', 'design', 'toolchain'] as const

type KnowledgeIntentTabsProps = {
  intent: KnowledgeIntent | undefined
  onIntentChange: (intent: KnowledgeIntent | undefined) => void
}

export function KnowledgeIntentTabs({ intent, onIntentChange }: KnowledgeIntentTabsProps) {
  return (
    <Tabs
      onValueChange={value => {
        onIntentChange(value === 'all' ? undefined : (value as KnowledgeIntent))
      }}
      value={intent ?? 'all'}
    >
      <Tabs.List aria-label={m.knowledge_intent()} className='mb-0'>
        {INTENT_TAB_VALUES.map(value => (
          <Tabs.Tab key={value} value={value}>
            {value === 'all' ? m.catalog_filterAll() : intentLabel(value)}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  )
}

type KnowledgeResultsTableProps = {
  results: KnowledgeSearchResultItem[]
  empty: boolean
  onClear?: () => void
}

export function KnowledgeResultsTable({ results, empty, onClear }: KnowledgeResultsTableProps) {
  if (empty) {
    return (
      <div className='rounded-lg border border-line border-dashed py-16 text-center'>
        <p className='text-muted'>{m.knowledge_empty()}</p>
        {onClear ? (
          <button className='link link-primary mt-4 text-sm' onClick={onClear} type='button'>
            {m.catalog_clear()}
          </button>
        ) : null}
      </div>
    )
  }

  return (
    <div className='overflow-x-auto rounded-lg border border-line'>
      <table className='table-hover table w-full'>
        <caption className='sr-only'>{m.knowledge_resultsCaption()}</caption>
        <thead className='thead-light'>
          <tr>
            <th scope='col'>{m.knowledge_col_type()}</th>
            <th scope='col'>{m.knowledge_col_id()}</th>
            <th scope='col'>{m.knowledge_col_match()}</th>
            <th scope='col'>{m.knowledge_col_tags()}</th>
          </tr>
        </thead>
        <tbody>
          {results.map(row => {
            const articleId = row.type === 'article' ? row.id : row.articleId
            const href = `/knowledge/${articleId}`
            return (
              <tr className='cursor-pointer' key={`${row.type}-${row.id}`}>
                <td>
                  <span className='badge badge-light font-mono text-xs uppercase'>
                    {row.type === 'article' ? intentLabel(row.intent) : chunkTypeLabel(row.chunkType)}
                  </span>
                </td>
                <td className='font-mono text-sm'>
                  <RouterLink className='link link-primary font-medium' to={href}>
                    {row.id}
                  </RouterLink>
                </td>
                <td className='relative'>
                  <RouterLink className='link stretched-link no-underline' to={href}>
                    {row.title}
                    <span className='mt-0.5 block text-muted text-sm'>{row.match}</span>
                  </RouterLink>
                </td>
                <td>
                  <div className='flex flex-wrap gap-1'>
                    {row.axisTags.slice(0, 4).map(tag => (
                      <span className='badge badge-light' key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function KnowledgeResultsSkeleton() {
  return (
    <div className='space-y-3' role='status'>
      <span className='sr-only'>{m.knowledge_resultsCaption()}</span>
      <div className='skeleton h-11 w-full rounded-lg' />
      <div className='skeleton h-9 w-2/3 rounded-lg' />
      <div className='skeleton h-64 w-full rounded-lg' />
    </div>
  )
}

type AxisTagRowProps = {
  tags: string[]
}

export function AxisTagRow({ tags }: AxisTagRowProps) {
  return (
    <div className='flex flex-wrap gap-1.5'>
      {tags.map(tag => (
        <span className='badge badge-light' key={tag}>
          {tag}
        </span>
      ))}
    </div>
  )
}

type KnowledgeBreadcrumbProps = {
  items: Array<{ label: string; href?: string }>
}

export function KnowledgeBreadcrumb({ items }: KnowledgeBreadcrumbProps) {
  return (
    <Breadcrumb className='mb-4 text-sm'>
      {items.map(item =>
        item.href ? (
          <Breadcrumb.Item active={false} key={item.label}>
            <RouterLink className='link link-dark' search={defaultKnowledgeSearch} to={item.href}>
              {item.label}
            </RouterLink>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item active key={item.label}>
            {item.label}
          </Breadcrumb.Item>
        )
      )}
    </Breadcrumb>
  )
}

type KnowledgeChunkBlockProps = {
  chunk: KnowledgeChunk
}

export function KnowledgeChunkBlock({ chunk }: KnowledgeChunkBlockProps) {
  return (
    <section className='knowledge-chunk mt-8 border-line border-t pt-8' id={chunk.slug}>
      <div className='flex flex-wrap items-center gap-2'>
        <h3 className='h3'>{chunk.title}</h3>
        <span className='badge badge-light font-mono text-xs uppercase'>
          {chunkTypeLabel(chunk.chunkType)}
        </span>
        {chunk.artifactFilename ? (
          <span className='badge badge-light font-mono text-xs'>{chunk.artifactFilename}</span>
        ) : null}
      </div>

      {chunk.chunkType === 'config' ? (
        <pre className='knowledge-config mt-3 overflow-x-auto rounded-lg bg-surface-2 p-4 text-xs leading-relaxed'>
          <code>{chunk.body}</code>
        </pre>
      ) : (
        <p className='mt-3 whitespace-pre-wrap text-sm leading-relaxed'>{chunk.body}</p>
      )}

      {chunk.chunkType === 'incident' ? (
        <dl className='mt-4 space-y-3 text-sm'>
          {chunk.cause.length > 0 ? (
            <div>
              <dt className='label-mono'>{m.knowledge_cause()}</dt>
              <dd>
                <ul className='mt-1 list-disc space-y-1 ps-5'>
                  {chunk.cause.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ) : null}
          {chunk.fix.length > 0 ? (
            <div>
              <dt className='label-mono'>{m.knowledge_fix()}</dt>
              <dd>
                <ul className='mt-1 list-disc space-y-1 ps-5'>
                  {chunk.fix.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ) : null}
          {chunk.verify.length > 0 ? (
            <div>
              <dt className='label-mono'>{m.knowledge_verify()}</dt>
              <dd>
                <ul className='mt-1 list-disc space-y-1 ps-5 font-mono text-xs'>
                  {chunk.verify.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ) : null}
        </dl>
      ) : null}

      {chunk.chunkType === 'checklist' && chunk.checklistItems.length > 0 ? (
        <ul className='mt-4 list-none space-y-2'>
          {chunk.checklistItems.map(item => (
            <li className='flex gap-2 text-sm' key={item}>
              <span aria-hidden className='text-primary-700'>
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
