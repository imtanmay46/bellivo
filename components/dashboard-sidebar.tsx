"use client"

import { Home, Compass, Music, Heart, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

const navItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Explore", href: "/dashboard/explore", icon: Compass },
  { label: "Playlists", href: "/dashboard/playlists", icon: Music },
  { label: "Liked Songs", href: "/dashboard/liked-songs", icon: Heart },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <aside className="hidden md:fixed md:left-0 md:top-0 md:w-64 md:h-screen md:bg-card/50 md:backdrop-blur-xl md:border-r md:border-border/50 md:flex md:flex-col md:p-6 md:gap-8">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
          <Music className="w-6 h-6 text-white" />
        </div>
        <span className="font-bold text-lg text-white">Bellivo</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-green-600/20 text-green-500 border border-green-600/50"
                    : "text-muted-foreground hover:bg-card/50 hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      <div className="space-y-2 pt-6 border-t border-border/50">
        <Link href="/dashboard/settings">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-card/50 hover:text-foreground transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </div>
        </Link>
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-red-600/10 hover:text-red-500 transition-colors disabled:opacity-50"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">{isLoading ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    </aside>
  )
}
