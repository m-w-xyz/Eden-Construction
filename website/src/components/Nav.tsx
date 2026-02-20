'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTransitionPhase } from '@/contexts/TransitionContext'

export default function Nav({ overlay = false, theme }: { overlay?: boolean; theme?: 'contact' }) {
  const pathname = usePathname()
  const transitionPhase = useTransitionPhase()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [closingAccordion, setClosingAccordion] = useState(false)
  const [accordionPanelSliding, setAccordionPanelSliding] = useState(false)
  const [navHidden, setNavHidden] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [accordionDropdownExpanded, setAccordionDropdownExpanded] = useState(false)
  const lastScrollY = useRef(0)
  const isHomePage = pathname === '/'

  useEffect(() => setMounted(true), [])

  // Slide-down: start collapsed then expand after paint so transition runs
  useEffect(() => {
    if (!open && !closingAccordion) {
      setAccordionDropdownExpanded(false)
      return
    }
    if (open && !closingAccordion) {
      setAccordionDropdownExpanded(false)
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setAccordionDropdownExpanded(true))
      })
      return () => cancelAnimationFrame(raf)
    }
  }, [open, closingAccordion])

  const SLIDE_DURATION_MS = 500
  const ACCORDION_FADE_OUT_MS = 500

  const closeMenu = () => {
    setClosing(true)
    setTimeout(() => {
      setOpen(false)
      setClosing(false)
    }, SLIDE_DURATION_MS)
  }

  useEffect(() => {
    if (!overlay) return
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [overlay])

  // Non-homepage: hide nav on scroll down, show on scroll up
  const SCROLL_THRESHOLD = 80
  useEffect(() => {
    if (isHomePage) return
    const onScroll = () => {
      const y = window.scrollY
      if (y <= SCROLL_THRESHOLD) {
        setNavHidden(false)
      } else if (y > lastScrollY.current) {
        setNavHidden(true)
      } else {
        setNavHidden(false)
      }
      lastScrollY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHomePage])

  // Don't close accordion until transition is fully idle — prevents logo/+ jump during reveal
  useEffect(() => {
    if (transitionPhase !== 'idle') return
    setOpen(false)
    setClosing(false)
    setClosingAccordion(false)
    setAccordionPanelSliding(false)
  }, [pathname, transitionPhase])

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  const navLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/process', label: 'Process' },
    { href: '/projects?category=residential', label: 'Residential' },
    { href: '/projects?category=commercial', label: 'Commercial' },
    { href: '/contact', label: 'Contact' },
  ]

  const linkStyle = {
    fontFamily: "'Aktiv Grotesk Ex', sans-serif",
    fontWeight: 700,
    fontSize: '20px',
    verticalAlign: 'top' as const,
    textAlign: 'left' as const,
  }

  // ── Homepage hero layout ──────────────────────────────────────────────────
  // Full-width white logo at top; desktop: nav links at bottom; mobile: single MENU button, full-screen overlay when open
  if (overlay && !scrolled) {
    return (
      <>
        <header className="fixed top-0 left-0 right-0 z-50">
          <div className="px-[10px] py-6">
            <Image
              src="/logo-white.svg"
              alt="Eden Construction"
              width={1420}
              height={82}
              className="w-full h-auto"
              priority
            />
          </div>
        </header>

        {/* Desktop: nav links in a row at bottom; mobile: single centered MENU button */}
        <nav
          className="fixed bottom-0 left-0 right-0 z-50 flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-3 px-[10px] pt-[10px] pb-[10px] text-[var(--white)] max-md:gap-y-4 max-md:py-4 max-md:justify-center max-md:items-center"
          aria-label="Main navigation"
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`uppercase font-bold hover:opacity-50 transition-opacity leading-none py-2 max-md:min-h-[44px] max-md:flex max-md:items-center md:inline-block max-md:hidden ${
                isActive(href.split('?')[0]) ? 'opacity-60' : ''
              }`}
              style={linkStyle}
            >
              {label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="hidden max-md:inline-flex uppercase font-bold hover:opacity-50 transition-opacity leading-none py-2 min-h-[44px] items-center text-[var(--white)]"
            style={linkStyle}
          >
            Menu
          </button>
        </nav>

        {/* Mobile only: sliding panel; logo at top so it is only visible when panel has slid up (masked). */}
        <div
          className="fixed inset-0 z-[60] bg-[var(--cream)] md:hidden will-change-transform transition-transform duration-500 ease-out"
          style={{
            transform: open && !closing ? 'translate3d(0, 0, 0)' : 'translate3d(0, 100%, 0)',
            visibility: open || closing ? 'visible' : 'hidden',
            pointerEvents: open && !closing ? 'auto' : 'none',
          }}
          aria-hidden={!open && !closing}
        >
          {/* Logo at top of panel: revealed as panel slides up, not visible until menu covers it */}
          <header className="shrink-0 px-[10px] py-6">
            <Link
              href="/"
              onClick={closeMenu}
              className="block hover:opacity-50 transition-opacity"
              aria-label="Eden Construction home"
            >
              <Image
                src="/logo-black.svg"
                alt="Eden Construction"
                width={1420}
                height={82}
                className="w-full h-auto"
                priority
              />
            </Link>
          </header>

          {/* Nav stack at bottom left, above the X bar */}
          <nav
            className="fixed left-0 right-0 bottom-0 top-0 pt-[72px] pb-24 px-[10px] flex flex-col justify-end items-start"
            style={{ color: 'var(--charcoal)' }}
            aria-label="Main navigation"
          >
            <div className="flex flex-col items-start gap-1.5">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`uppercase font-bold hover:opacity-50 transition-opacity leading-none py-2 min-h-[44px] flex items-center ${
                    isActive(href.split('?')[0]) ? 'opacity-60' : ''
                  }`}
                  style={linkStyle}
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>

          {/* X: same position as MENU (centered, bottom), much larger */}
          <div className="fixed bottom-0 left-0 right-0 z-[61] flex justify-center items-center px-[10px] pt-[10px] pb-[10px] max-md:py-4">
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
              className="uppercase font-bold hover:opacity-50 transition-opacity leading-none py-2 min-h-[44px] flex items-center text-[var(--charcoal)] text-[40px] md:text-[44px]"
              style={{ fontFamily: "'Aktiv Grotesk Ex', sans-serif" }}
            >
              ×
            </button>
          </div>
        </div>
      </>
    )
  }

  // ── Standard accordion layout ─────────────────────────────────────────────
  // Nav links expand ABOVE the logo row (links first in DOM → appear at top).
  // Used on all inner pages and on the homepage once the user scrolls.
  // Mobile (inner pages only): logo 2/3 width, + same height as logo; menu drops to fill screen, nav at bottom left; logo and +/× stay fixed.
  const navBg = theme === 'contact' ? '#6B8CA3' : '#EDE5D9'
  const navText = theme === 'contact' ? '#1C1A18' : 'var(--charcoal)'
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 max-md:z-[100] transition-[transform,background-color] duration-300 ease-in-out"
      style={{
        backgroundColor: navBg,
        transform: !isHomePage && navHidden ? 'translateY(-100%)' : 'translateY(0)',
      }}
    >

      {/* Nav links row — desktop: in header; mobile: portaled to body so it always shows on top */}
      <div
        className={`overflow-hidden max-md:hidden ${
          (open && !closingAccordion) || (closingAccordion && !accordionPanelSliding)
            ? 'md:max-h-36'
            : 'md:max-h-0'
        } md:transition-[max-height] md:duration-500 md:ease-out`}
        style={{ backgroundColor: navBg }}
      >
        <nav
          className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-[10px] pt-8 pb-8"
          style={{ color: navText }}
          aria-label="Main navigation"
        >
          {navLinks.map(({ href, label }, i) => (
            <Link
              key={href}
              href={href}
              className={`uppercase font-bold hover:opacity-50 transition-opacity leading-none ${isActive(href.split('?')[0]) ? 'opacity-60' : ''}`}
              style={linkStyle}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile only: dropdown portaled to body so it's never clipped or behind overlay */}
      {mounted &&
        typeof document !== 'undefined' &&
        (open || closingAccordion) &&
        createPortal(
          <div
            className="fixed left-0 right-0 bottom-0 overflow-hidden md:hidden"
            style={{
              top: '72px',
              zIndex: 10002,
              maxHeight: accordionDropdownExpanded ? 'calc(100dvh - 72px)' : '0',
              backgroundColor: navBg,
              transition: 'max-height 500ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            aria-hidden={!open && !closingAccordion}
          >
            <nav
              className="absolute left-[2px] right-0 bottom-0 top-0 flex flex-col justify-end items-start gap-y-1.5 px-[10px] pb-24 pt-0"
              style={{ color: navText }}
              aria-label="Main navigation"
            >
              {navLinks.map(({ href, label }, i) => (
                <Link
                  key={href}
                  href={href}
                  className={`uppercase font-bold hover:opacity-50 transition-opacity leading-none min-h-[44px] flex items-center ${
                    open && !closingAccordion ? 'accordion-nav-item-in' : ''
                  } ${closingAccordion ? 'accordion-nav-item-out' : ''} ${isActive(href.split('?')[0]) ? 'opacity-60' : ''}`}
                  style={{
                    ...linkStyle,
                    ...(open && !closingAccordion ? { animationDelay: `${280 + i * 55}ms` } : {}),
                    ...(closingAccordion ? { animationDelay: `${(navLinks.length - 1 - i) * 45}ms` } : {}),
                  }}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>,
          document.body
        )}

      {/* Logo row — always visible on top of dropdown; desktop: unchanged; mobile: logo 2/3 width, + same height as logo */}
      <div className="relative z-50 flex items-center justify-between gap-4 px-[10px] py-6" style={{ backgroundColor: navBg }}>
        <Link href="/" className="flex shrink-0 w-1/3 max-md:w-2/3 hover:opacity-50 transition-opacity">
          <Image
            src="/logo-black.svg"
            alt="Eden Construction"
            width={1420}
            height={82}
            className="w-full h-auto block"
            priority
          />
        </Link>

        {/* Toggle button — rotates + to ×; desktop: unchanged; mobile: close = fade links out then slide panel up */}
        <button
          onClick={() => {
            if (open) {
              setClosingAccordion(true)
              setTimeout(() => setAccordionPanelSliding(true), ACCORDION_FADE_OUT_MS)
              setTimeout(() => {
                setOpen(false)
                setClosingAccordion(false)
                setAccordionPanelSliding(false)
              }, ACCORDION_FADE_OUT_MS + SLIDE_DURATION_MS)
            } else {
              setAccordionDropdownExpanded(false)
              setOpen(true)
            }
          }}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="flex shrink-0 items-center justify-center p-1 cursor-pointer hover:opacity-50 transition-opacity duration-300 ease-in-out max-md:p-0 max-md:h-[calc(66.667vw*82/1420)] max-md:min-h-[44px] max-md:w-[calc(66.667vw*82/1420)] max-md:min-w-[44px]"
          style={{ color: navText }}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            className={`block transition-transform duration-300 ease-in-out max-md:w-[0.55em] max-md:h-[0.55em] max-md:min-w-[18px] max-md:min-h-[18px] ${open ? 'rotate-45' : 'rotate-0'}`}
          >
            <path d="M15.8359 9.57324H25.4092V15.8369H15.8359V25.4102H9.57324V15.8369H0V9.57324H9.57324V0H15.8359V9.57324Z" fill="currentColor" />
          </svg>
        </button>
      </div>

    </header>
  )
}
