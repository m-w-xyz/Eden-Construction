import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav'
import AnimateOnScroll from '@/components/AnimateOnScroll'
import ServicesAccordion from '@/components/ServicesAccordion'
import ValuesSection from '@/components/ValuesSection'
import { client } from '@/lib/sanity.client'
import { staffBiosQuery, aboutPageQuery } from '@/lib/queries'
import { urlFor } from '@/lib/sanity.client'
import type { StaffBio, SanityImage, ServiceItem } from '@/types'

export const metadata: Metadata = { title: 'About Us' }
export const revalidate = 60

const values = [
  {
    headline: 'Built on Trust',
    subheadline: 'Driven by Integrity',
    body: 'We believe trust is the foundation of every successful project. We build strong relationships through transparency, accountability, honest pricing, and an unwavering commitment to our clients.',
  },
  {
    headline: 'Unmatched Efficiency',
    subheadline: 'and smart execution',
    body: "We don't just build structures, we engineer solutions. Through advanced planning, we optimise every detail to deliver projects on time, on budget, and to the highest level of craftsmanship.",
  },
  {
    headline: 'Global Standards',
    subheadline: 'Upheld by local strength',
    body: 'Our approach blends New Zealand training and expertise with local knowledge, delivering a superior quality of construction to Fiji through smart sourcing and high standards.',
  },
]

