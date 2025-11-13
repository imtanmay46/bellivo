"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { exchangeCodeForToken } from "@/lib/spotify-auth"
import { Loader2 } from "lucide-react"

export default function SpotifyCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const storedState = localStorage.getItem("spotify_auth_state")

    if (!code) {
      setError("No authorization code received")
      return
    }

    if (state !== storedState) {
      setError("State mismatch - possible CSRF attack")
      return
    }

    exchangeCodeForToken(code)
      .then(async (tokens) => {
        console.log("[v0] Successfully exchanged code for tokens")

        // Create/update user profile in Supabase
        const response = await fetch("/api/auth/spotify-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: tokens.access_token }),
        })

        if (response.ok) {
          router.push("/home")
        } else {
          setError("Failed to create user profile")
        }
      })
      .catch((err) => {
        console.error("[v0] Token exchange error:", err)
        setError("Failed to authenticate with Spotify")
      })
  }, [searchParams, router])

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0B]">
        <div className="rounded-xl bg-red-500/10 p-8 text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-500">Authentication Error</h1>
          <p className="mb-6 text-gray-400">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="rounded-lg bg-[#C9A86A] px-6 py-3 font-semibold text-black transition hover:bg-[#B39860]"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0B]">
      <Loader2 className="mb-4 h-12 w-12 animate-spin text-[#C9A86A]" />
      <p className="text-lg text-gray-400">Authenticating with Spotify...</p>
    </div>
  )
}
