// Spotify API integration utility
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
const SPOTIFY_API_URL = "https://api.spotify.com/v1"

// Get Spotify access token (Client Credentials Flow)
async function getSpotifyToken(): Promise<string> {
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
    next: { revalidate: 3000 }, // Cache token for 50 minutes
  })

  if (!response.ok) {
    throw new Error("Failed to get Spotify token")
  }

  const data = await response.json()
  return data.access_token
}

// Search for tracks on Spotify
export async function searchTracks(query: string, limit = 20) {
  try {
    const token = await getSpotifyToken()
    const response = await fetch(`${SPOTIFY_API_URL}/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to search tracks")
    }

    const data = await response.json()
    return data.tracks.items.map((track: any) => ({
      id: track.id,
      title: track.name,
      artist: track.artists[0]?.name || "Unknown Artist",
      album: track.album.name,
      image_url: track.album.images[0]?.url || "",
      preview_url: track.preview_url,
      duration_ms: track.duration_ms,
      spotify_url: track.external_urls.spotify,
    }))
  } catch (error) {
    console.error("Spotify search error:", error)
    return []
  }
}

// Get track by ID
export async function getTrackById(trackId: string) {
  try {
    const token = await getSpotifyToken()
    const response = await fetch(`${SPOTIFY_API_URL}/tracks/${trackId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to get track")
    }

    const track = await response.json()
    return {
      id: track.id,
      title: track.name,
      artist: track.artists[0]?.name || "Unknown Artist",
      album: track.album.name,
      image_url: track.album.images[0]?.url || "",
      preview_url: track.preview_url,
      duration_ms: track.duration_ms,
      spotify_url: track.external_urls.spotify,
    }
  } catch (error) {
    console.error("Spotify get track error:", error)
    return null
  }
}

// Get recommendations
export async function getRecommendations(seedTrackIds: string[], limit = 10) {
  try {
    const token = await getSpotifyToken()
    const response = await fetch(
      `${SPOTIFY_API_URL}/recommendations?seed_tracks=${seedTrackIds.join(",")}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to get recommendations")
    }

    const data = await response.json()
    return data.tracks.map((track: any) => ({
      id: track.id,
      title: track.name,
      artist: track.artists[0]?.name || "Unknown Artist",
      album: track.album.name,
      image_url: track.album.images[0]?.url || "",
      preview_url: track.preview_url,
      duration_ms: track.duration_ms,
      spotify_url: track.external_urls.spotify,
    }))
  } catch (error) {
    console.error("Spotify recommendations error:", error)
    return []
  }
}

// Get featured playlists
export async function getFeaturedPlaylists(limit = 10) {
  try {
    const token = await getSpotifyToken()
    const response = await fetch(`${SPOTIFY_API_URL}/browse/featured-playlists?limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to get featured playlists")
    }

    const data = await response.json()
    return data.playlists.items
  } catch (error) {
    console.error("Spotify featured playlists error:", error)
    return []
  }
}
