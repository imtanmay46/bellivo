"use client"

import { useState } from "react"
import { Mic, Square, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface VoiceRecorderProps {
  onIntentDetected?: (intent: { intent: string; slots: Record<string, string>; message: string }) => void
  onError?: (error: string) => void
}

export function VoiceRecorder({ onIntentDetected, onError }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [chunks, setChunks] = useState<Blob[]>([])
  const [feedback, setFeedback] = useState<string>("")

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const audioChunks: Blob[] = []

      recorder.ondataavailable = (e) => {
        audioChunks.push(e.data)
      }

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" })
        await processAudio(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
      setFeedback("Listening...")
    } catch (error) {
      onError?.("Microphone access denied")
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop()
      setIsRecording(false)
      setIsProcessing(true)
      setFeedback("Processing...")
    }
  }

  const processAudio = async (audioBlob: Blob) => {
    try {
      // Step 1: Transcribe
      const formData = new FormData()
      formData.append("audio", audioBlob)

      const transcribeRes = await fetch("/api/voice/transcribe", {
        method: "POST",
        body: formData,
      })

      if (!transcribeRes.ok) {
        throw new Error("Transcription failed")
      }

      const { text } = await transcribeRes.json()
      setFeedback(`Heard: "${text}"`)

      // Step 2: Parse intent
      const intentRes = await fetch("/api/voice/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })

      if (!intentRes.ok) {
        throw new Error("Intent parsing failed")
      }

      const intentData = await intentRes.json()

      // Step 3: Execute intent
      const executeRes = await fetch("/api/voice/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: intentData.intent,
          slots: intentData.slots,
        }),
      })

      if (!executeRes.ok) {
        throw new Error("Execution failed")
      }

      const result = await executeRes.json()

      onIntentDetected?.({
        intent: intentData.intent,
        slots: intentData.slots,
        message: result.message,
      })

      setFeedback(result.message)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Processing failed"
      onError?.(errorMsg)
      setFeedback(`Error: ${errorMsg}`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed bottom-24 right-6 z-50 space-y-3">
      {/* Feedback card */}
      {feedback && (
        <Card className="w-64 bg-card/80 backdrop-blur-xl border-border/50">
          <CardContent className="p-3">
            <p className="text-sm text-white line-clamp-2">{feedback}</p>
          </CardContent>
        </Card>
      )}

      {/* Recording button */}
      <div className="flex justify-end">
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`rounded-full w-16 h-16 flex items-center justify-center transition-all shadow-lg ${
            isRecording ? "bg-red-600 hover:bg-red-700 animate-pulse" : "bg-green-600 hover:bg-green-700"
          } text-white`}
        >
          {isProcessing ? (
            <Loader size={24} className="animate-spin" />
          ) : isRecording ? (
            <Square size={24} />
          ) : (
            <Mic size={24} />
          )}
        </Button>
      </div>
    </div>
  )
}
