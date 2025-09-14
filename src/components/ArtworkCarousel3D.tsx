import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import ArtworkCard from "@/components/ArtworkCard";
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
  onPurchase: (id: string) => void;
}

const ArtworkCarousel3D = ({ artworks, onView, onPurchase }: ArtworkCarousel3DProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { addToWishlist, isInWishlist } = useCartWishlist();

  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? artworks.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === artworks.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const getCardTransform = (index: number) => {
    const position = index - currentIndex;
    const isActive = position === 0;
    const isLeft = position < 0;
    const isRight = position > 0;

    if (isActive) {
      return "translateX(0) translateZ(0) rotateY(0deg) scale(1)";
    } else if (isLeft) {
      return "translateX(-120%) translateZ(-50px) rotateY(25deg) scale(0.85)";
    } else if (isRight) {
      return "translateX(120%) translateZ(-50px) rotateY(-25deg) scale(0.85)";
    } else {
      return "translateX(200%) translateZ(-100px) rotateY(-45deg) scale(0.7)";
    }
  };

  const getCardOpacity = (index: number) => {
    const position = Math.abs(index - currentIndex);
    if (position === 0) return 1;
    if (position === 1) return 0.8;
    return 0.4;
  };

  const getCardZIndex = (index: number) => {
    const position = Math.abs(index - currentIndex);
    return artworks.length - position;
  };

  return (
    <div className="relative w-full">
      {/* Mobile-Enhanced 3D Carousel Container */}
      <div 
        ref={carouselRef}
        className="relative h-80 sm:h-96 overflow-visible mx-auto mobile-padding"
        style={{ 
          perspective: "800px",
          perspectiveOrigin: "center center"
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {artworks.map((artwork, index) => (
            <div
              key={artwork.id}
              className="absolute transition-all duration-500 ease-out"
              style={{
                transform: getCardTransform(index),
                opacity: getCardOpacity(index),
                zIndex: getCardZIndex(index),
                transformStyle: "preserve-3d",
                width: "280px", // Smaller for mobile
                maxWidth: "90vw", // Responsive width
              }}
            >
              {/* Mobile-Optimized Cards */}
              <div className="transform scale-75 sm:scale-90 origin-center">
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
                    onView={onView}
                    onPurchase={onPurchase}
                  />
                  {/* Mobile-Enhanced Save Button */}
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
            </div>
          ))}
        </div>
      </div>

      {/* Mobile-Enhanced Navigation Controls */}
      <div className="flex justify-center items-center gap-4 sm:gap-8 mt-6 sm:mt-8 mobile-padding">
        <Button
          onClick={handlePrevious}
          disabled={isTransitioning}
          className="group relative p-0 w-10 h-10 sm:w-12 sm:h-12 bg-paper-white dark:bg-muted border-2 border-foreground rounded-full mobile-shadow shadow-foreground mobile-hover-shadow transition-all duration-200 font-handwritten touch-target touch-interaction"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-foreground group-hover:text-primary transition-colors" />
          {/* Mobile-friendly decoration */}
          <div className="absolute -bottom-0.5 sm:-bottom-1 -right-0.5 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 border-2 border-foreground rounded-full bg-crayon-yellow opacity-80 group-hover:opacity-100 transition-opacity" />
        </Button>

        {/* Mobile-Optimized Indicators */}
        <div className="flex gap-1.5 sm:gap-2">
          {artworks.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-1.5 h-1.5 rounded-full border border-foreground transition-all duration-200 font-handwritten touch-target ${
                index === currentIndex 
                  ? 'bg-primary scale-110 sm:scale-125' 
                  : 'bg-muted hover:bg-accent'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          disabled={isTransitioning}
          className="group relative p-0 w-10 h-10 sm:w-12 sm:h-12 bg-paper-white dark:bg-muted border-2 border-foreground rounded-full mobile-shadow shadow-foreground mobile-hover-shadow transition-all duration-200 font-handwritten touch-target touch-interaction"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-foreground group-hover:text-primary transition-colors" />
          {/* Mobile-friendly decoration */}
          <div className="absolute -bottom-0.5 sm:-bottom-1 -left-0.5 sm:-left-1 w-2 h-2 sm:w-3 sm:h-3 border-2 border-foreground rounded-full bg-crayon-pink opacity-80 group-hover:opacity-100 transition-opacity" />
        </Button>
      </div>

      {/* Keyboard navigation */}
      <div 
        className="sr-only" 
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') handlePrevious();
          if (e.key === 'ArrowRight') handleNext();
        }}
      >
        Use arrow keys to navigate carousel
      </div>
    </div>
  );
};

export default ArtworkCarousel3D;