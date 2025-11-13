"use client"

import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from "react"

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

interface PlayerState {
  isPlaying: boolean
  currentTrack: Track | null
  position: number
  duration: number
  volume: number
  deviceId: string | null
  queue: Track[]
  repeatMode: "off" | "track" | "context"
  shuffleMode: boolean
}

interface SpotifyPlayerContextType extends PlayerState {
  play: (uri?: string) => Promise<void>
  pause: () => Promise<void>
  resume: () => Promise<void>
  skipToNext: () => Promise<void>
  skipToPrevious: () => Promise<void>
  seek: (position: number) => Promise<void>
  setVolume: (volume: number) => Promise<void>
  toggleRepeat: () => Promise<void>
  toggleShuffle: () => Promise<void>
  addToQueue: (uri: string) => Promise<void>
  playTrack: (track: Track) => Promise<void>
  playTracks: (tracks: Track[], startIndex?: number) => Promise<void>
}

const SpotifyPlayerContext = createContext<SpotifyPlayerContextType | null>(null)

export function useSpotifyPlayer() {
  const context = useContext(SpotifyPlayerContext)
  if (!context) {
    throw new Error("useSpotifyPlayer must be used within SpotifyPlayerProvider")
  }
  return context
}

export function SpotifyPlayerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlayerState>({
    isPlaying: false,
    currentTrack: null,
    position: 0,
    duration: 0,
    volume: 100,
    deviceId: null,
    queue: [],
    repeatMode: "off",
    shuffleMode: false,
  })

  const playerRef = useRef<any | null>(null)
  const accessTokenRef = useRef<string | null>(null)

  useEffect(() => {
    // Load Spotify Web Playback SDK
    const script = document.createElement("script")
    script.src = "https://sdk.scdn.co/spotify-player.js"
    script.async = true
    document.body.appendChild(script)

    // Get access token from cookie
    const getAccessToken = async () => {
      const response = await fetch("/api/auth/spotify-token")
      const data = await response.json()
      return data.access_token
    }

    window.onSpotifyWebPlaybackSDKReady = async () => {
      const token = await getAccessToken()
      accessTokenRef.current = token

      const player = new window.Spotify.Player({
        name: "Bellivo Web Player",
        getOAuthToken: (cb) => {
          cb(token)
        },
        volume: 1.0,
      })

      playerRef.current = player

      player.addListener("ready", ({ device_id }) => {
        console.log("[v0] Spotify player ready with device ID:", device_id)
        setState((prev) => ({ ...prev, deviceId: device_id }))
      })

      player.addListener("not_ready", ({ device_id }) => {
        console.log("[v0] Device ID has gone offline:", device_id)
      })

      player.addListener("player_state_changed", (playbackState) => {
        if (!playbackState) return

        const track = playbackState.track_window.current_track
        setState((prev) => ({
          ...prev,
          isPlaying: !playbackState.paused,
          currentTrack: {
            id: track.id || "",
            name: track.name,
            artists: track.artists.map((a) => ({ name: a.name })),
            album: {
              name: track.album.name,
              images: track.album.images.map((i) => ({ url: i.url })),
            },
            duration_ms: track.duration_ms,
            uri: track.uri,
          },
          position: playbackState.position,
          duration: track.duration_ms,
          repeatMode: playbackState.repeat_mode === 0 ? "off" : playbackState.repeat_mode === 1 ? "context" : "track",
          shuffleMode: playbackState.shuffle,
        }))
      })

      player.connect()
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect()
      }
    }
  }, [])

  const play = async (uri?: string) => {
    if (!state.deviceId || !accessTokenRef.current) return

    const endpoint = `https://api.spotify.com/v1/me/player/play?device_id=${state.deviceId}`
    const body = uri ? JSON.stringify({ uris: [uri] }) : undefined

    await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessTokenRef.current}`,
      },
      body,
    })
  }

  const pause = async () => {
    await playerRef.current?.pause()
  }

  const resume = async () => {
    await playerRef.current?.resume()
  }

  const skipToNext = async () => {
    await playerRef.current?.nextTrack()
  }

  const skipToPrevious = async () => {
    await playerRef.current?.previousTrack()
  }

  const seek = async (position: number) => {
    await playerRef.current?.seek(position)
  }

  const setVolume = async (volume: number) => {
    await playerRef.current?.setVolume(volume / 100)
    setState((prev) => ({ ...prev, volume }))
  }

  const toggleRepeat = async () => {
    if (!state.deviceId || !accessTokenRef.current) return

    const modes: ("off" | "track" | "context")[] = ["off", "context", "track"]
    const currentIndex = modes.indexOf(state.repeatMode)
    const nextMode = modes[(currentIndex + 1) % modes.length]

    await fetch(`https://api.spotify.com/v1/me/player/repeat?state=${nextMode}&device_id=${state.deviceId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessTokenRef.current}`,
      },
    })

    setState((prev) => ({ ...prev, repeatMode: nextMode }))
  }

  const toggleShuffle = async () => {
    if (!state.deviceId || !accessTokenRef.current) return

    const newShuffleMode = !state.shuffleMode

    await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${newShuffleMode}&device_id=${state.deviceId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessTokenRef.current}`,
      },
    })

    setState((prev) => ({ ...prev, shuffleMode: newShuffleMode }))
  }

  const addToQueue = async (uri: string) => {
    if (!state.deviceId || !accessTokenRef.current) return

    await fetch(`https://api.spotify.com/v1/me/player/queue?uri=${uri}&device_id=${state.deviceId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessTokenRef.current}`,
      },
    })
  }

  const playTrack = async (track: Track) => {
    await play(track.uri)
  }

  const playTracks = async (tracks: Track[], startIndex = 0) => {
    if (!state.deviceId || !accessTokenRef.current) return

    const uris = tracks.map((t) => t.uri)

    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${state.deviceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessTokenRef.current}`,
      },
      body: JSON.stringify({
        uris,
        offset: { position: startIndex },
      }),
    })

    setState((prev) => ({ ...prev, queue: tracks }))
  }

  return (
    <SpotifyPlayerContext.Provider
      value={{
        ...state,
        play,
        pause,
        resume,
        skipToNext,
        skipToPrevious,
        seek,
        setVolume,
        toggleRepeat,
        toggleShuffle,
        addToQueue,
        playTrack,
        playTracks,
      }}
    >
      {children}
    </SpotifyPlayerContext.Provider>
  )
}

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void
    Spotify: any
  }
}
