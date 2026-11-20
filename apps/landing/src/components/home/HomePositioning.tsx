import { m } from '../../paraglide/messages.js'
import { HomeSectionChip } from './HomeSectionChip'

const STEPS = [
  { number: '01', title: m.positioning_ask_title, body: m.positioning_ask_body },
  { number: '02', title: m.positioning_method_title, body: m.positioning_method_body },
  { number: '03', title: m.positioning_apply_title, body: m.positioning_apply_body },
] as const

/** The host selects and applies guidance; these are illustrative steps, not a server-side workflow. */
export function HomePositioning() {
  return (
    <section
      aria-labelledby='positioning-heading'
      className='app-home-section app-shell mx-auto max-w-[1080px]'
      id='positioning'
    >
      <HomeSectionChip label={m.positioning_label()} n='02' />
      <h2 className='app-pipeline__title m-0 mb-3 font-bold font-sans text-fg' id='positioning-heading'>
        {m.positioning_title()}
      </h2>
      <p className='mb-8 max-w-[760px] text-muted'>{m.positioning_intro()}</p>

      <div className='grid gap-3 md:grid-cols-3'>
        {STEPS.map(step => (
          <div className='rounded-[24px] border border-line bg-body p-6' key={step.number}>
            <div className='mb-4 font-mono text-[12px] font-bold text-primary-600'>{step.number}</div>
            <h3 className='m-0 mb-2 font-bold font-sans text-[18px] text-fg'>{step.title()}</h3>
            <p className='m-0 text-[14.5px] text-muted leading-relaxed'>{step.body()}</p>
          </div>
        ))}
      </div>

      <p className='mt-6 max-w-[920px] border-l-2 border-primary-500 pl-4 text-sm text-muted'>
        {m.positioning_note()}
      </p>
    </section>
  )
}
