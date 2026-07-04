import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { trackEvent } from '../lib/umami'
import { getLocale, type Locale, setLocale as setParaglideLocale } from '../paraglide/runtime'

export type Theme = 'dark' | 'light'
export type { Locale }

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

function applyLocale(locale: Locale) {
  document.documentElement.lang = locale
}

function readStoredTheme(): Theme {
  const stored = localStorage.getItem('ai-kit-theme')
  if (stored === 'dark' || stored === 'light') return stored
  return 'light'
}

type AppState = {
  theme: Theme
  locale: Locale
  paletteOpen: boolean
  hydrated: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setLocale: (locale: Locale) => Promise<void>
  setPaletteOpen: (open: boolean) => void
  togglePalette: () => void
  hydrate: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      locale: 'vi',
      paletteOpen: false,
      hydrated: false,
      hydrate: () => {
        const theme = readStoredTheme()
        const locale = getLocale()
        applyTheme(theme)
        applyLocale(locale)
        set({ theme, locale, hydrated: true })
      },
      setTheme: theme => {
        applyTheme(theme)
        localStorage.setItem('ai-kit-theme', theme)
        trackEvent('theme_toggle', { theme })
        set({ theme })
      },
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        get().setTheme(next)
      },
      setLocale: async locale => {
        await setParaglideLocale(locale, { reload: false })
        applyLocale(locale)
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
      name: 'ai-kit-app-store',
      partialize: state => ({ theme: state.theme }),
      onRehydrateStorage: () => state => {
        const theme = readStoredTheme()
        const locale = getLocale()
        applyTheme(theme)
        applyLocale(locale)
        if (state) {
          state.theme = theme
          state.locale = locale
          state.hydrated = true
        }
      },
    }
  )
)
