import { useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export type NavId = 'overview' | 'catalog' | 'start' | 'pipeline'

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
    if (id === 'overview') return !hash || hash === '#'
    if (id === 'start') return hash === '#start'
    if (id === 'catalog') return hash === '#catalog'
    if (id === 'pipeline') return hash === '#pipeline'
    return false
  }
}
