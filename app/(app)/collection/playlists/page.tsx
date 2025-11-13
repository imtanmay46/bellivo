"use client"

import { useEffect, useState } from "react"
import { useSpotifyPlayer } from "@/lib/spotify-player-context"
import { Play, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Playlist {
  id: string
  name: string
  description: string
  images: { url: string }[]
  tracks: { total: number }
  uri: string
  owner: { display_name: string }
}

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const player = useSpotifyPlayer()

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await fetch("/api/spotify/playlists/user")
        const data = await response.json()
        setPlaylists(data.items || [])
      } catch (error) {
        console.error("[v0] Failed to fetch playlists:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlaylists()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C9A86A]"></div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Your Playlists</h1>
        <button className="flex items-center gap-2 bg-[#C9A86A] text-black px-6 py-3 rounded-full font-semibold hover:bg-[#C9A86A]/90 transition">
          <Plus className="w-5 h-5" />
          Create Playlist
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {playlists.map((playlist) => (
          <Link
            key={playlist.id}
            href={`/playlist/${playlist.id}`}
            className="group bg-white/5 hover:bg-white/10 rounded-lg p-4 transition cursor-pointer"
          >
            <div className="relative mb-4">
              <Image
                src={playlist.images[0]?.url || "/placeholder.svg?height=200&width=200&query=playlist"}
                alt={playlist.name}
                width={200}
                height={200}
                className="rounded-md shadow-lg"
              />
              <button
                onClick={(e) => {
                  e.preventDefault()
                  player.play(playlist.uri)
                }}
                className="absolute bottom-2 right-2 bg-[#2ECC71] text-black p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition"
              >
                <Play className="w-5 h-5 fill-black" />
              </button>
            </div>
            <h3 className="font-semibold text-white truncate">{playlist.name}</h3>
            <p className="text-sm text-gray-400 mt-1">
              By {playlist.owner.display_name} • {playlist.tracks.total} songs
            </p>
          </Link>
        ))}
      </div>

      {playlists.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">You don't have any playlists yet</p>
          <button className="bg-[#C9A86A] text-black px-6 py-3 rounded-full font-semibold hover:bg-[#C9A86A]/90 transition">
            Create your first playlist
          </button>
        </div>
      )}
    </div>
  )
}
