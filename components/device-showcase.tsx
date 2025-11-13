"use client"

import { motion } from "framer-motion"
import { WaveformAnimation } from "./waveform-animation"

export function DeviceShowcase() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Experience Bellivo</h2>
          <p className="text-xl text-gray-400">Designed for every device. Listen everywhere.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative w-64 h-96">
              {/* Phone frame */}
              <div className="absolute inset-0 bg-black rounded-3xl shadow-2xl border-8 border-gray-900 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-[#0d0d0f] to-[#1a0a2e] flex flex-col items-center justify-between p-6">
                  <div className="w-full space-y-4">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#00FFA3] to-[#DC1FFF] rounded-full" />
                    <div className="text-center">
                      <p className="text-white font-bold">Until I Found You</p>
                      <p className="text-gray-400 text-sm">Stephen Sanchez</p>
                    </div>
                  </div>
                  <WaveformAnimation />
                  <div className="w-full space-y-2">
                    <div className="h-2 bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] rounded-full" />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>1:23</span>
                      <span>3:45</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-white">Now Playing</h3>
              <p className="text-lg text-gray-300">
                Beautiful interface that shows album art, track information, and playback controls.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#00FFA3]" />
                <span className="text-gray-300">Real-time waveform visualization</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#DC1FFF]" />
                <span className="text-gray-300">Voice control integration</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#00FFA3]" />
                <span className="text-gray-300">Adaptive crossfades</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
