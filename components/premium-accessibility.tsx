"use client"

import { motion } from "framer-motion"

export function PremiumAccessibility() {
  return (
    <section className="relative w-full py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B] via-[#1a1a1f] to-[#0B0B0B]" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center p-12 rounded-2xl backdrop-blur-md border border-[#C9A86A]/30 bg-gradient-to-br from-white/10 to-white/5"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#C9A86A]/20 to-[#2ECC71]/20 opacity-0 hover:opacity-100 rounded-2xl transition-opacity duration-300 -z-10 blur-xl" />

          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#C9A86A] to-[#2ECC71] bg-clip-text text-transparent">
              Music for Everyone
            </span>
          </h2>

          <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Designed for inclusivity. Bellivo empowers users of all abilities through voice and vision. Whether you
            prefer speaking or typing, controlling with a gesture or a click, our platform adapts to you.
          </p>

          <div className="mt-8 pt-8 border-t border-[#C9A86A]/20 flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 bg-[#C9A86A]/10 rounded-full text-sm text-[#C9A86A]">♿ Fully Accessible</span>
            <span className="px-4 py-2 bg-[#2ECC71]/10 rounded-full text-sm text-[#2ECC71]">🎙️ Voice First</span>
            <span className="px-4 py-2 bg-white/10 rounded-full text-sm text-gray-300">🌍 Multilingual</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
