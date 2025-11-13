import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export interface IntentResult {
  intent: string
  slots: Record<string, string>
  confidence: number
}

const INTENTS = {
  PLAY_SONG: "PLAY_SONG",
  PAUSE: "PAUSE",
  RESUME: "RESUME",
  SKIP_NEXT: "SKIP_NEXT",
  SKIP_PREV: "SKIP_PREV",
  ADD_TO_PLAYLIST: "ADD_TO_PLAYLIST",
  CREATE_PLAYLIST: "CREATE_PLAYLIST",
  SEARCH: "SEARCH",
  GET_CURRENT: "GET_CURRENT",
  LIKE_SONG: "LIKE_SONG",
  UNLIKE_SONG: "UNLIKE_SONG",
  SHUFFLE_ON: "SHUFFLE_ON",
  SHUFFLE_OFF: "SHUFFLE_OFF",
  REPEAT_ONE: "REPEAT_ONE",
  REPEAT_ALL: "REPEAT_ALL",
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    // Simple rule-based intent classification (demo)
    const lowerText = text.toLowerCase()
    let intent: IntentResult

    if (lowerText.includes("play") || lowerText.includes("play song") || lowerText.includes("play track")) {
      const songMatch = text.match(/play\s+(.+?)(?:\s+by|\s+from|$)/i)
      intent = {
        intent: INTENTS.PLAY_SONG,
        slots: {
          song: songMatch ? songMatch[1].trim() : "",
        },
        confidence: 0.92,
      }
    } else if (lowerText.includes("pause")) {
      intent = {
        intent: INTENTS.PAUSE,
        slots: {},
        confidence: 0.98,
      }
    } else if (lowerText.includes("resume") || lowerText.includes("play") || lowerText.includes("unpause")) {
      intent = {
        intent: INTENTS.RESUME,
        slots: {},
        confidence: 0.9,
      }
    } else if (lowerText.includes("skip") || lowerText.includes("next")) {
      intent = {
        intent: INTENTS.SKIP_NEXT,
        slots: {},
        confidence: 0.95,
      }
    } else if (lowerText.includes("add") && lowerText.includes("playlist")) {
      const songMatch = text.match(/add\s+(.+?)\s+to/i)
      const playlistMatch = text.match(/to\s+(.+?)$/i)
      intent = {
        intent: INTENTS.ADD_TO_PLAYLIST,
        slots: {
          song: songMatch ? songMatch[1].trim() : "",
          playlist: playlistMatch ? playlistMatch[1].trim() : "",
        },
        confidence: 0.88,
      }
    } else if (lowerText.includes("create") && lowerText.includes("playlist")) {
      const playlistMatch = text.match(/playlist\s+(?:called|named|)\s*(.+?)$/i)
      intent = {
        intent: INTENTS.CREATE_PLAYLIST,
        slots: {
          name: playlistMatch ? playlistMatch[1].trim() : "New Playlist",
        },
        confidence: 0.9,
      }
    } else if (lowerText.includes("search") || lowerText.includes("find")) {
      const queryMatch = text.match(/(?:search|find)\s+(?:for\s+)?(.+?)$/i)
      intent = {
        intent: INTENTS.SEARCH,
        slots: {
          query: queryMatch ? queryMatch[1].trim() : "",
        },
        confidence: 0.85,
      }
    } else if (lowerText.includes("what") && lowerText.includes("playing")) {
      intent = {
        intent: INTENTS.GET_CURRENT,
        slots: {},
        confidence: 0.93,
      }
    } else if (lowerText.includes("like") || lowerText.includes("love")) {
      intent = {
        intent: INTENTS.LIKE_SONG,
        slots: {},
        confidence: 0.88,
      }
    } else if (lowerText.includes("shuffle") && !lowerText.includes("shuffle off")) {
      intent = {
        intent: INTENTS.SHUFFLE_ON,
        slots: {},
        confidence: 0.92,
      }
    } else if (lowerText.includes("shuffle off")) {
      intent = {
        intent: INTENTS.SHUFFLE_OFF,
        slots: {},
        confidence: 0.93,
      }
    } else if (lowerText.includes("repeat one")) {
      intent = {
        intent: INTENTS.REPEAT_ONE,
        slots: {},
        confidence: 0.93,
      }
    } else if (lowerText.includes("repeat")) {
      intent = {
        intent: INTENTS.REPEAT_ALL,
        slots: {},
        confidence: 0.92,
      }
    } else {
      // Default fallback
      intent = {
        intent: "UNKNOWN",
        slots: { raw_text: text },
        confidence: 0.5,
      }
    }

    return NextResponse.json(intent)
  } catch (error) {
    console.error("Intent parsing error:", error)
    return NextResponse.json({ error: "Intent parsing failed" }, { status: 500 })
  }
}
