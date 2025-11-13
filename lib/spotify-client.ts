import { cookies } from "next/headers"

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!
const SPOTIFY_REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || "http://localhost:3000/auth/callback"

export interface SpotifyTokens {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
}

export class SpotifyClient {
  private static async getBasicAuth(): Promise<string> {
    return Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")
  }

  static async getAuthUrl(): Promise<string> {
    const scopes = [
      "user-read-private",
      "user-read-email",
      "user-read-playback-state",
      "user-modify-playback-state",
      "user-read-currently-playing",
      "streaming",
      "playlist-read-private",
      "playlist-read-collaborative",
      "playlist-modify-private",
      "playlist-modify-public",
      "user-library-read",
      "user-library-modify",
      "user-top-read",
      "user-read-recently-played",
    ].join(" ")

    const params = new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      response_type: "code",
      redirect_uri: SPOTIFY_REDIRECT_URI,
      scope: scopes,
      show_dialog: "true",
    })

    return `https://accounts.spotify.com/authorize?${params.toString()}`
  }

  static async getTokens(code: string): Promise<SpotifyTokens> {
    const basicAuth = await this.getBasicAuth()

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to get tokens")
    }

    return response.json()
  }

  static async refreshToken(refresh_token: string): Promise<SpotifyTokens> {
    const basicAuth = await this.getBasicAuth()

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to refresh token")
    }

    return response.json()
  }

  static async getCurrentUser(accessToken: string) {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to get current user")
    }

    return response.json()
  }
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("spotify_access_token")?.value
  const refreshToken = cookieStore.get("spotify_refresh_token")?.value
  const expiresAt = cookieStore.get("spotify_expires_at")?.value

  if (!accessToken || !refreshToken) {
    return null
  }

  // Check if token is expired
  if (expiresAt && Date.now() >= Number.parseInt(expiresAt)) {
    try {
      const tokens = await SpotifyClient.refreshToken(refreshToken)

      // Update cookies with new tokens
      cookieStore.set("spotify_access_token", tokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: tokens.expires_in,
      })

      cookieStore.set("spotify_expires_at", (Date.now() + tokens.expires_in * 1000).toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: tokens.expires_in,
      })

      return tokens.access_token
    } catch (error) {
      console.error("[v0] Failed to refresh token:", error)
      return null
    }
  }

  return accessToken
}
