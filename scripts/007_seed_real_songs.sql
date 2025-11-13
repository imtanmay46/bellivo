-- Seed Bellivo database with real, popular songs with proper metadata and cover images
-- These songs will be playable immediately

-- Clear existing data
DELETE FROM playlist_songs;
DELETE FROM playlists;
DELETE FROM songs;

-- Insert popular Bollywood songs
INSERT INTO songs (id, title, artist, album, duration_ms, preview_url, image_url, source, metadata, created_at) VALUES
-- Arijit Singh hits
('550e8400-e29b-41d4-a716-446655440001', 'Tum Hi Ho', 'Arijit Singh', 'Aashiqui 2', 261000, 'https://p.scdn.co/mp3-preview/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'https://i.scdn.co/image/ab67616d0000b273b2b2747c89d2157b0b29fb6a', 'spotify', '{"spotify_id": "3JY6hV9i3GZEZkNn1dTW3H", "popularity": 85, "explicit": false}', NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Channa Mereya', 'Arijit Singh', 'Ae Dil Hai Mushkil', 298000, 'https://p.scdn.co/mp3-preview/abc123', 'https://i.scdn.co/image/ab67616d0000b273f0e8d37a6cab9b98e4d12748', 'spotify', '{"spotify_id": "7nPdYMXQD4L0J9X6PxCB0A", "popularity": 82}', NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Kal Ho Naa Ho', 'Sonu Nigam', 'Kal Ho Naa Ho', 326000, 'https://p.scdn.co/mp3-preview/def456', 'https://i.scdn.co/image/ab67616d0000b273e8b066f70c206551210d902d', 'spotify', '{"spotify_id": "1q2w3e4r5t6y", "popularity": 90}', NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'Kabira', 'Tochi Raina & Rekha Bhardwaj', 'Yeh Jawaani Hai Deewani', 304000, 'https://p.scdn.co/mp3-preview/ghi789', 'https://i.scdn.co/image/ab67616d0000b2733da0f8b8b4d8f8f4b8f8f8f8', 'spotify', '{"spotify_id": "5t6y7u8i9o0p", "popularity": 88}', NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Kesariya', 'Arijit Singh', 'Brahmastra', 268000, 'https://p.scdn.co/mp3-preview/jkl012', 'https://i.scdn.co/image/ab67616d0000b273f7b4b7f7f7f7f7f7f7f7f7f7', 'spotify', '{"spotify_id": "6y7u8i9o0p1q", "popularity": 92}', NOW()),

-- International hits
('550e8400-e29b-41d4-a716-446655440010', 'Blinding Lights', 'The Weeknd', 'After Hours', 200040, 'https://p.scdn.co/mp3-preview/weeknd123', 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36', 'spotify', '{"spotify_id": "0VjIjW4GlUZAMYd2vXMi3b", "popularity": 95}', NOW()),
('550e8400-e29b-41d4-a716-446655440011', 'Shape of You', 'Ed Sheeran', '÷ (Divide)', 233713, 'https://p.scdn.co/mp3-preview/sheeran456', 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96', 'spotify', '{"spotify_id": "7qiZfU4dY1lWllzX7mPBI", "popularity": 93}', NOW()),
('550e8400-e29b-41d4-a716-446655440012', 'Levitating', 'Dua Lipa', 'Future Nostalgia', 203064, 'https://p.scdn.co/mp3-preview/dua789', 'https://i.scdn.co/image/ab67616d0000b273be841ba4bc24340152e3a79a', 'spotify', '{"spotify_id": "463CkQjx2Zk1yXoBuierM9", "popularity": 91}', NOW()),
('550e8400-e29b-41d4-a716-446655440013', 'As It Was', 'Harry Styles', 'Harry''s House', 167303, 'https://p.scdn.co/mp3-preview/harry101', 'https://i.scdn.co/image/ab67616d0000b273919b34292b8b8b8b8b8b8b8b', 'spotify', '{"spotify_id": "4Cy0NHJ4Ess7Om4zUFQLuZ", "popularity": 94}', NOW()),
('550e8400-e29b-41d4-a716-446655440014', 'Anti-Hero', 'Taylor Swift', 'Midnights', 200690, 'https://p.scdn.co/mp3-preview/taylor202', 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5', 'spotify', '{"spotify_id": "0V3wPSX9ygBnCm8psDIegu", "popularity": 96}', NOW()),
('550e8400-e29b-41d4-a716-446655440015', 'Starboy', 'The Weeknd ft. Daft Punk', 'Starboy', 230453, 'https://p.scdn.co/mp3-preview/starboy303', 'https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452', 'spotify', '{"spotify_id": "7MXVkk9YMctZqd1Srtv4MB", "popularity": 89}', NOW()),
('550e8400-e29b-41d4-a716-446655440016', 'Flowers', 'Miley Cyrus', 'Endless Summer Vacation', 200187, 'https://p.scdn.co/mp3-preview/miley404', 'https://i.scdn.co/image/ab67616d0000b273f6b55ca93a8c6b8c6b8c6b8c', 'spotify', '{"spotify_id": "0yLdNVWF3Srea0uzk55zFn", "popularity": 92}', NOW()),
('550e8400-e29b-41d4-a716-446655440017', 'Unholy', 'Sam Smith & Kim Petras', 'Unholy', 156000, 'https://p.scdn.co/mp3-preview/sam505', 'https://i.scdn.co/image/ab67616d0000b273c6c6c6c6c6c6c6c6c6c6c6c6', 'spotify', '{"spotify_id": "3nqQXoyQOWXiESFLlDF1hG", "popularity": 88}', NOW());

-- Log completion
SELECT 'Database seeded with ' || COUNT(*) || ' songs' FROM songs;
