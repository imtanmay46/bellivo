import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  const authHeader = request.headers.get("authorization")
  const token = authHeader?.replace("Bearer ", "")

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?` +
        new URLSearchParams({
          q: query,
          type: "track,artist,album,playlist",
          limit: "20",
        }),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!response.ok) {
      const error = await response.json()
      console.error("[v0] Spotify search error:", error)
      return NextResponse.json({ error: "Failed to search" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Search API error:", error)
    return NextResponse.json({ error: "Failed to search" }, { status: 500 })
  }
}
