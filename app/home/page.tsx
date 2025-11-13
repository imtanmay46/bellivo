"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Play } from "lucide-react"
import { Input } from "@/components/ui/input"
import { usePlayer } from "@/lib/player-context"
import Link from "next/link"
import Image from "next/image"

interface Track {
  id: string
  title: string
  artist: string
  album: string
  image_url: string
  preview_url: string | null
  duration_ms: number
}

export default function HomePage() {
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get("search") || ""
  const autoplay = searchParams.get("autoplay") === "true"

  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [searchResults, setSearchResults] = useState<Track[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [featuredSongs, setFeaturedSongs] = useState<Track[]>([])
  const { playTrack, setQueue } = usePlayer()

  useEffect(() => {
    loadFeaturedSongs()
  }, [])

  useEffect(() => {
    if (initialSearch) {
      performSearch(initialSearch, autoplay)
    }
  }, [initialSearch, autoplay])

  const loadFeaturedSongs = async () => {
    try {
      const response = await fetch("/api/songs/featured")
      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Loaded featured songs:", data.songs?.length || 0)
        setFeaturedSongs(data.songs || [])
      }
    } catch (error) {
      console.error("[v0] Failed to load featured songs:", error)
    }
  }

  const performSearch = async (query: string, autoPlay = false) => {
    if (!query.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()

      console.log("[v0] Search results:", data.tracks?.length || 0)

      if (data.tracks && data.tracks.length > 0) {
        setSearchResults(data.tracks)
        setQueue(data.tracks)

        if (autoPlay && data.tracks[0]) {
          playTrack(data.tracks[0])
        }
      }
    } catch (error) {
      console.error("[v0] Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(searchQuery)
  }

  const handlePlayTrack = (track: Track, index: number) => {
    console.log("[v0] Playing track:", track.title)
    setQueue(searchResults.length > 0 ? searchResults : featuredSongs)
    playTrack(track)
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] pb-32">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B0B0B]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
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
            <Link href="/home" className="text-sm font-medium text-white hover:text-[#C9A86A]">
              Home
            </Link>
            <Link href="/explore" className="text-sm font-medium text-white/60 hover:text-white">
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
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
            <Input
              type="text"
              placeholder="Search for songs, artists, or albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 border-white/10 bg-white/5 pl-12 text-white placeholder:text-white/40"
            />
          </div>
        </form>

        {isSearching && <div className="text-center text-white/60">Searching...</div>}

        {searchResults.length > 0 && (
          <div>
            <h2 className="mb-4 text-2xl font-bold text-white">Search Results</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {searchResults.map((track, index) => (
                <div
                  key={track.id}
                  className="group relative cursor-pointer overflow-hidden rounded-lg bg-white/5 p-4 transition-all hover:bg-white/10"
                  onClick={() => handlePlayTrack(track, index)}
                >
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-md">
                    <Image
                      src={track.image_url || "/placeholder.svg?height=200&width=200"}
                      alt={track.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <h3 className="truncate font-medium text-white">{track.title}</h3>
                  <p className="truncate text-sm text-white/60">{track.artist}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!searchQuery && searchResults.length === 0 && featuredSongs.length > 0 && (
          <div>
            <h2 className="mb-4 text-2xl font-bold text-white">Featured Songs</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {featuredSongs.map((track, index) => (
                <div
                  key={track.id}
                  className="group relative cursor-pointer overflow-hidden rounded-lg bg-white/5 p-4 transition-all hover:bg-white/10"
                  onClick={() => handlePlayTrack(track, index)}
                >
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-md">
                    <Image
                      src={track.image_url || "/placeholder.svg?height=200&width=200"}
                      alt={track.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <h3 className="truncate font-medium text-white">{track.title}</h3>
                  <p className="truncate text-sm text-white/60">{track.artist}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!searchQuery && searchResults.length === 0 && featuredSongs.length === 0 && (
          <div className="text-center">
            <h2 className="mb-2 text-3xl font-bold text-white">Welcome to Bellivo</h2>
            <p className="text-white/60">Search for your favorite music or use voice commands</p>
          </div>
        )}
      </main>
    </div>
  )
}
