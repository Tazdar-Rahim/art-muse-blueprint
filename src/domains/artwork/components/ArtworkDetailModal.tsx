import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, X } from "lucide-react";
import { useCartWishlist } from "@/contexts/CartWishlistContext";
import { resolveArtworkImages } from "@/lib/artwork-images";

interface ArtworkDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  artwork: {
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
  } | null;
  onPurchase: (artworkData: {
    id: string;
    title: string;
    price: number;
    imageUrl?: string;
    category: string;
  }) => void;
}

const ArtworkDetailModal = ({ isOpen, onClose, artwork, onPurchase }: ArtworkDetailModalProps) => {
  const { addToCart, addToWishlist, isInWishlist } = useCartWishlist();

  if (!artwork) return null;

  const resolvedImages = resolveArtworkImages(artwork.image_urls);
  const imageUrl = resolvedImages[0] || '/placeholder.svg';

  const handleAddToCart = () => {
    if (artwork.price) {
      addToCart({
        id: artwork.id,
        title: artwork.title,
        price: artwork.price,
        imageUrl: resolvedImages[0],
        category: artwork.category,
      });
    }
  };

  const handleAddToWishlist = () => {
    addToWishlist({
      id: artwork.id,
      title: artwork.title,
      price: artwork.price,
      imageUrl: resolvedImages[0],
      category: artwork.category,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[90vw] sm:w-full max-h-[90vh] overflow-y-auto p-0 border-2 border-foreground left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative">
            <img
              src={imageUrl}
              alt={artwork.title}
              className="w-full h-64 md:h-full object-cover"
            />
            {artwork.is_featured && (
              <div className="absolute top-3 left-3 bg-amber-400 text-zinc-900 font-handwritten px-3 py-1 rounded-full rotate-[-5deg] text-sm border-2 border-zinc-900">
                Featured! ⭐
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-2xl font-bold font-handwritten text-foreground pr-8">
                {artwork.title}
              </DialogTitle>
            </DialogHeader>

            {artwork.description && (
              <p className="text-sm sm:text-base text-muted-foreground font-handwritten leading-relaxed">
                {artwork.description}
              </p>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant="secondary" 
                className="font-handwritten bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30"
              >
                {artwork.category.replace('_', ' ')}
              </Badge>
              {artwork.medium && (
                <Badge 
                  variant="secondary" 
                  className="font-handwritten bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30"
                >
                  {artwork.medium}
                </Badge>
              )}
              {artwork.style && (
                <Badge 
                  variant="secondary" 
                  className="font-handwritten bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30"
                >
                  {artwork.style}
                </Badge>
              )}
            </div>

            {/* Details */}
            <div className="space-y-3">
              {artwork.dimensions && (
                <div>
                  <span className="font-semibold font-handwritten text-foreground">Dimensions:</span>
                  <span className="ml-2 text-muted-foreground font-handwritten">{artwork.dimensions}</span>
                </div>
              )}
              {artwork.price && (
                <div>
                  <span className="font-semibold font-handwritten text-foreground">Price:</span>
                  <span className="ml-2 text-2xl font-bold font-handwritten text-amber-600 dark:text-amber-400">
                    ₹{artwork.price}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
              <Button
                onClick={handleAddToWishlist}
                variant={isInWishlist(artwork.id) ? "default" : "outline"}
                className="w-full sm:w-auto font-handwritten border-2 border-foreground mobile-shadow shadow-foreground hover:shadow-[2px_2px_0px_0px] hover:shadow-foreground hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all text-sm"
              >
                <Heart className={`w-4 h-4 mr-2 ${isInWishlist(artwork.id) ? 'fill-current' : ''}`} />
                {isInWishlist(artwork.id) ? 'Saved' : 'Save'}
              </Button>
              
              {artwork.price && (
                <>
                  <Button
                    onClick={handleAddToCart}
                    variant="secondary"
                    className="w-full sm:w-auto font-handwritten border-2 border-foreground bg-green-500 text-white hover:bg-green-600 mobile-shadow shadow-foreground hover:shadow-[2px_2px_0px_0px] hover:shadow-foreground hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all text-sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  
                  <Button
                    onClick={() => onPurchase({
                      id: artwork.id,
                      title: artwork.title,
                      price: artwork.price!,
                      imageUrl: resolvedImages[0],
                      category: artwork.category,
                    })}
                    className="w-full sm:w-auto font-handwritten border-2 border-foreground bg-amber-400 text-zinc-900 hover:bg-amber-300 mobile-shadow shadow-foreground hover:shadow-[2px_2px_0px_0px] hover:shadow-foreground hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all text-sm"
                  >
                    Buy Now
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArtworkDetailModal;