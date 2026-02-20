import Image from 'next/image'

export default function FooterWarm() {
  return (
    <footer
      className="relative z-[-1] flex flex-col gap-[120px] text-[var(--color-black)] bg-[#B89566] h-[476px] max-md:h-auto pb-[10px]"
    >
      {/* ── Top row: left column tagline, right half = two equal columns from center ── */}
      <div className="grid grid-cols-2 gap-8 px-[10px] pt-[10px] pb-[120px] max-md:grid-cols-1 max-md:gap-6 max-md:pb-8">
        <p className="text-base max-md:mb-0">Solutions-based Building</p>
        <div className="flex min-w-0 max-md:flex-col max-md:gap-6">
          <div className="flex flex-1 min-w-0 flex-col items-start justify-start gap-0 font-normal">
            <p className="w-full text-base">Pacific Harbour, Fiji</p>
          </div>
          <div className="flex flex-1 min-w-0 flex-col items-start justify-start gap-0 font-normal max-md:gap-0">
            <p className="mb-0">
              <a href="mailto:finn@edenconstruction.org" className="text-base hover:opacity-50 transition-opacity inline-block py-0">
                finn@edenconstruction.org
              </a>
            </p>
            <p className="mb-0">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base hover:opacity-50 transition-opacity inline-block py-0"
              >
                Facebook
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* ── Full-width black logo (same as homepage top), aligned to bottom of footer ── */}
      <div className="mt-auto px-[10px] pb-[10px]">
        <Image
          src="/logo-black.svg"
          alt="Eden Construction"
          width={1420}
          height={82}
          className="w-full h-auto"
        />
      </div>
    </footer>
  )
}
