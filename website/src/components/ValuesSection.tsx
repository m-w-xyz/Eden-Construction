'use client'

import { motion } from 'framer-motion'

type Value = {
  headline: string
  subheadline: string
  body: string
}

interface Props {
  values: Value[]
}

export default function ValuesSection({ values }: Props) {
  return (
    <div className="flex flex-col">
      {values.map((v, i) => (
        <motion.div
          key={v.headline}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.75, ease: [0.42, 0, 0.58, 1], delay: i * 0.1 }}
          className="grid grid-cols-12 gap-[10px] border-t border-black max-md:gap-y-4"
        >
          {/* Left — headline + subheadline, 1 col gap on right */}
          <div className="col-span-12 md:col-span-5 pt-5 pb-20 max-md:pb-2.5 flex items-start justify-start">
            <p
              className="font-display uppercase text-[20px] md:text-[clamp(28px,3.2vw,44px)]"
              style={{ lineHeight: '0.9', letterSpacing: '-0.02em' }}
            >
              {v.headline}
              <br />
              {v.subheadline}
            </p>
          </div>

          {/* Right — 80px padding, 1 col gap on right */}
          <div className="col-span-12 md:col-start-7 md:col-span-5">
            <p className="pt-2.5 pb-20 max-md:pb-[60px] mt-5 font-normal text-base">{v.body}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
