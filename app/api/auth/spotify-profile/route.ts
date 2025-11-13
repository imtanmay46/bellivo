import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { accessToken, spotifyUser } = await request.json()

    console.log("[v0] Spotify profile API called for user:", spotifyUser?.display_name)

    let user = spotifyUser

    if (!user) {
      // Fetch user profile from Spotify
      const spotifyResponse = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!spotifyResponse.ok) {
        console.error("[v0] Failed to fetch Spotify profile")
        return NextResponse.json({ error: "Failed to fetch Spotify profile" }, { status: 400 })
      }

      user = await spotifyResponse.json()
    }

    const supabase = await createClient()

    // Use Spotify ID as the profile ID
    const profileId = user.id

    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: profileId,
        email: user.email,
        display_name: user.display_name,
        avatar_url: user.images?.[0]?.url || null,
        premium: user.product === "premium",
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "id",
      },
    )

    if (profileError) {
      console.error("[v0] Profile upsert error:", profileError)
      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    console.log("[v0] Profile saved successfully for:", user.display_name)
    return NextResponse.json({ success: true, profileId })
  } catch (error) {
    console.error("[v0] Spotify profile API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
