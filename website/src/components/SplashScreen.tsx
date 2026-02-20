'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'

const HOLD_MS = 900
const SLIDE_DURATION_MS = 550
const PAGE_FADE_MS = 450

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

    const slideStart = HOLD_MS
    const hideAt = HOLD_MS + SLIDE_DURATION_MS + 80

    const slideTimer = setTimeout(() => {
      if (page) {
        page.style.transition = `opacity ${PAGE_FADE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
        page.style.opacity = '1'
      }
      splash.style.transition = `transform ${SLIDE_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
      splash.style.transform = 'translateY(-100%)'
    }, slideStart)

    const hideTimer = setTimeout(() => {
      splash.style.setProperty('display', 'none')
    }, hideAt)

    return () => {
      clearTimeout(slideTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  return null
}
