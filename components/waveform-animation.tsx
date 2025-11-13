"use client"

import { motion } from "framer-motion"

export function WaveformAnimation() {
  const bars = Array.from({ length: 24 })

  return (
    <div className="flex items-end justify-center gap-1 h-32">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-full bg-gradient-to-t from-[#DC1FFF] to-[#00FFA3]"
          animate={{
            height: [8, 32, 16, 24, 8],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.08,
          }}
        />
      ))}
    </div>
  )
}
