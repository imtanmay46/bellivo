"use client"

import { useState, useEffect } from "react"

interface TextToSpeechProps {
  text: string
  autoPlay?: boolean
  onComplete?: () => void
}

export function TextToSpeech({ text, autoPlay = true, onComplete }: TextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isAvailable, setIsAvailable] = useState(false)

  useEffect(() => {
    // Check if Web Speech API is available
    const speechSynthesis = window.speechSynthesis
    setIsAvailable(!!speechSynthesis)
  }, [])

  useEffect(() => {
    if (autoPlay && text && isAvailable) {
      speak()
    }
  }, [text, autoPlay, isAvailable])

  const speak = () => {
    if (!isAvailable || !text) return

    const speechSynthesis = window.speechSynthesis

    // Cancel any ongoing speech
    speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.95
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => {
      setIsSpeaking(true)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      onComplete?.()
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
    }

    speechSynthesis.speak(utterance)
  }

  const stop = () => {
    if (isAvailable) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  if (!isAvailable) return null

  return {
    isSpeaking,
    speak,
    stop,
  }
}

// Hook version for easier integration
export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const speak = (text: string) => {
    const speechSynthesis = window.speechSynthesis

    if (!speechSynthesis) return

    speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.95
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    speechSynthesis.speak(utterance)
  }

  const stop = () => {
    window.speechSynthesis?.cancel()
    setIsSpeaking(false)
  }

  return { isSpeaking, speak, stop }
}
