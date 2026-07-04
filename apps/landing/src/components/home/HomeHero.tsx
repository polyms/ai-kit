import { Button } from '@polyms/core-ui'
import { ChatRoundDots, Code2, MagicStick3, Rocket2 } from '@solar-icons/react-perf/BoldDuotone'
import { useT } from '../../lib/i18n'
import { BRAND_ACCENT, HOME_PLAYFUL } from './brand'

type SolarIcon = typeof Rocket2

function FloatingIcon({
  icon: Icon,
  top,
  right,
  bottom,
  size = 30,
  rotate = 0,
}: {
  icon: SolarIcon
  top?: number
  right?: number
  bottom?: number
  size?: number
  rotate?: number
}) {
  if (!HOME_PLAYFUL) return null
  const box = size * 1.9
  return (
    <div
      className='demo-floating-icon absolute flex items-center justify-center border border-line bg-body'
      style={{
        top,
        right,
        bottom,
        width: box,
        height: box,
        transform: `rotate(${rotate}deg)`,
      }}
      aria-hidden
    >
      <Icon size={size} color={BRAND_ACCENT} aria-hidden />
    </div>
  )
}

export function HomeHero() {
  const t = useT()

  return (
    <section className='demo-hero demo-shell relative overflow-hidden bg-no-repeat'>
      <div className='demo-hero__glow pointer-events-none absolute rounded-full opacity-70' aria-hidden />
      <FloatingIcon icon={Rocket2} top={70} right={140} rotate={-8} />
      <FloatingIcon icon={MagicStick3} top={260} right={60} size={26} rotate={6} />
      <FloatingIcon icon={Code2} top={180} right={280} size={24} rotate={10} />
      <FloatingIcon icon={ChatRoundDots} bottom={40} right={220} size={22} rotate={-6} />

      <div className='demo-hero__content relative z-10'>
        <span className='badge badge-primary demo-hero__badge inline-flex font-mono'>{t('hero.badge')}</span>
        <h1 className='demo-hero__title font-bold font-sans text-fg tracking-tight'>
          {t('hero.line1')}
          <br />
          <span className='demo-hero__accent'>{t('hero.line2')}</span>
        </h1>
        <p className='my-9 max-w-lg font-semibold text-fg text-lg'>{t('hero.sub')}</p>
        <div className='flex flex-wrap items-center gap-3.5'>
          <Button variant='primary' size='xl' rounded render={<a href='#start' />} className='font-bold'>
            <Rocket2 size={20} color='#ffffff' aria-hidden />
            {t('hero.ctaPrimary')}
          </Button>
          <Button
            variant='light'
            size='xl'
            outlined
            rounded
            className='font-bold'
            render={
              <a href='https://github.com/polyms/ai-kit#readme' target='_blank' rel='noopener noreferrer' />
            }
          >
            {t('hero.ctaSecondary')}
          </Button>
        </div>
      </div>
    </section>
  )
}
