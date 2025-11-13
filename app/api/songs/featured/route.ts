import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Fetch featured songs from database
    const { data: songs, error } = await supabase
      .from("songs")
      .select("*")
      .limit(20)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Failed to fetch featured songs:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Transform to match Track interface
    const tracks = songs?.map((song) => ({
      id: song.id,
      title: song.title,
      artist: song.artist,
      album: song.album,
      image_url: song.image_url,
      preview_url: song.preview_url,
      duration_ms: song.duration_ms,
      spotify_id: song.metadata?.spotify_id,
    }))

    return NextResponse.json({ songs: tracks || [] })
  } catch (error) {
    console.error("[v0] Featured songs API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
