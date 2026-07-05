import { createFileRoute, Link as RouterLink } from '@tanstack/react-router'
import { SiblingLink } from '../../components/guides'
import { HomeSiteChrome } from '../../components/home/HomeSiteChrome'
import { AxisTagRow, RunbookBreadcrumb } from '../../components/runbooks'
import { defaultRunbooksSearch, getRunbookFn } from '../../lib/runbooks/runbook.fns'
import { m } from '../../paraglide/messages.js'

export const Route = createFileRoute('/runbooks/$id')({
  loader: async ({ params: { id } }) => {
    try {
      return { runbook: await getRunbookFn({ data: { id } }) }
    } catch {
      throw new Error('NOT_FOUND')
    }
  },
  component: RunbookDetailPage,
  errorComponent: RunbookNotFound,
})

function RunbookNotFound() {
  return (
    <div className='page-x section-y mx-auto max-w-4xl'>
      <p className='text-muted'>{m.runbooks_notFound()}</p>
      <RouterLink
        className='link link-primary mt-4 inline-block'
        search={defaultRunbooksSearch}
        to='/runbooks'
      >
        {m.runbooks_backToIndex()}
      </RouterLink>
    </div>
  )
}

function RunbookDetailPage() {
  const { runbook } = Route.useLoaderData()

  return (
    <>
      <div className='runbook-page page-x section-y mx-auto max-w-4xl'>
        <RunbookBreadcrumb
          items={[{ label: m.runbooks_title(), href: '/runbooks' }, { label: runbook.id }]}
        />

        <p className='label-mono'>{runbook.id}</p>
        <h1 className='h1 mt-2'>
          {runbook.id}: {runbook.title}
        </h1>
        <p className='mt-2 text-muted'>
          {m.runbooks_audience()}: {runbook.audience}
        </p>
        <div className='mt-4'>
          <AxisTagRow tags={runbook.axisTags} />
        </div>

        {runbook.relatedStackGuide ? (
          <SiblingLink
            id={runbook.relatedStackGuide.id}
            kind='guide'
            title={runbook.relatedStackGuide.title}
          />
        ) : null}

        <section className='runbook-section mt-12' id='symptom-index'>
          <h2 className='h2'>{m.runbooks_symptomIndex()}</h2>
          <div className='mt-4 overflow-x-auto'>
            <table className='table-hover table-bordered table w-full'>
              <thead className='thead-light'>
                <tr>
                  <th scope='col'>{m.runbooks_col_symptom()}</th>
                  <th scope='col'>{m.runbooks_col_issueId()}</th>
                </tr>
              </thead>
              <tbody>
                {runbook.knownIssues.map(issue => (
                  <tr key={issue.id}>
                    <td>{issue.symptom}</td>
                    <td className='font-mono text-sm'>
                      <RouterLink
                        className='link link-primary'
                        params={{ issueId: issue.id }}
                        to='/runbooks/issues/$issueId'
                      >
                        {issue.id}
                      </RouterLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className='runbook-section mt-12' id='stack-profile'>
          <h2 className='h2'>{m.runbooks_stackProfile()}</h2>
          <div className='runbook-markdown mt-4 whitespace-pre-wrap font-mono text-sm leading-relaxed'>
            {runbook.stackProfileMarkdown}
          </div>
        </section>

        <section className='runbook-section mt-12' id='greenfield'>
          <h2 className='h2'>{m.runbooks_greenfield()}</h2>
          <ul className='mt-4 list-none space-y-2'>
            {runbook.greenfieldChecklist.map(item => (
              <li className='flex gap-2 text-sm' key={item}>
                <span aria-hidden className='text-primary-700'>
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className='runbook-section mt-12' id='known-issues'>
          <h2 className='h2'>{m.runbooks_knownIssues()}</h2>
          <ul className='mt-4 space-y-2'>
            {runbook.knownIssues.map(issue => (
              <li key={issue.id}>
                <RouterLink
                  className='link link-primary font-mono text-sm'
                  params={{ issueId: issue.id }}
                  to='/runbooks/issues/$issueId'
                >
                  {issue.id}
                </RouterLink>
                <span className='ms-2 text-muted'>{issue.title}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <HomeSiteChrome />
    </>
  )
}