export default async function AboutPage() {
  type AboutPageData = {
    hero: SanityImage
    image2: SanityImage
    image3: SanityImage
    image4: SanityImage
    statement1: string
    servicesIntroduction?: string
    servicesButtonText?: string
    servicesButtonLink?: string
    serviceItems?: ServiceItem[]
  }

  const [staff, aboutData] = await Promise.all([
    client.fetch<StaffBio[]>(staffBiosQuery),
    client.fetch<AboutPageData | null>(aboutPageQuery),
  ])

  const hero = aboutData?.hero
  const image2 = aboutData?.image2
  const image3 = aboutData?.image3
  const statement1 = aboutData?.statement1

  return (
    <>
      <Nav />

      {/* ── Hero image — full bleed, starts right below the fixed nav bar ── */}
      <div className="w-full pt-[var(--nav-height)]">
        <div className="group relative w-full h-[66vh] min-h-[200px] bg-[#EDE5D9] overflow-hidden">
          {hero?.asset ? (
            <Image
              src={urlFor(hero).width(2400).quality(85).url()}
              alt={hero.alt ?? 'Eden Construction'}
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

        {/* ── Intro — 12-col grid: title col 1, copy col 7–11, subnav col 12 ── */}
        <section className="segment-bg-cream px-[10px] py-10 md:py-12">
          <div className="grid grid-cols-12 gap-x-[10px] gap-y-[120px] items-start">

            {/* Col 1: page title + section links */}
            <div className="col-span-12 md:col-span-1 md:w-[150px]">
              <h2
                className="font-body-medium text-[var(--charcoal)] mb-4 text-[20px] md:text-[24px]"
              >
                About Us
              </h2>
              <nav className="flex flex-col gap-[2px] max-md:gap-0.5" aria-label="Page sections">
                {[
                  { href: '#services', label: 'Services' },
                  { href: '#team', label: 'Team' },
                  { href: '#values', label: 'Values' },
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

            {/* Col 7–11: intro copy */}
            <div className="col-span-12 md:col-start-7 md:col-span-5">
              <p className="mb-3 font-normal text-base md:text-[20px]">
                We're a Fiji-based building company delivering New Zealand
                standards and a solutions-driven approach to every project.
              </p>
              <p className="mb-3 indent-[4em] font-normal text-base md:text-[20px]">
                From bespoke homes to large-scale commercial builds, we focus on
                quality, precision, and efficiency at every stage.
              </p>
              <p className="mb-3 indent-[4em] font-normal text-base md:text-[20px]">
                Our experienced team thrives on collaboration and is committed to
                exceeding expectations, no matter the size or complexity of the
                job.
              </p>
              <p className="indent-[4em] font-normal text-base md:text-[20px]">
                Through strong local partnerships and international supply
                networks, we source premium materials at competitive rates,
                ensuring every build is completed to the highest standard, on
                time and within budget.
              </p>
            </div>


          </div>
        </section>

        {/* ── Image 2 ───────────────────────────────────────────────────── */}
        {image2?.asset && (
          <div className="segment-bg-cream px-[10px] py-10">
            <AnimateOnScroll className="relative w-[55vw] max-md:w-full mr-[25%] max-md:mr-0 aspect-[4/3] bg-[var(--sand-light)] overflow-hidden group">
              <Image
                src={urlFor(image2).width(1600).quality(85).url()}
                alt={image2.alt ?? 'Eden Construction'}
                width={1600}
                height={1200}
                className="static w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-150 bg-transparent"
                sizes="55vw"
              />
            </AnimateOnScroll>
          </div>
        )}

        {/* ── Statement + Image 3 ───────────────────────────────────────── */}
        {(statement1 || image3?.asset) && (
          <div className="segment-bg-cream flex items-end justify-start px-[10px] py-10 gap-[10px] max-md:flex-col max-md:items-stretch max-md:gap-6">
            {statement1 && (
              <p className="statement w-full text-[var(--charcoal)] mr-[calc((100%-110px)/12)] max-md:order-1">
                {statement1}
              </p>
            )}
            {image3?.asset && (
              <AnimateOnScroll direction="right" className="relative w-1/2 max-md:w-full shrink-0 h-[66vh] max-md:h-[45vh] bg-[var(--sand-light)] overflow-hidden group max-md:order-2">
                <Image
                  src={urlFor(image3).width(1400).quality(85).url()}
                  alt={image3.alt ?? 'Eden Construction'}
                  width={1400}
                  height={933}
                  className="static w-full h-full object-cover object-right grayscale group-hover:grayscale-0 transition-all duration-150 bg-transparent"
                  sizes="50vw"
                />
              </AnimateOnScroll>
            )}
          </div>
        )}

        {/* ── Services ──────────────────────────────────────────────────── */}
        <section id="services">
          <div className="segment-bg-cream px-[10px] py-20">

            {/* Header row */}
            <div className="grid grid-cols-12 gap-[10px] mb-14">
              <div className="col-span-12 md:col-span-6">
                <h2 className="font-body-medium text-[20px] md:text-[24px]">Services</h2>
              </div>
              <div className="col-span-12 md:col-start-7 md:col-span-5 flex flex-col gap-8">
                <p className="font-normal text-base md:text-[20px]">
                  {aboutData?.servicesIntroduction ??
                    'We partner with architects, engineers, trades, and suppliers to deliver every project with precision, quality, and efficiency — no matter the scale.'}
                </p>
                <div>
                  <Link
                    href={aboutData?.servicesButtonLink ?? '/process'}
                    className="inline-flex items-center gap-2 font-normal text-base md:text-[20px] md:leading-[20px] tracking-normal text-[var(--charcoal)] no-underline hover:opacity-50 transition-opacity"
                  >
                    {aboutData?.servicesButtonText ?? 'See our process'}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
                      <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Accordion */}
            <ServicesAccordion items={aboutData?.serviceItems ?? []} />

          </div>
        </section>

        {/* ── Image 4 ───────────────────────────────────────────────────── */}
        {aboutData?.image4?.asset && (
          <div className="segment-bg-cream px-[10px] py-20">
            <div className="grid grid-cols-12 gap-[10px]">
              <div className="col-start-1 col-span-12 md:col-start-5 md:col-span-7">
                <AnimateOnScroll direction="right" className="group relative ml-[25%] max-md:ml-0 aspect-[16/9] bg-[var(--sand-light)] overflow-hidden">
                  <Image
                    src={urlFor(aboutData.image4).width(1800).quality(85).url()}
                    alt={aboutData.image4.alt ?? 'Eden Construction'}
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

        {/* ── Management Team ───────────────────────────────────────────── */}
        <section id="team">
          <div className="segment-bg-warm px-[10px] py-20">

            {/* Header row — label left, descriptor at col-7 */}
            <div className="grid grid-cols-12 gap-[10px] mb-14">
              <div className="col-span-12 md:col-span-6">
                <h2 className="font-body-medium text-[20px] md:text-[24px]">Management Team</h2>
              </div>
              <div className="col-span-12 md:col-start-7 md:col-span-5">
                <p className="font-normal font-sans text-base md:text-[20px]">Local Expertise.</p>
              </div>
            </div>

            <div className="flex flex-col">
              {staff.length > 0 ? (
                staff.map((person) => (
                  <div
                    key={person._id}
                    className="grid grid-cols-12 gap-[10px] py-14 items-start"
                  >
                    {/* Image — 4 cols */}
                    <AnimateOnScroll className="col-span-12 md:col-span-4 group relative aspect-[3/4] bg-[var(--sand-light)] overflow-hidden">
                      {person.portrait?.asset ? (
                        <Image
                          src={urlFor(person.portrait).width(800).quality(85).url()}
                          alt={person.portrait.alt ?? person.name}
                          width={800}
                          height={1067}
                          className="static w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-150 bg-transparent"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[var(--sand)]" />
                      )}
                    </AnimateOnScroll>

                    {/* Text — starts at col 7 (50% mark) */}
                    <div className="col-span-12 md:col-start-7 md:col-span-5 flex flex-col">
                      <p className="font-bold text-base md:text-[20px] mb-1">{person.name}</p>
                      {person.title && (
                        <p className="mb-10 font-normal font-sans text-base md:text-[20px]">{person.title}</p>
                      )}
                      {person.bio && (
                        <p className="whitespace-pre-line mb-14 font-normal font-sans text-base md:text-[20px]">{person.bio}</p>
                      )}
                      <div className="flex flex-col gap-2 max-md:gap-3">
                        {person.fijiPhone && (
                          <p className="flex gap-16 max-md:gap-4 flex-wrap font-normal font-sans text-base md:text-[20px]">
                            <span>Fiji</span>
                            <a href={`tel:${person.fijiPhone}`} className="hover:opacity-50 transition-opacity py-1">
                              {person.fijiPhone}
                            </a>
                          </p>
                        )}
                        {person.nzPhone && (
                          <p className="flex gap-16 max-md:gap-4 flex-wrap font-normal font-sans text-base md:text-[20px]">
                            <span>NZ</span>
                            <a href={`tel:${person.nzPhone}`} className="hover:opacity-50 transition-opacity py-1">
                              {person.nzPhone}
                            </a>
                          </p>
                        )}
                        {person.email && (
                          <p className="flex gap-16 max-md:gap-4 flex-wrap font-normal font-sans text-base md:text-[20px]">
                            <span>Email</span>
                            <a href={`mailto:${person.email}`} className="hover:opacity-50 transition-opacity py-1">
                              {person.email}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-16">Team bios coming soon.</p>
              )}
            </div>
          </div>
        </section>

        {/* ── Values ───────────────────────────────────────────────────── */}
        <section id="values">
          <div className="about-values-section-bg px-[10px] py-20">
            <h2 className="font-body-medium mb-14 text-[20px] md:text-[24px]">Values</h2>

            <ValuesSection values={values} />
          </div>
        </section>

      </main>
    </>
  )
}
