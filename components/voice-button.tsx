"use client"

import { useState } from "react"
import { VoiceRecorder } from "./voice-recorder"

export function VoiceButton({ onRecordingComplete }: { onRecordingComplete?: (audioBlob: Blob) => void }) {
  const [toastMessage, setToastMessage] = useState<string>("")

  return (
    <>
      <VoiceRecorder
        onIntentDetected={(result) => {
          setToastMessage(result.message)
          setTimeout(() => setToastMessage(""), 3000)
        }}
        onError={(error) => {
          setToastMessage(`Error: ${error}`)
          setTimeout(() => setToastMessage(""), 3000)
        }}
      />
    </>
  )
}
