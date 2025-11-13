"use client"

import { motion } from "framer-motion"
import { Github, Twitter, Mail } from "lucide-react"

export function PremiumFooter() {
  return (
    <footer className="relative w-full border-t border-[#C9A86A]/20 bg-gradient-to-b from-[#0B0B0B] to-black">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-[#C9A86A] to-[#E8D4B8] bg-clip-text text-transparent">
              Bellivo
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your voice. Your music. Your vibe. The future of music streaming is here.
            </p>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-[#C9A86A] transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#C9A86A] transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#C9A86A] transition-colors">
                  Download
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#C9A86A] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#C9A86A]/20 hover:bg-[#C9A86A]/40 flex items-center justify-center text-[#C9A86A] transition-all"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#C9A86A]/20 hover:bg-[#C9A86A]/40 flex items-center justify-center text-[#C9A86A] transition-all"
              >
                <Github size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#C9A86A]/20 hover:bg-[#C9A86A]/40 flex items-center justify-center text-[#C9A86A] transition-all"
              >
                <Mail size={18} />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#C9A86A]/10 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© 2025 Bellivo. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#C9A86A] transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-[#C9A86A] transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-[#C9A86A] transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
