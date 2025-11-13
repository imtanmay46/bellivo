"use client"

import { useSpotifyPlayer } from "@/lib/spotify-player-context"
import { Play, Pause, SkipForward, SkipBack, Repeat, Shuffle, Volume2 } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { useEffect, useState } from "react"
import Image from "next/image"

export function PlayerBar() {
  const player = useSpotifyPlayer()
  const [localPosition, setLocalPosition] = useState(0)

  useEffect(() => {
    setLocalPosition(player.position)
  }, [player.position])

  useEffect(() => {
    if (!player.isPlaying) return

    const interval = setInterval(() => {
      setLocalPosition((prev) => Math.min(prev + 1000, player.duration))
    }, 1000)

    return () => clearInterval(interval)
  }, [player.isPlaying, player.duration])

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!player.currentTrack) {
    return <div className="fixed bottom-0 left-0 right-0 h-24 bg-black/95 backdrop-blur-xl border-t border-white/10" />
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-black/95 backdrop-blur-xl border-t border-white/10 px-4">
      <div className="h-full max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Image
            src={player.currentTrack.album.images[0]?.url || "/placeholder.svg?height=56&width=56"}
            alt={player.currentTrack.album.name}
            width={56}
            height={56}
            className="rounded"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{player.currentTrack.name}</p>
            <p className="text-xs text-gray-400 truncate">
              {player.currentTrack.artists.map((a) => a.name).join(", ")}
            </p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center gap-2 flex-[2] max-w-2xl">
          <div className="flex items-center gap-4">
            <button
              onClick={player.toggleShuffle}
              className={`p-2 hover:text-white transition ${player.shuffleMode ? "text-[#2ECC71]" : "text-gray-400"}`}
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <button onClick={player.skipToPrevious} className="p-2 text-gray-400 hover:text-white transition">
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={() => (player.isPlaying ? player.pause() : player.resume())}
              className="p-3 bg-white rounded-full text-black hover:scale-105 transition"
            >
              {player.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <button onClick={player.skipToNext} className="p-2 text-gray-400 hover:text-white transition">
              <SkipForward className="w-5 h-5" />
            </button>
            <button
              onClick={player.toggleRepeat}
              className={`p-2 hover:text-white transition ${player.repeatMode !== "off" ? "text-[#2ECC71]" : "text-gray-400"}`}
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full flex items-center gap-2">
            <span className="text-xs text-gray-400 w-10 text-right">{formatTime(localPosition)}</span>
            <Slider
              value={[localPosition]}
              max={player.duration}
              step={1000}
              onValueChange={([value]) => setLocalPosition(value)}
              onValueCommit={([value]) => player.seek(value)}
              className="flex-1"
            />
            <span className="text-xs text-gray-400 w-10">{formatTime(player.duration)}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <Volume2 className="w-5 h-5 text-gray-400" />
          <Slider
            value={[player.volume]}
            max={100}
            step={1}
            onValueChange={([value]) => player.setVolume(value)}
            className="w-24"
          />
        </div>
      </div>
    </div>
  )
}
