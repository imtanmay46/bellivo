"use client"
import { Music } from "lucide-react"
import { getAuthorizationUrl } from "@/lib/spotify-auth"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function LoginPage() {
  const handleSpotifyLogin = () => {
    const authUrl = getAuthorizationUrl()
    window.location.href = authUrl
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-b from-[#0B0B0B] via-[#1a1a1f] to-[#0B0B0B]">
      {/* Gold glow effects */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#C9A86A]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-20 w-80 h-80 bg-[#2ECC71]/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col gap-8 items-center text-center">
          {/* Bellivo Logo */}
          <div className="flex flex-col items-center gap-4">
            <Image src="/images/bellivo-logo-dark.png" alt="Bellivo" width={80} height={80} className="h-20 w-auto" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#C9A86A] to-[#E8D4B8] bg-clip-text text-transparent">
              Bellivo
            </h1>
            <p className="text-gray-400">Voice-Assisted Music Streaming</p>
          </div>

          {/* Spotify Login Card */}
          <div className="w-full rounded-2xl bg-black/40 backdrop-blur-xl border border-[#C9A86A]/20 p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-white">Welcome to Bellivo</h2>
                <p className="text-sm text-gray-400">
                  Connect with Spotify to access millions of songs with voice control
                </p>
              </div>

              <Button
                onClick={handleSpotifyLogin}
                className="w-full h-14 bg-[#1DB954] hover:bg-[#1ed760] text-white font-semibold text-lg rounded-full flex items-center justify-center gap-3 transition-all"
              >
                <Music size={24} />
                Continue with Spotify
              </Button>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex-1 h-px bg-gray-700" />
                <span>Secure OAuth 2.0</span>
                <div className="flex-1 h-px bg-gray-700" />
              </div>

              <p className="text-xs text-gray-500 text-center">
                By continuing, you agree to grant Bellivo access to your Spotify account. We use this to provide you
                with personalized music streaming and voice control features.
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            Don't have Spotify?{" "}
            <a
              href="https://www.spotify.com/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C9A86A] hover:underline"
            >
              Create a free account
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
