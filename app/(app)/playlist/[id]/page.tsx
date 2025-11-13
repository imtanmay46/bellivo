"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useSpotifyPlayer } from "@/lib/spotify-player-context"
import { Play, Clock, Heart } from "lucide-react"
import Image from "next/image"

interface PlaylistDetails {
  id: string
  name: string
  description: string
  images: { url: string }[]
  tracks: {
    total: number
    items: Array<{
      track: {
        id: string
        name: string
        artists: { name: string }[]
        album: {
          name: string
          images: { url: string }[]
        }
        duration_ms: number
        uri: string
      }
    }>
  }
  owner: { display_name: string }
  uri: string
}

export default function PlaylistPage() {
  const params = useParams()
  const [playlist, setPlaylist] = useState<PlaylistDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const player = useSpotifyPlayer()

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await fetch(`/api/spotify/playlists/${params.id}`)
        const data = await response.json()
        setPlaylist(data)
      } catch (error) {
        console.error("[v0] Failed to fetch playlist:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchPlaylist()
    }
  }, [params.id])

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = ((ms % 60000) / 1000).toFixed(0)
    return `${minutes}:${Number.parseInt(seconds) < 10 ? "0" : ""}${seconds}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C9A86A]"></div>
      </div>
    )
  }

  if (!playlist) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Playlist not found</p>
      </div>
    )
  }

  return (
    <div>
      {/* Playlist Header */}
      <div className="bg-gradient-to-b from-[#C9A86A]/20 to-transparent p-8">
        <div className="flex items-end gap-6">
          <Image
            src={playlist.images[0]?.url || "/placeholder.svg?height=232&width=232&query=playlist"}
            alt={playlist.name}
            width={232}
            height={232}
            className="rounded-lg shadow-2xl"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase mb-2">Playlist</p>
            <h1 className="text-6xl font-bold mb-6">{playlist.name}</h1>
            {playlist.description && <p className="text-gray-300 mb-4">{playlist.description}</p>}
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold">{playlist.owner.display_name}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">{playlist.tracks.total} songs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-8 flex items-center gap-8">
        <button
          onClick={() => player.play(playlist.uri)}
          className="w-14 h-14 bg-[#2ECC71] rounded-full flex items-center justify-center hover:scale-105 transition"
        >
          <Play className="w-6 h-6 text-black fill-black ml-1" />
        </button>
      </div>

      {/* Tracks */}
      <div className="px-8 pb-8">
        <div className="grid grid-cols-[16px_4fr_3fr_2fr_minmax(120px,1fr)] gap-4 px-4 py-2 border-b border-white/10 text-sm text-gray-400">
          <span>#</span>
          <span>Title</span>
          <span>Album</span>
          <span>Date added</span>
          <Clock className="w-4 h-4 ml-auto" />
        </div>

        <div className="mt-4">
          {playlist.tracks.items.map((item, index) => (
            <div
              key={item.track.id}
              className="grid grid-cols-[16px_4fr_3fr_2fr_minmax(120px,1fr)] gap-4 px-4 py-2 rounded hover:bg-white/5 group cursor-pointer"
              onClick={() => player.playTrack(item.track as any)}
            >
              <span className="text-gray-400 group-hover:hidden">{index + 1}</span>
              <Play className="w-4 h-4 text-white hidden group-hover:block" />
              <div className="flex items-center gap-3">
                <Image
                  src={item.track.album.images[0]?.url || "/placeholder.svg?height=40&width=40"}
                  alt={item.track.album.name}
                  width={40}
                  height={40}
                  className="rounded"
                />
                <div className="min-w-0">
                  <p className="text-white truncate">{item.track.name}</p>
                  <p className="text-sm text-gray-400 truncate">{item.track.artists.map((a) => a.name).join(", ")}</p>
                </div>
              </div>
              <span className="text-gray-400 truncate">{item.track.album.name}</span>
              <span className="text-gray-400">Today</span>
              <div className="flex items-center gap-4 ml-auto">
                <button className="opacity-0 group-hover:opacity-100 transition">
                  <Heart className="w-4 h-4 text-gray-400 hover:text-white" />
                </button>
                <span className="text-gray-400 text-sm">{formatDuration(item.track.duration_ms)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
