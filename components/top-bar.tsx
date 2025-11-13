"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"

export function TopBar() {
  const router = useRouter()
  const [user, setUser] = useState<{ display_name: string; avatar_url?: string } | null>(null)

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => setUser(null))
  }, [])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
  }

  return (
    <header className="h-16 bg-gradient-to-b from-black/40 to-transparent backdrop-blur-sm flex items-center justify-between px-6">
      {/* Navigation Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.back()}
          className="p-2 bg-black/40 rounded-full text-white hover:bg-black/60 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => router.forward()}
          className="p-2 bg-black/40 rounded-full text-white hover:bg-black/60 transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 bg-black/40 hover:bg-black/60">
            {user?.avatar_url ? (
              <img src={user.avatar_url || "/placeholder.svg"} alt="Profile" className="w-6 h-6 rounded-full" />
            ) : (
              <User className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{user?.display_name || "User"}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-[#0B0B0B] border-white/10">
          <DropdownMenuItem asChild>
            <a href="/profile" className="cursor-pointer">
              <User className="w-4 h-4 mr-2" />
              Profile
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/settings" className="cursor-pointer">
              Settings
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-400">
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
