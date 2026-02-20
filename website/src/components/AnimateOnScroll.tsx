'use client'

import { motion } from 'framer-motion'

type AnimateOnScrollProps = {
  children: React.ReactNode
  className?: string
  direction?: 'left' | 'right'
  /** When true, animation triggers when element reaches 50% down the viewport (50vh) */
  triggerAtHalfViewport?: boolean
}

export default function AnimateOnScroll({
  children,
  className,
  direction = 'left',
  triggerAtHalfViewport = false,
}: AnimateOnScrollProps) {
  const xOffset = direction === 'right' ? 24 : -24
  const viewport = triggerAtHalfViewport
    ? { once: true, amount: 0, margin: '0px 0px -50% 0px' as const }
    : { once: true, amount: 0.8 }
  return (
    <motion.div
      initial={{ opacity: 0, x: xOffset }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={viewport}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
