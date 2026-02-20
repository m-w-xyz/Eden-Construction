'use client'

import { usePathname } from 'next/navigation'
import FooterWarm from './FooterWarm'

export default function ConditionalFooter() {
  const pathname = usePathname()
  if (pathname === '/' || pathname === '/contact') return null
  return <FooterWarm />
}
