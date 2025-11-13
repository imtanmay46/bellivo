"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Plus, Music, Lock, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import Image from "next/image"

interface Playlist {
  id: string
  name: string
  description: string | null
  public: boolean
  image_url: string | null
  created_at: string
  song_count?: number
}

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newPlaylist, setNewPlaylist] = useState({ name: "", description: "", public: false })
  const supabase = createClient()

  useEffect(() => {
    fetchPlaylists()
  }, [])

  const fetchPlaylists = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = "/auth/login"
        return
      }

      const { data, error } = await supabase
        .from("playlists")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setPlaylists(data || [])
    } catch (error) {
      console.error("[v0] Failed to fetch playlists:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const createPlaylist = async () => {
    if (!newPlaylist.name.trim()) return

    setIsCreating(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase.from("playlists").insert({
        user_id: user.id,
        name: newPlaylist.name,
        description: newPlaylist.description || null,
        public: newPlaylist.public,
      })

      if (error) throw error

      setNewPlaylist({ name: "", description: "", public: false })
      fetchPlaylists()
    } catch (error) {
      console.error("[v0] Failed to create playlist:", error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] pb-32">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B0B0B]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
          <Link href="/home" className="flex items-center gap-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-11-12%20at%2011.49.57%E2%80%AFPM-GHy614Gx27cpKWz0KqgVpsLO3Qs2Qs.png"
              alt="Bellivo"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="text-xl font-bold text-[#C9A86A]">Bellivo</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/home" className="text-sm font-medium text-white/60 hover:text-white">
              Home
            </Link>
            <Link href="/explore" className="text-sm font-medium text-white/60 hover:text-white">
              Explore
            </Link>
            <Link href="/playlists" className="text-sm font-medium text-white hover:text-[#C9A86A]">
              Playlists
            </Link>
            <Link href="/favorites" className="text-sm font-medium text-white/60 hover:text-white">
              Favorites
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-screen-2xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">Your Playlists</h1>
            <p className="mt-2 text-white/60">Create and manage your music collections</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#C9A86A] hover:bg-[#B89858]">
                <Plus className="mr-2 h-5 w-5" />
                Create Playlist
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1A1A1A] border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Playlist</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">
                    Playlist Name
                  </Label>
                  <Input
                    id="name"
                    value={newPlaylist.name}
                    onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
                    placeholder="My Awesome Playlist"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-white">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="description"
                    value={newPlaylist.description}
                    onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
                    placeholder="Add a description..."
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="public" className="text-white">
                    Make Public
                  </Label>
                  <Switch
                    id="public"
                    checked={newPlaylist.public}
                    onCheckedChange={(checked) => setNewPlaylist({ ...newPlaylist, public: checked })}
                  />
                </div>
                <Button
                  onClick={createPlaylist}
                  disabled={isCreating || !newPlaylist.name.trim()}
                  className="w-full bg-[#2ECC71] hover:bg-[#27AE60]"
                >
                  {isCreating ? "Creating..." : "Create Playlist"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center text-white/60">Loading playlists...</div>
        ) : playlists.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {playlists.map((playlist) => (
              <Link
                key={playlist.id}
                href={`/playlists/${playlist.id}`}
                className="group relative overflow-hidden rounded-lg bg-white/5 p-4 transition-all hover:bg-white/10"
              >
                <div className="relative mb-3 aspect-square overflow-hidden rounded-md bg-white/5 flex items-center justify-center">
                  {playlist.image_url ? (
                    <Image
                      src={playlist.image_url || "/placeholder.svg"}
                      alt={playlist.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Music className="h-16 w-16 text-white/20" />
                  )}
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="truncate font-medium text-white">{playlist.name}</h3>
                    <p className="truncate text-sm text-white/60">{playlist.song_count || 0} songs</p>
                  </div>
                  {playlist.public ? (
                    <Globe className="h-4 w-4 text-white/40" />
                  ) : (
                    <Lock className="h-4 w-4 text-white/40" />
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Music className="mx-auto h-16 w-16 text-white/20 mb-4" />
            <p className="text-white/60">No playlists yet. Create your first playlist!</p>
          </div>
        )}
      </main>
    </div>
  )
}
