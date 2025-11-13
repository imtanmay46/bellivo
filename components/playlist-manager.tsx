"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2, Lock, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Playlist {
  id: string
  name: string
  description?: string
  public: boolean
  image_url?: string
  song_count?: number
}

interface PlaylistManagerProps {
  playlists: Playlist[]
  onCreatePlaylist: (name: string, description?: string, isPublic?: boolean) => void
  onUpdatePlaylist: (id: string, name: string, description?: string, isPublic?: boolean) => void
  onDeletePlaylist: (id: string) => void
}

export function PlaylistManager({
  playlists,
  onCreatePlaylist,
  onUpdatePlaylist,
  onDeletePlaylist,
}: PlaylistManagerProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newName, setNewName] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [isPublic, setIsPublic] = useState(false)

  const handleCreate = () => {
    if (newName.trim()) {
      onCreatePlaylist(newName, newDescription, isPublic)
      setNewName("")
      setNewDescription("")
      setIsPublic(false)
      setIsCreating(false)
    }
  }

  const handleUpdate = (id: string) => {
    if (newName.trim()) {
      onUpdatePlaylist(id, newName, newDescription, isPublic)
      setEditingId(null)
      setNewName("")
      setNewDescription("")
    }
  }

  return (
    <div className="space-y-4">
      {/* Create new playlist */}
      {!isCreating ? (
        <Button onClick={() => setIsCreating(true)} className="bg-green-600 hover:bg-green-700 text-white w-full">
          <Plus size={20} />
          Create Playlist
        </Button>
      ) : (
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label htmlFor="playlist-name">Playlist Name</Label>
              <Input
                id="playlist-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="My Awesome Playlist"
                className="bg-input/50"
              />
            </div>
            <div>
              <Label htmlFor="playlist-desc">Description</Label>
              <Input
                id="playlist-desc"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Optional description"
                className="bg-input/50"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="public-toggle"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="public-toggle" className="cursor-pointer">
                Make this playlist public
              </Label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                Create
              </Button>
              <Button
                onClick={() => {
                  setIsCreating(false)
                  setNewName("")
                  setNewDescription("")
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Playlist list */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {playlists.map((playlist) => (
          <Card
            key={playlist.id}
            className="bg-card/30 hover:bg-card/60 border-border/50 transition-all cursor-pointer group"
          >
            <CardContent className="p-4">
              {editingId === playlist.id ? (
                <div className="space-y-3">
                  <Input value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-input/50" />
                  <Input
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Description"
                    className="bg-input/50"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleUpdate(playlist.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      Save
                    </Button>
                    <Button onClick={() => setEditingId(null)} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-sm">{playlist.name}</h3>
                    <p className="text-xs text-muted-foreground">{playlist.song_count || 0} songs</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {playlist.public ? (
                      <Globe size={16} className="text-green-500" />
                    ) : (
                      <Lock size={16} className="text-muted-foreground" />
                    )}
                    <Button
                      onClick={() => {
                        setEditingId(playlist.id)
                        setNewName(playlist.name)
                        setNewDescription(playlist.description || "")
                        setIsPublic(playlist.public)
                      }}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button
                      onClick={() => onDeletePlaylist(playlist.id)}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
