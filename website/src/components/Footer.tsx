import Link from 'next/link'
import Image from 'next/image'

type FooterVariant = 'default' | 'warm' | 'sand'

export default function Footer({ variant = 'default' }: { variant?: FooterVariant }) {
  const bgClass =
    variant === 'sand' ? 'bg-[#B8A68F]' : variant === 'warm' ? 'bg-[#B89566]' : 'bg-[#B89566]'
  return (
    <footer
      className={`flex flex-col text-[var(--color-black)] ${bgClass}`}
      style={{ height: '476px' }}
    >
      {/* ── Top row: left column tagline, right half = two equal columns from center ── */}
      <div className="grid grid-cols-2 gap-8 px-[10px] pt-[10px] pb-[120px]">
        <p>Solutions-based Building</p>
        <div className="flex min-w-0">
          <div className="flex flex-1 min-w-0 flex-col items-start justify-start gap-0">
            <p className="w-full">Pacific Harbour, Fiji</p>
          </div>
          <div className="flex flex-1 min-w-0 flex-col items-start justify-start gap-0">
            <p>
              <a href="mailto:finn@edenconstruction.org" className="hover:opacity-50 transition-opacity">
                finn@edenconstruction.org
              </a>
            </p>
            <p>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-50 transition-opacity"
              >
                Facebook
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* ── Full-width black logo (same as homepage top), aligned to bottom of footer ── */}
      <div className="mt-auto px-[10px] pb-[10px]">
        <Link href="/" className="block hover:opacity-50 transition-opacity">
          <Image
            src="/logo-black.svg"
            alt="Eden Construction"
            width={1420}
            height={82}
            className="w-full h-auto"
          />
        </Link>
      </div>
    </footer>
  )
}
