"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Heart, Play } from "lucide-react"
import { usePlayer } from "@/lib/player-context"
import Link from "next/link"
import Image from "next/image"

interface Song {
  id: string
  title: string
  artist: string
  album: string
  image_url: string
  preview_url: string | null
  duration_ms: number
}

export default function FavoritesPage() {
  const [likedSongs, setLikedSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const { playTrack, setQueue } = usePlayer()

  useEffect(() => {
    fetchLikedSongs()
  }, [])

  const fetchLikedSongs = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = "/auth/login"
        return
      }

      const { data, error } = await supabase.from("songs").select("*").limit(20)

      if (error) throw error
      setLikedSongs(data || [])
    } catch (error) {
      console.error("[v0] Failed to fetch liked songs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlaySong = (song: Song, index: number) => {
    setQueue(likedSongs)
    playTrack(song)
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] pb-32">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B0B0B]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
          <Link href="/home" className="flex items-center gap-2">
            <Image
              src="/images/bellivo-logo-dark.png"
              alt="Bellivo"
              width={40}
              height={40}
              className="h-10 w-auto object-contain"
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
            <Link href="/playlists" className="text-sm font-medium text-white/60 hover:text-white">
              Playlists
            </Link>
            <Link href="/favorites" className="text-sm font-medium text-white hover:text-[#C9A86A]">
              Favorites
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-screen-2xl px-4 py-8">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#2ECC71] to-[#27AE60]">
            <Heart className="h-8 w-8 text-white fill-current" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Liked Songs</h1>
            <p className="text-white/60">{likedSongs.length} songs</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-white/60">Loading...</div>
        ) : likedSongs.length > 0 ? (
          <div className="space-y-2">
            {likedSongs.map((song, index) => (
              <div
                key={song.id}
                className="group flex items-center gap-4 rounded-lg p-3 hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => handlePlaySong(song, index)}
              >
                <span className="w-8 text-center text-white/60">{index + 1}</span>
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded">
                  <Image
                    src={song.image_url || "/placeholder.svg?height=48&width=48"}
                    alt={song.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-white">{song.title}</p>
                  <p className="truncate text-sm text-white/60">{song.artist}</p>
                </div>
                <p className="hidden md:block text-sm text-white/60">{song.album}</p>
                <Play className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="mx-auto h-16 w-16 text-white/20 mb-4" />
            <p className="text-white/60">No liked songs yet. Like songs to add them here.</p>
          </div>
        )}
      </main>
    </div>
  )
}
