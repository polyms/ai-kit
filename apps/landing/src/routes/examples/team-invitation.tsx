import { createFileRoute } from '@tanstack/react-router'
import { HomeFooter, HomeHeader } from '../../components/home'
import { m } from '../../paraglide/messages.js'

/**
 * A fictional, draft-only example of artifacts a host AI could produce with AI Kit guidance.
 * This is not a captured run or an authorization to publish or create invitations.
 */
const REQUIREMENTS = [
  { id: 'BR-01', body: m.example_br01 },
  { id: 'AC-01', body: m.example_ac01 },
  { id: 'AC-02', body: m.example_ac02 },
  { id: 'AC-03', body: m.example_ac03 },
] as const

const IMPLEMENTATION_TASKS = [
  { id: 'TASK-01', body: m.example_task1 },
  { id: 'TASK-02', body: m.example_task2 },
  { id: 'TASK-03', body: m.example_task3 },
] as const

const QA_CASES = [
  { id: 'TC-01', body: m.example_tc01 },
  { id: 'TC-02', body: m.example_tc02 },
  { id: 'TC-03', body: m.example_tc03 },
] as const

function DraftRows({ rows }: { rows: readonly { id: string; body: () => string }[] }) {
  return (
    <div className='space-y-3'>
      {rows.map(row => (
        <div className='flex items-start gap-3 border-b border-line pb-3 last:border-0 last:pb-0' key={row.id}>
          <code className='w-[70px] shrink-0 font-mono text-[12px] font-bold text-primary-700'>{row.id}</code>
          <p className='m-0 text-[14px] text-fg leading-relaxed'>{row.body()}</p>
        </div>
      ))}
    </div>
  )
}

function TeamInvitationExample() {
  return (
    <main className='app-page min-h-dvh'>
      <HomeHeader />
      <article className='app-home-section app-shell mx-auto max-w-[1080px]' id='content'>
        <a className='mb-6 inline-flex font-semibold text-sm text-primary-700 hover:underline' href='/#use-cases'>
          ← {m.example_back()}
        </a>
        <div>
          <span className='badge badge-primary mb-4 inline-flex font-mono'>{m.example_badge()}</span>
          <h1 className='app-pipeline__title m-0 mb-4 font-bold font-sans text-fg'>{m.example_title()}</h1>
          <p className='mb-8 max-w-[800px] text-muted leading-relaxed'>{m.example_intro()}</p>
        </div>

        <div className='grid gap-5 lg:grid-cols-2'>
          <section className='rounded-[24px] border border-line bg-body p-6' aria-labelledby='example-reqs'>
            <h2 className='mb-5 font-bold text-[19px] text-fg' id='example-reqs'>{m.example_reqs_heading()}</h2>
            <DraftRows rows={REQUIREMENTS} />
            <p className='mt-5 mb-0 border-l-2 border-primary-500 pl-3 text-sm text-muted'>{m.example_scope()}</p>
          </section>

          <section className='rounded-[24px] border border-line bg-body p-6' aria-labelledby='example-tasks'>
            <h2 className='mb-5 font-bold text-[19px] text-fg' id='example-tasks'>{m.example_plan_heading()}</h2>
            <DraftRows rows={IMPLEMENTATION_TASKS} />
            <p className='mt-5 mb-0 border-l-2 border-primary-500 pl-3 text-sm text-muted'>{m.example_effort()}</p>
          </section>

          <section className='rounded-[24px] border border-line bg-body p-6 lg:col-span-2' aria-labelledby='example-qa'>
            <h2 className='mb-5 font-bold text-[19px] text-fg' id='example-qa'>{m.example_qa_heading()}</h2>
            <DraftRows rows={QA_CASES} />
          </section>
        </div>

        <p className='mt-6 max-w-[850px] text-sm text-muted'>{m.example_boundary()}</p>
        <a className='mt-5 inline-flex rounded-full border border-line px-5 py-2.5 font-semibold text-primary-700 no-underline hover:bg-surface' href='/#chat-start'>
          {m.example_setup()} →
        </a>
      </article>
      <HomeFooter />
    </main>
  )
}

export const Route = createFileRoute('/examples/team-invitation')({
  component: TeamInvitationExample,
})
