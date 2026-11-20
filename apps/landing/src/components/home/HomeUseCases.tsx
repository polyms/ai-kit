import { m } from '../../paraglide/messages.js'
import { HomeSectionChip } from './HomeSectionChip'

const USE_CASES = [
  {
    id: 'research',
    title: m.usecases_research_title,
    body: m.usecases_research_body,
    outcome: m.usecases_research_outcome,
  },
  {
    id: 'requirements',
    title: m.usecases_reqs_title,
    body: m.usecases_reqs_body,
    outcome: m.usecases_reqs_outcome,
  },
  {
    id: 'delivery',
    title: m.usecases_delivery_title,
    body: m.usecases_delivery_body,
    outcome: m.usecases_delivery_outcome,
  },
  {
    id: 'engineering',
    title: m.usecases_engineering_title,
    body: m.usecases_engineering_body,
    outcome: m.usecases_engineering_outcome,
  },
] as const

export function HomeUseCases() {
  return (
    <section
      aria-labelledby='usecases-heading'
      className='app-home-section app-shell mx-auto max-w-[1080px]'
      id='use-cases'
    >
      <HomeSectionChip label={m.chip_usecases()} n='01' />
      <h2 className='app-pipeline__title m-0 mb-3 font-bold font-sans text-fg' id='usecases-heading'>
        {m.usecases_title()}
      </h2>
      <p className='mb-8 max-w-[750px] text-muted'>{m.usecases_intro()}</p>

      <div className='grid gap-4 sm:grid-cols-2'>
        {USE_CASES.map(useCase => (
          <article className='rounded-[24px] border border-line bg-body p-6' key={useCase.id}>
            <h3 className='m-0 mb-2 font-bold font-sans text-[19px] text-fg'>{useCase.title()}</h3>
            <p className='m-0 mb-4 text-[14.5px] text-muted leading-relaxed'>{useCase.body()}</p>
            <p className='m-0 border-t border-line pt-3 text-[13px] text-primary-700'>
              {useCase.outcome()}
            </p>
          </article>
        ))}
      </div>
      <p className='mt-5 max-w-[760px] text-sm text-muted'>{m.usecases_note()}</p>
    </section>
  )
}
