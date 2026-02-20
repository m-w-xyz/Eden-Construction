import type { Metadata } from 'next'
import Image from 'next/image'
import Nav from '@/components/Nav'
import AnimateOnScroll from '@/components/AnimateOnScroll'
import { client } from '@/lib/sanity.client'
import { urlFor } from '@/lib/sanity.client'
import { processPageQuery, testimonialsQuery } from '@/lib/queries'
import TestimonialsSection from '@/components/TestimonialsSection'
import type { SanityImage } from '@/types'

export const metadata: Metadata = { title: 'Process' }
export const revalidate = 60

const steps = [
  {
    number: '01',
    title: 'Initial Consultation',
    body: 'Reach out to schedule a consultation with our Project Manager, Finn Eden. During this meeting, we will discuss your project, goals and how Eden Construction can assist you.',
  },
  {
    number: '02',
    title: 'Project Planning',
    body: "After the consultation, we'll begin organising project details such as timelines, budgeting, and materials, ensuring everything is aligned with your expectations.",
  },
  {
    number: '03',
    title: 'Partner Collaboration',
    body: "We'll partner with architects, engineers, trades, suppliers, and any other necessary parties to ensure each part of the project plan from Stage 2 is executed with timeliness, precision and quality.",
  },
  {
    number: '04',
    title: 'Execution & Completion',
    body: "Once all other stages are in place, the construction process will begin. We'll keep you informed and involved every step of the way until your finished project is delivered.",
  },
]

const whyChooseUs = [
  {
    title: 'Exclusive Supplier Relationships',
    body: 'We can ensure high quality products at competitive prices and timely delivery directly to site through exclusive partnerships with large international suppliers.',
  },
  {
    title: 'Pre-Construction Guidance',
    body: 'We have detailed conversations with clients, architects, and engineers from the start to provide guidance and ensure best construction methods, materials, and strategies.',
  },
  {
    title: 'Expert Project Management',
    body: 'Our small but highly skilled team has the capacity and flexibility to execute small to large scale projects. Our combined industry experience allows us to provide efficient project management and quality control.',
  },
  {
    title: 'Build to International Standards',
    body: 'Eden Construction is based in Fiji, but is backed by New Zealand standards and experience, with a mission to raise the standard of construction in Fiji through efficiency, innovation and transparency.',
  },
]

const fallbackTestimonial = {
  quote:
    "I have worked with many contractors and builders over the years and I can say without any fear of contradiction that Finn stands out above most of them.",
  author: 'Peter Todd',
}

