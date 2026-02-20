'use client'

import TestimonialCarousel, { type TestimonialQuote } from './TestimonialCarousel'

const QUOTE_STYLE = {
  lineHeight: '0.9',
  letterSpacing: '-0.02em',
} as const

type Props = {
  quotes: TestimonialQuote[]
  fallback: { quote: string; author: string }
}

export default function TestimonialsSection({ quotes, fallback }: Props) {
  const n = quotes.length

  return (
    <section id="testimonials" className="border-t border-[var(--sand-light)]">
      <div
        className="testimonials-section-bg relative px-[10px] py-20 md:py-[120px] flex flex-col border-0 min-h-[640px] max-md:min-h-0 max-md:py-12"
      >
        <h2 className="font-body-medium text-[var(--charcoal)] mb-4 shrink-0" style={{ fontSize: '20px' }}>
          Testimonials
        </h2>

        {n > 0 ? (
          <TestimonialCarousel quotes={quotes} />
        ) : (
          <>
            <figure className="max-w-2xl min-h-[349px]">
              <blockquote>
                <p
                  className="font-display uppercase text-[var(--charcoal)] mb-8 text-[20px] md:text-[clamp(28px,3.2vw,44px)]"
                  style={QUOTE_STYLE}
                >
                  {fallback.quote}
                </p>
              </blockquote>
            </figure>
            <div className="font-normal text-[20px] text-[var(--charcoal)] flex flex-wrap items-center justify-between gap-4 mt-8">
              <figcaption className="m-0">{fallback.author}</figcaption>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
