"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { SearchBar } from "@/components/search-bar"
import { PlaylistGrid } from "@/components/playlist-grid"
import { Sidebar } from "@/components/sidebar"
import { NowPlaying } from "@/components/now-playing"
import { VoiceButton } from "@/components/voice-button"

interface Song {
  id: string
  title: string
  artist: string
  image_url?: string
  duration_ms?: number
}

export default function ExplorePage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([])
  const [currentSong, setCurrentSong] = useState<Song | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const { data, error } = await supabase.from("songs").select("*")

        if (error) throw error
        setSongs(data || [])
        setFilteredSongs(data || [])
      } catch (error) {
        console.error("Failed to fetch songs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSongs()
  }, [supabase])

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredSongs(songs)
      return
    }

    const lowerQuery = query.toLowerCase()
    const results = songs.filter(
      (song) =>
        song.title.toLowerCase().includes(lowerQuery) ||
        song.artist.toLowerCase().includes(lowerQuery) ||
        song.album?.toLowerCase().includes(lowerQuery),
    )

    setFilteredSongs(results)
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <main className="flex-1 flex flex-col md:ml-64">
        {/* Header */}
        <header className="border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-30">
          <div className="p-6 space-y-4">
            <h1 className="text-3xl font-bold text-white">Explore</h1>
            <SearchBar onSearch={handleSearch} />
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-32">
          <div className="p-6 space-y-8">
            {isLoading ? (
              <div className="text-muted-foreground">Loading songs...</div>
            ) : filteredSongs.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">{filteredSongs.length} Songs Found</h2>
                <PlaylistGrid songs={filteredSongs} onPlaySong={setCurrentSong} />
              </div>
            ) : (
              <div className="text-muted-foreground text-center py-12">No songs found. Try a different search.</div>
            )}
          </div>
        </div>
      </main>

      <div className="fixed bottom-24 right-6 z-50">
        <VoiceButton />
      </div>

      <NowPlaying song={currentSong} />
    </div>
  )
}
