"use client"

const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!
const SPOTIFY_REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || "http://localhost:4200/auth/callback"
const SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-library-read",
  "user-library-modify",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-top-read",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-modify-private",
].join(" ")

export function getSpotifyAuthUrl(): string {
  const state = generateRandomString(16)
  const codeVerifier = generateRandomString(128)

  // Store code verifier for PKCE
  if (typeof window !== "undefined") {
    localStorage.setItem("spotify_code_verifier", codeVerifier)
    localStorage.setItem("spotify_auth_state", state)
  }

  const challenge = generateCodeChallenge(codeVerifier)

  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: SPOTIFY_REDIRECT_URI,
    state: state,
    scope: SCOPES,
    code_challenge_method: "S256",
    code_challenge: challenge,
  })

  return `https://accounts.spotify.com/authorize?${params.toString()}`
}

function generateRandomString(length: number): string {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const values = crypto.getRandomValues(new Uint8Array(length))
  return values.reduce((acc, x) => acc + possible[x % possible.length], "")
}

function generateCodeChallenge(verifier: string): string {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = crypto.subtle.digest("SHA-256", data)

  return digest
    .then((hash) => {
      const bytes = new Uint8Array(hash)
      return btoa(String.fromCharCode(...bytes))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "")
    })
    .toString()
}

export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string
  refresh_token: string
  expires_in: number
}> {
  const codeVerifier = localStorage.getItem("spotify_code_verifier")

  if (!codeVerifier) {
    throw new Error("Code verifier not found")
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      grant_type: "authorization_code",
      code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to exchange code for token")
  }

  const data = await response.json()

  // Store tokens securely
  localStorage.setItem("spotify_access_token", data.access_token)
  localStorage.setItem("spotify_refresh_token", data.refresh_token)
  localStorage.setItem("spotify_token_expires_at", (Date.now() + data.expires_in * 1000).toString())

  // Clean up
  localStorage.removeItem("spotify_code_verifier")
  localStorage.removeItem("spotify_auth_state")

  return data
}

export async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem("spotify_refresh_token")

  if (!refreshToken) {
    throw new Error("No refresh token available")
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to refresh token")
  }

  const data = await response.json()

  localStorage.setItem("spotify_access_token", data.access_token)
  localStorage.setItem("spotify_token_expires_at", (Date.now() + data.expires_in * 1000).toString())

  return data.access_token
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null

  const token = localStorage.getItem("spotify_access_token")
  const expiresAt = localStorage.getItem("spotify_token_expires_at")

  if (!token || !expiresAt) return null

  // Check if token is expired
  if (Date.now() >= Number.parseInt(expiresAt)) {
    refreshAccessToken().catch(console.error)
    return null
  }

  return token
}

export function isAuthenticated(): boolean {
  return !!getAccessToken()
}

export function logout() {
  localStorage.removeItem("spotify_access_token")
  localStorage.removeItem("spotify_refresh_token")
  localStorage.removeItem("spotify_token_expires_at")
}
