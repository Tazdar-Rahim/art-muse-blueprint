import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart, Plus } from "lucide-react";
import { useCartWishlist } from "@/contexts/CartWishlistContext";
import { resolveArtworkImages } from "@/lib/artwork-images";

interface ArtworkCardProps {
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
  isFullVersion?: boolean; // New prop to determine if this is featured/full version
  onView: (id: string) => void;
  onPurchase: (artworkData: {
    id: string;
    title: string;
    price: number;
    imageUrl?: string;
    category: string;
  }) => void;
}

const ArtworkCard = ({
  title,
  description,
  category,
  medium,
  style,
  dimensions,
  price,
  imageUrls,
  isFeatured,
  isFullVersion = false,
  onView,
  onPurchase,
  id
}: ArtworkCardProps) => {
  const resolvedImages = resolveArtworkImages(imageUrls);
  const imageUrl = resolvedImages[0] || '/placeholder.svg';
  const { addToCart } = useCartWishlist();

  const handleAddToCart = () => {
    if (price) {
      addToCart({
        id,
        title,
        price,
        imageUrl,
        category,
      });
    }
  };
  
  // Random rotation for creative effect
  const rotations = ['rotate-[-1deg]', 'rotate-[1deg]', 'rotate-[-2deg]'];
  const rotation = rotations[Math.floor(Math.random() * rotations.length)];
  
  return (
    <div className={`group relative transition-all duration-300 ${rotation}`}>
      {/* Creative shadow card */}
      <div className="absolute inset-0 bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white rounded-lg mobile-shadow shadow-zinc-900 dark:shadow-white transition-all duration-300 group-hover:shadow-[6px_6px_0px_0px] sm:group-hover:shadow-[8px_8px_0px_0px] group-hover:translate-x-[-3px] group-hover:translate-y-[-3px] sm:group-hover:translate-x-[-4px] sm:group-hover:translate-y-[-4px]" />
      
      <Card 
        className="relative bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white rounded-lg overflow-hidden cursor-pointer"
        onClick={() => price && onPurchase({
          id,
          title,
          price,
          imageUrl,
          category,
        })}
      >
        {isFeatured && (
          <div className="absolute top-1 left-1 bg-amber-400 text-zinc-900 font-handwritten px-1.5 py-0.5 rounded-full -rotate-12 text-xs border border-zinc-900 z-20 shadow-sm">
            ⭐
          </div>
        )}
        
        <div className="relative overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            decoding="async"
            className="w-full h-32 sm:h-40 object-cover transition-transform duration-700 group-hover:scale-110"
            onLoad={(e) => {
              e.currentTarget.classList.add('loaded');
            }}
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-2 left-2 right-2 flex gap-1">
              <Button
                size="sm"
                className="flex-1 font-handwritten border border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-white dark:hover:bg-zinc-700 h-6 px-2 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onView(id);
                }}
              >
                <Eye className="w-3 h-3" />
              </Button>
              {price && (
                <>
                  <Button
                    size="sm"
                    className="font-handwritten border border-zinc-900 dark:border-white bg-green-500 text-white hover:bg-green-600 h-6 px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart();
                    }}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    className="font-handwritten border border-zinc-900 dark:border-white bg-amber-400 text-zinc-900 hover:bg-amber-300 h-6 px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (price) onPurchase({
                        id,
                        title,
                        price,
                        imageUrl,
                        category,
                      });
                    }}
                  >
                    <ShoppingCart className="w-3 h-3" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className={`${isFullVersion ? 'p-4 space-y-3' : 'p-2 space-y-1'}`}>
          <div>
            <h3 className={`${isFullVersion ? 'text-lg font-bold' : 'text-xs sm:text-sm font-handwritten'} text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors ${isFullVersion ? '' : 'truncate'}`}>
              {title}
            </h3>
            {isFullVersion && description && (
              <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2 line-clamp-2">
                {description}
              </p>
            )}
          </div>
          
          {isFullVersion && (medium || style || dimensions) && (
            <div className="space-y-1">
              {medium && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="font-medium">Medium:</span> {medium}
                </p>
              )}
              {style && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="font-medium">Style:</span> {style}
                </p>
              )}
              {dimensions && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="font-medium">Dimensions:</span> {dimensions}
                </p>
              )}
            </div>
          )}
          
          <div className="flex justify-between items-center">
            {category && (
              <div className="px-1.5 py-0.5 bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30 rounded text-xs font-handwritten">
                {category.replace('_', ' ')}
              </div>
            )}
            {price && (
              <span className={`${isFullVersion ? 'text-lg font-bold' : 'text-xs sm:text-sm font-handwritten'} text-amber-600 dark:text-amber-400`}>₹{price}</span>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ArtworkCard;