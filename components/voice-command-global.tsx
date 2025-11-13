"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useSpotifyPlayer } from "@/lib/spotify-player-context"

export function VoiceCommandGlobal() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [feedback, setFeedback] = useState("")
  const recognitionRef = useRef<any>(null)
  const router = useRouter()
  const player = useSpotifyPlayer()

  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase()
        setTranscript(transcript)
        console.log("[v0] Voice transcript:", transcript)
        processCommand(transcript)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("[v0] Speech recognition error:", event.error)
        setIsListening(false)
        setFeedback("Error: Could not recognize speech")
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const processCommand = async (text: string) => {
    console.log("[v0] Processing voice command:", text)

    if (text.includes("play")) {
      const songName = text.replace("play", "").replace("song", "").trim()

      if (!songName) {
        setFeedback("Please specify a song name")
        setTimeout(() => setFeedback(""), 3000)
        return
      }

      setFeedback(`Searching for "${songName}"...`)

      try {
        const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(songName)}`)
        const data = await response.json()

        if (data.tracks?.items && data.tracks.items.length > 0) {
          const track = data.tracks.items[0]
          await player.playTrack(track)
          setFeedback(`Now playing: ${track.name} by ${track.artists.map((a: any) => a.name).join(", ")}`)
        } else {
          setFeedback(`No results found for "${songName}"`)
        }
      } catch (error) {
        console.error("[v0] Voice search error:", error)
        setFeedback("Search failed. Please try again.")
      }
    } else if (text.includes("search")) {
      const query = text.replace("search", "").replace("for", "").trim()
      setFeedback(`Searching for "${query}"...`)
      router.push(`/search?q=${encodeURIComponent(query)}`)
    } else if (text.includes("next") || text.includes("skip")) {
      setFeedback("Skipping to next track...")
      await player.skipToNext()
    } else if (text.includes("previous") || text.includes("back")) {
      setFeedback("Going to previous track...")
      await player.skipToPrevious()
    } else if (text.includes("pause") || text.includes("stop")) {
      setFeedback("Pausing...")
      if (player.isPlaying) {
        await player.pause()
      }
    } else if (text.includes("resume") || text.includes("continue")) {
      setFeedback("Resuming...")
      if (!player.isPlaying) {
        await player.resume()
      }
    } else if (text.includes("volume")) {
      if (text.includes("up") || text.includes("increase") || text.includes("louder")) {
        const newVolume = Math.min(player.volume + 20, 100)
        await player.setVolume(newVolume)
        setFeedback(`Volume increased to ${newVolume}%`)
      } else if (
        text.includes("down") ||
        text.includes("decrease") ||
        text.includes("lower") ||
        text.includes("quieter")
      ) {
        const newVolume = Math.max(player.volume - 20, 0)
        await player.setVolume(newVolume)
        setFeedback(`Volume decreased to ${newVolume}%`)
      } else if (text.includes("mute")) {
        await player.setVolume(0)
        setFeedback("Muted")
      } else if (text.includes("max") || text.includes("full")) {
        await player.setVolume(100)
        setFeedback("Volume set to maximum")
      }
    } else if (text.includes("shuffle")) {
      await player.toggleShuffle()
      setFeedback(player.shuffleMode ? "Shuffle off" : "Shuffle on")
    } else if (text.includes("repeat")) {
      await player.toggleRepeat()
      setFeedback(`Repeat ${player.repeatMode}`)
    } else if (text.includes("home") || text.includes("main")) {
      setFeedback("Going to home...")
      router.push("/home")
    } else if (text.includes("liked") || text.includes("favorites")) {
      setFeedback("Opening liked songs...")
      router.push("/collection/tracks")
    } else if (text.includes("playlist")) {
      setFeedback("Opening playlists...")
      router.push("/collection/playlists")
    } else if (text.includes("library") || text.includes("collection")) {
      setFeedback("Opening library...")
      router.push("/collection")
    } else if (text.includes("what") && (text.includes("playing") || text.includes("song"))) {
      if (player.currentTrack) {
        setFeedback(
          `Playing: ${player.currentTrack.name} by ${player.currentTrack.artists.map((a) => a.name).join(", ")}`,
        )
      } else {
        setFeedback("Nothing is playing right now")
      }
    } else {
      setFeedback(`Command not recognized: "${text}"`)
    }

    // Clear feedback after 3 seconds
    setTimeout(() => {
      setFeedback("")
      setTranscript("")
    }, 3000)
  }

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setFeedback("Speech recognition not supported in this browser")
      setTimeout(() => setFeedback(""), 3000)
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
      setFeedback("Listening...")
    }
  }

  return (
    <div className="fixed bottom-32 right-6 z-50 flex flex-col items-end gap-2">
      {feedback && (
        <div className="max-w-xs rounded-lg bg-[#C9A86A]/20 px-4 py-2 text-sm text-[#C9A86A] backdrop-blur-md border border-[#C9A86A]/30 animate-in fade-in slide-in-from-bottom-2">
          {feedback}
        </div>
      )}
      {transcript && (
        <div className="max-w-xs rounded-lg bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
          "{transcript}"
        </div>
      )}
      <Button
        onClick={toggleListening}
        size="lg"
        className={`h-16 w-16 rounded-full ${
          isListening
            ? "bg-[#2ECC71] hover:bg-[#27AE60] shadow-[0_0_30px_rgba(46,204,113,0.6)] animate-pulse"
            : "bg-[#C9A86A] hover:bg-[#B89858] shadow-lg"
        } transition-all duration-300`}
        aria-label={isListening ? "Stop listening" : "Start voice command"}
      >
        {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
      </Button>
    </div>
  )
}
