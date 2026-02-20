'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { urlFor } from '@/lib/sanity.client'
import type { Project } from '@/types'

const MD_BREAKPOINT = 768

type Filter = 'all' | 'residential' | 'commercial'
type ViewMode = 'list' | 'grid'

const CONTAINER_ANIMATION = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
  transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
}

const ROW_ANIMATION: Variants = {
  initial: { opacity: 0 },
  animate: (i: number) => ({
    opacity: 1,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.1 },
  }),
  exit: (i: number) => ({
    opacity: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.1 },
  }),
}

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All Projects' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
]

export default function ProjectsList({ projects }: { projects: Project[] }) {
  const searchParams = useSearchParams()
  const initialCategory = (searchParams.get('category') as Filter) ?? 'all'
  const [filter, setFilter] = useState<Filter>(initialCategory)
  const [view, setView] = useState<ViewMode>('list')
  const [hoverProject, setHoverProject] = useState<Project | null>(null)
  const [thumbPos, setThumbPos] = useState({ x: 0, y: 0 })
  const [thumbGrown, setThumbGrown] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [inViewIndices, setInViewIndices] = useState<Set<number>>(new Set())
  const gridContainerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const setupObserverRef = useRef<() => void>(() => {})
  const contentWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cat = searchParams.get('category') as Filter | null
    if (cat === 'residential' || cat === 'commercial') {
      setFilter(cat)
    }
  }, [searchParams])

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MD_BREAKPOINT - 1}px)`)
    const handle = () => setIsMobile(mql.matches)
    handle()
    mql.addEventListener('change', handle)
    return () => mql.removeEventListener('change', handle)
  }, [])

  const filtered =
    filter === 'all' ? projects : projects.filter((p) => p.category === filter)
  const listProjects = filtered.filter((p) => p.slug?.current)

  const handleRowMouseEnter = useCallback((project: Project) => {
    setHoverProject(project)
  }, [])

  const handleRowMouseMove = useCallback((e: React.MouseEvent) => {
    setThumbPos({ x: e.clientX, y: e.clientY })
  }, [])

  const handleRowMouseLeave = useCallback(() => {
    setHoverProject(null)
  }, [])

  useEffect(() => {
    if (hoverProject) {
      setThumbGrown(false)
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setThumbGrown(true))
      })
      return () => cancelAnimationFrame(id)
    } else {
      setThumbGrown(false)
    }
  }, [hoverProject])

  // Reset in-view state and reattach observer when filter or list changes (so colour works for any filter).
  // Observer is (re)attached in onAnimationComplete so it runs after the new list is in the DOM (AnimatePresence mode="wait").
  useEffect(() => {
    setInViewIndices(new Set())
    observerRef.current?.disconnect()
    observerRef.current = null

    const setupObserver = () => {
      const container = gridContainerRef.current
      if (!container) return
      const cards = container.querySelectorAll<HTMLElement>('[data-index]')
      if (cards.length === 0) return
      observerRef.current?.disconnect()
      const observer = new IntersectionObserver(
        (entries) => {
          setInViewIndices((prev) => {
            const next = new Set(prev)
            for (const entry of entries) {
              const index = Number((entry.target as HTMLElement).dataset.index)
              if (Number.isFinite(index)) {
                if (entry.isIntersecting) next.add(index)
                else next.delete(index)
              }
            }
            return next
          })
        },
        { rootMargin: '0px', threshold: 1 }
      )
      observerRef.current = observer
      cards.forEach((el) => observer.observe(el))
    }

    setupObserverRef.current = setupObserver
    return () => {
      observerRef.current?.disconnect()
      observerRef.current = null
    }
  }, [filter, listProjects.length, view, isMobile])

  return (
    <div className="flex flex-col min-h-[400px]">
      <div ref={contentWrapperRef} className="flex flex-col gap-[60px]">
      {/* Top bar: filters (left, stacked) + view toggle (right) */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 mb-10">
        <nav
          className="flex flex-col gap-0 text-[var(--charcoal)] max-md:gap-0.5"
          aria-label="Filter projects"
        >
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`font-display text-left uppercase tracking-tight text-[24px] leading-[24px] md:text-[56px] md:leading-[56px] mb-0 text-[var(--charcoal)] transition-opacity hover:opacity-50 last:mb-0 cursor-pointer py-0 max-md:h-fit max-md:flex max-md:items-center ${
                filter === value ? 'opacity-50' : 'opacity-100'
              }`}
            >
              {value === 'all' ? 'All Projects' : label}
            </button>
          ))}
        </nav>

        <p className="hidden md:flex font-sans font-medium text-[20px] uppercase tracking-wide items-center gap-2 shrink-0 text-[var(--charcoal)] gap-3">
          <button
            onClick={() => setView('list')}
            className={`cursor-pointer py-2 min-h-[44px] flex items-center ${
              view === 'list'
                ? 'opacity-50 transition-opacity'
                : 'opacity-100 hover:opacity-50 transition-opacity'
            }`}
            aria-label="List view"
          >
            List
          </button>
          <span aria-hidden>/</span>
          <button
            onClick={() => setView('grid')}
            className={`cursor-pointer py-2 min-h-[44px] flex items-center ${
              view === 'grid'
                ? 'opacity-50 transition-opacity'
                : 'opacity-100 hover:opacity-50 transition-opacity'
            }`}
            aria-label="Grid view"
          >
            Grid
          </button>
        </p>
      </div>

      {listProjects.length === 0 && (
        <p className="text-[var(--mid)] py-16">No projects found.</p>
      )}

      {/* List view: table-like rows with hover thumbnail (hidden on mobile) */}
      {view === 'list' && listProjects.length > 0 && (
        <div className="max-md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={CONTAINER_ANIMATION.initial}
              animate={CONTAINER_ANIMATION.animate}
              exit={CONTAINER_ANIMATION.exit}
              transition={CONTAINER_ANIMATION.transition}
              className="border-t border-[var(--charcoal)]"
            >
              {listProjects.map((project, i) => (
                <motion.div
                  key={project._id}
                  custom={i}
                  variants={ROW_ANIMATION}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Link
                    href={`/projects/${project.slug.current}`}
                    className="grid grid-cols-12 items-center gap-x-4 py-2 border-b border-[var(--charcoal)] hover:opacity-80 transition-opacity block"
                    onMouseEnter={() => handleRowMouseEnter(project)}
                    onMouseMove={handleRowMouseMove}
                    onMouseLeave={handleRowMouseLeave}
                  >
                    <p className="col-span-3 col-start-1 font-body-medium text-[16px] md:text-[20px] md:leading-[20px] text-[var(--charcoal)] text-left max-md:col-span-1 max-md:col-start-1">
                      {project.title}
                    </p>
                    <p className="col-start-4 font-body-medium text-[16px] md:text-[20px] md:leading-[20px] text-[var(--charcoal)] capitalize text-left max-md:col-start-1">
                      {project.category}
                    </p>
                    <p className="col-start-7 w-[171px] font-body-medium text-[16px] md:text-[20px] md:leading-[20px] text-[var(--charcoal)] text-left max-md:col-start-1 max-md:w-auto">
                      {project.year ? `Completed ${project.year}` : ''}
                    </p>
                    <span className="col-start-12 font-body-medium text-[16px] md:text-[20px] md:leading-[20px] text-[var(--charcoal)] whitespace-nowrap justify-self-end max-md:col-start-1 max-md:justify-self-start max-md:pt-1">
                      View Project
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Hover thumbnail: fixed, 250x250, centered on cursor, grows in quickly */}
          {hoverProject?.heroImage?.asset && (
            <div
              className="fixed z-50 w-[250px] h-[250px] overflow-hidden shadow-lg pointer-events-none origin-center transition-transform duration-150 ease-out"
              style={{
                left: thumbPos.x - 125,
                top: thumbPos.y - 125,
                transform: thumbGrown ? 'scale(1)' : 'scale(0)',
              }}
            >
              <Image
                src={urlFor(hoverProject.heroImage).width(500).height(500).quality(80).url()}
                alt={hoverProject.heroImage.alt ?? hoverProject.title}
                width={250}
                height={250}
                className="object-cover w-full h-full"
                unoptimized
              />
            </div>
          )}
        </div>
      )}

      {/* Grid view: vertical list, 6 cols image (3:2) + 6 cols details on hover; on mobile stacked, details always visible, images color on scroll */}
      {(view === 'grid' || isMobile) && listProjects.length > 0 && (
        <div ref={gridContainerRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={CONTAINER_ANIMATION.initial}
              animate={CONTAINER_ANIMATION.animate}
              exit={CONTAINER_ANIMATION.exit}
              transition={CONTAINER_ANIMATION.transition}
              className="border-t border-[var(--charcoal)]"
              onAnimationComplete={() => setupObserverRef.current?.()}
            >
              {listProjects.map((project, i) => (
                <motion.div
                  key={project._id}
                  data-index={i}
                  custom={i}
                  variants={ROW_ANIMATION}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                <Link
                  href={`/projects/${project.slug.current}`}
                  className="group grid grid-cols-12 max-md:grid-cols-1 gap-x-2.5 border-b border-[var(--charcoal)] pt-2.5 pb-[30px] opacity-100 hover:!opacity-100 block"
                >
                  {/* Left: project image — desktop: grayscale, color on hover; mobile: first in color, others color when scrolled into view */}
                  <div className="col-span-6 max-md:col-span-1 relative aspect-[3/2] overflow-hidden bg-transparent">
                    {project.heroImage?.asset ? (
                      <Image
                        src={urlFor(project.heroImage).width(800).height(533).quality(80).url()}
                        alt={project.heroImage.alt ?? project.title}
                        fill
                        className={`object-cover bg-transparent ${
                          i === 0
                            ? 'transition-all duration-500 ease-out'
                            : 'transition-all duration-150'
                        } ${
                          i === 0 || inViewIndices.has(i)
                            ? 'max-md:grayscale-0'
                            : 'max-md:grayscale'
                        } md:grayscale md:group-hover:grayscale-0`}
                        sizes="(max-width: 767px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[var(--sand)]" />
                    )}
                  </div>
                  {/* Right: project details — visible on hover desktop, always visible mobile; tighter vertical gap on mobile */}
                  <div className="col-span-6 max-md:col-span-1 flex flex-col justify-between opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150 bg-transparent max-md:gap-0.5 max-md:pt-1">
                    <div className="flex justify-between items-start gap-4 max-md:gap-2">
                      <p className="font-body-medium text-[20px] max-md:text-[16px] text-[var(--charcoal)] text-left h-fit leading-[20px] max-md:leading-[16px]">
                        {project.title}
                      </p>
                      <p className="font-body-medium text-[20px] max-md:text-[16px] text-[var(--charcoal)] capitalize text-right shrink-0 h-fit leading-[20px] max-md:leading-[16px]">
                        {project.category}
                      </p>
                    </div>
                    <div className="flex justify-between items-end gap-4 max-md:gap-2">
                      <p className="font-body-medium text-[20px] max-md:text-[16px] md:leading-[20px] text-[var(--charcoal)] text-left">
                        {project.year ? `Completed ${project.year}` : ''}
                      </p>
                      <span className="font-body-medium text-[20px] max-md:text-[16px] md:leading-[20px] text-[var(--charcoal)] shrink-0 group-hover:opacity-50 transition-opacity">
                        View Project
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
      </div>
    </div>
  )
}
