"use client"

import { motion } from "framer-motion"
import { Mic2, Wand2, Globe } from "lucide-react"

const features = [
  {
    icon: Mic2,
    title: "Voice Intelligence",
    description: "Control your music hands-free using natural voice commands. Say it, and Bellivo understands.",
  },
  {
    icon: Wand2,
    title: "Premium Automix",
    description: "Seamless crossfade and smart transitions for uninterrupted listening. Your flow, perfected.",
  },
  {
    icon: Globe,
    title: "Multilingual Magic",
    description: "Speak in any language — we'll understand and respond. Music knows no boundaries.",
  },
]

export function PremiumFeatures() {
  return (
    <section className="relative w-full py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B] via-[#1a1a1f] to-[#0B0B0B]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#C9A86A] to-[#2ECC71] bg-clip-text text-transparent">
              Powerful Features
            </span>
            <span className="text-white"> for Your Music</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group relative p-8 rounded-2xl backdrop-blur-md border border-[#C9A86A]/20 hover:border-[#C9A86A]/50 bg-white/5 hover:bg-white/10 transition-all duration-300"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#C9A86A]/20 to-[#2ECC71]/20 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 -z-10 blur-xl" />

                <div className="mb-4 p-4 w-fit rounded-xl bg-gradient-to-br from-[#C9A86A]/30 to-[#2ECC71]/20 group-hover:from-[#C9A86A]/50 group-hover:to-[#2ECC71]/30 transition-all">
                  <Icon size={28} className="text-[#C9A86A]" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>

                {/* Decorative line */}
                <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-1 bg-gradient-to-r from-[#C9A86A] to-[#2ECC71] rounded-full transition-all duration-500" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