export default async function ProcessPage() {
  type ProcessPageData = {
    heroBanner?: SanityImage
    introduction?: string | null
    image1?: SanityImage
  }
  type TestimonialsData = {
    quotes?: Array<{ _key?: string; quote?: string | null; name?: string | null; title?: string | null }> | null
  }
  const [data, testimonialsData] = await Promise.all([
    client.fetch<ProcessPageData | null>(processPageQuery),
    client.fetch<TestimonialsData | null>(testimonialsQuery),
  ])
  const heroBanner = data?.heroBanner
  const introduction = data?.introduction ?? ''
  const image1 = data?.image1
  const quotes = testimonialsData?.quotes ?? []

  return (
    <>
      <Nav />

      {/* Hero banner — same layout as About page */}
      <div className="w-full pt-[var(--nav-height)]">
        <div className="group relative w-full h-[66vh] min-h-[200px] bg-[#EDE5D9] overflow-hidden">
          {heroBanner?.asset ? (
            <Image
              src={urlFor(heroBanner).width(2400).quality(85).url()}
              alt={heroBanner.alt ?? 'Eden Construction'}
              fill
              priority
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-150 px-2.5 bg-transparent"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-[var(--sand-dark)]" />
          )}
        </div>
      </div>

      <main className="pb-0">
        {/* Intro — 12-col grid: title + subnav col 1, copy col 7–11 (same as About) */}
        <section className="px-[10px] pt-[30px] pb-[120px] bg-[#EDE5D9]">
          <div className="grid grid-cols-12 gap-x-[10px] gap-y-[10px] max-md:gap-y-[120px] md:gap-[10px] items-start">
            <div className="col-span-12 md:col-span-1 md:w-[150px]">
              <h2
                className="font-body-medium text-[var(--charcoal)] mb-4"
                style={{ fontSize: '20px' }}
              >
                Process
              </h2>
              <nav className="flex flex-col gap-[2px] max-md:gap-0.5" aria-label="Page sections">
                {[
                  { href: '#why-choose-us', label: 'Why Choose Us' },
                  { href: '#testimonials', label: 'Testimonials' },
                ].map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    className="text-[16px] md:text-[20px] text-[var(--charcoal)] opacity-60 hover:opacity-50 transition-opacity max-md:inline-block"
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>
            <div className="col-span-12 md:col-start-7 md:col-span-5">
              {introduction
                ? introduction
                    .split(/\n\n+/)
                    .filter(Boolean)
                    .map((paragraph, i) => (
                      <p key={i} className="mb-3 font-normal text-base md:text-[20px] text-[var(--charcoal)] leading-relaxed md:leading-[20px]">
                        {paragraph.trim()}
                      </p>
                    ))
                : (
                  <p className="mb-3 font-normal text-base md:text-[20px] text-[var(--charcoal)] leading-relaxed md:leading-[20px]">
                    Our collaborative process enables the best outcomes. Through
                    clear communication and meticulous planning, we deliver
                    results that exceed expectations at every stage.
                  </p>
                )}
            </div>
          </div>
        </section>

        {/* Steps — 01: 1–5, 02: 3–8, 03: 5–10, 04: 7–12; number left, text right; accordion borders */}
        <section>
          <div className="px-[10px] bg-[#EDE5D9]">
            <div className="flex flex-col">
              {steps.map((step, i) => {
                const colClass = [
                  'md:col-start-1 md:col-span-5',   // 01: cols 1-5
                  'md:col-start-3 md:col-span-6',   // 02: cols 3-8
                  'md:col-start-5 md:col-span-6',   // 03: cols 5-10
                  'md:col-start-7 md:col-span-6',   // 04: cols 7-12
                ][i]
                return (
                  <div
                    key={step.number}
                    className="grid grid-cols-12 gap-[10px] border-t border-black pt-5 pb-12 md:pt-5 md:pb-16"
                  >
                    <AnimateOnScroll
                      triggerAtHalfViewport
                      className={`col-span-12 flex flex-col gap-4 md:flex-row md:gap-6 min-w-0 items-start ${colClass}`}
                    >
                      <span
                        className="font-display text-[var(--charcoal)] leading-none shrink-0 text-[56px] md:text-[128px]"
                      >
                        {step.number}
                      </span>
                      <div className="min-w-0">
                        <h2
                        className="font-body-medium text-[var(--charcoal)] mb-4"
                        style={{ fontSize: '20px' }}
                      >
                          {step.title}
                        </h2>
                        <p className="font-normal text-base md:text-[20px] text-[var(--charcoal)] leading-relaxed md:leading-[20px]">
                          {step.body}
                        </p>
                      </div>
                    </AnimateOnScroll>
                  </div>
                )
              })}
            </div>
            <div className="h-px border-t border-black" aria-hidden="true" />
          </div>
        </section>

        {/* ── Image 1 (from Sanity Process page) ─────────────────────────── */}
        {image1?.asset && (
          <div className="px-[10px] py-[120px] bg-[#EDE5D9]">
            <div className="grid grid-cols-12 gap-[10px]">
              <div className="col-start-1 col-span-12 md:col-start-5 md:col-span-7">
                <AnimateOnScroll direction="right" className="group relative ml-[25%] max-md:ml-[25%] aspect-[16/9] bg-[var(--sand-light)] overflow-hidden">
                  <Image
                    src={urlFor(image1).width(1800).quality(85).url()}
                    alt={image1.alt ?? 'Eden Construction'}
                    width={1800}
                    height={1012}
                    className="static w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-150 bg-transparent"
                    sizes="(max-width: 768px) 100vw, 66vw"
                  />
                </AnimateOnScroll>
              </div>
            </div>
          </div>
        )}

        {/* Why Choose Us */}
        <section id="why-choose-us" className="border-t border-[var(--sand-light)]">
          <div className="why-choose-us-bg px-[10px] py-16 md:py-20">
            <h2 className="font-body-medium text-[var(--charcoal)] mb-4" style={{ fontSize: '20px' }}>
              Why Choose Us
            </h2>
            <div className="flex flex-col">
              {whyChooseUs.map((item, i) => (
                <div
                  key={item.title}
                  className="grid grid-cols-12 gap-x-6 gap-y-2 border-t border-black pt-5 pb-12 md:pt-5 md:pb-16 max-md:gap-y-3"
                >
                  <p className="col-span-2 m-0 font-body-medium text-[20px] text-[var(--charcoal)] leading-none">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <p className="col-span-10 md:col-span-4 m-0 font-body-medium text-[20px] text-[var(--charcoal)] md:col-start-3">
                    {item.title}
                  </p>
                  <p className="col-span-12 md:col-span-6 md:col-start-7 m-0 font-normal text-base md:text-[20px] text-[var(--charcoal)] leading-relaxed md:leading-[20px] mt-2 md:mt-0 mr-[calc(100%/12)] max-md:mr-0">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialsSection
          quotes={quotes}
          fallback={{ quote: fallbackTestimonial.quote, author: fallbackTestimonial.author }}
        />
      </main>
    </>
  )
}
