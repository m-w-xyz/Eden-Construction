'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { TransitionProvider } from '@/contexts/TransitionContext'

const DURATION_MS = 400
const FADE_MS = 220
const REVEAL_DELAY_MS = 320
const COVERED_FALLBACK_MS = 2500
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'

const norm = (p: string) => (p || '/').replace(/\/$/, '') || '/'

type Phase = 'idle' | 'covering' | 'covered' | 'revealing'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [phase, setPhase] = useState<Phase>('idle')

  const navigating = useRef(false)
  const prevPathname = useRef(norm(pathname))
  const fallbackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingHref = useRef<string | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const startReveal = () => {
    if (fallbackTimeout.current) {
      clearTimeout(fallbackTimeout.current)
      fallbackTimeout.current = null
    }
    setPhase('revealing')
  }

  // When covering phase starts: navigate only after the navy overlay has fully faded in (transitionend)
  useEffect(() => {
    if (phase !== 'covering' || !pendingHref.current) return

    const el = overlayRef.current
    const href = pendingHref.current

    const onTransitionEnd = (e: TransitionEvent) => {
      if (e.target !== el || e.propertyName !== 'opacity') return
      el?.removeEventListener('transitionend', onTransitionEnd)
      setPhase('covered')
      router.push(href)
      pendingHref.current = null
    }

    const fallback = setTimeout(() => {
      el?.removeEventListener('transitionend', onTransitionEnd)
      setPhase('covered')
      router.push(href)
      pendingHref.current = null
    }, FADE_MS + 80)

    el?.addEventListener('transitionend', onTransitionEnd)

    return () => {
      el?.removeEventListener('transitionend', onTransitionEnd)
      clearTimeout(fallback)
    }
  }, [phase, router])

  // When the route changes, wait for new page to paint then reveal
  useEffect(() => {
    const current = norm(pathname)
    const prev = prevPathname.current
    if (!navigating.current) {
      prevPathname.current = current
      return
    }
    if (current === prev) return

    prevPathname.current = current
    navigating.current = false

    // New page is mounted; ensure it’s at top with no scroll animation before reveal
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

    let rafId = 0
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    // Double RAF ensures the new page has painted before we start the delay (prevents flash)
    rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        timeoutId = setTimeout(startReveal, REVEAL_DELAY_MS)
      })
    })

    return () => {
      cancelAnimationFrame(rafId)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [pathname])

  // If we stay in covered too long (pathname did not update), reveal anyway
  useEffect(() => {
    if (phase !== 'covered') return
    fallbackTimeout.current = setTimeout(() => {
      fallbackTimeout.current = null
      navigating.current = false
      setPhase('revealing')
    }, COVERED_FALLBACK_MS)
    return () => {
      if (fallbackTimeout.current) {
        clearTimeout(fallbackTimeout.current)
        fallbackTimeout.current = null
      }
    }
  }, [phase])

  // After reveal animation completes, return to idle
  useEffect(() => {
    if (phase !== 'revealing') return
    const t = setTimeout(() => setPhase('idle'), DURATION_MS + 50)
    return () => clearTimeout(t)
  }, [phase])

  // Intercept internal link clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (navigating.current) return

      const anchor = (e.target as Element).closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href || !href.startsWith('/')) return
      if (anchor.getAttribute('target') === '_blank') return

      const hrefPath = norm(href.split('#')[0].split('?')[0])
      const currentPath = norm(pathname)
      if (hrefPath === currentPath && hrefPath !== '') return

      e.preventDefault()
      navigating.current = true
      prevPathname.current = currentPath
      pendingHref.current = href

      // Jump to top immediately so the covered page and then the new page are at top (no scroll animation during transition)
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

      try {
        sessionStorage.setItem('nav-transition', '1')
      } catch (_) {}

      setPhase('covering')
      // Navigation happens in transitionend (or fallback) so the blue is fully visible first
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [pathname, router])

  // Covering: overlay in place, fade in. Revealing: slide up.
  const transform =
    phase === 'idle'      ? 'translate3d(0, 100%, 0)' :
    phase === 'covering'  ? 'translate3d(0, 0, 0)'    :
    phase === 'covered'   ? 'translate3d(0, 0, 0)'    :
                            'translate3d(0, -100%, 0)'

  const opacity = phase === 'idle' ? 0 : 1

  const cssTransition =
    phase === 'covering'  ? `opacity ${FADE_MS}ms ${EASING}` :
    phase === 'revealing' ? `transform ${DURATION_MS}ms ${EASING}` :
                            'none'

  return (
    <TransitionProvider phase={phase}>
      {children}
      <div
        ref={overlayRef}
        aria-hidden="true"
        style={{
          position:           'fixed',
          inset:              0,
          zIndex:             10000,
          backgroundColor:   '#151D2E',
          transform,
          opacity,
          transition:         cssTransition,
          pointerEvents:     'none',
          willChange:         'transform',
          backfaceVisibility: 'hidden',
        }}
      />
    </TransitionProvider>
  )
}
