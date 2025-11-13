import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import { PlayerBar } from "@/components/player-bar"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check authentication
  // const cookieStore = await cookies()
  // const accessToken = cookieStore.get("spotify_access_token")

  // if (!accessToken) {
  //   redirect("/auth/login")
  // }

  return (
    <div className="h-screen bg-gradient-to-b from-[#0B0B0B] to-black text-white">
      <AppSidebar />
      <div className="ml-64 h-full flex flex-col pb-24">
        <TopBar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <PlayerBar />
    </div>
  )
}
