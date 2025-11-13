import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json()

    // Fetch user profile from Spotify
    const spotifyResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!spotifyResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch Spotify profile" }, { status: 400 })
    }

    const spotifyUser = await spotifyResponse.json()

    // Create or update user in Supabase
    const supabase = await createClient()

    // First, create auth user if doesn't exist
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: spotifyUser.email,
      password: spotifyUser.id, // Use Spotify ID as password
    })

    if (authError && authError.message.includes("Invalid login credentials")) {
      // User doesn't exist, create them
      const { error: signUpError } = await supabase.auth.signUp({
        email: spotifyUser.email,
        password: spotifyUser.id,
        options: {
          data: {
            display_name: spotifyUser.display_name,
            avatar_url: spotifyUser.images?.[0]?.url,
          },
        },
      })

      if (signUpError) {
        return NextResponse.json({ error: signUpError.message }, { status: 400 })
      }
    }

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Failed to get user" }, { status: 400 })
    }

    // Upsert profile
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: user.id,
      email: spotifyUser.email,
      display_name: spotifyUser.display_name,
      avatar_url: spotifyUser.images?.[0]?.url || null,
      premium: spotifyUser.product === "premium",
      updated_at: new Date().toISOString(),
    })

    if (profileError) {
      console.error("[v0] Profile upsert error:", profileError)
      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("[v0] Spotify profile API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
