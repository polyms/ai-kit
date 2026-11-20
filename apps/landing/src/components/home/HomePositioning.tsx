import { m } from '../../paraglide/messages.js'

const PARTS = [
  {
    number: '01',
    title: m.positioning_host_title,
    body: m.positioning_host_body,
  },
  {
    number: '02',
    title: m.positioning_kit_title,
    body: m.positioning_kit_body,
  },
  {
    number: '03',
    title: m.positioning_tools_title,
    body: m.positioning_tools_body,
  },
] as const

/** Product boundary: AI Kit augments host AI clients, never replaces their inference or execution. */
export function HomePositioning() {
  return (
    <section
      aria-labelledby='positioning-heading'
      className='app-home-section app-shell mx-auto max-w-[1080px]'
      id='positioning'
    >
      <span className='mb-4 inline-flex rounded-full border border-line px-4 py-1.5 font-bold font-mono text-[12.5px] text-primary-600'>
        {m.positioning_label()}
      </span>
      <h2 className='app-pipeline__title m-0 mb-3 font-bold font-sans text-fg' id='positioning-heading'>
        {m.positioning_title()}
      </h2>
      <p className='mb-8 max-w-[720px] text-muted'>{m.positioning_intro()}</p>
      <div className='grid gap-4 md:grid-cols-3'>
        {PARTS.map(part => (
          <div className='min-w-0 rounded-[24px] border border-line bg-body p-6' key={part.number}>
            <div className='mb-4 font-mono text-[12px] font-bold text-primary-600'>{part.number}</div>
            <h3 className='mb-2 font-bold text-[18px] text-fg'>{part.title()}</h3>
            <p className='m-0 text-[14.5px] leading-relaxed text-muted'>{part.body()}</p>
          </div>
        ))}
      </div>
      <p className='mt-6 max-w-[920px] border-l-2 border-primary-500 pl-4 text-sm text-muted'>
        {m.positioning_note()}
      </p>
    </section>
  )
}
