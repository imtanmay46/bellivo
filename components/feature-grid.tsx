"use client"

import { motion } from "framer-motion"

interface FeatureProps {
  title: string
  description: string
  icon: string
  index: number
}

function FeatureCard({ title, description, icon, index }: FeatureProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300" />
      <div className="relative bg-[#1a1a2e]/40 backdrop-blur-md border border-gray-700/50 rounded-2xl p-8 h-full hover:border-[#00FFA3]/50 transition duration-300">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

export function FeatureGrid() {
  const features = [
    {
      title: "Voice-Driven Music Control",
      description: "Say it, and it plays. Control every beat with natural voice commands. No hands required.",
      icon: "🎤",
    },
    {
      title: "AI-Powered Automix & Crossfade",
      description: "Smart transitions between songs. Your AI assistant learns your taste and creates seamless flows.",
      icon: "🌊",
    },
    {
      title: "Effortless Playlist Creation",
      description: "Build playlists with voice. Just describe the mood, and Bellivo curates the perfect collection.",
      icon: "🎵",
    },
  ]

  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Bellivo Features</h2>
          <p className="text-xl text-gray-400">Everything you need to experience music your way.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
