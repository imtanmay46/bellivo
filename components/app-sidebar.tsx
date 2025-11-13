"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Home, Search, Library, Heart, Plus, Mic } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/collection", label: "Your Library", icon: Library },
]

const libraryItems = [
  { href: "/collection/playlists", label: "Playlists", icon: Library },
  { href: "/collection/tracks", label: "Liked Songs", icon: Heart },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-black/95 backdrop-blur-xl border-r border-white/10 flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Link href="/home" className="flex items-center gap-2">
          <Image src="/images/bellivo-logo-dark.png" alt="Bellivo" width={120} height={40} className="object-contain" />
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5",
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}

        {/* Create Playlist Button */}
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors w-full mt-4">
          <Plus className="w-5 h-5" />
          <span className="font-medium">Create Playlist</span>
        </button>

        {/* Voice Assistant Button */}
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#C9A86A] hover:text-white hover:bg-[#C9A86A]/10 transition-colors w-full">
          <Mic className="w-5 h-5" />
          <span className="font-medium">Voice Assistant</span>
        </button>

        {/* Library Section */}
        <div className="pt-6">
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Library</h3>
          {libraryItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  isActive ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5",
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Premium Badge */}
      <div className="p-4 border-t border-white/10">
        <div className="bg-gradient-to-r from-[#2ECC71]/20 to-[#C9A86A]/20 rounded-lg p-4 backdrop-blur-sm border border-[#C9A86A]/30">
          <p className="text-sm font-semibold text-white mb-1">Upgrade to Premium</p>
          <p className="text-xs text-gray-400 mb-3">Get unlimited skips and ad-free music</p>
          <Link
            href="/pricing"
            className="block text-center bg-[#C9A86A] text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-[#C9A86A]/90 transition"
          >
            Learn More
          </Link>
        </div>
      </div>
    </aside>
  )
}
