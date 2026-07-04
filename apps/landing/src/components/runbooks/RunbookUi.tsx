import { Field } from '@polyms/core-ui'
import { Link as RouterLink } from '@tanstack/react-router'
import type { SearchResultItem } from '../../lib/runbooks/types'
import { useT } from '../../lib/i18n'
import { defaultRunbooksSearch } from '../../lib/runbooks-search'

type RunbookSearchProps = {
  query: string
  onQueryChange: (q: string) => void
}

export function RunbookSearch({ query, onQueryChange }: RunbookSearchProps) {
  const t = useT()

  return (
    <Field name='runbook-search' className='w-full'>
      <Field.Label className='sr-only'>{t('runbooks.searchLabel')}</Field.Label>
      <Field.Control
        type='search'
        value={query}
        debounce={300}
        placeholder={t('runbooks.searchPlaceholder')}
        className='font-mono text-sm'
        aria-label={t('runbooks.searchLabel')}
        onChange={e => onQueryChange(e.target.value)}
      />
    </Field>
  )
}

type RunbookResultsTableProps = {
  results: SearchResultItem[]
  empty: boolean
}

export function RunbookResultsTable({ results, empty }: RunbookResultsTableProps) {
  const t = useT()

  if (empty) {
    return <p className='text-muted'>{t('runbooks.empty')}</p>
  }

  return (
    <div className='overflow-x-auto'>
      <table className='table-hover table-bordered table w-full'>
        <caption className='sr-only'>{t('runbooks.resultsCaption')}</caption>
        <thead className='thead-light'>
          <tr>
            <th scope='col'>{t('runbooks.col.type')}</th>
            <th scope='col'>{t('runbooks.col.id')}</th>
            <th scope='col'>{t('runbooks.col.match')}</th>
            <th scope='col'>{t('runbooks.col.tags')}</th>
          </tr>
        </thead>
        <tbody>
          {results.map(row => {
            const href = row.type === 'issue' ? `/runbooks/issues/${row.id}` : `/runbooks/${row.id}`
            return (
              <tr key={`${row.type}-${row.id}`} className='cursor-pointer'>
                <td className='font-mono text-xs uppercase'>{row.type}</td>
                <td className='font-mono text-sm'>
                  <RouterLink to={href} className='link link-primary font-medium'>
                    {row.id}
                  </RouterLink>
                </td>
                <td>
                  <RouterLink to={href} className='link stretched-link no-underline'>
                    {row.type === 'issue' ? row.title : row.title}
                    <span className='mt-0.5 block text-muted text-sm'>{row.match}</span>
                  </RouterLink>
                </td>
                <td>
                  <div className='flex flex-wrap gap-1'>
                    {row.axisTags.slice(0, 4).map(tag => (
                      <span key={tag} className='badge badge-light'>
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
        <span key={tag} className='badge badge-light'>
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
          <li key={item.label} className='flex items-center gap-1'>
            {index > 0 ? <span aria-hidden>/</span> : null}
            {item.href ? (
              <RouterLink
                to={item.href}
                search={item.href === '/runbooks' ? defaultRunbooksSearch : undefined}
                className='link'
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
