import { Modal, Toast } from '@polyms/core-ui'
import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { getLocale } from '~/paraglide/runtime'
import { CommandPalette } from '../components/CommandPalette'
import { GlobalActionFlyout } from '../components/GlobalActionFlyout'
import homeCss from '../components/home/home.css?url'
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
        content: 'ai-kit — bộ skill agent của Polyms cho kỹ thuật thật tế: align, viết spec, rồi ship.',
      },
      { title: 'ai-kit — Polyms' },
      { name: 'theme-color', content: __THEME_COLOR__ },
      { name: 'version', content: __VERSION__ },
    ],
    links: [
      { rel: 'stylesheet', href: globalsCss },
      { rel: 'stylesheet', href: homeCss },
      { rel: 'icon', href: `${origin}/favicon.svg`, type: 'image/svg+xml' },
      { rel: 'icon', href: `${origin}/favicon-32x32.png`, sizes: '32x32', type: 'image/png' },
      { rel: 'apple-touch-icon', href: `${origin}/favicon-180x180.png`, sizes: '180x180' },
      { rel: 'manifest', href: '/manifest.json' },
    ],
  }),
  component: RootLayout,
})

function RootLayout() {
  const locale = useAppStore(s => s.locale)
  const theme = useAppStore(s => s.theme)
  const hydrated = useAppStore(s => s.hydrated)

  return (
    <html className={theme === 'dark' ? 'dark' : ''} key={locale} lang={getLocale() satisfies Locale}>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `;(() => {
            var t = JSON.parse(localStorage.getItem('ai-kit:app-store') || '{"state":{}}').state
            if (t && t.theme === 'dark') document.documentElement.classList.add('dark')
          })()`,
          }}
        />
      </head>
      <body>
        <Toast>
          <Outlet />
          <CommandPalette />
          {hydrated ? (
            <>
              <GlobalActionFlyout />
              <Modal.Container />
              <Toast.Container />
            </>
          ) : null}
        </Toast>
        <Scripts />
      </body>
    </html>
  )
}
