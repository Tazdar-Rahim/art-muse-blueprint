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
  onView: (id: string) => void;
  onPurchase: (id: string) => void;
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
        onClick={() => price && onPurchase(id)}
      >
        {isFeatured && (
          <div className="absolute -top-2 -right-2 bg-amber-400 text-zinc-900 font-handwritten px-2 sm:px-3 py-1 rounded-full rotate-12 text-xs sm:text-sm border-2 border-zinc-900 z-10">
            Featured! ⭐
          </div>
        )}
        
        <div className="relative overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-48 sm:h-64 object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex gap-1.5 sm:gap-2">
              <Button
                size="sm"
                className="flex-1 font-handwritten border-2 border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-white dark:hover:bg-zinc-700 mobile-shadow shadow-zinc-900 dark:shadow-white mobile-hover-shadow touch-target touch-interaction"
                onClick={(e) => {
                  e.stopPropagation();
                  onView(id);
                }}
              >
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">View</span>
              </Button>
              {price && (
                <>
                  <Button
                    size="sm"
                    className="font-handwritten border-2 border-zinc-900 dark:border-white bg-green-500 text-white hover:bg-green-600 mobile-shadow shadow-zinc-900 dark:shadow-white mobile-hover-shadow touch-target touch-interaction"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart();
                    }}
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="font-handwritten border-2 border-zinc-900 dark:border-white bg-amber-400 text-zinc-900 hover:bg-amber-300 mobile-shadow shadow-zinc-900 dark:shadow-white mobile-hover-shadow touch-target touch-interaction"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPurchase(id);
                    }}
                  >
                    <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-0 sm:mr-1" />
                    <span className="hidden xs:inline">Buy</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="mobile-card-padding space-y-3">
          <div>
            <h3 className="mobile-text font-bold font-handwritten text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors">
              {title}
            </h3>
            {description && (
              <p className="text-xs sm:text-sm font-handwritten text-zinc-600 dark:text-zinc-400 line-clamp-2 mt-1">
                {description}
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {category && (
              <div className="px-2 py-1 bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30 rounded-full text-xs font-handwritten">
                {category.replace('_', ' ')}
              </div>
            )}
            {medium && (
              <div className="px-2 py-1 bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 rounded-full text-xs font-handwritten">
                {medium}
              </div>
            )}
            {style && (
              <div className="px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30 rounded-full text-xs font-handwritten">
                {style}
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center pt-2">
            {dimensions && (
              <span className="text-xs sm:text-sm font-handwritten text-zinc-600 dark:text-zinc-400">{dimensions}</span>
            )}
            {price && (
              <span className="text-lg sm:text-xl font-bold font-handwritten text-amber-600 dark:text-amber-400">₹{price}</span>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ArtworkCard;