'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type TestimonialQuote = {
  _key?: string
  quote?: string | null
  name?: string | null
  title?: string | null
}

type Props = {
  quotes: TestimonialQuote[]
}

const ROTATE_INTERVAL_MS = 5000

export default function TestimonialCarousel({ quotes }: Props) {
  const [index, setIndex] = useState(0)
  const n = quotes.length

  const goNext = useCallback(() => {
    if (n <= 0) return
    setIndex((i) => (i + 1) % n)
  }, [n])

  const goPrev = useCallback(() => {
    if (n <= 0) return
    setIndex((i) => (i - 1 + n) % n)
  }, [n])

  useEffect(() => {
    if (n <= 1) return
    const id = setInterval(goNext, ROTATE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [n, goNext])

  if (n === 0) return null

  const current = quotes[index]
  const authorLine = [current.name, current.title].filter(Boolean).join(', ')

  return (
    <>
      <div className="overflow-hidden min-h-[400px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <figure className="max-w-2xl m-0">
              <blockquote>
                <p
                  className="font-display uppercase text-[var(--charcoal)] mb-8 text-[20px] md:text-[clamp(28px,3.2vw,44px)]"
                  style={{
                    lineHeight: '0.9',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {current.quote ?? ''}
                </p>
              </blockquote>
            </figure>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="font-normal text-base md:text-[20px] md:leading-[20px] text-[var(--charcoal)] flex flex-col flex-nowrap items-start justify-start gap-5 mt-[30px] max-md:gap-6">
        <figcaption className="m-0 text-base md:text-[20px] md:leading-[20px] font-medium">{authorLine || '—'}</figcaption>
        <nav className="flex gap-6 max-md:gap-4" aria-label="Testimonial navigation">
          <button
            type="button"
            onClick={goPrev}
            className="hover:opacity-50 transition-opacity bg-transparent border-0 cursor-pointer font-normal text-base md:text-[20px] md:leading-[20px] text-[var(--charcoal)] p-0 max-md:py-2 max-md:min-h-[44px] max-md:flex max-md:items-center"
            aria-label="Previous testimonial"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={goNext}
            className="hover:opacity-50 transition-opacity bg-transparent border-0 cursor-pointer font-normal text-base md:text-[20px] md:leading-[20px] text-[var(--charcoal)] p-0 max-md:py-2 max-md:min-h-[44px] max-md:flex max-md:items-center"
            aria-label="Next testimonial"
          >
            Next
          </button>
        </nav>
      </div>
    </>
  )
}
