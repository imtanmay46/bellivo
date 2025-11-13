import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const seedTracks = searchParams.get("seed_tracks") || ""
  const seedArtists = searchParams.get("seed_artists") || ""
  const seedGenres = searchParams.get("seed_genres") || "pop,rock,indie"

  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const params = new URLSearchParams({
      limit: "20",
      ...(seedTracks && { seed_tracks: seedTracks }),
      ...(seedArtists && { seed_artists: seedArtists }),
      ...(seedGenres && { seed_genres: seedGenres }),
    })

    const response = await fetch(`https://api.spotify.com/v1/recommendations?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Recommendations error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
