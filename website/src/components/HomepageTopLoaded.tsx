'use client'

import { useEffect } from 'react'

const FALLBACK_MS = 300
const POLL_INTERVAL_MS = 50

export default function HomepageTopLoaded() {
  useEffect(() => {
    const fire = () => window.dispatchEvent(new CustomEvent('homepage-top-loaded'))

    const el = document.getElementById('hero-image')
    if (el) {
      if ((el as HTMLImageElement).complete) fire()
      else el.addEventListener('load', fire)
      return
    }

    const poll = setInterval(() => {
      const img = document.getElementById('hero-image')
      if (img) {
        clearInterval(poll)
        if ((img as HTMLImageElement).complete) fire()
        else img.addEventListener('load', fire)
      }
    }, POLL_INTERVAL_MS)

    const fallback = setTimeout(() => {
      clearInterval(poll)
      fire()
    }, FALLBACK_MS)

    return () => {
      clearInterval(poll)
      clearTimeout(fallback)
    }
  }, [])
  return null
}
