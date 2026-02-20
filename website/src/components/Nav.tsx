'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTransitionPhase } from '@/contexts/TransitionContext'

export default function Nav({ overlay = false, theme }: { overlay?: boolean; theme?: 'contact' }) {
  const pathname = usePathname()
  const transitionPhase = useTransitionPhase()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [closingAccordion, setClosingAccordion] = useState(false)
  const [accordionPanelSliding, setAccordionPanelSliding] = useState(false)

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
          className="fixed inset-0 z-[60] bg-[var(--cream)] md:hidden transition-transform duration-500 ease-out"
          style={{
            transform: open && !closing ? 'translateY(0)' : 'translateY(100%)',
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
    <header className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ease-in-out" style={{ backgroundColor: navBg }}>

      {/* Nav links row — desktop: above logo; mobile: drops down; on X tap links fade out then panel slides up */}
      <div
        className={`overflow-hidden transition-[max-height] ease-in-out max-md:fixed max-md:top-[72px] max-md:left-0 max-md:right-0 max-md:z-40 ${
          (open && !closingAccordion) || closingAccordion ? 'max-md:h-[calc(100dvh-72px)] duration-500' : ''
        } ${
          (open && !closingAccordion) || (closingAccordion && !accordionPanelSliding)
            ? 'max-h-[calc(100dvh-72px)] md:max-h-36 duration-700'
            : 'max-h-0 duration-500'
        }`}
        style={{ backgroundColor: navBg }}
      >
        <nav
          className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-[10px] pt-8 pb-8 max-md:absolute max-md:left-[2px] max-md:right-0 max-md:bottom-0 max-md:top-0 max-md:flex max-md:flex-col max-md:justify-end max-md:items-start max-md:gap-y-1.5 max-md:px-[10px] max-md:pb-24 max-md:pt-0"
          style={{ color: navText }}
          aria-label="Main navigation"
        >
          {navLinks.map(({ href, label }, i) => (
            <Link
              key={href}
              href={href}
              className={`uppercase font-bold hover:opacity-50 transition-opacity leading-none max-md:min-h-[44px] max-md:flex max-md:items-center ${
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
      </div>

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
