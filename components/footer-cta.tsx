"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function FooterCTA() {
  const socialIcons = [
    { name: "Spotify", icon: "🎵" },
    { name: "Apple Music", icon: "🍎" },
    { name: "YouTube", icon: "▶️" },
  ]

  return (
    <footer className="py-24 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
          <div className="relative bg-[#1a1a2e]/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Music, reimagined for every listener.</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users experiencing the future of music streaming. Control with your voice. Discover by
              mood.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/auth/sign-up">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-[#00FFA3] to-[#00D67F] text-black font-bold rounded-full hover:shadow-lg transition duration-300"
                >
                  Get Started
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border-2 border-gray-500 text-gray-300 font-bold rounded-full hover:border-[#00FFA3] hover:text-[#00FFA3] transition duration-300"
              >
                Explore Demo
              </motion.button>
            </div>

            {/* Social icons */}
            <div className="flex justify-center gap-6 pt-8 border-t border-gray-700/50">
              {socialIcons.map((social) => (
                <motion.button
                  key={social.name}
                  whileHover={{ scale: 1.2 }}
                  className="text-gray-500 hover:text-[#00FFA3] text-2xl transition duration-300"
                  title={social.name}
                >
                  {social.icon}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Coming soon badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 text-sm">Coming soon to iOS & Android. Web app available now.</p>
        </motion.div>
      </div>
    </footer>
  )
}
