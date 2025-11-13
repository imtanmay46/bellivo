"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center pt-20 pb-20">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d0f] via-[#1a0a2e] to-[#0f0f1e]" />
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#00FFA3] to-[#DC1FFF] rounded-full mix-blend-screen opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#DC1FFF] to-[#00FFA3] rounded-full mix-blend-screen opacity-15 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            delay: 1,
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="relative w-24 h-24 mx-auto mb-6">
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00FFA3] to-[#DC1FFF] opacity-30 blur-xl"
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#00FFA3] to-[#DC1FFF] flex items-center justify-center text-white font-bold text-3xl">
              ♪
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-balance">
            <span className="bg-gradient-to-r from-[#00FFA3] via-white to-[#DC1FFF] bg-clip-text text-transparent">
              Your Music. Your Voice.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto text-balance">
            Stream, discover, and control your favorite music with your voice — powered by AI.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
        >
          <Link href="/auth/sign-up">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300" />
              <button className="relative px-10 py-3 bg-black rounded-full font-semibold text-white hover:shadow-2xl transition duration-300">
                Try for Free
              </button>
            </motion.div>
          </Link>
          <Link href="/auth/login">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button className="px-10 py-3 border-2 border-[#00FFA3] text-[#00FFA3] rounded-full font-semibold hover:bg-[#00FFA3]/10 backdrop-blur-sm transition duration-300">
                Login
              </button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
