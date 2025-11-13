"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react"

interface Track {
  id: string
  title: string
  artist: string
  album: string
  image_url: string
  preview_url: string | null
  duration_ms: number
  spotify_id?: string
}

interface PlayerContextType {
  currentTrack: Track | null
  queue: Track[]
  isPlaying: boolean
  volume: number
  currentTime: number
  duration: number
  isFavorite: boolean
  playTrack: (track: Track) => void
  addToQueue: (track: Track) => void
  setQueue: (tracks: Track[]) => void
  togglePlay: () => void
  nextTrack: () => void
  previousTrack: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  toggleFavorite: () => void
  clearQueue: () => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [queue, setQueueState] = useState<Track[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolumeState] = useState(70)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio()
      audioRef.current.volume = volume / 100

      audioRef.current.addEventListener("timeupdate", () => {
        setCurrentTime(audioRef.current?.currentTime || 0)
      })

      audioRef.current.addEventListener("loadedmetadata", () => {
        setDuration(audioRef.current?.duration || 0)
      })

      audioRef.current.addEventListener("ended", () => {
        nextTrack()
      })

      audioRef.current.addEventListener("play", () => {
        setIsPlaying(true)
      })

      audioRef.current.addEventListener("pause", () => {
        setIsPlaying(false)
      })
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    }
  }, [])

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  // Play track
  const playTrack = useCallback((track: Track) => {
    console.log("[v0] Playing track:", track.title)
    setCurrentTrack(track)
    if (audioRef.current && track.preview_url) {
      audioRef.current.src = track.preview_url
      audioRef.current
        .play()
        .then(() => console.log("[v0] Playback started"))
        .catch((e) => console.error("[v0] Playback error:", e))
    }
  }, [])

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch((e) => console.error("[v0] Play error:", e))
    }
  }, [isPlaying])

  // Next track
  const nextTrack = useCallback(() => {
    if (queue.length === 0 || !currentTrack) return

    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id)
    const nextIndex = (currentIndex + 1) % queue.length
    playTrack(queue[nextIndex])
  }, [queue, currentTrack, playTrack])

  // Previous track
  const previousTrack = useCallback(() => {
    if (queue.length === 0 || !currentTrack) return

    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id)
    const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1
    playTrack(queue[prevIndex])
  }, [queue, currentTrack, playTrack])

  // Seek
  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }, [])

  // Set volume
  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol)
  }, [])

  // Add to queue
  const addToQueue = useCallback((track: Track) => {
    setQueueState((prev) => [...prev, track])
  }, [])

  // Set queue
  const setQueue = useCallback((tracks: Track[]) => {
    setQueueState(tracks)
  }, [])

  // Toggle favorite
  const toggleFavorite = useCallback(() => {
    setIsFavorite((prev) => !prev)
    // TODO: Save to database
  }, [])

  // Clear queue
  const clearQueue = useCallback(() => {
    setQueueState([])
  }, [])

  const value: PlayerContextType = {
    currentTrack,
    queue,
    isPlaying,
    volume,
    currentTime,
    duration,
    isFavorite,
    playTrack,
    addToQueue,
    setQueue,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
    toggleFavorite,
    clearQueue,
  }

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider")
  }
  return context
}
