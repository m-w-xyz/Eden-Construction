'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'

const MIN_HOLD_MS = 400
const MAX_WAIT_MS = 2800
const SLIDE_DURATION_MS = 550
const PAGE_FADE_MS = 450

function whenTopLoaded(): Promise<void> {
  return new Promise((resolve) => {
    const start = Date.now()
    const check = () => {
      const page = document.getElementById('page-content')
      const img = page?.querySelector('img')
      const loaded = img?.complete && (img.naturalWidth ?? 0) > 0
      if (loaded || Date.now() - start >= MAX_WAIT_MS) {
        resolve()
        return
      }
      requestAnimationFrame(check)
    }
    requestAnimationFrame(check)
  })
}

export default function SplashScreen() {
  const handledViaTransition = useRef(false)

  // Run before paint when navigating to home so we never show splash for one frame
  useLayoutEffect(() => {
    let viaTransition = false
    try {
      viaTransition = !!sessionStorage.getItem('nav-transition')
    } catch (_) {}

    if (!viaTransition) return

    handledViaTransition.current = true
    try {
      sessionStorage.removeItem('nav-transition')
    } catch (_) {}

    const page = document.getElementById('page-content')
    const splash = document.getElementById('splash-cover')
    if (page) page.style.opacity = '1'
    if (splash) splash.style.setProperty('display', 'none')
  }, [])

  useEffect(() => {
    if (handledViaTransition.current) return

    const splash = document.getElementById('splash-cover')
    const page = document.getElementById('page-content')

    if (!splash) return

    let cancelled = false
    const hideAt = SLIDE_DURATION_MS + 80

    const runSlide = () => {
      if (cancelled) return
      if (page) {
        page.style.transition = `opacity ${PAGE_FADE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
        page.style.opacity = '1'
      }
      splash.style.transition = `transform ${SLIDE_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
      splash.style.transform = 'translateY(-100%)'
    }
    const finishHide = () => {
      if (cancelled) return
      splash.style.setProperty('display', 'none')
    }

    const minPromise = new Promise<void>((r) => setTimeout(r, MIN_HOLD_MS))
    Promise.all([minPromise, whenTopLoaded()]).then(() => {
      if (cancelled) return
      runSlide()
      setTimeout(finishHide, hideAt)
    })

    return () => {
      cancelled = true
    }
  }, [])

  return null
}
