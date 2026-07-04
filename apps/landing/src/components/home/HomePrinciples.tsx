import { HandShake, PenNewSquare, RefreshCircle, Target, Widget5 } from '@solar-icons/react-perf/BoldDuotone'
import { useT, type MessageKey } from '../../lib/i18n'
import { BRAND_ACCENT, HOME_PLAYFUL } from './brand'

const CELLS = [1, 2, 3, 4, 5] as const
const ICONS = [Target, Widget5, RefreshCircle, PenNewSquare, HandShake] as const

export function HomePrinciples() {
  const t = useT()

  return (
    <section className='demo-shell mx-auto max-w-[1080px] px-10 pt-2.5 pb-24'>
      <div className='mb-8 flex items-baseline gap-3.5'>
        <h2 className='m-0 font-bold font-sans text-[34px] leading-[1.1] tracking-tight'>
          {t('principles.title')}
        </h2>
        <span className='h-px flex-1 bg-line' aria-hidden />
        <span className='font-mono text-muted text-xs'>{t('principles.kicker')}</span>
      </div>
      <div className='demo-principles-grid'>
        {CELLS.map((n, i) => {
          const Icon = ICONS[i]!
          const featured = i === 0
          const playfulRotate =
            HOME_PLAYFUL && i % 2 === 0 ? '-rotate-[0.4deg]' : HOME_PLAYFUL ? 'rotate-[0.4deg]' : ''
          return (
            <article
              key={n}
              className={`card p-[22px] transition-transform duration-300 ease-in-out ${featured ? 'demo-principle-card--featured' : ''} ${playfulRotate}`}
            >
              <div className='flex items-start justify-between'>
                <span
                  className={`demo-principle-card__icon flex size-11 items-center justify-center rounded-xl ${featured ? 'demo-principle-card__icon--featured' : ''}`}
                >
                  <Icon size={24} color={BRAND_ACCENT} aria-hidden />
                </span>
                <span className='font-bold font-mono text-[26px] text-line'>
                  {String(n).padStart(2, '0')}
                </span>
              </div>
              <h3 className='mt-4 mb-2 font-bold text-[17px]'>{t(`principles.${n}.title` as MessageKey)}</h3>
              <p className='m-0 text-muted text-sm leading-relaxed'>
                {t(`principles.${n}.body` as MessageKey)}
              </p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
