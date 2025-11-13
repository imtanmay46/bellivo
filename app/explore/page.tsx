"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Play, TrendingUp } from "lucide-react"
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

export default function ExplorePage() {
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([])
  const [recentlyAdded, setRecentlyAdded] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const { playTrack, setQueue } = usePlayer()

  useEffect(() => {
    fetchSongs()
  }, [])

  const fetchSongs = async () => {
    try {
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20)

      if (error) throw error

      setTrendingSongs(data?.slice(0, 10) || [])
      setRecentlyAdded(data?.slice(10) || [])
    } catch (error) {
      console.error("[v0] Failed to fetch songs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlaySong = (song: Song, songs: Song[]) => {
    setQueue(songs)
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
            <Link href="/explore" className="text-sm font-medium text-white hover:text-[#C9A86A]">
              Explore
            </Link>
            <Link href="/playlists" className="text-sm font-medium text-white/60 hover:text-white">
              Playlists
            </Link>
            <Link href="/favorites" className="text-sm font-medium text-white/60 hover:text-white">
              Favorites
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-screen-2xl px-4 py-8">
        <div className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-[#2ECC71]" />
            <h2 className="text-3xl font-bold text-white">Trending Now</h2>
          </div>

          {isLoading ? (
            <div className="text-white/60">Loading...</div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {trendingSongs.map((song) => (
                <div
                  key={song.id}
                  className="group relative cursor-pointer overflow-hidden rounded-lg bg-white/5 p-4 transition-all hover:bg-white/10"
                  onClick={() => handlePlaySong(song, trendingSongs)}
                >
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-md">
                    <Image
                      src={song.image_url || "/placeholder.svg?height=200&width=200"}
                      alt={song.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <h3 className="truncate font-medium text-white">{song.title}</h3>
                  <p className="truncate text-sm text-white/60">{song.artist}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-6 text-3xl font-bold text-white">Recently Added</h2>
          <div className="space-y-2">
            {recentlyAdded.map((song, index) => (
              <div
                key={song.id}
                className="group flex items-center gap-4 rounded-lg p-3 hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => handlePlaySong(song, recentlyAdded)}
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
        </div>
      </main>
    </div>
  )
}
