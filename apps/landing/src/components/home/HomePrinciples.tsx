import { m } from '../../paraglide/messages.js'
import { HOME_PLAYFUL } from './brand'
import { HomeSectionChip } from './HomeSectionChip'

const PRINCIPLE_KEYS = ['1', '2', '3', '4', '5'] as const

const PRINCIPLE_TITLES = {
  '1': m.principles_1_title,
  '2': m.principles_2_title,
  '3': m.principles_3_title,
  '4': m.principles_4_title,
  '5': m.principles_5_title,
} as const

const PRINCIPLE_BODIES = {
  '1': m.principles_1_body,
  '2': m.principles_2_body,
  '3': m.principles_3_body,
  '4': m.principles_4_body,
  '5': m.principles_5_body,
} as const

export function HomePrinciples() {
  return (
    <section className='app-home-section app-shell mx-auto max-w-[900px]'>
      <HomeSectionChip label='principles' n='01' />
      <h2 className='app-principles__title m-0 mb-12 font-bold font-sans text-fg'>
        {m.principles_titlePrefix()} <span className='app-hero__accent'>{m.principles_titleAccent()}</span>
      </h2>

      <div className='flex flex-col'>
        {PRINCIPLE_KEYS.map((n, i) => {
          const featured = i === 0
          const playfulRotate =
            HOME_PLAYFUL && i % 2 === 0 ? '-rotate-[3deg]' : HOME_PLAYFUL ? 'rotate-[3deg]' : ''
          return (
            <div className='flex gap-6' key={n}>
              <div className='flex w-[52px] shrink-0 flex-col items-center'>
                <span
                  className={`flex size-[52px] shrink-0 items-center justify-center rounded-full font-bold font-mono text-base ${featured ? 'app-principles__num--featured' : 'app-principles__num'} ${playfulRotate}`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                {i < PRINCIPLE_KEYS.length - 1 ? (
                  <span aria-hidden className='my-1.5 min-h-10 w-0.5 flex-1 bg-line' />
                ) : null}
              </div>
              <div className={i < PRINCIPLE_KEYS.length - 1 ? 'pb-10' : undefined}>
                <div className='mt-2.5 mb-2 font-bold font-sans text-[21px] text-fg'>
                  {PRINCIPLE_TITLES[n]()}
                </div>
                <div className='max-w-[560px] text-[15.5px] text-muted leading-relaxed'>
                  {PRINCIPLE_BODIES[n]()}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
