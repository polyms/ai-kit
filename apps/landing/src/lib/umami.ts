declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, string>) => void
    }
  }
}

export function trackEvent(event: string, data?: Record<string, string>) {
  if (typeof window === 'undefined') return
  window.umami?.track(event, data)
}

export function injectUmami() {
  const scriptUrl = import.meta.env.VITE_UMAMI_SCRIPT_URL as string | undefined
  const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID as string | undefined
  if (!scriptUrl || !websiteId) return

  const existing = document.querySelector(`script[data-website-id="${websiteId}"]`)
  if (existing) return

  const script = document.createElement('script')
  script.async = true
  script.defer = true
  script.src = scriptUrl
  script.dataset.websiteId = websiteId
  document.body.appendChild(script)
}
