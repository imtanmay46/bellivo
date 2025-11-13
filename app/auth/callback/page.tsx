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
    console.log("[v0] Callback page loaded")
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const storedState = typeof window !== "undefined" ? localStorage.getItem("spotify_auth_state") : null

    console.log("[v0] Code:", code ? "received" : "missing")
    console.log("[v0] State:", state, "Stored:", storedState)

    if (!code) {
      console.error("[v0] No authorization code received")
      setError("No authorization code received from Spotify")
      return
    }

    if (state !== storedState) {
      console.error("[v0] State mismatch")
      setError("State mismatch - possible CSRF attack")
      return
    }

    exchangeCodeForToken(code)
      .then(async (tokens) => {
        console.log("[v0] Successfully exchanged code for tokens")

        const userResponse = await fetch("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        })

        if (!userResponse.ok) {
          throw new Error("Failed to fetch Spotify user profile")
        }

        const spotifyUser = await userResponse.json()
        console.log("[v0] Spotify user:", spotifyUser.display_name)

        try {
          const profileResponse = await fetch("/api/auth/spotify-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              accessToken: tokens.access_token,
              spotifyUser,
            }),
          })

          if (profileResponse.ok) {
            console.log("[v0] Profile saved, redirecting to /home")
            router.push("/home")
          } else {
            const errorData = await profileResponse.json()
            console.error("[v0] Profile save failed:", errorData)
            console.log("[v0] Continuing to /home despite profile save failure")
            router.push("/home")
          }
        } catch (profileError) {
          console.error("[v0] Profile save request failed:", profileError)
          console.log("[v0] Continuing to /home despite profile error")
          router.push("/home")
        }
      })
      .catch((err) => {
        console.error("[v0] Token exchange error:", err)
        setError(`Failed to authenticate: ${err.message}`)
      })
  }, [searchParams, router])

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0B]">
        <div className="rounded-xl bg-red-500/10 p-8 text-center max-w-md">
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
      <p className="mt-2 text-sm text-gray-500">Please wait while we complete your login</p>
    </div>
  )
}
