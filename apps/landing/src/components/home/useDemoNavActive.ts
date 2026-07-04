import { useEffect, useState } from 'react'
import { useRouterState } from '@tanstack/react-router'

export type DemoNavId = 'overview' | 'catalog' | 'start' | 'pipeline'

export function useDemoNavActive() {
  const pathname = useRouterState({ select: s => s.location.pathname })
  const [hash, setHash] = useState('')

  useEffect(() => {
    const sync = () => setHash(window.location.hash)
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  return (id: DemoNavId): boolean => {
    if (pathname !== '/') return false
    if (id === 'overview') return !hash || hash === '#'
    if (id === 'start') return hash === '#start'
    if (id === 'catalog' || id === 'pipeline') return hash === '#catalog'
    return false
  }
}
