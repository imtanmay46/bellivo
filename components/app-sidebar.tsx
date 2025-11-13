"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Library, Heart, Plus, Mic } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { getAccessToken } from "@/lib/spotify-auth"

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
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [playlistName, setPlaylistName] = useState("")
  const [playlistDescription, setPlaylistDescription] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [creating, setCreating] = useState(false)

  const handleCreatePlaylist = async () => {
    if (!playlistName.trim()) return

    setCreating(true)
    try {
      const token = getAccessToken()
      if (!token) {
        console.error("[v0] No access token available")
        return
      }

      // Get user profile first
      const profileRes = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const profile = await profileRes.json()

      // Create playlist
      const response = await fetch(`https://api.spotify.com/v1/users/${profile.id}/playlists`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: playlistName,
          description: playlistDescription,
          public: isPublic,
        }),
      })

      if (response.ok) {
        console.log("[v0] Playlist created successfully")
        setShowCreateDialog(false)
        setPlaylistName("")
        setPlaylistDescription("")
        setIsPublic(false)
        // Refresh the page or redirect
        window.location.href = "/collection/playlists"
      }
    } catch (error) {
      console.error("[v0] Failed to create playlist:", error)
    } finally {
      setCreating(false)
    }
  }

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-64 bg-black/95 backdrop-blur-xl border-r border-white/10 flex flex-col">
        <div className="p-6">
          <Link href="/home" className="flex items-center gap-2">
            <span className="text-3xl font-bold bg-gradient-to-r from-[#C9A86A] via-[#E8D4B8] to-[#C9A86A] bg-clip-text text-transparent tracking-tight">
              Bellivo
            </span>
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

          <button
            onClick={() => setShowCreateDialog(true)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors w-full mt-4"
          >
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

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-zinc-900 border-white/10">
          <DialogHeader>
            <DialogTitle>Create Playlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                placeholder="My Awesome Playlist"
                className="bg-white/5 border-white/10"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                value={playlistDescription}
                onChange={(e) => setPlaylistDescription(e.target.value)}
                placeholder="Add a description"
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="public"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="public" className="cursor-pointer">
                Make public
              </Label>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCreatePlaylist}
                disabled={creating}
                className="flex-1 bg-[#2ECC71] hover:bg-[#2ECC71]/90"
              >
                {creating ? "Creating..." : "Create"}
              </Button>
              <Button onClick={() => setShowCreateDialog(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
