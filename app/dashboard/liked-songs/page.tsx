"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Heart } from "lucide-react"
import { PlaylistGrid } from "@/components/playlist-grid"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

interface Song {
  id: string
  title: string
  artist: string
  image_url?: string
  duration_ms?: number
}

export default function LikedSongsPage() {
  const [likedSongs, setLikedSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchLikedSongs = async () => {
      try {
        const { data, error } = await supabase.from("song_likes").select("song:songs(*)").limit(20)

        if (error) throw error
        const songs = data?.map((like: any) => like.song).filter(Boolean) || []
        setLikedSongs(songs)
      } catch (error) {
        console.error("Failed to fetch liked songs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLikedSongs()
  }, [supabase])

  const handlePlaySong = (song: Song) => {
    console.log("Playing:", song.title)
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <DashboardSidebar />

      <main className="flex-1 flex flex-col md:ml-64">
        <header className="border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-30">
          <div className="p-6 flex items-center gap-3">
            <Heart className="w-8 h-8 text-green-600 fill-green-600" />
            <div>
              <h1 className="text-3xl font-bold text-white">Liked Songs</h1>
              <p className="text-muted-foreground">Your favorite tracks</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pb-32">
          <div className="p-6">
            {isLoading ? (
              <div className="text-muted-foreground">Loading liked songs...</div>
            ) : likedSongs.length > 0 ? (
              <PlaylistGrid songs={likedSongs} onPlaySong={handlePlaySong} />
            ) : (
              <div className="text-muted-foreground text-center py-12">
                No liked songs yet. Like songs to add them here.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
