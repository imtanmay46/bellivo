import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json()

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({ access_token: accessToken })
  } catch (error) {
    console.error("[v0] Failed to get access token:", error)
    return NextResponse.json({ error: "Failed to get token" }, { status: 500 })
  }
}

// Fallback GET method for legacy support
export async function GET() {
  return NextResponse.json({ error: "Use POST method with accessToken in body" }, { status: 400 })
}
