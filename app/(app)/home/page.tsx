"use client"

import { useEffect, useState } from "react"
import { useSpotifyPlayer } from "@/lib/spotify-player-context"
import { Play } from "lucide-react"
import Image from "next/image"

interface Playlist {
  id: string
  name: string
  description: string
  images: { url: string }[]
  uri: string
}

interface Album {
  id: string
  name: string
  artists: { name: string }[]
  images: { url: string }[]
  uri: string
  release_date: string
}

export default function HomePage() {
  const [featuredPlaylists, setFeaturedPlaylists] = useState<Playlist[]>([])
  const [newReleases, setNewReleases] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const player = useSpotifyPlayer()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playlistsRes, releasesRes] = await Promise.all([
          fetch("/api/spotify/featured-playlists"),
          fetch("/api/spotify/new-releases"),
        ])

        const playlistsData = await playlistsRes.json()
        const releasesData = await releasesRes.json()

        setFeaturedPlaylists(playlistsData.playlists?.items || [])
        setNewReleases(releasesData.albums?.items || [])
      } catch (error) {
        console.error("[v0] Failed to fetch home data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C9A86A]"></div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Greeting */}
      <h1 className="text-4xl font-bold">{getGreeting()}</h1>

      {/* Featured Playlists */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Featured Playlists</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {featuredPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              className="group bg-white/5 hover:bg-white/10 rounded-lg p-4 transition cursor-pointer"
              onClick={() => player.play(playlist.uri)}
            >
              <div className="relative mb-4">
                <Image
                  src={playlist.images[0]?.url || "/placeholder.svg?height=200&width=200"}
                  alt={playlist.name}
                  width={200}
                  height={200}
                  className="rounded-md shadow-lg"
                />
                <button className="absolute bottom-2 right-2 bg-[#2ECC71] text-black p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition">
                  <Play className="w-5 h-5 fill-black" />
                </button>
              </div>
              <h3 className="font-semibold text-white truncate">{playlist.name}</h3>
              <p className="text-sm text-gray-400 line-clamp-2 mt-1">{playlist.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* New Releases */}
      <section>
        <h2 className="text-2xl font-bold mb-4">New Releases</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {newReleases.map((album) => (
            <div
              key={album.id}
              className="group bg-white/5 hover:bg-white/10 rounded-lg p-4 transition cursor-pointer"
              onClick={() => player.play(album.uri)}
            >
              <div className="relative mb-4">
                <Image
                  src={album.images[0]?.url || "/placeholder.svg?height=200&width=200"}
                  alt={album.name}
                  width={200}
                  height={200}
                  className="rounded-md shadow-lg"
                />
                <button className="absolute bottom-2 right-2 bg-[#2ECC71] text-black p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition">
                  <Play className="w-5 h-5 fill-black" />
                </button>
              </div>
              <h3 className="font-semibold text-white truncate">{album.name}</h3>
              <p className="text-sm text-gray-400 truncate">{album.artists.map((a) => a.name).join(", ")}</p>
              <p className="text-xs text-gray-500 mt-1">{new Date(album.release_date).getFullYear()}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
