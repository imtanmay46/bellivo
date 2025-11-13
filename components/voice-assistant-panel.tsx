"use client"

import { useState } from "react"
import { VoiceRecorder } from "./voice-recorder"
import { ConfirmationDialog } from "./confirmation-dialog"
import { Card, CardContent } from "@/components/ui/card"

interface AssistantResponse {
  intent: string
  slots: Record<string, string>
  message: string
  requiresConfirmation?: boolean
}

interface VoiceAssistantPanelProps {
  onActionExecuted?: (response: AssistantResponse) => void
}

export function VoiceAssistantPanel({ onActionExecuted }: VoiceAssistantPanelProps) {
  const [lastResponse, setLastResponse] = useState<AssistantResponse | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleIntentDetected = (result: AssistantResponse) => {
    setLastResponse(result)

    // Show confirmation for potentially risky actions
    if (result.intent === "DELETE_PLAYLIST" || result.intent === "CLEAR_PLAYLIST") {
      setShowConfirm(true)
    } else {
      onActionExecuted?.(result)
    }
  }

  return (
    <>
      <VoiceRecorder onIntentDetected={handleIntentDetected} />

      {/* Last action feedback */}
      {lastResponse && !showConfirm && (
        <Card className="fixed bottom-32 right-6 w-64 bg-card/80 backdrop-blur-xl border-border/50 z-40">
          <CardContent className="p-4">
            <p className="text-sm text-white">{lastResponse.message}</p>
          </CardContent>
        </Card>
      )}

      {/* Confirmation dialog */}
      {lastResponse && (
        <ConfirmationDialog
          isOpen={showConfirm}
          type="confirmation"
          title={`Confirm ${lastResponse.intent.replace(/_/g, " ")}`}
          message={lastResponse.message}
          confirmText="Yes, proceed"
          cancelText="Cancel"
          onConfirm={() => {
            onActionExecuted?.(lastResponse)
            setShowConfirm(false)
          }}
          onCancel={() => {
            setShowConfirm(false)
            setLastResponse(null)
          }}
        />
      )}
    </>
  )
}
