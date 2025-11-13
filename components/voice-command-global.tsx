"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { usePlayer } from "@/lib/player-context"

export function VoiceCommandGlobal() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [feedback, setFeedback] = useState("")
  const recognitionRef = useRef<any>(null)
  const router = useRouter()
  const { togglePlay, nextTrack, previousTrack, toggleFavorite, playTrack, setQueue } = usePlayer()

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

    // Play song command
    if (text.includes("play")) {
      const songName = text.replace("play", "").trim()
      setFeedback(`Searching for "${songName}"...`)

      // Search Spotify and play first result
      try {
        const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(songName)}`)
        const data = await response.json()

        if (data.tracks && data.tracks.length > 0) {
          const track = data.tracks[0]
          playTrack(track)
          setQueue(data.tracks)
          setFeedback(`Now playing: ${track.title} by ${track.artist}`)
        } else {
          setFeedback(`No results found for "${songName}"`)
        }
      } catch (error) {
        console.error("[v0] Voice search error:", error)
        setFeedback("Search failed. Please try again.")
      }
    }
    // Search command
    else if (text.includes("search")) {
      const query = text.replace("search", "").replace("for", "").trim()
      setFeedback(`Searching for "${query}"...`)
      router.push(`/home?search=${encodeURIComponent(query)}`)
    }
    // Next/Skip command
    else if (text.includes("next") || text.includes("skip")) {
      setFeedback("Skipping to next track...")
      nextTrack()
    }
    // Previous command
    else if (text.includes("previous") || text.includes("back")) {
      setFeedback("Going to previous track...")
      previousTrack()
    }
    // Pause/Resume command
    else if (text.includes("pause") || text.includes("stop") || text.includes("resume")) {
      setFeedback(text.includes("pause") || text.includes("stop") ? "Pausing..." : "Resuming...")
      togglePlay()
    }
    // Add to favorites
    else if (text.includes("favorite") || text.includes("like")) {
      setFeedback("Adding to favorites...")
      toggleFavorite()
    }
    // Go to home
    else if (text.includes("home") || text.includes("main")) {
      setFeedback("Going to home...")
      router.push("/home")
    }
    // Go to favorites
    else if (text.includes("favorites") || text.includes("liked")) {
      setFeedback("Opening favorites...")
      router.push("/favorites")
    }
    // Go to explore
    else if (text.includes("explore") || text.includes("discover")) {
      setFeedback("Opening explore...")
      router.push("/explore")
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
