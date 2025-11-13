-- Enable Row Level Security on all tables

-- Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own_or_public"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() = id OR 
    public IS TRUE
  );

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Songs - public read
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "songs_select_all"
  ON public.songs FOR SELECT
  TO authenticated, anon
  USING (TRUE);

-- Playlists RLS
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "playlists_select_own_or_public"
  ON public.playlists FOR SELECT
  USING (
    auth.uid() = user_id OR 
    public IS TRUE
  );

CREATE POLICY "playlists_insert_own"
  ON public.playlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "playlists_update_own"
  ON public.playlists FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "playlists_delete_own"
  ON public.playlists FOR DELETE
  USING (auth.uid() = user_id);

-- Playlist songs RLS
ALTER TABLE public.playlist_songs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "playlist_songs_select_playlist_members"
  ON public.playlist_songs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.playlists
      WHERE playlists.id = playlist_songs.playlist_id
      AND (playlists.user_id = auth.uid() OR playlists.public = TRUE)
    )
  );

CREATE POLICY "playlist_songs_insert_own_playlist"
  ON public.playlist_songs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.playlists
      WHERE playlists.id = playlist_songs.playlist_id
      AND playlists.user_id = auth.uid()
    )
  );

CREATE POLICY "playlist_songs_delete_own_playlist"
  ON public.playlist_songs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.playlists
      WHERE playlists.id = playlist_songs.playlist_id
      AND playlists.user_id = auth.uid()
    )
  );

-- Follows RLS
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "follows_select_own"
  ON public.follows FOR SELECT
  USING (auth.uid() = follower_id OR auth.uid() = followed_id);

CREATE POLICY "follows_insert_own"
  ON public.follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "follows_delete_own"
  ON public.follows FOR DELETE
  USING (auth.uid() = follower_id);

-- Reports RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reports_insert_own"
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "reports_select_own"
  ON public.reports FOR SELECT
  USING (auth.uid() = reporter_id);

-- Blocked users RLS
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "blocked_users_insert_own"
  ON public.blocked_users FOR INSERT
  WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "blocked_users_select_own"
  ON public.blocked_users FOR SELECT
  USING (auth.uid() = blocker_id OR auth.uid() = blocked_id);

CREATE POLICY "blocked_users_delete_own"
  ON public.blocked_users FOR DELETE
  USING (auth.uid() = blocker_id);
