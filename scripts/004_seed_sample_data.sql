-- Seed sample songs for testing

INSERT INTO public.songs (title, artist, album, duration_ms, preview_url, source, image_url) VALUES
('Shape of You', 'Ed Sheeran', '÷', 233713, 'https://p.scdn.co/mp3-preview/preview1', 'spotify', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300'),
('Blinding Lights', 'The Weeknd', 'After Hours', 200040, 'https://p.scdn.co/mp3-preview/preview2', 'spotify', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300'),
('Levitating', 'Dua Lipa', 'Future Nostalgia', 203149, 'https://p.scdn.co/mp3-preview/preview3', 'spotify', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300'),
('Don''t Start Now', 'Dua Lipa', 'Future Nostalgia', 204240, 'https://p.scdn.co/mp3-preview/preview4', 'spotify', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300'),
('As It Was', 'Harry Styles', 'Harry''s House', 172000, 'https://p.scdn.co/mp3-preview/preview5', 'spotify', 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=300'),
('Anti-Hero', 'Taylor Swift', 'Midnights', 228000, 'https://p.scdn.co/mp3-preview/preview6', 'spotify', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300'),
('Calm Down', 'Rema & Selena Gomez', 'Rave & Roses', 241000, 'https://p.scdn.co/mp3-preview/preview7', 'spotify', 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300'),
('Espresso', 'Sabrina Carpenter', 'Short n Sweet', 234000, 'https://p.scdn.co/mp3-preview/preview8', 'spotify', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300');

SELECT * FROM public.songs;
