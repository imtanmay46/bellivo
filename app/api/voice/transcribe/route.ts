import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Placeholder API key - user should configure their own Whisper/ASR service
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    // For demo purposes, return mock transcription
    // In production, this would call OpenAI's Whisper API or similar
    const mockTranscriptions = [
      "Play shape of you",
      "Add this to my favorites",
      "Create a new playlist called workout mix",
      "Skip to the next song",
      "What's playing right now",
      "Pause the music",
    ]

    const transcription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)]

    return NextResponse.json({
      text: transcription,
      confidence: 0.95,
      timestamp: new Date().toISOString(),
    })

    // Production implementation with OpenAI Whisper:
    /*
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "ASR API key not configured" },
        { status: 500 }
      );
    }

    const formDataForAPI = new FormData();
    formDataForAPI.append("file", audioFile);
    formDataForAPI.append("model", "whisper-1");

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: formDataForAPI,
    });

    if (!response.ok) {
      throw new Error(`Transcription failed: ${response.statusText}`);
    }

    const result = await response.json();

    return NextResponse.json({
      text: result.text,
      confidence: 0.95,
      timestamp: new Date().toISOString(),
    });
    */
  } catch (error) {
    console.error("Transcription error:", error)
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 })
  }
}
