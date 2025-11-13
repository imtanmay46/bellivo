import { type NextRequest, NextResponse } from "next/server"
import { getRecommendations } from "@/lib/spotify"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const seedTracks = searchParams.get("seed_tracks")

  if (!seedTracks) {
    return NextResponse.json({ error: "Seed tracks parameter is required" }, { status: 400 })
  }

  try {
    const trackIds = seedTracks.split(",")
    const recommendations = await getRecommendations(trackIds)
    return NextResponse.json({ tracks: recommendations })
  } catch (error) {
    console.error("Recommendations API error:", error)
    return NextResponse.json({ error: "Failed to get recommendations" }, { status: 500 })
  }
}
