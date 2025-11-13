"use client"

import { useState, useEffect, use } from "react"
import { createClient } from "@/lib/supabase/client"
import { Play, Trash2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
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

interface PlaylistSong {
  song: Song
  position: number
}

export default function PlaylistDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [playlist, setPlaylist] = useState<any>(null)
  const [songs, setSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const { playTrack, setQueue } = usePlayer()

  useEffect(() => {
    fetchPlaylistDetails()
  }, [resolvedParams.id])

  const fetchPlaylistDetails = async () => {
    try {
      const { data: playlistData, error: playlistError } = await supabase
        .from("playlists")
        .select("*")
        .eq("id", resolvedParams.id)
        .single()

      if (playlistError) throw playlistError

      const { data: songsData, error: songsError } = await supabase
        .from("playlist_songs")
        .select("song:songs(*), position")
        .eq("playlist_id", resolvedParams.id)
        .order("position")

      if (songsError) throw songsError

      setPlaylist(playlistData)
      setSongs(songsData?.map((ps: any) => ps.song) || [])
    } catch (error) {
      console.error("[v0] Failed to fetch playlist:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const playAllSongs = () => {
    if (songs.length > 0) {
      setQueue(songs)
      playTrack(songs[0])
    }
  }

  const playSong = (song: Song, index: number) => {
    setQueue(songs)
    playTrack(song)
  }

  const removeSong = async (songId: string) => {
    try {
      const { error } = await supabase
        .from("playlist_songs")
        .delete()
        .eq("playlist_id", resolvedParams.id)
        .eq("song_id", songId)

      if (error) throw error
      fetchPlaylistDetails()
    } catch (error) {
      console.error("[v0] Failed to remove song:", error)
    }
  }

  if (isLoading) {
    return <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center text-white">Loading...</div>
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center text-white">Playlist not found</div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] pb-32">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B0B0B]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-screen-2xl items-center px-4">
          <Link href="/playlists">
            <Button variant="ghost" size="sm" className="text-white hover:text-[#C9A86A]">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Playlists
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-screen-2xl px-4 py-8">
        <div className="mb-8 flex gap-6">
          <div className="h-48 w-48 flex-shrink-0 rounded-lg bg-white/5 flex items-center justify-center">
            {playlist.image_url ? (
              <Image
                src={playlist.image_url || "/placeholder.svg"}
                alt={playlist.name}
                width={192}
                height={192}
                className="rounded-lg"
              />
            ) : (
              <Play className="h-24 w-24 text-white/20" />
            )}
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-sm text-white/60 uppercase">Playlist</p>
            <h1 className="text-5xl font-bold text-white mb-4">{playlist.name}</h1>
            {playlist.description && <p className="text-white/60 mb-4">{playlist.description}</p>}
            <p className="text-sm text-white/60">{songs.length} songs</p>
          </div>
        </div>

        <div className="mb-6 flex gap-4">
          <Button
            onClick={playAllSongs}
            disabled={songs.length === 0}
            className="bg-[#2ECC71] hover:bg-[#27AE60] h-14 px-8 rounded-full"
          >
            <Play className="mr-2 h-5 w-5 fill-current" />
            Play All
          </Button>
        </div>

        {songs.length > 0 ? (
          <div className="space-y-2">
            {songs.map((song, index) => (
              <div
                key={song.id}
                className="group flex items-center gap-4 rounded-lg p-3 hover:bg-white/5 transition-colors"
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => playSong(song, index)}
                  className="opacity-0 group-hover:opacity-100 text-white hover:text-[#C9A86A]"
                >
                  <Play className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSong(song.id)}
                  className="opacity-0 group-hover:opacity-100 text-white/60 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-white/60">No songs in this playlist yet.</p>
          </div>
        )}
      </main>
    </div>
  )
}
