"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"
import { useSpeech } from "./text-to-speech"
import { useEffect } from "react"

interface ConfirmationDialogProps {
  isOpen: boolean
  type: "success" | "confirmation" | "error"
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  autoClose?: boolean
  autoCloseTime?: number
}

export function ConfirmationDialog({
  isOpen,
  type,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  autoClose = true,
  autoCloseTime = 3000,
}: ConfirmationDialogProps) {
  const { speak } = useSpeech()

  useEffect(() => {
    if (isOpen) {
      // Speak the message for accessibility
      speak(message)

      // Auto-close if specified
      if (autoClose && type === "success") {
        const timer = setTimeout(() => {
          onCancel?.()
        }, autoCloseTime)

        return () => clearTimeout(timer)
      }
    }
  }, [isOpen, message, type, autoClose, autoCloseTime, speak, onCancel])

  if (!isOpen) return null

  const bgColor =
    type === "success"
      ? "bg-green-600/10 border-green-600/30"
      : type === "error"
        ? "bg-red-600/10 border-red-600/30"
        : "bg-blue-600/10 border-blue-600/30"

  const titleColor = type === "success" ? "text-green-500" : type === "error" ? "text-red-500" : "text-blue-500"

  const icon =
    type === "success" ? (
      <CheckCircle size={24} className={titleColor} />
    ) : (
      <AlertCircle size={24} className={titleColor} />
    )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />

      {/* Dialog */}
      <Card className={`relative w-full max-w-md ${bgColor} border`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            {icon}
            <CardTitle className={titleColor}>{title}</CardTitle>
          </div>
          <CardDescription className="mt-2">{message}</CardDescription>
        </CardHeader>

        {(type === "confirmation" || type === "error") && (
          <CardContent className="flex gap-3">
            {type === "confirmation" && (
              <>
                <Button onClick={onConfirm} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                  {confirmText}
                </Button>
                <Button onClick={onCancel} variant="outline" className="flex-1 bg-transparent">
                  {cancelText}
                </Button>
              </>
            )}

            {type === "error" && (
              <Button onClick={onCancel} className="w-full bg-red-600 hover:bg-red-700 text-white">
                Dismiss
              </Button>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  )
}
