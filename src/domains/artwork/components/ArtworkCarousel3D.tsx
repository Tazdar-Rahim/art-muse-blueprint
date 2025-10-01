import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { addToWishlist, isInWishlist } = useCartWishlist();
  
  // Touch/swipe state
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

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

  // Touch handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }
  };

  const getCardTransform = (index: number) => {
    const position = index - currentIndex;
    const isActive = position === 0;
    const isLeft = position < 0;
    const isRight = position > 0;

    if (isActive) {
      return "translateX(0) translateZ(0) rotateY(0deg) scale(1)";
    } else if (isLeft) {
      return "translateX(calc(-100% - 2rem)) translateZ(-40px) rotateY(20deg) scale(0.85)";
    } else if (isRight) {
      return "translateX(calc(100% + 2rem)) translateZ(-40px) rotateY(-20deg) scale(0.85)";
    } else {
      return "translateX(calc(200% + 4rem)) translateZ(-80px) rotateY(-35deg) scale(0.7)";
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
    <div className="relative w-full overflow-hidden">
      {/* Mobile-Enhanced 3D Carousel Container */}
      <div 
        ref={carouselRef}
        className="relative h-[450px] sm:h-[550px] overflow-hidden mx-auto px-4 sm:px-8 py-8"
        style={{ 
          perspective: "800px",
          perspectiveOrigin: "center center"
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {artworks.map((artwork, index) => (
            <div
              key={artwork.id}
              className="absolute transition-all duration-500 ease-out touch-none"
              style={{
                transform: getCardTransform(index),
                opacity: getCardOpacity(index),
                zIndex: getCardZIndex(index),
                transformStyle: "preserve-3d",
                width: "280px",
                maxWidth: "85vw",
              }}
            >
              {/* Mobile-Optimized Cards */}
              <div className="transform scale-75 sm:scale-90 md:scale-100 origin-center">
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
      <div className="flex justify-center items-center gap-4 sm:gap-8 mt-4 sm:mt-6 mobile-padding">
        <Button
          onClick={handlePrevious}
          disabled={isTransitioning}
          className="group relative p-0 w-12 h-12 sm:w-14 sm:h-14 bg-paper-white dark:bg-muted border-2 border-foreground rounded-full mobile-shadow shadow-foreground mobile-hover-shadow transition-all duration-200 font-handwritten touch-target touch-interaction active:scale-95"
          aria-label="Previous artwork"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-foreground group-hover:text-primary transition-colors" />
          {/* Mobile-friendly decoration */}
          <div className="absolute -bottom-0.5 sm:-bottom-1 -right-0.5 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 border-2 border-foreground rounded-full bg-crayon-yellow opacity-80 group-hover:opacity-100 transition-opacity" />
        </Button>

        <Button
          onClick={handleNext}
          disabled={isTransitioning}
          className="group relative p-0 w-12 h-12 sm:w-14 sm:h-14 bg-paper-white dark:bg-muted border-2 border-foreground rounded-full mobile-shadow shadow-foreground mobile-hover-shadow transition-all duration-200 font-handwritten touch-target touch-interaction active:scale-95"
          aria-label="Next artwork"
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