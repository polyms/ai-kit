import { Button } from '@polyms/ui-kit'
import { ChatRoundDots, Code2, MagicStick3, Rocket2 } from '@solar-icons/react-perf/BoldDuotone'
import { GITHUB_REPO } from '../../content/overlay'
import { m } from '../../paraglide/messages.js'
import { HOME_PLAYFUL } from './brand'

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
      <Icon aria-hidden className='text-primary-600' size={size} />
    </div>
  )
}

function AlignCard() {
  return (
    <div
      className={`relative w-full max-w-95 rounded-[20px] border border-line bg-body p-5 shadow-popout ${HOME_PLAYFUL ? 'rotate-[0.8deg]' : ''}`}
    >
      <div className='mb-3.5 flex items-center gap-2'>
        <span
          aria-hidden
          className='size-2 rounded-full bg-primary-600 shadow-[0_0_0_3px_var(--accent-glow)]'
        />
        <span className='font-mono text-[12.5px] text-muted'>polyms/ai-kit · main</span>
      </div>
      <div className='mb-3 font-bold font-mono text-[15px] text-primary-600'>/align checkout refactor</div>
      <div className='font-mono text-[12.5px] text-muted leading-[1.9]'>
        <div>→ {m.hero_alignCard_clarify()}</div>
        <div>
          → {m.hero_alignCard_wrote()} <span className='font-semibold text-fg'>docs/adr/0007.md</span>
        </div>
      </div>
    </div>
  )
}

export function HomeHero() {
  return (
    <section
      className='app-hero app-shell relative flex flex-col justify-start overflow-hidden'
      id='content'
      tabIndex={-1}
    >
      <div aria-hidden className='app-hero__decor pointer-events-none absolute inset-0 overflow-hidden'>
        <FloatingIcon icon={Rocket2} right={160} rotate={-8} top={64} />
        <FloatingIcon icon={Code2} right={48} rotate={10} size={24} top={150} />
        <FloatingIcon bottom={120} icon={MagicStick3} right={220} rotate={6} size={26} />
        <FloatingIcon bottom={64} icon={ChatRoundDots} right={48} rotate={-6} size={22} />
      </div>

      <div className='app-hero__content'>
        <div className='app-hero__layout'>
          <span
            className={`badge badge-primary app-hero__badge mb-8 inline-flex w-fit font-mono ${HOME_PLAYFUL ? 'app-hero__badge--playful' : ''}`}
          >
            {m.hero_badge()}
          </span>
          <h1 className='app-hero__title font-bold font-sans text-fg'>
            {m.hero_line1()}
            <br />
            <span className='app-hero__accent'>{m.hero_line2()}</span>
          </h1>

          <div className='app-hero__copy'>
            <p className='m-0 mb-10 text-[19px] text-muted leading-[1.65]'>{m.hero_sub()}</p>
            <div className='flex flex-wrap items-center gap-3.5'>
              <Button
                className='font-bold'
                render={<a href={GITHUB_REPO} rel='noopener noreferrer' target='_blank' />}
                rounded
                size='xl'
                variant='primary'
              >
                <Rocket2 aria-hidden color='#ffffff' size={20} />
                {m.hero_ctaPrimary()}
              </Button>
              <Button
                className='font-bold'
                outlined
                render={<a href='/skills' />}
                rounded
                size='xl'
                variant='light'
              >
                {m.hero_ctaSecondary()}
              </Button>
            </div>
          </div>

          <div className='app-hero__align-float'>
            <AlignCard />
          </div>
        </div>
      </div>
    </section>
  )
}
