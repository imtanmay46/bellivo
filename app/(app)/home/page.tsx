"use client"

import { useEffect, useState } from "react"
import { useSpotifyPlayer } from "@/lib/spotify-player-context"
import { Play, Clock } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { getAccessToken } from "@/lib/spotify-auth"

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

interface Track {
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

interface RecentlyPlayedItem {
  track: Track
  played_at: string
}

export default function HomePage() {
  const router = useRouter()
  const [featuredPlaylists, setFeaturedPlaylists] = useState<Playlist[]>([])
  const [newReleases, setNewReleases] = useState<Album[]>([])
  const [recentlyPlayed, setRecentlyPlayed] = useState<RecentlyPlayedItem[]>([])
  const [recommendations, setRecommendations] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const player = useSpotifyPlayer()

  useEffect(() => {
    console.log("[v0] Home page: Loading Spotify content")

    const fetchData = async () => {
      const accessToken = getAccessToken()

      if (!accessToken) {
        console.error("[v0] No access token, redirecting to login")
        router.push("/auth/login")
        return
      }

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      }

      try {
        const [playlistsRes, releasesRes, recentRes, recsRes] = await Promise.all([
          fetch("/api/spotify/featured-playlists", { headers }),
          fetch("/api/spotify/new-releases", { headers }),
          fetch("/api/spotify/recently-played", { headers }),
          fetch("/api/spotify/recommendations", { headers }),
        ])

        if (
          playlistsRes.status === 401 ||
          releasesRes.status === 401 ||
          recentRes.status === 401 ||
          recsRes.status === 401
        ) {
          console.error("[v0] Authentication failed, redirecting to login")
          router.push("/auth/login")
          return
        }

        const [playlistsData, releasesData, recentData, recsData] = await Promise.all([
          playlistsRes.ok ? playlistsRes.json() : { playlists: { items: [] } },
          releasesRes.ok ? releasesRes.json() : { albums: { items: [] } },
          recentRes.ok ? recentRes.json() : { items: [] },
          recsRes.ok ? recsRes.json() : { tracks: [] },
        ])

        console.log("[v0] Loaded home feed data successfully")

        setFeaturedPlaylists(playlistsData.playlists?.items || [])
        setNewReleases(releasesData.albums?.items || [])
        setRecentlyPlayed(recentData.items || [])
        setRecommendations(recsData.tracks || [])
      } catch (error) {
        console.error("[v0] Failed to fetch home data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

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

  return (
    <div className="p-8 space-y-8 pb-32">
      {/* Greeting */}
      <h1 className="text-4xl font-bold mb-6">{getGreeting()}</h1>

      {/* Recently Played - Quick Access Grid */}
      {recentlyPlayed.length > 0 && (
        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recentlyPlayed.slice(0, 6).map((item) => (
              <div
                key={item.track.id + item.played_at}
                className="flex items-center gap-4 bg-white/5 hover:bg-white/10 rounded-md overflow-hidden cursor-pointer group transition"
                onClick={() => player.playTrack(item.track as any)}
              >
                <Image
                  src={item.track.album.images[0]?.url || "/placeholder.svg?height=64&width=64"}
                  alt={item.track.album.name}
                  width={64}
                  height={64}
                  className="flex-shrink-0"
                />
                <div className="flex-1 min-w-0 pr-4">
                  <p className="font-semibold text-white truncate">{item.track.name}</p>
                  <p className="text-sm text-gray-400 truncate">{item.track.artists.map((a) => a.name).join(", ")}</p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity mr-4">
                  <div className="h-10 w-10 rounded-full bg-[#2ECC71] flex items-center justify-center shadow-lg hover:scale-105 transition">
                    <Play className="h-4 w-4 text-black fill-black ml-0.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Playlists */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Featured Playlists</h2>
          <button className="text-sm text-gray-400 hover:text-white transition font-semibold">Show all</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {featuredPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              className="group bg-white/5 hover:bg-white/10 rounded-lg p-4 transition cursor-pointer relative"
              onClick={() => player.play(playlist.uri)}
            >
              <div className="relative mb-4">
                <Image
                  src={playlist.images[0]?.url || "/placeholder.svg?height=200&width=200"}
                  alt={playlist.name}
                  width={200}
                  height={200}
                  className="rounded-md shadow-lg w-full aspect-square object-cover"
                />
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  <div className="h-12 w-12 rounded-full bg-[#2ECC71] flex items-center justify-center shadow-lg hover:scale-105 transition">
                    <Play className="h-5 w-5 text-black fill-black ml-0.5" />
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-white truncate">{playlist.name}</h3>
              <p className="text-sm text-gray-400 line-clamp-2 mt-1">{playlist.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* New Releases */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">New Releases</h2>
          <button className="text-sm text-gray-400 hover:text-white transition font-semibold">Show all</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {newReleases.map((album) => (
            <div
              key={album.id}
              className="group bg-white/5 hover:bg-white/10 rounded-lg p-4 transition cursor-pointer relative"
              onClick={() => player.play(album.uri)}
            >
              <div className="relative mb-4">
                <Image
                  src={album.images[0]?.url || "/placeholder.svg?height=200&width=200"}
                  alt={album.name}
                  width={200}
                  height={200}
                  className="rounded-md shadow-lg w-full aspect-square object-cover"
                />
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  <div className="h-12 w-12 rounded-full bg-[#2ECC71] flex items-center justify-center shadow-lg hover:scale-105 transition">
                    <Play className="h-5 w-5 text-black fill-black ml-0.5" />
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-white truncate">{album.name}</h3>
              <p className="text-sm text-gray-400 truncate">{album.artists.map((a) => a.name).join(", ")}</p>
              <p className="text-xs text-gray-500 mt-1">{new Date(album.release_date).getFullYear()}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended for you */}
      {recommendations.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Recommended for you</h2>
          </div>
          <div className="space-y-2">
            {recommendations.slice(0, 10).map((track, index) => (
              <div
                key={track.id}
                className="flex items-center gap-4 p-2 rounded hover:bg-white/5 cursor-pointer group"
                onClick={() => player.playTrack(track as any)}
              >
                <div className="w-10 text-center text-gray-400">{index + 1}</div>
                <div className="relative">
                  <Image
                    src={track.album.images[0]?.url || "/placeholder.svg?height=48&width=48"}
                    alt={track.album.name}
                    width={48}
                    height={48}
                    className="rounded"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="h-4 w-4 text-white fill-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{track.name}</p>
                  <p className="text-sm text-gray-400 truncate">{track.artists.map((a) => a.name).join(", ")}</p>
                </div>
                <p className="text-sm text-gray-400">{track.album.name}</p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(track.duration_ms)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
