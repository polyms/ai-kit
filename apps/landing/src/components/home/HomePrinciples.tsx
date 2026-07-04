import { HandShake, PenNewSquare, RefreshCircle, Target, Widget5 } from '@solar-icons/react-perf/BoldDuotone'
import { m } from '../../paraglide/messages.js'
import { BRAND_ACCENT, HOME_PLAYFUL } from './brand'

const CELLS = [1, 2, 3, 4, 5] as const
const ICONS = [Target, Widget5, RefreshCircle, PenNewSquare, HandShake] as const

const PRINCIPLE_TITLES = [
  m.principles_1_title,
  m.principles_2_title,
  m.principles_3_title,
  m.principles_4_title,
  m.principles_5_title,
] as const

const PRINCIPLE_BODIES = [
  m.principles_1_body,
  m.principles_2_body,
  m.principles_3_body,
  m.principles_4_body,
  m.principles_5_body,
] as const

export function HomePrinciples() {
  return (
    <section className='demo-shell mx-auto max-w-[1080px] px-10 pt-2.5 pb-24'>
      <div className='mb-8 flex items-baseline gap-3.5'>
        <h2 className='m-0 font-bold font-sans text-[34px] leading-[1.1] tracking-tight'>
          {m.principles_title()}
        </h2>
        <span aria-hidden className='h-px flex-1 bg-line' />
        <span className='font-mono text-muted text-xs'>{m.principles_kicker()}</span>
      </div>
      <div className='demo-principles-grid'>
        {CELLS.map((n, i) => {
          const Icon = ICONS[i]!
          const featured = i === 0
          const playfulRotate =
            HOME_PLAYFUL && i % 2 === 0 ? '-rotate-[0.4deg]' : HOME_PLAYFUL ? 'rotate-[0.4deg]' : ''
          return (
            <article
              className={`card p-[22px] transition-transform duration-300 ease-in-out ${featured ? 'demo-principle-card--featured' : ''} ${playfulRotate}`}
              key={n}
            >
              <div className='flex items-start justify-between'>
                <span
                  className={`demo-principle-card__icon flex size-11 items-center justify-center rounded-xl ${featured ? 'demo-principle-card__icon--featured' : ''}`}
                >
                  <Icon aria-hidden color={BRAND_ACCENT} size={24} />
                </span>
                <span className='font-bold font-mono text-[26px] text-line'>
                  {String(n).padStart(2, '0')}
                </span>
              </div>
              <h3 className='mt-4 mb-2 font-bold text-[17px]'>{PRINCIPLE_TITLES[i]()}</h3>
              <p className='m-0 text-muted text-sm leading-relaxed'>{PRINCIPLE_BODIES[i]()}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
