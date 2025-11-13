"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleNavigation = (link: string) => {
    if (link === "Login") {
      router.push("/auth/login")
    } else if (link === "Home") {
      router.push("/home")
    } else if (link === "Explore") {
      router.push("/explore")
    } else if (link === "Pricing") {
      router.push("/pricing")
    } else if (link === "Features") {
      router.push("/#features")
    } else {
      const element = document.getElementById(link.toLowerCase())
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
    setMobileMenuOpen(false)
  }

  const navLinks = ["Home", "Features", "Pricing", "Explore", "Login"]

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-md border-b border-[#C9A86A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/images/bellivo-logo-dark.png"
              alt="Bellivo"
              width={40}
              height={40}
              className="h-10 w-auto object-contain"
            />
            <span className="hidden sm:inline font-bold text-lg bg-gradient-to-r from-[#C9A86A] to-[#E8D4B8] bg-clip-text text-transparent">
              Bellivo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => handleNavigation(link)}
                className="text-gray-300 hover:text-[#C9A86A] transition-colors text-sm font-medium"
              >
                {link}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-[#C9A86A]"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-[#C9A86A]/10">
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => handleNavigation(link)}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:text-[#C9A86A] hover:bg-[#C9A86A]/5 rounded-lg transition-all text-sm"
              >
                {link}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
