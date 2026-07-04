import { Button } from '@polyms/core-ui'
import { ChatRoundDots, Code2, MagicStick3, Rocket2 } from '@solar-icons/react-perf/BoldDuotone'
import { m } from '../../paraglide/messages.js'
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
      aria-hidden
      className='app-floating-icon absolute flex items-center justify-center border border-line bg-body'
      style={{
        top,
        right,
        bottom,
        width: box,
        height: box,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      <Icon aria-hidden color={BRAND_ACCENT} size={size} />
    </div>
  )
}

export function HomeHero() {
  return (
    <section className='app-hero app-shell relative overflow-hidden bg-no-repeat'>
      <div aria-hidden className='app-hero__glow pointer-events-none absolute rounded-full opacity-70' />
      <FloatingIcon icon={Rocket2} right={140} rotate={-8} top={70} />
      <FloatingIcon icon={MagicStick3} right={60} rotate={6} size={26} top={260} />
      <FloatingIcon icon={Code2} right={280} rotate={10} size={24} top={180} />
      <FloatingIcon bottom={40} icon={ChatRoundDots} right={220} rotate={-6} size={22} />

      <div className='app-hero__content relative z-10'>
        <span className='badge badge-primary app-hero__badge inline-flex font-mono'>{m.hero_badge()}</span>
        <h1 className='app-hero__title font-bold font-sans text-fg tracking-tight'>
          {m.hero_line1()}
          <br />
          <span className='app-hero__accent'>{m.hero_line2()}</span>
        </h1>
        <p className='my-9 max-w-lg font-semibold text-fg text-lg'>{m.hero_sub()}</p>
        <div className='flex flex-wrap items-center gap-3.5'>
          <Button className='font-bold' render={<a href='#start' />} rounded size='xl' variant='primary'>
            <Rocket2 aria-hidden color='#ffffff' size={20} />
            {m.hero_ctaPrimary()}
          </Button>
          <Button
            className='font-bold'
            outlined
            render={
              <a href='https://github.com/polyms/ai-kit#readme' rel='noopener noreferrer' target='_blank' />
            }
            rounded
            size='xl'
            variant='light'
          >
            {m.hero_ctaSecondary()}
          </Button>
        </div>
      </div>
    </section>
  )
}
