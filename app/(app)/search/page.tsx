"use client"

import { useState, useEffect } from "react"
import { SearchIcon, Play } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/lib/use-debounce"
import { useSpotifyPlayer } from "@/lib/spotify-player-context"
import { getAccessToken } from "@/lib/spotify-auth"
import Image from "next/image"

interface SearchResult {
  tracks?: {
    items: Array<{
      id: string
      name: string
      artists: { name: string }[]
      album: {
        name: string
        images: { url: string }[]
      }
      duration_ms: number
      uri: string
    }>
  }
  artists?: {
    items: Array<{
      id: string
      name: string
      images: { url: string }[]
      uri: string
    }>
  }
  albums?: {
    items: Array<{
      id: string
      name: string
      artists: { name: string }[]
      images: { url: string }[]
      uri: string
    }>
  }
  playlists?: {
    items: Array<{
      id: string
      name: string
      description: string
      images: { url: string }[]
      uri: string
    }>
  }
}

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult | null>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 200) // Reduced debounce to 200ms for even faster instant results
  const player = useSpotifyPlayer()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = getAccessToken()
        if (!token) return

        const response = await fetch("/api/spotify/categories", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()
        setCategories(data.categories?.items || [])
      } catch (error) {
        console.error("[v0] Failed to fetch categories:", error)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    if (!debouncedQuery) {
      setResults(null)
      return
    }

    const search = async () => {
      setLoading(true)
      try {
        const token = getAccessToken()
        if (!token) {
          console.error("[v0] No access token for search")
          return
        }

        const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(debouncedQuery)}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          throw new Error(`Search failed: ${response.status}`)
        }

        const data = await response.json()
        console.log("[v0] Search results:", data)
        setResults(data)
      } catch (error) {
        console.error("[v0] Search failed:", error)
      } finally {
        setLoading(false)
      }
    }

    search()
  }, [debouncedQuery])

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = ((ms % 60000) / 1000).toFixed(0)
    return `${minutes}:${Number.parseInt(seconds) < 10 ? "0" : ""}${seconds}`
  }

  return (
    <div className="p-8">
      {/* Search Bar */}
      <div className="max-w-2xl mb-8">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="What do you want to listen to?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 h-12 bg-white/10 border-none text-white placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-white/20"
            autoFocus
          />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C9A86A]"></div>
        </div>
      )}

      {!query && !results && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Browse all</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                style={{
                  backgroundColor: `hsl(${Math.random() * 360}, 60%, 40%)`,
                }}
              >
                <div className="p-4">
                  <h3 className="text-xl font-bold text-white">{category.name}</h3>
                </div>
                {category.icons?.[0] && (
                  <img
                    src={category.icons[0].url || "/placeholder.svg"}
                    alt={category.name}
                    className="absolute bottom-0 right-0 w-24 h-24 object-cover transform rotate-12 translate-x-2 translate-y-2 group-hover:scale-110 transition"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {results && !loading && (
        <div className="space-y-8">
          {/* Top Result */}
          {results.tracks?.items[0] && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Top result</h2>
              <div
                className="bg-white/5 hover:bg-white/10 rounded-lg p-6 cursor-pointer transition max-w-md group relative"
                onClick={() => player.playTrack(results.tracks!.items[0] as any)}
              >
                <Image
                  src={results.tracks.items[0].album.images[0]?.url || "/placeholder.svg?height=92&width=92"}
                  alt={results.tracks.items[0].name}
                  width={92}
                  height={92}
                  className="rounded mb-4"
                />
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-12 w-12 rounded-full bg-[#2ECC71] flex items-center justify-center hover:scale-105 transition shadow-lg">
                    <Play className="h-5 w-5 text-black fill-black ml-0.5" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-2 truncate">{results.tracks.items[0].name}</h3>
                <p className="text-sm text-gray-400">
                  Song · {results.tracks.items[0].artists.map((a) => a.name).join(", ")}
                </p>
              </div>
            </section>
          )}

          {/* Songs */}
          {results.tracks && results.tracks.items.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Songs</h2>
              <div className="space-y-2">
                {results.tracks.items.slice(0, 4).map((track, index) => (
                  <div
                    key={track.id}
                    className="flex items-center gap-4 p-2 rounded hover:bg-white/5 cursor-pointer group"
                    onClick={() => player.playTrack(track as any)}
                  >
                    <div className="relative">
                      <Image
                        src={track.album.images[0]?.url || "/placeholder.svg?height=48&width=48"}
                        alt={track.album.name}
                        width={48}
                        height={48}
                        className="rounded"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="h-5 w-5 text-white fill-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{track.name}</p>
                      <p className="text-sm text-gray-400 truncate">{track.artists.map((a) => a.name).join(", ")}</p>
                    </div>
                    <span className="text-sm text-gray-400 mr-4">{formatDuration(track.duration_ms)}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Artists */}
          {results.artists && results.artists.items.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Artists</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {results.artists.items.slice(0, 6).map((artist) => (
                  <div
                    key={artist.id}
                    className="group bg-white/5 hover:bg-white/10 rounded-lg p-4 transition cursor-pointer text-center"
                  >
                    <div className="mb-4 relative">
                      <Image
                        src={artist.images[0]?.url || "/placeholder.svg?height=160&width=160"}
                        alt={artist.name}
                        width={160}
                        height={160}
                        className="rounded-full mx-auto shadow-lg"
                      />
                      <div className="absolute bottom-2 right-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                        <div className="h-12 w-12 rounded-full bg-[#2ECC71] flex items-center justify-center shadow-lg hover:scale-105 transition">
                          <Play className="h-5 w-5 text-black fill-black ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-white truncate">{artist.name}</h3>
                    <p className="text-sm text-gray-400">Artist</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Albums */}
          {results.albums && results.albums.items.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Albums</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {results.albums.items.slice(0, 5).map((album) => (
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
                        className="rounded-md shadow-lg w-full"
                      />
                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                        <div className="h-12 w-12 rounded-full bg-[#2ECC71] flex items-center justify-center shadow-lg hover:scale-105 transition">
                          <Play className="h-5 w-5 text-black fill-black ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-white truncate">{album.name}</h3>
                    <p className="text-sm text-gray-400 truncate">{album.artists.map((a) => a.name).join(", ")}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Playlists */}
          {results.playlists && results.playlists.items.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Playlists</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {results.playlists.items.slice(0, 5).map((playlist) => (
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
                        className="rounded-md shadow-lg w-full"
                      />
                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                        <div className="h-12 w-12 rounded-full bg-[#2ECC71] flex items-center justify-center shadow-lg hover:scale-105 transition">
                          <Play className="h-5 w-5 text-black fill-black ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-white truncate">{playlist.name}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{playlist.description || "Playlist"}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
