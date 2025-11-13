"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { NowPlaying } from "@/components/now-playing"
import { PlaylistGrid } from "@/components/playlist-grid"
import { VoiceButton } from "@/components/voice-button"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { VoiceAssistantPanel } from "@/components/voice-assistant-panel"

interface Song {
  id: string
  title: string
  artist: string
  image_url?: string
  duration_ms?: number
}

export default function DashboardPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [currentSong, setCurrentSong] = useState<Song | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const { data, error } = await supabase.from("songs").select("*").limit(20)

        if (error) throw error
        setSongs(data || [])
      } catch (error) {
        console.error("Failed to fetch songs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSongs()
  }, [supabase])

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song)
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content */}
      <main className="flex-1 flex flex-col md:ml-64">
        {/* Header */}
        <header className="border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-30">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-white">Home</h1>
            <p className="text-muted-foreground">Welcome to your music library</p>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto pb-32">
          <div className="p-6 space-y-8">
            {/* Recently played section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Recently Played</h2>
                <Link href="/dashboard/explore">
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-500 hover:bg-green-600/10 bg-transparent"
                  >
                    See All
                  </Button>
                </Link>
              </div>
              {isLoading ? (
                <div className="text-muted-foreground">Loading songs...</div>
              ) : songs.length > 0 ? (
                <PlaylistGrid songs={songs.slice(0, 10)} onPlaySong={handlePlaySong} />
              ) : (
                <div className="text-muted-foreground">No songs available</div>
              )}
            </div>

            {/* Popular section */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Popular Now</h2>
              {songs.length > 0 && <PlaylistGrid songs={songs.slice(10, 20)} onPlaySong={handlePlaySong} />}
            </div>
          </div>
        </div>
      </main>

      {/* Voice button - floating */}
      <div className="fixed bottom-24 right-6 z-50">
        <VoiceButton onRecordingComplete={(blob) => console.log("Recording:", blob)} />
      </div>

      {/* Voice assistant panel for voice output and confirmations */}
      <VoiceAssistantPanel />

      {/* Now playing */}
      <NowPlaying song={currentSong} />
    </div>
  )
}
