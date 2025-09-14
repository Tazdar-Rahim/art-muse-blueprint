-- Clean up existing artworks: remove blob URLs and set some as featured
UPDATE artwork 
SET 
  is_featured = true,
  image_urls = ARRAY(
    SELECT url FROM unnest(image_urls) AS url 
    WHERE url LIKE 'https://mnsdoctypclwfflpzwfz.supabase.co/%'
  )
WHERE id IN (
  SELECT id FROM artwork 
  ORDER BY created_at DESC 
  LIMIT 2
);

-- Insert the 10 new featured artworks
INSERT INTO artwork (title, description, category, medium, style, price, dimensions, image_urls, is_featured, is_available) VALUES 
('Snowy Bicycle Adventure', 'A peaceful winter scene featuring a bicycle covered in fresh snow, captured during a quiet morning walk', 'print', 'digital', 'landscape', 450.00, '16x20 inches', ARRAY['/src/assets/artwork-11-snowy-bike.jpg'], true, true),

('Winter Bicycle Rest', 'An intimate moment of stillness as winter embraces everyday objects, transforming the ordinary into art', 'print', 'digital', 'realism', 475.00, '16x20 inches', ARRAY['/src/assets/artwork-12-winter-bicycle.jpg'], true, true),

('Snowy Path Discovery', 'A winding path through a winter wonderland, inviting viewers to imagine their own journey through the snow', 'print', 'digital', 'landscape', 520.00, '18x24 inches', ARRAY['/src/assets/artwork-13-snowy-path.jpg'], true, true),

('Winter Trail Meditation', 'The serene beauty of a snow-covered trail that speaks to the soul of winter wanderers', 'print', 'digital', 'landscape', 495.00, '16x20 inches', ARRAY['/src/assets/artwork-14-winter-trail.jpg'], true, true),

('Snowy Trees Embrace', 'Majestic trees standing tall in their winter coats, creating a natural cathedral of peace and tranquility', 'print', 'digital', 'landscape', 650.00, '20x30 inches', ARRAY['/src/assets/artwork-15-snowy-trees.jpg'], true, true),

('Winter Forest Symphony', 'The silent music of winter captured in a forest scene where every branch tells a story', 'print', 'digital', 'landscape', 580.00, '18x24 inches', ARRAY['/src/assets/artwork-16-winter-forest.jpg'], true, true),

('Snowy Landscape Dreams', 'An expansive winter landscape that captures the breathtaking beauty of nature in its pristine state', 'print', 'digital', 'landscape', 720.00, '24x36 inches', ARRAY['/src/assets/artwork-17-snowy-landscape.jpg'], true, true),

('Winter Scene Reverie', 'A contemplative winter scene that invites quiet reflection and appreciation of seasonal beauty', 'print', 'digital', 'contemporary', 525.00, '16x20 inches', ARRAY['/src/assets/artwork-18-winter-scene.jpg'], true, true),

('Evening Snow Magic', 'The magical transition from day to evening captured in soft snow and gentle light', 'print', 'digital', 'contemporary', 595.00, '18x24 inches', ARRAY['/src/assets/artwork-19-evening-snow.jpg'], true, true),

('Twilight Winter Glow', 'The enchanting glow of twilight over a winter landscape, where light and shadow dance in perfect harmony', 'print', 'digital', 'contemporary', 675.00, '20x30 inches', ARRAY['/src/assets/artwork-20-twilight-winter.jpg'], true, true);