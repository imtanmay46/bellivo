"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Music, Home, Compass, Heart, LogOut, Menu, X } from "lucide-react"

export function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <>
      {/* Mobile menu button */}
      <button onClick={() => setIsOpen(!isOpen)} className="fixed top-4 left-4 z-50 md:hidden">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 md:hidden z-40" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-card/50 backdrop-blur-xl border-r border-border/50 flex flex-col gap-6 p-6 transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
            <Music size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">Bellivo</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-white hover:bg-muted/20"
              onClick={() => setIsOpen(false)}
            >
              <Home size={20} />
              <span>Home</span>
            </Button>
          </Link>
          <Link href="/dashboard/explore">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-white hover:bg-muted/20"
              onClick={() => setIsOpen(false)}
            >
              <Compass size={20} />
              <span>Explore</span>
            </Button>
          </Link>
          <Link href="/dashboard/liked">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-white hover:bg-muted/20"
              onClick={() => setIsOpen(false)}
            >
              <Heart size={20} />
              <span>Liked Songs</span>
            </Button>
          </Link>
        </nav>

        {/* Playlists section */}
        <div className="border-t border-border/50 pt-4 flex-1">
          <h3 className="text-xs font-semibold text-muted-foreground mb-3 px-2">PLAYLISTS</h3>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            <Link href="/dashboard/playlist/favorites">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-muted-foreground hover:text-white hover:bg-muted/20"
                onClick={() => setIsOpen(false)}
              >
                Favorites
              </Button>
            </Link>
            <Link href="/dashboard/playlist/workout">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-muted-foreground hover:text-white hover:bg-muted/20"
                onClick={() => setIsOpen(false)}
              >
                Workout Mix
              </Button>
            </Link>
            <Link href="/dashboard/playlist/chill">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-muted-foreground hover:text-white hover:bg-muted/20"
                onClick={() => setIsOpen(false)}
              >
                Chill Vibes
              </Button>
            </Link>
          </div>
        </div>

        {/* Logout button */}
        <Button
          onClick={handleLogout}
          disabled={isLoading}
          className="w-full bg-red-600/20 text-red-500 hover:bg-red-600/30 border border-red-500/30"
        >
          <LogOut size={18} />
          {isLoading ? "Logging out..." : "Logout"}
        </Button>
      </aside>
    </>
  )
}
