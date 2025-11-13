"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"

const premiumFeatures = [
  "Multilingual LLM support",
  "Crossfade & Automix",
  "Complex playlist commands",
  "Ad-free experience",
  "Priority voice processing",
  "Custom voice preferences",
]

export function PremiumPricing() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push("/home")
  }

  return (
    <section className="relative w-full py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1f] via-[#0B0B0B] to-[#1a1a1f]" />

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A86A]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2ECC71]/10 rounded-full blur-3xl" />

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
              Upgrade to Bellivo Premium
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Unlock the full potential of voice-controlled music streaming.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative p-8 sm:p-12 rounded-2xl backdrop-blur-md border border-[#C9A86A]/30 bg-gradient-to-br from-white/10 to-white/5 hover:border-[#C9A86A]/60 transition-all duration-300">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#C9A86A] to-[#2ECC71] rounded-full text-sm font-bold text-black">
              Premium
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-[#C9A86A]/20 to-[#2ECC71]/20 opacity-0 hover:opacity-100 rounded-2xl transition-opacity duration-300 -z-10 blur-xl" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {premiumFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#2ECC71] to-[#27AE60] flex items-center justify-center">
                    <Check size={16} className="text-white" />
                  </div>
                  <span className="text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="w-full py-4 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white font-bold rounded-full hover:shadow-lg hover:shadow-[#2ECC71]/50 transition-all"
            >
              Get Started
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
