// This script adds the featured watercolor winter artworks to the database
import { supabase } from '../integrations/supabase/client';

// Import the artwork images
import artwork1 from '../assets/artwork-1-winter-scene.jpg';
import artwork2 from '../assets/artwork-2-snowy-landscape.jpg';
import artwork3 from '../assets/artwork-3-winter-trees.jpg';
import artwork4 from '../assets/artwork-4-snow-path.jpg';
import artwork5 from '../assets/artwork-5-winter-forest.jpg';
import artwork6 from '../assets/artwork-6-winter-cabin.jpg';
import artwork7 from '../assets/artwork-7-snowy-buildings.jpg';
import artwork8 from '../assets/artwork-8-winter-village.jpg';
import artwork9 from '../assets/artwork-9-evening-snow.jpg';
import artwork10 from '../assets/artwork-10-twilight-winter.jpg';

const featuredArtworks = [
  {
    title: "Serene Winter Scene",
    description: "A peaceful watercolor painting capturing the quiet beauty of a snow-covered landscape with bare trees against a soft winter sky.",
    category: 'original_painting' as const,
    medium: 'watercolor' as const,
    style: 'landscape' as const,
    price: 2500,
    dimensions: "12x16 inches",
    image_urls: [artwork1],
    is_featured: true,
    is_available: true
  },
  {
    title: "Snowy Countryside",
    description: "A delicate watercolor depicting rolling hills blanketed in pristine snow, with gentle curves leading the eye through the composition.",
    category: 'original_painting' as const,
    medium: 'watercolor' as const,
    style: 'landscape' as const,
    price: 2800,
    dimensions: "14x18 inches",
    image_urls: [artwork2],
    is_featured: true,
    is_available: true
  },
  {
    title: "Winter Forest Path",
    description: "Bare winter trees create a natural corridor in this atmospheric watercolor, showcasing the stark beauty of the dormant season.",
    category: 'original_painting' as const,
    medium: 'watercolor' as const,
    style: 'landscape' as const,
    price: 3200,
    dimensions: "16x20 inches",
    image_urls: [artwork3],
    is_featured: true,
    is_available: true
  },
  {
    title: "Snowy Trail",
    description: "A winding path through snow-covered terrain, painted in soft watercolor tones that capture the tranquility of winter walks.",
    category: 'original_painting' as const,
    medium: 'watercolor' as const,
    style: 'landscape' as const,
    price: 2200,
    dimensions: "11x14 inches",
    image_urls: [artwork4],
    is_featured: true,
    is_available: true
  },
  {
    title: "Misty Winter Forest",
    description: "An ethereal watercolor forest scene where snow and mist create a dreamlike atmosphere among the winter trees.",
    category: 'original_painting' as const,
    medium: 'watercolor' as const,
    style: 'landscape' as const,
    price: 3500,
    dimensions: "18x24 inches",
    image_urls: [artwork5],
    is_featured: true,
    is_available: true
  },
  {
    title: "Cozy Winter Cabin",
    description: "A charming rustic cabin nestled in a snowy landscape, painted with warm watercolor tones that evoke comfort and shelter.",
    category: 'original_painting' as const,
    medium: 'watercolor' as const,
    style: 'landscape' as const,
    price: 4200,
    dimensions: "16x20 inches",
    image_urls: [artwork6],
    is_featured: true,
    is_available: true
  },
  {
    title: "Snow-Covered Village",
    description: "Traditional buildings dusted with snow create a picturesque winter village scene in this detailed watercolor composition.",
    category: 'original_painting' as const,
    medium: 'watercolor' as const,
    style: 'landscape' as const,
    price: 3800,
    dimensions: "14x18 inches",
    image_urls: [artwork7],
    is_featured: true,
    is_available: true
  },
  {
    title: "Winter Village Harmony",
    description: "A collection of snow-topped roofs and winter architecture painted in harmonious watercolor washes.",
    category: 'original_painting' as const,
    medium: 'watercolor' as const,
    style: 'landscape' as const,
    price: 3600,
    dimensions: "15x19 inches",
    image_urls: [artwork8],
    is_featured: true,
    is_available: true
  },
  {
    title: "Evening Snow Fall",
    description: "Capturing the magical moment when evening light meets fresh snowfall, rendered in subtle watercolor gradations.",
    category: 'original_painting' as const,
    medium: 'watercolor' as const,
    style: 'landscape' as const,
    price: 4500,
    dimensions: "18x24 inches",
    image_urls: [artwork9],
    is_featured: true,
    is_available: true
  },
  {
    title: "Twilight Winter Glow",
    description: "The serene beauty of winter twilight captured in delicate watercolor, where warm light contrasts with cool snow tones.",
    category: 'original_painting' as const,
    medium: 'watercolor' as const,
    style: 'landscape' as const,
    price: 5000,
    dimensions: "20x26 inches",
    image_urls: [artwork10],
    is_featured: true,
    is_available: true
  }
];

export const addFeaturedArtworks = async () => {
  try {
    const { data, error } = await supabase
      .from('artwork')
      .insert(featuredArtworks);

    if (error) {
      console.error('Error adding featured artworks:', error);
      return { success: false, error: error.message };
    }

    console.log('Successfully added featured artworks:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error adding featured artworks:', error);
    return { success: false, error: 'Failed to add artworks' };
  }
};

// Call the function if this script is run directly
if (typeof window !== 'undefined') {
  // This is running in the browser
  addFeaturedArtworks().then(result => {
    if (result.success) {
      console.log('Featured artworks added successfully!');
    } else {
      console.error('Failed to add featured artworks:', result.error);
    }
  });
}