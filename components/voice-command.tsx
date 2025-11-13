"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface VoiceCommandProps {
  onCommand?: (command: string, transcript: string) => void
}

export function VoiceCommand({ onCommand }: VoiceCommandProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [feedback, setFeedback] = useState("")
  const recognitionRef = useRef<any>(null)
  const router = useRouter()

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
    console.log("[v0] Processing command:", text)

    // Play song command
    if (text.includes("play")) {
      const songName = text.replace("play", "").trim()
      setFeedback(`Searching for "${songName}"...`)
      if (onCommand) {
        onCommand("PLAY", songName)
      }
      router.push(`/home?search=${encodeURIComponent(songName)}&autoplay=true`)
    }
    // Search command
    else if (text.includes("search")) {
      const query = text.replace("search", "").replace("for", "").trim()
      setFeedback(`Searching for "${query}"...`)
      if (onCommand) {
        onCommand("SEARCH", query)
      }
      router.push(`/home?search=${encodeURIComponent(query)}`)
    }
    // Next/Skip command
    else if (text.includes("next") || text.includes("skip")) {
      setFeedback("Skipping to next track...")
      if (onCommand) {
        onCommand("NEXT", "")
      }
    }
    // Pause command
    else if (text.includes("pause") || text.includes("stop")) {
      setFeedback("Pausing playback...")
      if (onCommand) {
        onCommand("PAUSE", "")
      }
    }
    // Add to favorites
    else if (text.includes("favorite") || text.includes("like")) {
      setFeedback("Adding to favorites...")
      if (onCommand) {
        onCommand("FAVORITE", "")
      }
    } else {
      setFeedback(`Command not recognized: "${text}"`)
    }

    // Clear feedback after 3 seconds
    setTimeout(() => setFeedback(""), 3000)
  }

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setFeedback("Speech recognition not supported in this browser")
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
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-2">
      {feedback && (
        <div className="rounded-lg bg-[#C9A86A]/20 px-4 py-2 text-sm text-[#C9A86A] backdrop-blur-md border border-[#C9A86A]/30">
          {feedback}
        </div>
      )}
      {transcript && (
        <div className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md">"{transcript}"</div>
      )}
      <Button
        onClick={toggleListening}
        size="lg"
        className={`h-16 w-16 rounded-full ${
          isListening
            ? "bg-[#2ECC71] hover:bg-[#27AE60] shadow-[0_0_30px_rgba(46,204,113,0.6)]"
            : "bg-[#C9A86A] hover:bg-[#B89858] shadow-lg"
        } transition-all duration-300`}
      >
        {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
      </Button>
    </div>
  )
}
