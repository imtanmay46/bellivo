import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { intent, slots } = await request.json()

    if (!intent) {
      return NextResponse.json({ error: "No intent provided" }, { status: 400 })
    }

    let result: any = { success: false, message: "", data: null }

    switch (intent) {
      case "PLAY_SONG": {
        const { song } = slots
        if (song) {
          const { data: songData, error } = await supabase
            .from("songs")
            .select("*")
            .ilike("title", `%${song}%`)
            .limit(1)
            .single()

          if (error || !songData) {
            result = {
              success: false,
              message: `Could not find song "${song}"`,
              data: null,
            }
          } else {
            result = {
              success: true,
              message: `Now playing ${songData.title} by ${songData.artist}`,
              data: songData,
            }
          }
        }
        break
      }

      case "ADD_TO_PLAYLIST": {
        const { song: songName, playlist: playlistName } = slots

        // Find song
        const { data: songData, error: songError } = await supabase
          .from("songs")
          .select("id")
          .ilike("title", `%${songName}%`)
          .limit(1)
          .single()

        if (songError || !songData) {
          result = {
            success: false,
            message: `Could not find song "${songName}"`,
            data: null,
          }
          break
        }

        // Find or create playlist
        let playlistId: string
        const { data: existingPlaylist } = await supabase
          .from("playlists")
          .select("id")
          .eq("user_id", user.id)
          .ilike("name", `%${playlistName}%`)
          .limit(1)
          .single()

        if (existingPlaylist) {
          playlistId = existingPlaylist.id
        } else {
          const { data: newPlaylist, error: createError } = await supabase
            .from("playlists")
            .insert({
              user_id: user.id,
              name: playlistName,
              public: false,
            })
            .select("id")
            .single()

          if (createError || !newPlaylist) {
            result = {
              success: false,
              message: `Could not create playlist "${playlistName}"`,
              data: null,
            }
            break
          }

          playlistId = newPlaylist.id
        }

        // Add song to playlist
        const { error: addError } = await supabase.from("playlist_songs").insert({
          playlist_id: playlistId,
          song_id: songData.id,
          position: 0,
        })

        if (addError) {
          result = {
            success: false,
            message: `Could not add song to playlist`,
            data: null,
          }
        } else {
          result = {
            success: true,
            message: `Added "${songName}" to "${playlistName}"`,
            data: { playlistId, songId: songData.id },
          }
        }
        break
      }

      case "CREATE_PLAYLIST": {
        const { name = "New Playlist" } = slots

        const { data: newPlaylist, error } = await supabase
          .from("playlists")
          .insert({
            user_id: user.id,
            name,
            public: false,
          })
          .select()
          .single()

        if (error || !newPlaylist) {
          result = {
            success: false,
            message: `Could not create playlist`,
            data: null,
          }
        } else {
          result = {
            success: true,
            message: `Created new playlist "${name}"`,
            data: newPlaylist,
          }
        }
        break
      }

      case "SEARCH": {
        const { query } = slots

        if (!query) {
          result = {
            success: false,
            message: "No search query provided",
            data: null,
          }
          break
        }

        const { data: songs, error } = await supabase
          .from("songs")
          .select("*")
          .or(`title.ilike.%${query}%,artist.ilike.%${query}%,album.ilike.%${query}%`)
          .limit(10)

        if (error) {
          result = {
            success: false,
            message: "Search failed",
            data: null,
          }
        } else {
          result = {
            success: true,
            message: `Found ${songs?.length || 0} results for "${query}"`,
            data: songs,
          }
        }
        break
      }

      case "PAUSE":
      case "RESUME":
      case "SKIP_NEXT":
      case "SKIP_PREV":
      case "SHUFFLE_ON":
      case "SHUFFLE_OFF":
      case "REPEAT_ONE":
      case "REPEAT_ALL":
        result = {
          success: true,
          message: `${intent.replace(/_/g, " ")} action executed`,
          data: null,
        }
        break

      default:
        result = {
          success: false,
          message: "Unknown intent",
          data: null,
        }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Execution error:", error)
    return NextResponse.json({ error: "Execution failed" }, { status: 500 })
  }
}
