"use client"

import { useState } from "react"
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface Song {
  id: string
  title: string
  artist: string
  duration_ms: number
  preview_url?: string
  image_url?: string
}

export function NowPlaying({ song }: { song?: Song }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(70)
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off")
  const [isShuffle, setIsShuffle] = useState(false)

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!song) {
    return (
      <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-card/50 backdrop-blur-xl border-t border-border/50 p-4">
        <div className="text-center text-muted-foreground">Select a song to start playing</div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-gradient-to-t from-black via-card/80 to-card/50 backdrop-blur-xl border-t border-border/50">
      {/* Progress bar */}
      <div className="px-4 pt-4">
        <Slider value={[currentTime]} max={song.duration_ms || 100} step={1} className="w-full" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(song.duration_ms || 0)}</span>
        </div>
      </div>

      {/* Song info and controls */}
      <div className="px-4 py-4">
        {/* Song info */}
        <div className="flex gap-4 items-center mb-4">
          {song.image_url && (
            <img
              src={song.image_url || "/placeholder.svg"}
              alt={song.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
          )}
          <div className="flex-1">
            <h4 className="font-semibold text-white text-sm truncate">{song.title}</h4>
            <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsShuffle(!isShuffle)}
              className={isShuffle ? "text-green-600" : "text-muted-foreground"}
            >
              <Shuffle size={18} />
            </Button>
            <Button size="sm" variant="ghost" className="text-muted-foreground">
              <SkipBack size={18} />
            </Button>
          </div>

          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-green-600 hover:bg-green-700 text-white rounded-full w-12 h-12 flex items-center justify-center"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </Button>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="text-muted-foreground">
              <SkipForward size={18} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                const modes: ("off" | "all" | "one")[] = ["off", "all", "one"]
                const nextMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length]
                setRepeatMode(nextMode)
              }}
              className={repeatMode !== "off" ? "text-green-600" : "text-muted-foreground"}
            >
              <Repeat size={18} />
            </Button>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3 mt-4">
          <Volume2 size={18} className="text-muted-foreground" />
          <Slider
            value={[volume]}
            max={100}
            step={1}
            onValueChange={(value) => setVolume(value[0])}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-8 text-right">{volume}%</span>
        </div>
      </div>
    </div>
  )
}
