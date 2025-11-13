import { type NextRequest, NextResponse } from "next/server"
import { getAccessToken } from "@/lib/spotify-auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getAccessToken()

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const response = await fetch(`https://api.spotify.com/v1/albums/${params.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch album" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Album API error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
