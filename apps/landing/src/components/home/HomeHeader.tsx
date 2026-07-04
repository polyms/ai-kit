import { Button, NavigationMenu } from '@polyms/core-ui'
import { GITHUB_REPO } from '../../content/overlay'
import { useT } from '../../lib/i18n'
import { HOME_PLAYFUL } from './brand'
import { useDemoNavActive, type DemoNavId } from './useDemoNavActive'
import { Code2 } from '@solar-icons/react-perf/BoldDuotone'

const NAV: { id: DemoNavId; href: string }[] = [
  { id: 'overview', href: '/#main' },
  { id: 'catalog', href: '/#catalog' },
  { id: 'start', href: '/#start' },
  { id: 'pipeline', href: '/#catalog' },
]

export function HomeHeader() {
  const t = useT()
  const isActive = useDemoNavActive()

  return (
    <header className='demo-header sticky top-0 z-20 flex items-center justify-between border-line border-b px-10 py-4 backdrop-blur-[10px]'>
      <div className='flex items-center gap-2.5'>
        <img src='/favicon.svg' alt='' className='size-7' />
        <span className='font-bold font-sans text-[19px]'>Polyms</span>
        <span
          className={`demo-header__brand-pill rounded-full border border-info border-dashed px-2.5 py-0.5 font-bold font-mono text-xs ${HOME_PLAYFUL ? 'demo-header__brand-pill--playful' : ''}`}
        >
          ai-kit
        </span>
      </div>

      <NavigationMenu className='rounded-full border border-line p-1' aria-label={t('nav.skip')}>
        <NavigationMenu.List variant='bare'>
          {NAV.map(item => (
            <NavigationMenu.Item key={item.id}>
              <NavigationMenu.Link
                href={item.href}
                variant='trigger'
                className='font-bold'
                active={isActive(item.id)}
              >
                {t(`nav.${item.id}` as 'nav.overview')}
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          ))}
        </NavigationMenu.List>
        <NavigationMenu.Viewport />
      </NavigationMenu>

      <div className='flex gap-2'>
        <Button
          variant='primary'
          outlined
          rounded
          render={<a href={GITHUB_REPO} target='_blank' rel='noopener noreferrer' />}
        >
          {t('nav.docs')}
        </Button>
        <Button
          variant='primary'
          rounded
          render={<a href={GITHUB_REPO} target='_blank' rel='noopener noreferrer' />}
        >
          <Code2 className='size-4' />
          {t('nav.github')}
        </Button>
      </div>
    </header>
  )
}
