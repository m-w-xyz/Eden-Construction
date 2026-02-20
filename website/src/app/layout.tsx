import type { Metadata } from 'next'
import './globals.css'
import PageTransition from '@/components/PageTransition'
import ConditionalFooter from '@/components/ConditionalFooter'

export const metadata: Metadata = {
  title: {
    default: 'Eden Construction',
    template: '%s | Eden Construction',
  },
  description:
    'A Fiji-based building company delivering New Zealand standards and a solutions-driven approach to every project.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/AktivGroteskEx-Bold.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/HelveticaNeue-Medium.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/HelveticaNeue-Roman.otf" as="font" type="font/otf" crossOrigin="anonymous" />
      </head>
      <body>
        <PageTransition>
          {children}
          <ConditionalFooter />
        </PageTransition>
      </body>
    </html>
  )
}
