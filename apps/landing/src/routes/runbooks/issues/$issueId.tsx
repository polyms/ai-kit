import { createFileRoute, Link as RouterLink } from '@tanstack/react-router'
import { Button, Toast } from '@polyms/core-ui'
import { HomeSiteChrome } from '../../../components/home/HomeSiteChrome'
import { AxisTagRow, RunbookBreadcrumb } from '../../../components/runbooks'
import { copyText } from '../../../lib/copy'
import { useT } from '../../../lib/i18n'
import { getIssue } from '../../../lib/runbooks/runbook-service'
import { defaultRunbooksSearch } from '../../../lib/runbooks-search'

export const Route = createFileRoute('/runbooks/issues/$issueId')({
  loader: ({ params: { issueId } }) => {
    const found = getIssue(issueId)
    if (!found) {
      throw new Error('NOT_FOUND')
    }
    return found
  },
  component: IssueDetailPage,
  errorComponent: IssueNotFound,
})

function IssueNotFound() {
  const t = useT()
  return (
    <div className='page-x section-y mx-auto max-w-4xl'>
      <p className='text-muted'>{t('runbooks.issueNotFound')}</p>
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

function IssueDetailPage() {
  const { issue, runbook } = Route.useLoaderData()
  const t = useT()
  const toast = Toast.useToastManager()

  const copyVerify = async (text: string) => {
    const ok = await copyText(text)
    if (ok) toast.add({ title: t('runbooks.copied'), type: 'success' })
  }

  return (
    <>
      <div className='runbook-page page-x section-y mx-auto max-w-4xl'>
        <RunbookBreadcrumb
          items={[
            { label: t('runbooks.title'), href: '/runbooks' },
            { label: runbook.id, href: `/runbooks/${runbook.id}` },
            { label: issue.id },
          ]}
        />

        <p className='label-mono'>{issue.id}</p>
        <h1 className='h1 mt-2'>{issue.title}</h1>

        <div className='mt-4 flex flex-wrap gap-1.5'>
          {issue.triggerPhrases.map(phrase => (
            <span
              key={phrase}
              className='rounded-md border border-line bg-surface px-2 py-0.5 font-mono text-xs'
            >
              {phrase}
            </span>
          ))}
        </div>

        <article
          className='issue-block mt-10 border-primary-700 border-s-4 ps-4'
          aria-labelledby='issue-symptom'
        >
          <h2 id='issue-symptom' className='h2'>
            {t('runbooks.symptom')}
          </h2>
          <p className='mt-2'>{issue.symptom}</p>

          <h2 className='h2 mt-8'>{t('runbooks.cause')}</h2>
          <ul className='mt-2 list-disc space-y-1 ps-5'>
            {issue.cause.map(line => (
              <li key={line}>{line}</li>
            ))}
          </ul>

          <h2 className='h2 mt-8'>{t('runbooks.fix')}</h2>
          <ol className='mt-2 list-decimal space-y-1 ps-5'>
            {issue.fix.map(line => (
              <li key={line}>{line}</li>
            ))}
          </ol>

          <h2 className='h2 mt-8'>{t('runbooks.verify')}</h2>
          <div className='mt-2 space-y-3'>
            {issue.verify.map(line => (
              <div
                key={line}
                className='flex flex-wrap items-start justify-between gap-2 rounded-lg border border-line bg-surface p-3'
              >
                <pre className='whitespace-pre-wrap font-mono text-sm'>{line}</pre>
                <Button type='button' variant='light' outlined size='sm' onClick={() => copyVerify(line)}>
                  {t('runbooks.copy')}
                </Button>
              </div>
            ))}
          </div>
        </article>

        <section className='runbook-section mt-10'>
          <h2 className='h2'>{t('runbooks.relatedFiles')}</h2>
          <ul className='mt-2 font-mono text-sm'>
            {issue.relatedFiles.map(file => (
              <li key={file}>{file}</li>
            ))}
          </ul>
        </section>

        <section className='runbook-section mt-8'>
          <h2 className='h2'>{t('runbooks.axisTags')}</h2>
          <div className='mt-2'>
            <AxisTagRow tags={issue.axisTags} />
          </div>
        </section>

        <RouterLink
          to='/runbooks/$id'
          params={{ id: runbook.id }}
          className='link link-primary mt-10 inline-block'
        >
          ← {t('runbooks.backToRunbook')} {runbook.id}
        </RouterLink>
      </div>
      <HomeSiteChrome />
    </>
  )
}
