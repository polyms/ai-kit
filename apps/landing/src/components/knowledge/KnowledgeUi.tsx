import { Field } from '@polyms/core-ui'
import { Link as RouterLink } from '@tanstack/react-router'
import type { KnowledgeChunk, KnowledgeSearchResultItem } from '../../lib/knowledge/knowledge.types'
import { m } from '../../paraglide/messages.js'

type KnowledgeSearchProps = {
  query: string
  onQueryChange: (q: string) => void
}

export function KnowledgeSearch({ query, onQueryChange }: KnowledgeSearchProps) {
  return (
    <Field className='w-full' name='knowledge-search'>
      <Field.Label className='sr-only'>{m.knowledge_searchLabel()}</Field.Label>
      <Field.Control
        aria-label={m.knowledge_searchLabel()}
        className='font-mono text-sm'
        debounce={300}
        onChange={e => onQueryChange(e.target.value)}
        placeholder={m.knowledge_searchPlaceholder()}
        type='search'
        value={query}
      />
    </Field>
  )
}

type KnowledgeResultsTableProps = {
  results: KnowledgeSearchResultItem[]
  empty: boolean
}

export function KnowledgeResultsTable({ results, empty }: KnowledgeResultsTableProps) {
  if (empty) {
    return <p className='text-muted'>{m.knowledge_empty()}</p>
  }

  return (
    <div className='overflow-x-auto'>
      <table className='table-hover table-bordered table w-full'>
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
                <td className='font-mono text-xs uppercase'>
                  {row.type === 'article' ? row.intent : row.chunkType}
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
    <nav aria-label='Breadcrumb' className='mb-4 text-muted text-sm'>
      <ol className='flex flex-wrap items-center gap-1'>
        {items.map((item, index) => (
          <li className='flex items-center gap-1' key={item.label}>
            {index > 0 ? <span aria-hidden>/</span> : null}
            {item.href ? (
              <RouterLink className='link' to={item.href}>
                {item.label}
              </RouterLink>
            ) : (
              <span className='text-fg'>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

type KnowledgeChunkBlockProps = {
  chunk: KnowledgeChunk
}

export function KnowledgeChunkBlock({ chunk }: KnowledgeChunkBlockProps) {
  return (
    <section className='knowledge-chunk mt-8' id={chunk.slug}>
      <div className='flex flex-wrap items-center gap-2'>
        <h3 className='h3'>{chunk.title}</h3>
        <span className='badge badge-light font-mono text-xs uppercase'>{chunk.chunkType}</span>
        {chunk.artifactFilename ? (
          <span className='badge badge-light font-mono text-xs'>{chunk.artifactFilename}</span>
        ) : null}
      </div>

      {chunk.chunkType === 'config' ? (
        <pre className='knowledge-config mt-3 overflow-x-auto rounded-md bg-surface-2 p-4 text-xs leading-relaxed'>
          <code>{chunk.body}</code>
        </pre>
      ) : (
        <p className='mt-3 whitespace-pre-wrap text-sm leading-relaxed'>{chunk.body}</p>
      )}

      {chunk.chunkType === 'incident' ? (
        <dl className='mt-4 space-y-3 text-sm'>
          {chunk.cause.length > 0 ? (
            <div>
              <dt className='font-medium text-muted'>{m.knowledge_cause()}</dt>
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
              <dt className='font-medium text-muted'>{m.knowledge_fix()}</dt>
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
              <dt className='font-medium text-muted'>{m.knowledge_verify()}</dt>
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
