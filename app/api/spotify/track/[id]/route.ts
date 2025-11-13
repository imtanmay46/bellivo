import { type NextRequest, NextResponse } from "next/server"
import { getTrackById } from "@/lib/spotify"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const track = await getTrackById(id)
    if (!track) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 })
    }
    return NextResponse.json(track)
  } catch (error) {
    console.error("Track API error:", error)
    return NextResponse.json({ error: "Failed to get track" }, { status: 500 })
  }
}
