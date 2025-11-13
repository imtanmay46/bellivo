import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { PlayerProvider } from "@/lib/player-context"
import { MusicPlayerGlobal } from "@/components/music-player-global"
import { VoiceCommandGlobal } from "@/components/voice-command-global"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bellivo - Voice Music App",
  description: "Sleek, inclusive voice-assisted music streaming web application",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased dark`}>
        <PlayerProvider>
          {children}
          <MusicPlayerGlobal />
          <VoiceCommandGlobal />
        </PlayerProvider>
        <Analytics />
      </body>
    </html>
  )
}
