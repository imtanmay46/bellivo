import { NextResponse } from "next/server"
import { SpotifyClient } from "@/lib/spotify-client"

export async function GET() {
  try {
    const authUrl = await SpotifyClient.getAuthUrl()
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error("[v0] Spotify login error:", error)
    return NextResponse.json({ error: "Failed to initiate Spotify login" }, { status: 500 })
  }
}
