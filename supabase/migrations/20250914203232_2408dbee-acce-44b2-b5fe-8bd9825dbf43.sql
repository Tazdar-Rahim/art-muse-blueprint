-- Update the artwork image URLs to use import paths
UPDATE artwork 
SET image_urls = ARRAY[
  CASE 
    WHEN image_urls[1] = '/src/assets/artwork-11-snowy-bike.jpg' THEN 'artwork11'
    WHEN image_urls[1] = '/src/assets/artwork-12-winter-bicycle.jpg' THEN 'artwork12'
    WHEN image_urls[1] = '/src/assets/artwork-13-snowy-path.jpg' THEN 'artwork13'
    WHEN image_urls[1] = '/src/assets/artwork-14-winter-trail.jpg' THEN 'artwork14'
    WHEN image_urls[1] = '/src/assets/artwork-15-snowy-trees.jpg' THEN 'artwork15'
    WHEN image_urls[1] = '/src/assets/artwork-16-winter-forest.jpg' THEN 'artwork16'
    WHEN image_urls[1] = '/src/assets/artwork-17-snowy-landscape.jpg' THEN 'artwork17'
    WHEN image_urls[1] = '/src/assets/artwork-18-winter-scene.jpg' THEN 'artwork18'
    WHEN image_urls[1] = '/src/assets/artwork-19-evening-snow.jpg' THEN 'artwork19'
    WHEN image_urls[1] = '/src/assets/artwork-20-twilight-winter.jpg' THEN 'artwork20'
    ELSE image_urls[1]
  END
]
WHERE image_urls[1] LIKE '/src/assets/artwork-%';