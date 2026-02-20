import type { Metadata } from 'next'
import { Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Nav from '@/components/Nav'
import { client } from '@/lib/sanity.client'
import { projectBySlugQuery, adjacentProjectsQuery, projectsQuery } from '@/lib/queries'
import { urlFor } from '@/lib/sanity.client'
import type { Project } from '@/types'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const projects: Pick<Project, 'slug'>[] = await client.fetch(
    `*[_type == "project" && defined(slug.current)]{ slug }`
  )
  return projects.map((p) => ({ slug: p.slug.current }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params
  const project: Project | null = await client.fetch(projectBySlugQuery, { slug })
  return { title: project?.title ?? 'Project' }
}

export default async function ProjectDetailPage(props: Props) {
  const { slug } = await props.params
  const project: Project | null = await client.fetch(projectBySlugQuery, { slug })

  if (!project) notFound()

  const adjacent: { prev: { title: string; slug: { current: string } } | null; next: { title: string; slug: { current: string } } | null } =
    await client.fetch(adjacentProjectsQuery, {
      slug,
      year: project.year ?? 0,
    })

  const heroImage = project.images?.[0]
  const galleryImages = project.images?.slice(1) ?? []

  const credits: { label: string; value: string }[] = [
    { label: 'Location', value: project.location ?? '—' },
    {
      label: 'Collaborators',
      value: project.collaborators?.length ? project.collaborators.join(', ') : '—',
    },
    { label: 'Size', value: project.size ?? '—' },
    { label: 'Architect', value: project.architect ?? '—' },
  ]

  return (
    <>
      <Nav />

      {/* Project hero banner — same as About/Process */}
      <div className="w-full pt-[var(--nav-height)]">
        <div className="group relative w-full aspect-[21/8] max-md:aspect-[1] bg-[#EDE5D9] overflow-hidden">
          {heroImage?.asset ? (
            <Image
              src={urlFor(heroImage).width(2400).quality(85).url()}
              alt={heroImage.alt ?? project.title}
              fill
              priority
              className="object-cover grayscale max-md:grayscale-0 group-hover:grayscale-0 transition-all duration-150 px-2.5 bg-transparent"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-[var(--sand-dark)]" />
          )}
        </div>
      </div>

      <main className="pb-0 bg-[var(--cream)]">
        {/* Header: 15px under image — Name col 1, Type col 4, Year col 7, arrows right; on mobile: title/category/year left, arrows top right */}
        <div className="flex flex-col gap-[120px] max-md:gap-12 px-[10px] pt-[15px] pb-[120px] max-md:pb-12 bg-[var(--cream)]" style={{ border: 'none' }}>
          <div className="grid grid-cols-12 gap-[10px] items-center max-md:grid-cols-2 max-md:grid-rows-[auto_auto_auto] max-md:gap-x-6 max-md:gap-y-1 max-md:items-start">
            <h2 className="col-span-12 md:col-span-3 md:col-start-1 max-md:col-start-1 max-md:row-start-1 font-body-medium text-[var(--charcoal)] leading-tight break-words text-[20px] max-md:text-[18px] md:text-[20px]">
              {project.title}
            </h2>
            <span className="col-span-12 md:col-span-1 md:col-start-4 max-md:col-start-1 max-md:row-start-2 font-body-medium text-[20px] max-md:text-[16px] text-[var(--charcoal)] capitalize">
              {project.category === 'residential' ? 'Residential' : 'Commercial'}
            </span>
            {project.year ? (
              <span className="col-span-12 md:col-span-1 md:col-start-7 max-md:col-start-1 max-md:row-start-3 font-body-medium text-[var(--charcoal)] max-md:w-auto text-[20px] max-md:text-[20px] md:text-[20px]" style={{ width: '200px' }}>
                Completed {project.year}
              </span>
            ) : null}
            <div className="col-span-12 md:col-start-10 md:col-span-3 flex items-center justify-center gap-3 justify-self-end pt-0 max-md:col-start-2 max-md:row-start-1 max-md:row-span-3 max-md:justify-self-end max-md:self-start max-md:gap-3">
                {adjacent.prev ? (
                  <Link
                    href={`/projects/${adjacent.prev.slug.current}`}
                    className="flex p-1.5 text-[var(--charcoal)] hover:opacity-50 transition-opacity"
                    aria-label="Previous project"
                  >
                    <svg width="24" height="24" viewBox="0 0 14 14" fill="none">
                      <path d="M13 7H1M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                ) : (
                  <span className="p-1.5 opacity-30" aria-hidden>
                    <svg width="24" height="24" viewBox="0 0 14 14" fill="none">
                      <path d="M13 7H1M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
                {adjacent.next ? (
                  <Link
                    href={`/projects/${adjacent.next.slug.current}`}
                    className="flex p-1.5 text-[var(--charcoal)] hover:opacity-50 transition-opacity"
                    aria-label="Next project"
                  >
                    <svg width="24" height="24" viewBox="0 0 14 14" fill="none">
                      <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                ) : (
                  <span className="p-1.5 opacity-30" aria-hidden>
                    <svg width="24" height="24" viewBox="0 0 14 14" fill="none">
                      <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
            </div>
          </div>

          {/* Two columns: Credits (1 col labels + 1 col values) + Description (indented from col 7) */}
          <div className="grid grid-cols-12 gap-x-[10px] gap-y-10 mt-12 md:mt-16 max-md:gap-y-8 max-md:mt-14">
            {/* Credits — two columns: labels left, details left-aligned */}
            <div className="col-span-12 md:col-span-2">
              <h2
                className="font-body-medium text-[var(--charcoal)] mb-8 max-md:mb-6 max-md:text-[20px]"
                style={{ fontSize: '16px' }}
              >
                Credits
              </h2>
              {credits.length > 0 ? (
                <dl className="grid grid-cols-[auto_1fr] gap-x-10 md:gap-x-16 gap-y-0 min-w-0 max-md:min-w-0 max-md:gap-x-4 max-md:gap-y-0">
                  {credits.map((c, i) => (
                    <Fragment key={i}>
                      <dt className="font-normal text-[20px] max-md:text-[16px] text-[var(--charcoal)] text-left">
                        {c.label}
                      </dt>
                      <dd className="font-normal text-[20px] max-md:text-[16px] text-[var(--charcoal)] text-left md:w-[200px] max-md:break-words">
                        {c.value}
                      </dd>
                    </Fragment>
                  ))}
                </dl>
              ) : (
                <p className="font-normal text-[20px] max-md:text-[16px] text-[var(--charcoal)]">—</p>
              )}
            </div>

            {/* Right: Description — indented 1 column (start col 7 like About) */}
            <div className="col-span-12 md:col-start-7 md:col-span-5 min-w-0 max-md:pt-2">
              {project.description ? (
                <div className="font-normal text-[20px] max-md:text-[16px] text-[var(--charcoal)] leading-relaxed whitespace-pre-line">
                  {project.description.split(/\n\n+/).filter(Boolean).map((paragraph, i) => (
                    <p key={i} className="mb-3 last:mb-0">
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Gallery */}
        {galleryImages.length > 0 && (
          <div id="gallery" className="px-[10px] pb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px]">
              {galleryImages.map((img, i) => (
                <div
                  key={i}
                  className={`group relative bg-[var(--sand-light)] overflow-hidden ${
                    i === 0 && galleryImages.length % 2 !== 0 ? 'md:col-span-2 aspect-[16/7]' : 'aspect-[4/3]'
                  }`}
                >
                  {img.asset && (
                    <Image
                      src={urlFor(img).width(1200).quality(80).url()}
                      alt={img.alt ?? `${project.title} — image ${i + 2}`}
                      width={1200}
                      height={900}
                      className="static w-full h-full object-cover grayscale max-md:grayscale-0 group-hover:grayscale-0 transition-all duration-150 bg-transparent"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  )}
                  {img.caption && (
                    <p className="absolute bottom-3 left-4 text-xs text-white/80 tracking-wide">
                      {img.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer: Previous Project / Next Project */}
        <div>
          <div className="px-[10px] pt-[15px] pb-[80px] flex items-center justify-between gap-[10px] bg-[var(--cream)] max-md:flex-wrap max-md:gap-4 max-md:pt-6 max-md:pb-[60px]" style={{ border: 'none' }}>
            {adjacent.prev ? (
              <Link
                href={`/projects/${adjacent.prev.slug.current}`}
                className="font-normal text-[20px] max-md:text-[16px] text-[var(--charcoal)] hover:opacity-50 transition-opacity py-2 max-md:min-h-[44px] max-md:flex max-md:items-center"
              >
                Previous Project
              </Link>
            ) : (
              <span />
            )}
            {adjacent.next ? (
              <Link
                href={`/projects/${adjacent.next.slug.current}`}
                className="font-normal text-[20px] max-md:text-[16px] text-[var(--charcoal)] hover:opacity-50 transition-opacity py-2 max-md:min-h-[44px] max-md:flex max-md:items-center"
              >
                Next Project
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </main>
    </>
  )
}
