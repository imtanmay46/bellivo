"use client"

import { SongCard } from "./song-card"

interface Song {
  id: string
  title: string
  artist: string
  image_url?: string
  duration_ms?: number
}

export function PlaylistGrid({
  songs,
  onPlaySong,
}: {
  songs: Song[]
  onPlaySong: (song: Song) => void
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {songs.map((song) => (
        <SongCard key={song.id} song={song} onPlay={onPlaySong} />
      ))}
    </div>
  )
}
