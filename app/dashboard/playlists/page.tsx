"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { PlaylistManager } from "@/components/playlist-manager"
import { Sidebar } from "@/components/sidebar"
import { NowPlaying } from "@/components/now-playing"
import { VoiceButton } from "@/components/voice-button"
import { useToast } from "@/hooks/use-toast"

interface Playlist {
  id: string
  name: string
  description?: string
  public: boolean
  image_url?: string
  user_id?: string
}

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        const { data, error } = await supabase
          .from("playlists")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        setPlaylists(data || [])
      } catch (error) {
        console.error("Failed to fetch playlists:", error)
        toast({
          title: "Error",
          description: "Failed to load playlists",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlaylists()
  }, [supabase, toast])

  const handleCreatePlaylist = async (name: string, description?: string, isPublic?: boolean) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data: newPlaylist, error } = await supabase
        .from("playlists")
        .insert({
          user_id: user.id,
          name,
          description,
          public: isPublic || false,
        })
        .select()
        .single()

      if (error) throw error

      setPlaylists([newPlaylist, ...playlists])
      toast({
        title: "Success",
        description: `Playlist "${name}" created successfully`,
      })
    } catch (error) {
      console.error("Failed to create playlist:", error)
      toast({
        title: "Error",
        description: "Failed to create playlist",
        variant: "destructive",
      })
    }
  }

  const handleUpdatePlaylist = async (id: string, name: string, description?: string, isPublic?: boolean) => {
    try {
      const { error } = await supabase
        .from("playlists")
        .update({
          name,
          description,
          public: isPublic || false,
        })
        .eq("id", id)

      if (error) throw error

      setPlaylists(playlists.map((p) => (p.id === id ? { ...p, name, description, public: isPublic || false } : p)))

      toast({
        title: "Success",
        description: "Playlist updated",
      })
    } catch (error) {
      console.error("Failed to update playlist:", error)
      toast({
        title: "Error",
        description: "Failed to update playlist",
        variant: "destructive",
      })
    }
  }

  const handleDeletePlaylist = async (id: string) => {
    try {
      const { error } = await supabase.from("playlists").delete().eq("id", id)

      if (error) throw error

      setPlaylists(playlists.filter((p) => p.id !== id))
      toast({
        title: "Success",
        description: "Playlist deleted",
      })
    } catch (error) {
      console.error("Failed to delete playlist:", error)
      toast({
        title: "Error",
        description: "Failed to delete playlist",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <main className="flex-1 flex flex-col md:ml-64">
        {/* Header */}
        <header className="border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-30">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-white">My Playlists</h1>
            <p className="text-muted-foreground">Create and manage your music collections</p>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-32">
          <div className="p-6 max-w-2xl">
            {isLoading ? (
              <div className="text-muted-foreground">Loading playlists...</div>
            ) : (
              <PlaylistManager
                playlists={playlists}
                onCreatePlaylist={handleCreatePlaylist}
                onUpdatePlaylist={handleUpdatePlaylist}
                onDeletePlaylist={handleDeletePlaylist}
              />
            )}
          </div>
        </div>
      </main>

      <div className="fixed bottom-24 right-6 z-50">
        <VoiceButton />
      </div>

      <NowPlaying />
    </div>
  )
}
