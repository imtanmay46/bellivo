import { NextResponse } from "next/server"
import { getAccessToken } from "@/lib/spotify-client"

export async function GET() {
  try {
    const accessToken = await getAccessToken()

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({ access_token: accessToken })
  } catch (error) {
    console.error("[v0] Failed to get access token:", error)
    return NextResponse.json({ error: "Failed to get token" }, { status: 500 })
  }
}
