import { Modal, Toast } from '@polyms/core-ui'
import { createRootRoute, HeadContent, Outlet, Scripts, useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'
import { CommandPalette } from '../components/CommandPalette'
import { HomeFooter, HomeHeader } from '../components/home'
import { m } from '../paraglide/messages.js'
import type { Locale } from '../stores/useAppStore'
import { useAppStore } from '../stores/useAppStore'
import globalsCss from '../styles/globals.css?url'

const origin = `${__ORIGIN_POLYMS__}/favicon`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        name: 'description',
        content: 'Polyms agent skills — align, spec, ship. Agent skills for real engineering.',
      },
      { title: 'ai-kit — Polyms' },
      { name: 'theme-color', content: __THEME_COLOR__ },
      { name: 'version', content: __VERSION__ },
    ],
    links: [
      { rel: 'stylesheet', href: globalsCss },
      { rel: 'icon', href: `${origin}/favicon.svg`, type: 'image/svg+xml' },
      { rel: 'icon', href: `${origin}/favicon-32x32.png`, sizes: '32x32', type: 'image/png' },
      { rel: 'apple-touch-icon', href: `${origin}/favicon-180x180.png`, sizes: '180x180' },
      { rel: 'manifest', href: '/site.webmanifest' },
    ],
  }),
  component: RootLayout,
})

function RootLayout() {
  const hydrate = useAppStore(s => s.hydrate)
  const locale = useAppStore(s => s.locale)
  const togglePalette = useAppStore(s => s.togglePalette)
  const setPaletteOpen = useAppStore(s => s.setPaletteOpen)
  const pathname = useRouterState({ select: s => s.location.pathname })
  const hideCommandPalette = pathname.startsWith('/runbooks')
  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (hideCommandPalette) return
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        togglePalette()
      }
      if (e.key === 'Escape') setPaletteOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [togglePalette, setPaletteOpen, hideCommandPalette])

  return (
    <html lang={locale satisfies Locale} suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `;(() => {
            var t = localStorage.getItem('ai-kit-theme')
            var dark = t ? t === 'dark' : false
            if (dark) document.documentElement.classList.add('dark')
          })()`,
          }}
        />
      </head>
      <body>
        <Toast>
          <div className='demo-shell min-h-dvh'>
            <a
              className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2'
              href='#main'
            >
              {m.nav_skip()}
            </a>
            <HomeHeader />
            <main id='main'>
              <Outlet />
            </main>
            <HomeFooter />
          </div>
          {!hideCommandPalette ? <CommandPalette /> : null}
          <Modal.Container />
          <Toast.Container />
        </Toast>
        <Scripts />
      </body>
    </html>
  )
}
