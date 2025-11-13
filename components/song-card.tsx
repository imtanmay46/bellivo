"use client"

import { Play, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface Song {
  id: string
  title: string
  artist: string
  image_url?: string
  duration_ms?: number
}

export function SongCard({
  song,
  onPlay,
}: {
  song: Song
  onPlay: (song: Song) => void
}) {
  const [isLiked, setIsLiked] = useState(false)

  return (
    <div className="group relative bg-card/30 hover:bg-card/60 rounded-lg p-4 transition-all duration-300 cursor-pointer overflow-hidden">
      {/* Song cover */}
      <div className="relative mb-4 aspect-square rounded-md overflow-hidden bg-muted/20">
        {song.image_url && (
          <img src={song.image_url || "/placeholder.svg"} alt={song.title} className="w-full h-full object-cover" />
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Button
            onClick={() => onPlay(song)}
            className="bg-green-600 hover:bg-green-700 text-white rounded-full w-12 h-12 flex items-center justify-center"
          >
            <Play size={20} fill="white" />
          </Button>
          <Button
            onClick={() => setIsLiked(!isLiked)}
            variant="ghost"
            className="rounded-full w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30"
          >
            <Heart size={20} className={isLiked ? "fill-red-500 text-red-500" : "text-white"} />
          </Button>
        </div>
      </div>

      {/* Song info */}
      <div className="space-y-1">
        <h3 className="font-semibold text-white text-sm truncate">{song.title}</h3>
        <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
      </div>
    </div>
  )
}
