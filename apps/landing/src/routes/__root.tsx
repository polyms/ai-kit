import { useEffect } from 'react'
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { Modal, Toast } from '@polyms/core-ui'
import { HomeFooter, HomeHeader } from '../components/home'
import { CommandPalette } from '../components/CommandPalette'
import { useAppStore } from '../stores/useAppStore'
import { useT } from '../lib/i18n'
import globalsCss from '../styles/globals.css?url'

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
    ],
    links: [
      { rel: 'stylesheet', href: globalsCss },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'icon', href: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { rel: 'icon', href: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { rel: 'apple-touch-icon', href: '/favicon-180x180.png', sizes: '180x180' },
      { rel: 'manifest', href: '/site.webmanifest' },
    ],
  }),
  component: RootLayout,
})

function RootLayout() {
  const hydrate = useAppStore(s => s.hydrate)
  const togglePalette = useAppStore(s => s.togglePalette)
  const setPaletteOpen = useAppStore(s => s.setPaletteOpen)
  const t = useT()

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        togglePalette()
      }
      if (e.key === 'Escape') setPaletteOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [togglePalette, setPaletteOpen])

  return (
    <html lang='en' suppressHydrationWarning>
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
              href='#main'
              className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-surface focus:px-3 focus:py-2'
            >
              {t('nav.skip')}
            </a>
            <HomeHeader />
            <main id='main'>
              <Outlet />
            </main>
            <HomeFooter />
          </div>
          <CommandPalette />
          <Modal.Container />
          <Toast.Container />
        </Toast>
        <Scripts />
      </body>
    </html>
  )
}
