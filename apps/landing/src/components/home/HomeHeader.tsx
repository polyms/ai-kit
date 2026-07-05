import { Button, NavigationMenu } from '@polyms/core-ui'
import { Code2 } from '@solar-icons/react-perf/BoldDuotone'
import { Link, useRouterState } from '@tanstack/react-router'
import { GITHUB_REPO } from '../../content/overlay'
import { m } from '../../paraglide/messages.js'
import { PolymsWordmark } from '../PolymsWordmark'
import { HOME_PLAYFUL } from './brand'
import { type NavId, useNavActive } from './useNavActive'

const HOME_NAV: { id: NavId; href: string }[] = [
  { id: 'overview', href: '/#main' },
  { id: 'pipeline', href: '/#pipeline' },
  { id: 'catalog', href: '/#catalog' },
  { id: 'start', href: '/#start' },
]

const SITE_NAV: { id: NavId | 'knowledge'; href: string }[] = [
  ...HOME_NAV,
  { id: 'knowledge', href: '/knowledge' },
]

const NAV_LABELS: Record<(typeof SITE_NAV)[number]['id'], () => string> = {
  overview: m.nav_overview,
  catalog: m.nav_catalog,
  start: m.nav_start,
  pipeline: m.nav_pipeline,
  knowledge: m.nav_knowledge,
}

export function HomeHeader() {
  const isActive = useNavActive()
  const pathname = useRouterState({ select: s => s.location.pathname })
  const onHome = pathname === '/'
  const nav = onHome ? HOME_NAV : SITE_NAV

  return (
    <header className='app-header sticky top-0 z-20 flex items-center justify-between px-10 py-4'>
      <Link className='flex items-center gap-2.5 no-underline' to='/'>
        <PolymsWordmark
          iconClassName='h-7 w-7 text-slate-500'
          size='header'
          textClassName='font-sans text-[19px] text-fg'
        />
        <span
          className={`app-header__brand-pill rounded-full px-2.5 py-0.5 font-bold font-mono text-xs ${HOME_PLAYFUL ? 'app-header__brand-pill--playful' : ''}`}
        >
          ai-kit
        </span>
      </Link>

      <NavigationMenu aria-label={m.nav_skip()}>
        <NavigationMenu.List className='app-header__nav-list'>
          {nav.map(item => (
            <NavigationMenu.Item key={item.id}>
              <NavigationMenu.Link
                active={
                  item.id === 'knowledge' ? pathname.startsWith('/knowledge') : isActive(item.id as NavId)
                }
                className='font-bold'
                href={item.href}
                size='lg'
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
          variant='primary'
        >
          <Code2 className='size-4' />
          {m.nav_github()}
        </Button>
      </div>
    </header>
  )
}
