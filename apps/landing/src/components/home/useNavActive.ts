import { useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export type NavId = 'overview' | 'catalog' | 'start' | 'pipeline' | 'intelligence'

export function useNavActive() {
  const pathname = useRouterState({ select: s => s.location.pathname })
  const [hash, setHash] = useState('')

  useEffect(() => {
    const sync = () => setHash(window.location.hash)
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  return (id: NavId): boolean => {
    if (pathname !== '/') return false
    if (id === 'overview') return !hash || hash === '#' || hash === '#use-cases'
    if (id === 'start') return hash === '#start' || hash === '#chat-start' || hash === '#dev-start'
    if (id === 'catalog') return hash === '#catalog'
    if (id === 'intelligence') return hash === '#intelligence'
    if (id === 'pipeline') return hash === '#pipeline'
    return false
  }
}
