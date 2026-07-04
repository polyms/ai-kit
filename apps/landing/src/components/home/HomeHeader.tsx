import { Button, NavigationMenu } from '@polyms/core-ui'
import { Code2 } from '@solar-icons/react-perf/BoldDuotone'
import { useRouterState } from '@tanstack/react-router'
import { GITHUB_REPO } from '../../content/overlay'
import { m } from '../../paraglide/messages.js'
import { PolymsWordmark } from '../PolymsWordmark'
import { HOME_PLAYFUL } from './brand'
import { type DemoNavId, useDemoNavActive } from './useDemoNavActive'

const NAV: { id: DemoNavId | 'runbooks'; href: string; external?: boolean }[] = [
  { id: 'overview', href: '/#main' },
  { id: 'catalog', href: '/#catalog' },
  { id: 'runbooks', href: '/runbooks' },
  { id: 'start', href: '/#start' },
]

const NAV_LABELS: Record<(typeof NAV)[number]['id'], () => string> = {
  overview: m.nav_overview,
  catalog: m.nav_catalog,
  runbooks: m.nav_runbooks,
  start: m.nav_start,
}

export function HomeHeader() {
  const isActive = useDemoNavActive()
  const pathname = useRouterState({ select: s => s.location.pathname })

  return (
    <header className='app-header sticky top-0 z-20 flex items-center justify-between border-line border-b px-10 py-4 backdrop-blur-[10px]'>
      <div className='flex items-center gap-2.5'>
        <PolymsWordmark
          iconClassName='text-slate-500'
          size='header'
          textClassName='font-sans text-lg text-fg'
        />
        <span
          className={`app-header__brand-pill rounded-full border border-info border-dashed px-2.5 py-0.5 font-bold font-mono text-xs ${HOME_PLAYFUL ? 'app-header__brand-pill--playful' : ''}`}
        >
          ai-kit
        </span>
      </div>

      <NavigationMenu aria-label={m.nav_skip()} className='rounded-full border border-line p-1'>
        <NavigationMenu.List variant='bare'>
          {NAV.map(item => (
            <NavigationMenu.Item key={item.id}>
              <NavigationMenu.Link
                active={
                  item.id === 'runbooks' ? pathname.startsWith('/runbooks') : isActive(item.id as DemoNavId)
                }
                className='font-bold'
                href={item.href}
                variant='trigger'
              >
                {NAV_LABELS[item.id]()}
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          ))}
        </NavigationMenu.List>
        <NavigationMenu.Viewport />
      </NavigationMenu>

      <div className='flex gap-2'>
        <Button
          render={<a href={GITHUB_REPO} rel='noopener noreferrer' target='_blank' />}
          rounded
          size='lg'
          variant='info'
        >
          <Code2 className='size-4' />
          {m.nav_github()}
        </Button>
      </div>
    </header>
  )
}
