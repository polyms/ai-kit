import { Button, Toast } from '@polyms/core-ui'
import { createFileRoute, Link as RouterLink } from '@tanstack/react-router'
import { HomeSiteChrome } from '../../../components/home/HomeSiteChrome'
import { AxisTagRow, RunbookBreadcrumb } from '../../../components/runbooks'
import { copyText } from '../../../lib/copy'
import { m } from '../../../paraglide/messages.js'
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
  return (
    <div className='page-x section-y mx-auto max-w-4xl'>
      <p className='text-muted'>{m.runbooks_issueNotFound()}</p>
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

function IssueDetailPage() {
  const { issue, runbook } = Route.useLoaderData()
  const toast = Toast.useToastManager()

  const copyVerify = async (text: string) => {
    const ok = await copyText(text)
    if (ok) toast.add({ title: m.runbooks_copied(), type: 'success' })
  }

  return (
    <>
      <div className='runbook-page page-x section-y mx-auto max-w-4xl'>
        <RunbookBreadcrumb
          items={[
            { label: m.runbooks_title(), href: '/runbooks' },
            { label: runbook.id, href: `/runbooks/${runbook.id}` },
            { label: issue.id },
          ]}
        />

        <p className='label-mono'>{issue.id}</p>
        <h1 className='h1 mt-2'>{issue.title}</h1>

        <div className='mt-4 flex flex-wrap gap-1.5'>
          {issue.triggerPhrases.map(phrase => (
            <span
              className='rounded-md border border-line bg-surface px-2 py-0.5 font-mono text-xs'
              key={phrase}
            >
              {phrase}
            </span>
          ))}
        </div>

        <article aria-labelledby='issue-symptom' className='issue-block mt-10'>
          <h2 className='h2' id='issue-symptom'>
            {m.runbooks_symptom()}
          </h2>
          <p className='mt-2'>{issue.symptom}</p>

          <h2 className='h2 mt-8'>{m.runbooks_cause()}</h2>
          <ul className='mt-2 list-disc space-y-1 ps-5'>
            {issue.cause.map(line => (
              <li key={line}>{line}</li>
            ))}
          </ul>

          <h2 className='h2 mt-8'>{m.runbooks_fix()}</h2>
          <ol className='mt-2 list-decimal space-y-1 ps-5'>
            {issue.fix.map(line => (
              <li key={line}>{line}</li>
            ))}
          </ol>

          <h2 className='h2 mt-8'>{m.runbooks_verify()}</h2>
          <div className='mt-2 space-y-3'>
            {issue.verify.map(line => (
              <div
                className='flex flex-wrap items-start justify-between gap-2 rounded-lg border border-line bg-surface p-3'
                key={line}
              >
                <pre className='whitespace-pre-wrap font-mono text-sm'>{line}</pre>
                <Button onClick={() => copyVerify(line)} outlined size='sm' type='button' variant='light'>
                  {m.runbooks_copy()}
                </Button>
              </div>
            ))}
          </div>
        </article>

        <section className='runbook-section mt-10'>
          <h2 className='h2'>{m.runbooks_relatedFiles()}</h2>
          <ul className='mt-2 font-mono text-sm'>
            {issue.relatedFiles.map(file => (
              <li key={file}>{file}</li>
            ))}
          </ul>
        </section>

        <section className='runbook-section mt-8'>
          <h2 className='h2'>{m.runbooks_axisTags()}</h2>
          <div className='mt-2'>
            <AxisTagRow tags={issue.axisTags} />
          </div>
        </section>

        <RouterLink
          className='link link-primary mt-10 inline-block'
          params={{ id: runbook.id }}
          to='/runbooks/$id'
        >
          ← {m.runbooks_backToRunbook()} {runbook.id}
        </RouterLink>
      </div>
      <HomeSiteChrome />
    </>
  )
}
