"use client"

import { useEffect, useState } from "react"
import { useSpotifyPlayer } from "@/lib/spotify-player-context"
import { Play, Clock, Heart } from "lucide-react"
import Image from "next/image"

interface SavedTrack {
  added_at: string
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
}

export default function LikedSongsPage() {
  const [tracks, setTracks] = useState<SavedTrack[]>([])
  const [loading, setLoading] = useState(true)
  const player = useSpotifyPlayer()

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch("/api/spotify/me/tracks")
        const data = await response.json()
        setTracks(data.items || [])
      } catch (error) {
        console.error("[v0] Failed to fetch liked songs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTracks()
  }, [])

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = ((ms % 60000) / 1000).toFixed(0)
    return `${minutes}:${Number.parseInt(seconds) < 10 ? "0" : ""}${seconds}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C9A86A]"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-b from-purple-900/40 to-transparent p-8">
        <div className="flex items-end gap-6">
          <div className="w-[232px] h-[232px] bg-gradient-to-br from-purple-700 to-indigo-900 rounded-lg shadow-2xl flex items-center justify-center">
            <Heart className="w-24 h-24 text-white fill-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase mb-2">Playlist</p>
            <h1 className="text-6xl font-bold mb-6">Liked Songs</h1>
            <p className="text-sm text-gray-300">{tracks.length} songs</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-8 flex items-center gap-8">
        <button
          onClick={() => {
            if (tracks.length > 0) {
              player.playTracks(tracks.map((t) => t.track) as any)
            }
          }}
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
          {tracks.map((item, index) => (
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
              <span className="text-gray-400">{formatDate(item.added_at)}</span>
              <div className="flex items-center gap-4 ml-auto">
                <button className="opacity-0 group-hover:opacity-100 transition">
                  <Heart className="w-4 h-4 text-[#2ECC71] fill-[#2ECC71]" />
                </button>
                <span className="text-gray-400 text-sm">{formatDuration(item.track.duration_ms)}</span>
              </div>
            </div>
          ))}
        </div>

        {tracks.length === 0 && (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Songs you like will appear here</h3>
            <p className="text-gray-400">Save songs by tapping the heart icon</p>
          </div>
        )}
      </div>
    </div>
  )
}
