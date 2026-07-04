import { Button, NavigationMenu } from '@polyms/core-ui'
import { useRouterState } from '@tanstack/react-router'
import { GITHUB_REPO } from '../../content/overlay'
import { useT } from '../../lib/i18n'
import { HOME_PLAYFUL } from './brand'
import { useDemoNavActive, type DemoNavId } from './useDemoNavActive'
import { Code2 } from '@solar-icons/react-perf/BoldDuotone'

const NAV: { id: DemoNavId | 'runbooks'; href: string; external?: boolean }[] = [
  { id: 'overview', href: '/#main' },
  { id: 'catalog', href: '/#catalog' },
  { id: 'runbooks', href: '/runbooks' },
  { id: 'start', href: '/#start' },
]

export function HomeHeader() {
  const t = useT()
  const isActive = useDemoNavActive()
  const pathname = useRouterState({ select: s => s.location.pathname })

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
                active={
                  item.id === 'runbooks' ? pathname.startsWith('/runbooks') : isActive(item.id as DemoNavId)
                }
              >
                {item.id === 'runbooks' ? t('nav.runbooks') : t(`nav.${item.id}` as 'nav.overview')}
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          ))}
        </NavigationMenu.List>
        <NavigationMenu.Viewport />
      </NavigationMenu>

      <div className='flex gap-2'>
        <Button
          variant='primary'
          rounded
          size='lg'
          render={<a href={GITHUB_REPO} target='_blank' rel='noopener noreferrer' />}
        >
          <Code2 className='size-4' />
          {t('nav.github')}
        </Button>
      </div>
    </header>
  )
}
