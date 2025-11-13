"use client"
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"
import { usePlayer } from "@/lib/player-context"

export function MusicPlayerGlobal() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isFavorite,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
    toggleFavorite,
  } = usePlayer()

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!currentTrack) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0B0B0B]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-24 max-w-screen-2xl items-center gap-4 px-4">
        {/* Track Info */}
        <div className="flex min-w-[240px] items-center gap-3">
          <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md">
            <Image
              src={currentTrack.image_url || "/placeholder.svg?height=56&width=56"}
              alt={currentTrack.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-white">{currentTrack.title}</p>
            <p className="truncate text-xs text-white/60">{currentTrack.artist}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={toggleFavorite} className="flex-shrink-0">
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-[#2ECC71] text-[#2ECC71]" : "text-white/60"}`} />
          </Button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-1 flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={previousTrack} className="text-white hover:text-[#C9A86A]">
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button onClick={togglePlay} size="sm" className="h-10 w-10 rounded-full bg-[#C9A86A] hover:bg-[#B89858]">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={nextTrack} className="text-white hover:text-[#C9A86A]">
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex w-full max-w-md items-center gap-2">
            <span className="text-xs text-white/60">{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              max={duration || 30}
              step={0.1}
              onValueChange={(v) => seek(v[0])}
              className="flex-1"
            />
            <span className="text-xs text-white/60">{formatTime(duration || 30)}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex min-w-[180px] items-center gap-2">
          <Volume2 className="h-4 w-4 text-white/60" />
          <Slider value={[volume]} max={100} step={1} onValueChange={(v) => setVolume(v[0])} className="flex-1" />
        </div>
      </div>
    </div>
  )
}
