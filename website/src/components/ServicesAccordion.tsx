'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { ServiceItem } from '@/types'

interface Props {
  items: ServiceItem[]
}

export default function ServicesAccordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (!items.length) return null

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = openIndex === i

        return (
          <motion.div
            key={item._key}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.75, ease: [0.42, 0, 0.58, 1], delay: i * 0.1 }}
          >

            {/* ── Heading row ── */}
            <div
              className="flex flex-wrap items-start justify-between cursor-pointer py-[35px] group border-t border-black min-h-[120px] max-md:min-h-[88px] max-md:py-6 max-md:gap-3"
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <p
                className="text-black max-md:min-w-0 max-md:flex-1"
                style={{
                  fontFamily: "'Helvetica Neue', sans-serif",
                  fontWeight: 500,
                  fontSize: 'clamp(40px, 5.5vw, 78px)',
                  letterSpacing: '-0.02em',
                  lineHeight: '40px',
                }}
              >
                {item.heading}
              </p>
              <span
                className={`shrink-0 ml-6 self-start font-normal text-base md:text-[20px] md:leading-[20px] text-black transition-opacity duration-200 max-md:ml-0 ${
                  isOpen ? 'opacity-100' : 'opacity-0'
                }`}
              >
                Close
              </span>
            </div>

            {/* ── Expanded content — animated drop-down ── */}
            <div
              className={`overflow-hidden transition-[max-height,opacity] ease-in-out ${
                isOpen
                  ? 'max-h-[600px] opacity-100 duration-700'
                  : 'max-h-0 opacity-0 duration-500'
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-[10px] pb-14">
                {/* empty left cols 1–6 on desktop */}
                <div className="hidden md:block md:col-span-6" />
                {/* text cols 7–11, col 12 left as indent to match page */}
                <div className="flex flex-col gap-8 pt-2 md:col-span-5">
                  {item.description && (
                    <p className="text-black font-normal text-base md:text-[20px] md:leading-[20px]">
                      {item.description}
                    </p>
                  )}
                  {item.buttonText && item.buttonLink && (
                    <div className="pt-2">
                      <Link
                        href={item.buttonLink}
                        className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-black border border-black px-4 py-2.5 hover:opacity-50 transition-opacity max-md:min-h-[44px] max-md:items-center"
                      >
                        {item.buttonText}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </motion.div>
        )
      })}

      {/* ── Closing rule ── */}
      <div className="h-px border-t border-black" />
    </div>
  )
}
