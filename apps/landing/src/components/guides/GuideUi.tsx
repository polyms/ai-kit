import { Field } from '@polyms/core-ui'
import { Link as RouterLink } from '@tanstack/react-router'
import { defaultGuidesSearch } from '../../lib/guides/guide.fns'
import type { SeamSection, StackGuideSearchResult } from '../../lib/guides/guide.types'
import { m } from '../../paraglide/messages.js'

type GuideSearchProps = {
  query: string
  onQueryChange: (q: string) => void
}

export function GuideSearch({ query, onQueryChange }: GuideSearchProps) {
  return (
    <Field className='w-full' name='guide-search'>
      <Field.Label className='sr-only'>{m.guides_searchLabel()}</Field.Label>
      <Field.Control
        aria-label={m.guides_searchLabel()}
        className='font-mono text-sm'
        debounce={300}
        onChange={e => onQueryChange(e.target.value)}
        placeholder={m.guides_searchPlaceholder()}
        type='search'
        value={query}
      />
    </Field>
  )
}

type GuideResultsTableProps = {
  results: StackGuideSearchResult[]
  empty: boolean
}

export function GuideResultsTable({ results, empty }: GuideResultsTableProps) {
  if (empty) {
    return <p className='text-muted'>{m.guides_empty()}</p>
  }

  return (
    <div className='overflow-x-auto'>
      <table className='table-hover table-bordered table w-full'>
        <caption className='sr-only'>{m.guides_resultsCaption()}</caption>
        <thead className='thead-light'>
          <tr>
            <th scope='col'>{m.guides_col_id()}</th>
            <th scope='col'>{m.guides_col_title()}</th>
            <th scope='col'>{m.guides_col_tags()}</th>
            <th scope='col'>{m.guides_col_match()}</th>
          </tr>
        </thead>
        <tbody>
          {results.map(row => (
            <tr className='cursor-pointer' key={row.id}>
              <td className='font-mono text-sm'>
                <RouterLink
                  className='link link-primary font-medium'
                  params={{ id: row.id }}
                  to='/guides/$id'
                >
                  {row.id}
                </RouterLink>
              </td>
              <td>
                <RouterLink
                  className='link stretched-link no-underline'
                  params={{ id: row.id }}
                  to='/guides/$id'
                >
                  {row.title}
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
              <td className='text-muted text-sm'>{row.match}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

type GuideBreadcrumbProps = {
  items: Array<{ label: string; href?: string }>
}

export function GuideBreadcrumb({ items }: GuideBreadcrumbProps) {
  return (
    <nav aria-label='Breadcrumb' className='mb-4 text-muted text-sm'>
      <ol className='flex flex-wrap items-center gap-1'>
        {items.map((item, index) => (
          <li className='flex items-center gap-1' key={item.label}>
            {index > 0 ? <span aria-hidden>/</span> : null}
            {item.href ? (
              <RouterLink
                className='link'
                search={item.href === '/guides' ? defaultGuidesSearch : undefined}
                to={item.href}
              >
                {item.label}
              </RouterLink>
            ) : (
              <span aria-current='page'>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

type GuideChecklistProps = {
  items: string[]
}

export function GuideChecklist({ items }: GuideChecklistProps) {
  return (
    <ul className='mt-4 list-none space-y-2'>
      {items.map(item => (
        <li className='flex gap-2 text-sm' key={item}>
          <span aria-hidden className='text-primary-700'>
            ✓
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function slugifyHeading(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

type SeamSectionBlockProps = {
  section: SeamSection
}

export function SeamSectionBlock({ section }: SeamSectionBlockProps) {
  const id = slugifyHeading(section.title)
  return (
    <section className='guide-section' id={id}>
      <h2 className='h2'>{section.title}</h2>
      <div className='seam-callout mt-4'>{section.body}</div>
    </section>
  )
}

type SiblingLinkProps = {
  kind: 'runbook' | 'guide'
  id: string
  title: string
}

export function SiblingLink({ kind, id, title }: SiblingLinkProps) {
  const href = kind === 'runbook' ? `/runbooks/${id}` : `/guides/${id}`
  const label = kind === 'runbook' ? m.guides_siblingRunbook() : m.runbooks_siblingGuide()

  return (
    <div className='sibling-link mt-6'>
      <span className='text-muted'>{label}</span>
      <RouterLink className='link link-primary font-mono text-sm' to={href}>
        {id} ↗
      </RouterLink>
      <span className='text-muted'>— {title}</span>
    </div>
  )
}

type GuideLocalNavProps = {
  sections: Array<{ id: string; label: string }>
}

export function GuideLocalNav({ sections }: GuideLocalNavProps) {
  if (sections.length === 0) return null

  return (
    <nav aria-label={m.guides_localNav()} className='docs-aside'>
      <ul className='space-y-1 text-sm'>
        {sections.map(section => (
          <li key={section.id}>
            <a className='link text-muted hover:text-fg' href={`#${section.id}`}>
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
