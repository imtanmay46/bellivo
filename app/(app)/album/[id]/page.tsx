"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSpotifyPlayer } from "@/lib/spotify-player-context"
import { Play, Clock, Heart, MoreHorizontal } from "lucide-react"
import Image from "next/image"

interface AlbumDetails {
  id: string
  name: string
  artists: { name: string; id: string }[]
  images: { url: string }[]
  release_date: string
  total_tracks: number
  tracks: {
    items: Array<{
      id: string
      name: string
      artists: { name: string }[]
      duration_ms: number
      uri: string
      track_number: number
    }>
  }
  uri: string
  copyrights: Array<{ text: string; type: string }>
}

export default function AlbumPage() {
  const params = useParams()
  const router = useRouter()
  const [album, setAlbum] = useState<AlbumDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const player = useSpotifyPlayer()

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await fetch(`/api/spotify/albums/${params.id}`)

        if (response.status === 401) {
          router.push("/auth/login")
          return
        }

        if (!response.ok) {
          throw new Error("Failed to fetch album")
        }

        const data = await response.json()
        console.log("[v0] Loaded album:", data.name)
        setAlbum(data)
      } catch (error) {
        console.error("[v0] Failed to fetch album:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchAlbum()
    }
  }, [params.id, router])

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = ((ms % 60000) / 1000).toFixed(0)
    return `${minutes}:${Number.parseInt(seconds) < 10 ? "0" : ""}${seconds}`
  }

  const getTotalDuration = () => {
    if (!album) return ""
    const totalMs = album.tracks.items.reduce((sum, track) => sum + track.duration_ms, 0)
    const totalMinutes = Math.floor(totalMs / 60000)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C9A86A]"></div>
      </div>
    )
  }

  if (!album) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Album not found</p>
      </div>
    )
  }

  return (
    <div className="pb-32">
      {/* Album Header */}
      <div className="bg-gradient-to-b from-indigo-900/40 to-transparent p-8">
        <div className="flex items-end gap-6">
          <Image
            src={album.images[0]?.url || "/placeholder.svg?height=232&width=232&query=album"}
            alt={album.name}
            width={232}
            height={232}
            className="rounded-lg shadow-2xl"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase mb-2">Album</p>
            <h1 className="text-6xl font-bold mb-6 text-balance">{album.name}</h1>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold">{album.artists.map((a) => a.name).join(", ")}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">{new Date(album.release_date).getFullYear()}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">{album.total_tracks} songs</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">{getTotalDuration()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-8 flex items-center gap-8">
        <button
          onClick={() => player.play(album.uri)}
          className="w-14 h-14 bg-[#2ECC71] rounded-full flex items-center justify-center hover:scale-105 transition shadow-lg"
        >
          <Play className="w-6 h-6 text-black fill-black ml-1" />
        </button>
        <button className="opacity-70 hover:opacity-100 transition">
          <Heart className="w-8 h-8 text-white" />
        </button>
        <button className="opacity-70 hover:opacity-100 transition">
          <MoreHorizontal className="w-8 h-8 text-white" />
        </button>
      </div>

      {/* Tracks */}
      <div className="px-8">
        <div className="grid grid-cols-[16px_4fr_1fr] gap-4 px-4 py-2 border-b border-white/10 text-sm text-gray-400 mb-2">
          <span>#</span>
          <span>Title</span>
          <Clock className="w-4 h-4 ml-auto" />
        </div>

        <div className="space-y-1">
          {album.tracks.items.map((track) => (
            <div
              key={track.id}
              className="grid grid-cols-[16px_4fr_1fr] gap-4 px-4 py-2 rounded hover:bg-white/5 group cursor-pointer items-center"
              onClick={() => player.playTrack({ ...track, album: { name: album.name, images: album.images } } as any)}
            >
              <span className="text-gray-400 group-hover:hidden text-center">{track.track_number}</span>
              <Play className="w-4 h-4 text-white hidden group-hover:block" />

              <div className="min-w-0">
                <p className="text-white truncate font-medium">{track.name}</p>
                <p className="text-sm text-gray-400 truncate">{track.artists.map((a) => a.name).join(", ")}</p>
              </div>

              <div className="flex items-center gap-4 ml-auto">
                <button className="opacity-0 group-hover:opacity-100 transition">
                  <Heart className="w-4 h-4 text-gray-400 hover:text-white" />
                </button>
                <span className="text-gray-400 text-sm w-12 text-right">{formatDuration(track.duration_ms)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright */}
      {album.copyrights && album.copyrights.length > 0 && (
        <div className="px-8 pt-12 text-xs text-gray-500 space-y-1">
          <p>
            {new Date(album.release_date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          {album.copyrights.map((copyright, index) => (
            <p key={index}>{copyright.text}</p>
          ))}
        </div>
      )}
    </div>
  )
}
