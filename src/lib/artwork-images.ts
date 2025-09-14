// Import all new artwork images
import artwork11 from '@/assets/artwork-11-snowy-bike.jpg';
import artwork12 from '@/assets/artwork-12-winter-bicycle.jpg';
import artwork13 from '@/assets/artwork-13-snowy-path.jpg';
import artwork14 from '@/assets/artwork-14-winter-trail.jpg';
import artwork15 from '@/assets/artwork-15-snowy-trees.jpg';
import artwork16 from '@/assets/artwork-16-winter-forest.jpg';
import artwork17 from '@/assets/artwork-17-snowy-landscape.jpg';
import artwork18 from '@/assets/artwork-18-winter-scene.jpg';
import artwork19 from '@/assets/artwork-19-evening-snow.jpg';
import artwork20 from '@/assets/artwork-20-twilight-winter.jpg';

// Import existing artworks
import artwork1 from '@/assets/artwork-1-winter-scene.jpg';
import artwork2 from '@/assets/artwork-2-snowy-landscape.jpg';
import artwork3 from '@/assets/artwork-3-winter-trees.jpg';
import artwork4 from '@/assets/artwork-4-snow-path.jpg';
import artwork5 from '@/assets/artwork-5-winter-forest.jpg';
import artwork6 from '@/assets/artwork-6-winter-cabin.jpg';
import artwork7 from '@/assets/artwork-7-snowy-buildings.jpg';
import artwork8 from '@/assets/artwork-8-winter-village.jpg';
import artwork9 from '@/assets/artwork-9-evening-snow.jpg';
import artwork10 from '@/assets/artwork-10-twilight-winter.jpg';

// Map import keys to actual imported images
const artworkImageMap: Record<string, string> = {
  artwork1,
  artwork2,
  artwork3,
  artwork4,
  artwork5,
  artwork6,
  artwork7,
  artwork8,
  artwork9,
  artwork10,
  artwork11,
  artwork12,
  artwork13,
  artwork14,
  artwork15,
  artwork16,
  artwork17,
  artwork18,
  artwork19,
  artwork20,
};

/**
 * Resolves artwork image URLs to actual imported images
 * @param imageUrls Array of image URLs/keys from database
 * @returns Array of resolved image URLs
 */
export const resolveArtworkImages = (imageUrls: string[] | null): string[] => {
  if (!imageUrls) return ['/placeholder.svg'];
  
  return imageUrls.map(url => {
    // If it's an artwork import key, map it to the actual imported image
    if (artworkImageMap[url]) {
      return artworkImageMap[url];
    }
    // Otherwise return the URL as-is (for Supabase URLs or other valid URLs)
    return url;
  });
};
