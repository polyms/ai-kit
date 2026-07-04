import en from '../content/locales/en.json'
import vi from '../content/locales/vi.json'
import { useAppStore, type Locale } from '../stores/useAppStore'

const messages = { vi, en } as const

export type MessageKey = keyof typeof vi

export function t(locale: Locale, key: MessageKey): string {
  return messages[locale][key] ?? key
}

export function useT() {
  const locale = useAppStore(s => s.locale)
  return (key: MessageKey) => t(locale, key)
}
