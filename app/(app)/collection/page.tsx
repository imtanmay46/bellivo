"use client"

import { useEffect, useState } from "react"
import { Play, Music } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSpotifyPlayer } from "@/lib/spotify-player-context"

interface LibraryItem {
  id: string
  name: string
  description?: string
  images: { url: string }[]
  type: "playlist" | "album"
  tracks?: { total: number }
  uri: string
}

export default function CollectionPage() {
  const [items, setItems] = useState<LibraryItem[]>([])
  const [loading, setLoading] = useState(true)
  const player = useSpotifyPlayer()

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const [playlistsRes, albumsRes] = await Promise.all([
          fetch("/api/spotify/playlists/user"),
          fetch("/api/spotify/me/albums"),
        ])

        const playlistsData = await playlistsRes.json()
        const albumsData = await albumsRes.json()

        const playlists = (playlistsData.items || []).map((p: any) => ({ ...p, type: "playlist" }))
        const albums = (albumsData.items || []).map((a: any) => ({ ...a.album, type: "album" }))

        setItems([...playlists, ...albums])
      } catch (error) {
        console.error("[v0] Failed to fetch library:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLibrary()
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
      <h1 className="text-4xl font-bold mb-8">Your Library</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.type === "playlist" ? `/playlist/${item.id}` : `/album/${item.id}`}
            className="group bg-white/5 hover:bg-white/10 rounded-lg p-4 transition cursor-pointer"
          >
            <div className="relative mb-4">
              <Image
                src={item.images[0]?.url || "/placeholder.svg?height=200&width=200"}
                alt={item.name}
                width={200}
                height={200}
                className="rounded-md shadow-lg"
              />
              <button
                onClick={(e) => {
                  e.preventDefault()
                  player.play(item.uri)
                }}
                className="absolute bottom-2 right-2 bg-[#2ECC71] text-black p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition"
              >
                <Play className="w-5 h-5 fill-black" />
              </button>
            </div>
            <h3 className="font-semibold text-white truncate">{item.name}</h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
              <Music className="w-3 h-3" />
              <span className="capitalize">{item.type}</span>
            </div>
          </Link>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12">
          <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Your library is empty</h3>
          <p className="text-gray-400">Start by liking songs or creating playlists</p>
        </div>
      )}
    </div>
  )
}
