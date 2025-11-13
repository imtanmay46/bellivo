import { NextResponse } from "next/server"
import { getAccessToken, SpotifyClient } from "@/lib/spotify-client"

export async function GET() {
  try {
    const accessToken = await getAccessToken()

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const user = await SpotifyClient.getCurrentUser(accessToken)

    return NextResponse.json({
      display_name: user.display_name || user.id,
      avatar_url: user.images?.[0]?.url,
      email: user.email,
    })
  } catch (error) {
    console.error("[v0] Failed to get user:", error)
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 })
  }
}
