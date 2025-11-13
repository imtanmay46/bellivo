-- Insert sample songs with preview URLs
INSERT INTO songs (id, title, artist, album, duration_ms, preview_url, source, created_at, image_url, metadata)
VALUES
  (gen_random_uuid(), 'Kabira', 'Arijit Singh', 'Yeh Jawaani Hai Deewani', 272000, 'https://p.scdn.co/mp3-preview/placeholder1', 'spotify', NOW(), 'https://via.placeholder.com/200', '{"genre": "Bollywood", "language": "Hindi"}'),
  (gen_random_uuid(), 'Shape of You', 'Ed Sheeran', 'Divide', 235973, 'https://p.scdn.co/mp3-preview/placeholder2', 'spotify', NOW(), 'https://via.placeholder.com/200', '{"genre": "Pop", "language": "English"}'),
  (gen_random_uuid(), 'Tum Se', 'Arijit Singh', 'Aashiqui 2', 320000, 'https://p.scdn.co/mp3-preview/placeholder3', 'spotify', NOW(), 'https://via.placeholder.com/200', '{"genre": "Bollywood", "language": "Hindi"}'),
  (gen_random_uuid(), 'Blinding Lights', 'The Weeknd', 'After Hours', 200040, 'https://p.scdn.co/mp3-preview/placeholder4', 'spotify', NOW(), 'https://via.placeholder.com/200', '{"genre": "Synthwave", "language": "English"}'),
  (gen_random_uuid(), 'Raees', 'Arijit Singh', 'Raees', 240000, 'https://p.scdn.co/mp3-preview/placeholder5', 'spotify', NOW(), 'https://via.placeholder.com/200', '{"genre": "Bollywood", "language": "Hindi"}');
