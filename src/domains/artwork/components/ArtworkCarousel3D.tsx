import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import ArtworkCard from "@/domains/artwork/components/ArtworkCard";
import { Button } from "@/components/ui/button";
import { useCartWishlist } from "@/contexts/CartWishlistContext";

interface ArtworkData {
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
}

interface ArtworkCarousel3DProps {
  artworks: ArtworkData[];
  onView: (id: string) => void;
  onPurchase: (artworkData: {
    id: string;
    title: string;
    price: number;
    imageUrl?: string;
    category: string;
  }) => void;
}

const ArtworkCarousel3D = ({ artworks, onView, onPurchase }: ArtworkCarousel3DProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: "center",
    skipSnaps: false,
    containScroll: "trimSnaps"
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { addToWishlist, isInWishlist } = useCartWishlist();

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full">
      {/* Swipe-Enabled Carousel Container */}
      <div className="overflow-hidden px-4 sm:px-8" ref={emblaRef}>
        <div className="flex touch-pan-y gap-4 sm:gap-6">
          {artworks.map((artwork) => (
            <div
              key={artwork.id}
              className="flex-[0_0_85%] sm:flex-[0_0_400px] min-w-0"
            >
              <div className="relative">
                <ArtworkCard
                  id={artwork.id}
                  title={artwork.title}
                  description={artwork.description}
                  category={artwork.category}
                  medium={artwork.medium}
                  style={artwork.style}
                  dimensions={artwork.dimensions}
                  price={artwork.price}
                  imageUrls={artwork.image_urls}
                  isFeatured={artwork.is_featured}
                  isFullVersion={true}
                  onView={onView}
                  onPurchase={(artworkData) => onPurchase(artworkData)}
                />
                {/* Wishlist Button */}
                <Button
                  size="sm"
                  variant={isInWishlist(artwork.id) ? "default" : "outline"}
                  onClick={() => addToWishlist({
                    id: artwork.id,
                    title: artwork.title,
                    price: artwork.price,
                    imageUrl: artwork.image_urls?.[0],
                    category: artwork.category,
                  })}
                  className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 font-handwritten border-2 border-foreground mobile-shadow shadow-foreground mobile-hover-shadow transition-all duration-200 touch-target touch-interaction"
                >
                  <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${isInWishlist(artwork.id) ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls & Indicators */}
      <div className="flex flex-col items-center gap-4 mt-6 sm:mt-8">
        {/* Swipe Indicators */}
        <div className="flex gap-2">
          {artworks.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full border-2 border-foreground transition-all duration-300 ${
                index === selectedIndex 
                  ? 'bg-primary scale-125' 
                  : 'bg-transparent'
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center items-center gap-4 sm:gap-8">
          <Button
            onClick={scrollPrev}
            className="group relative p-0 w-10 h-10 sm:w-12 sm:h-12 bg-paper-white dark:bg-muted border-2 border-foreground rounded-full mobile-shadow shadow-foreground mobile-hover-shadow transition-all duration-200 font-handwritten touch-target touch-interaction"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-foreground group-hover:text-primary transition-colors" />
            <div className="absolute -bottom-0.5 sm:-bottom-1 -right-0.5 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 border-2 border-foreground rounded-full bg-crayon-yellow opacity-80 group-hover:opacity-100 transition-opacity" />
          </Button>

          <Button
            onClick={scrollNext}
            className="group relative p-0 w-10 h-10 sm:w-12 sm:h-12 bg-paper-white dark:bg-muted border-2 border-foreground rounded-full mobile-shadow shadow-foreground mobile-hover-shadow transition-all duration-200 font-handwritten touch-target touch-interaction"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-foreground group-hover:text-primary transition-colors" />
            <div className="absolute -bottom-0.5 sm:-bottom-1 -left-0.5 sm:-left-1 w-2 h-2 sm:w-3 sm:h-3 border-2 border-foreground rounded-full bg-crayon-pink opacity-80 group-hover:opacity-100 transition-opacity" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArtworkCarousel3D;