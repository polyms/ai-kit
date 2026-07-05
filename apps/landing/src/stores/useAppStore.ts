import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { trackEvent } from '../lib/umami'
import { getLocale, type Locale, setLocale as setParaglideLocale } from '../paraglide/runtime'

export type Theme = 'dark' | 'light'
export type { Locale }

export const APP_STORE_KEY = 'ai-kit:app-store'

function readStoredTheme(): Theme {
  if (import.meta.env.SSR) return 'light'

  const raw = localStorage.getItem(APP_STORE_KEY) || '{"state":{}}'
  const parsed = JSON.parse(raw) as { state?: { theme?: unknown } }
  const theme = parsed.state?.theme as Theme
  if (theme === 'dark') return theme

  return 'light'
}

type AppState = {
  theme: Theme
  locale: Locale
  paletteOpen: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setLocale: (locale: Locale) => Promise<void>
  setPaletteOpen: (open: boolean) => void
  togglePalette: () => void
  hydrated: boolean
}
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: readStoredTheme(),
      locale: getLocale(),
      paletteOpen: false,
      hydrated: false,
      setTheme: theme => {
        trackEvent('theme_toggle', { theme })
        set({ theme })
      },
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        get().setTheme(next)
      },
      setLocale: async locale => {
        await setParaglideLocale(locale, { reload: false })
        set({ locale })
      },
      setPaletteOpen: paletteOpen => set({ paletteOpen }),
      togglePalette: () => {
        const next = !get().paletteOpen
        if (next) trackEvent('command_palette_open', { source: 'shortcut' })
        set({ paletteOpen: next })
      },
    }),
    {
      name: APP_STORE_KEY,
      partialize: state => ({ theme: state.theme }),
      onRehydrateStorage: () => state => {
        if (state) {
          state.hydrated = true
        }
      },
    }
  )
)
