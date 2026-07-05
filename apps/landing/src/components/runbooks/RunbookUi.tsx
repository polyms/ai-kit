import { Field } from '@polyms/core-ui'
import { Link as RouterLink } from '@tanstack/react-router'
import { defaultRunbooksSearch } from '../../lib/runbooks/runbook.fns'
import type { SearchResultItem } from '../../lib/runbooks/runbook.types'
import { m } from '../../paraglide/messages.js'

type RunbookSearchProps = {
  query: string
  onQueryChange: (q: string) => void
}

export function RunbookSearch({ query, onQueryChange }: RunbookSearchProps) {
  return (
    <Field className='w-full' name='runbook-search'>
      <Field.Label className='sr-only'>{m.runbooks_searchLabel()}</Field.Label>
      <Field.Control
        aria-label={m.runbooks_searchLabel()}
        className='font-mono text-sm'
        debounce={300}
        onChange={e => onQueryChange(e.target.value)}
        placeholder={m.runbooks_searchPlaceholder()}
        type='search'
        value={query}
      />
    </Field>
  )
}

type RunbookResultsTableProps = {
  results: SearchResultItem[]
  empty: boolean
}

export function RunbookResultsTable({ results, empty }: RunbookResultsTableProps) {
  if (empty) {
    return <p className='text-muted'>{m.runbooks_empty()}</p>
  }

  return (
    <div className='overflow-x-auto'>
      <table className='table-hover table-bordered table w-full'>
        <caption className='sr-only'>{m.runbooks_resultsCaption()}</caption>
        <thead className='thead-light'>
          <tr>
            <th scope='col'>{m.runbooks_col_type()}</th>
            <th scope='col'>{m.runbooks_col_id()}</th>
            <th scope='col'>{m.runbooks_col_match()}</th>
            <th scope='col'>{m.runbooks_col_tags()}</th>
          </tr>
        </thead>
        <tbody>
          {results.map(row => {
            const href = row.type === 'issue' ? `/runbooks/issues/${row.id}` : `/runbooks/${row.id}`
            return (
              <tr className='cursor-pointer' key={`${row.type}-${row.id}`}>
                <td className='font-mono text-xs uppercase'>{row.type}</td>
                <td className='font-mono text-sm'>
                  <RouterLink className='link link-primary font-medium' to={href}>
                    {row.id}
                  </RouterLink>
                </td>
                <td>
                  <RouterLink className='link stretched-link no-underline' to={href}>
                    {row.type === 'issue' ? row.title : row.title}
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

type RunbookBreadcrumbProps = {
  items: Array<{ label: string; href?: string }>
}

export function RunbookBreadcrumb({ items }: RunbookBreadcrumbProps) {
  return (
    <nav aria-label='Breadcrumb' className='mb-4 text-muted text-sm'>
      <ol className='flex flex-wrap items-center gap-1'>
        {items.map((item, index) => (
          <li className='flex items-center gap-1' key={item.label}>
            {index > 0 ? <span aria-hidden>/</span> : null}
            {item.href ? (
              <RouterLink
                className='link'
                search={item.href === '/runbooks' ? defaultRunbooksSearch : undefined}
                to={item.href}
              >
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
