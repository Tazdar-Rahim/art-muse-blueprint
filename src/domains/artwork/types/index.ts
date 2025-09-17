export interface Artwork {
  id: string;
  title: string;
  description?: string;
  category: string;
  medium?: string;
  style?: string;
  dimensions?: string;
  price?: number;
  image_urls?: string[];
  is_featured?: boolean;
  is_available?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ArtworkFilters {
  search?: string;
  category?: string;
  style?: string;
  medium?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  isFeatured?: boolean;
  isAvailable?: boolean;
}

export interface ArtworkCardProps {
  id: string;
  title: string;
  description?: string;
  category: string;
  medium?: string;
  style?: string;
  dimensions?: string;
  price?: number;
  imageUrls?: string[];
  isFeatured?: boolean;
  onView: (id: string) => void;
  onPurchase: (id: string) => void;
}