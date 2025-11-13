import { NextResponse } from "next/server"
import { getAccessToken } from "@/lib/spotify-client"

export async function GET() {
  try {
    const accessToken = await getAccessToken()

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const response = await fetch("https://api.spotify.com/v1/browse/new-releases?limit=10", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch new releases")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Failed to fetch new releases:", error)
    return NextResponse.json({ error: "Failed to fetch releases" }, { status: 500 })
  }
}
