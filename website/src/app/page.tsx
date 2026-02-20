import Image from 'next/image'
import { client } from '@/lib/sanity.client'
import { homepageImageQuery } from '@/lib/queries'
import { urlFor } from '@/lib/sanity.client'
import type { HomepageImageDoc } from '@/types'
import Nav from '@/components/Nav'
import SplashScreen from '@/components/SplashScreen'
import HomepageTopLoaded from '@/components/HomepageTopLoaded'

export const revalidate = 60

export default async function HomePage() {
  const data: HomepageImageDoc | null = await client.fetch(homepageImageQuery)

  return (
    <>
      {/* Opaque from first frame so no flash; SplashScreen slides it up after delay */}
      <div
        id="splash-cover"
        className="fixed inset-0 z-[9999] pointer-events-none"
        style={{
          backgroundColor: '#151D2E',
          opacity: 1,
        }}
      />
      {/* Client: handles the slide-up after top of page has loaded */}
      <SplashScreen />

      {/* Page content — starts invisible, revealed as splash slides away */}
      <div id="page-content" style={{ opacity: 0 }}>
        <Nav overlay />
        <main className="relative w-full h-dvh min-h-screen overflow-hidden bg-[var(--charcoal)]">
          {data?.image?.asset ? (
            <Image
              id="hero-image"
              src={urlFor(data.image).width(2400).quality(85).url()}
              alt={data.image.alt ?? 'Eden Construction'}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-[var(--sand-dark)]" />
          )}
        <HomepageTopLoaded />

          {/* Subtle dark gradient at bottom for legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" style={{ left: '-2px', top: '-1px' }} />

        </main>
      </div>
    </>
  )
}
