import { createFileRoute, Link as RouterLink } from '@tanstack/react-router'
import { HomeSiteChrome } from '../../components/home/HomeSiteChrome'
import { AxisTagRow, RunbookBreadcrumb } from '../../components/runbooks'
import { useT } from '../../lib/i18n'
import { getRunbook } from '../../lib/runbooks/runbook-service'
import { defaultRunbooksSearch } from '../../lib/runbooks-search'

export const Route = createFileRoute('/runbooks/$id')({
  loader: ({ params: { id } }) => {
    const runbook = getRunbook(id)
    if (!runbook) {
      throw new Error('NOT_FOUND')
    }
    return { runbook }
  },
  component: RunbookDetailPage,
  errorComponent: RunbookNotFound,
})

function RunbookNotFound() {
  const t = useT()
  return (
    <div className='page-x section-y mx-auto max-w-4xl'>
      <p className='text-muted'>{t('runbooks.notFound')}</p>
      <RouterLink
        to='/runbooks'
        search={defaultRunbooksSearch}
        className='link link-primary mt-4 inline-block'
      >
        {t('runbooks.backToIndex')}
      </RouterLink>
    </div>
  )
}

function RunbookDetailPage() {
  const { runbook } = Route.useLoaderData()
  const t = useT()

  return (
    <>
      <div className='runbook-page page-x section-y mx-auto max-w-4xl'>
        <RunbookBreadcrumb
          items={[{ label: t('runbooks.title'), href: '/runbooks' }, { label: runbook.id }]}
        />

        <p className='label-mono'>{runbook.id}</p>
        <h1 className='h1 mt-2'>
          {runbook.id}: {runbook.title}
        </h1>
        <p className='mt-2 text-muted'>
          {t('runbooks.audience')}: {runbook.audience}
        </p>
        <div className='mt-4'>
          <AxisTagRow tags={runbook.axisTags} />
        </div>

        <section id='symptom-index' className='runbook-section mt-12'>
          <h2 className='h2'>{t('runbooks.symptomIndex')}</h2>
          <div className='mt-4 overflow-x-auto'>
            <table className='table-hover table-bordered table w-full'>
              <thead className='thead-light'>
                <tr>
                  <th scope='col'>{t('runbooks.col.symptom')}</th>
                  <th scope='col'>{t('runbooks.col.issueId')}</th>
                </tr>
              </thead>
              <tbody>
                {runbook.knownIssues.map(issue => (
                  <tr key={issue.id}>
                    <td>{issue.symptom}</td>
                    <td className='font-mono text-sm'>
                      <RouterLink
                        to='/runbooks/issues/$issueId'
                        params={{ issueId: issue.id }}
                        className='link link-primary'
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

        <section id='stack-profile' className='runbook-section mt-12'>
          <h2 className='h2'>{t('runbooks.stackProfile')}</h2>
          <div className='runbook-markdown mt-4 whitespace-pre-wrap font-mono text-sm leading-relaxed'>
            {runbook.stackProfileMarkdown}
          </div>
        </section>

        <section id='greenfield' className='runbook-section mt-12'>
          <h2 className='h2'>{t('runbooks.greenfield')}</h2>
          <ul className='mt-4 list-none space-y-2'>
            {runbook.greenfieldChecklist.map(item => (
              <li key={item} className='flex gap-2 text-sm'>
                <span aria-hidden className='text-primary-700'>
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id='known-issues' className='runbook-section mt-12'>
          <h2 className='h2'>{t('runbooks.knownIssues')}</h2>
          <ul className='mt-4 space-y-2'>
            {runbook.knownIssues.map(issue => (
              <li key={issue.id}>
                <RouterLink
                  to='/runbooks/issues/$issueId'
                  params={{ issueId: issue.id }}
                  className='link link-primary font-mono text-sm'
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
