"use client"

import { useState } from "react"

export interface VoiceFeedbackState {
  isOpen: boolean
  type: "success" | "confirmation" | "error"
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
}

export function useVoiceFeedback() {
  const [feedback, setFeedback] = useState<VoiceFeedbackState>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  })

  const showSuccess = (title: string, message: string, autoClose = true) => {
    setFeedback({
      isOpen: true,
      type: "success",
      title,
      message,
      autoClose,
    })
  }

  const showConfirmation = (title: string, message: string, onConfirm: () => void, onCancel: () => void) => {
    setFeedback({
      isOpen: true,
      type: "confirmation",
      title,
      message,
      confirmText: "Yes",
      cancelText: "No",
      onConfirm,
      onCancel: () => {
        onCancel()
        closeFeedback()
      },
    })
  }

  const showError = (title: string, message: string) => {
    setFeedback({
      isOpen: true,
      type: "error",
      title,
      message,
    })
  }

  const closeFeedback = () => {
    setFeedback({ ...feedback, isOpen: false })
  }

  return { feedback, showSuccess, showConfirmation, showError, closeFeedback }
}
