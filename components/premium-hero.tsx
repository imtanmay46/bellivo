"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Mic } from "lucide-react"
import { useRouter } from "next/navigation"
import { getAuthorizationUrl } from "@/lib/spotify-auth"

export function PremiumHero() {
  const [voiceActive, setVoiceActive] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    let animationId: number
    let time = 0

    const animate = () => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight

      ctx.fillStyle = "rgba(11, 11, 11, 0.1)"
      ctx.fillRect(0, 0, width, height)

      // Draw animated waves
      ctx.strokeStyle = "rgba(201, 168, 106, 0.3)"
      ctx.lineWidth = 2

      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        for (let x = 0; x < width; x += 10) {
          const y = height / 2 + Math.sin((x + time + i * 20) * 0.01) * 30 + Math.cos((time + i * 15) * 0.005) * 20
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      time += 1
      animationId = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationId)
  }, [])

  const handleGetStarted = async () => {
    const authUrl = await getAuthorizationUrl()
    window.location.href = authUrl
  }

  const handleVoiceDemo = async () => {
    setVoiceActive(!voiceActive)
    const authUrl = await getAuthorizationUrl()
    window.location.href = authUrl
  }

  return (
    <section className="relative min-h-screen w-full overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B] via-[#1a1a1f] to-[#0B0B0B]" />

      {/* Canvas animation background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40" />

      {/* Gold glow orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#C9A86A]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-20 w-80 h-80 bg-[#2ECC71]/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Floating mic icon with ripple */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          className="mb-12"
        >
          <div
            className={`relative w-24 h-24 flex items-center justify-center rounded-full transition-all duration-300 ${
              voiceActive
                ? "bg-gradient-to-br from-[#2ECC71] to-[#27AE60]"
                : "bg-gradient-to-br from-[#C9A86A] to-[#A6835C]"
            }`}
          >
            <Mic size={40} className="text-white" />

            {voiceActive && (
              <>
                <motion.div
                  animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute inset-0 rounded-full border-2 border-[#2ECC71]"
                />
                <motion.div
                  animate={{ scale: [1, 2], opacity: [1, 0] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
                  className="absolute inset-0 rounded-full border-2 border-[#2ECC71]"
                />
              </>
            )}
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white">Your Voice.</span>
            <br />
            <span className="bg-gradient-to-r from-[#C9A86A] via-[#E8D4B8] to-[#2ECC71] bg-clip-text text-transparent">
              Your Music.
            </span>
            <br />
            <span className="text-white">Your Vibe.</span>
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Stream music effortlessly with AI-powered voice control, multilingual support, and inclusive design.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="group relative px-8 py-4 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-full text-white font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-[#2ECC71]/50 transition-all"
            >
              <Play size={18} />
              Get Started
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#2ECC71] to-[#27AE60] opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVoiceDemo}
              className="px-8 py-4 border-2 border-[#C9A86A] text-[#C9A86A] rounded-full font-semibold hover:bg-[#C9A86A]/10 transition-all"
            >
              <Mic size={18} className="inline mr-2" />
              Try Voice Demo
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
