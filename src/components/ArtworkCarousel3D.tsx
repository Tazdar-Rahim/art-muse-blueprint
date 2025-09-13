import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ArtworkCard from "@/components/ArtworkCard";
import { Button } from "@/components/ui/button";

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
      {/* 3D Carousel Container */}
      <div 
        ref={carouselRef}
        className="relative h-96 overflow-visible mx-auto"
        style={{ 
          perspective: "1000px",
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
                width: "280px", // Reduced from default card width
              }}
            >
              {/* Scaled down ArtworkCard */}
              <div className="transform scale-75 origin-center">
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
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Handwritten Style Navigation Arrows */}
      <div className="flex justify-center items-center gap-8 mt-8">
        <Button
          onClick={handlePrevious}
          disabled={isTransitioning}
          className="group relative p-0 w-12 h-12 bg-paper-white dark:bg-muted border-2 border-foreground rounded-full shadow-[3px_3px_0px_0px] shadow-foreground hover:shadow-[5px_5px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 font-handwritten"
        >
          <ChevronLeft className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
          {/* Handwritten style decoration */}
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-2 border-foreground rounded-full bg-crayon-yellow opacity-80 group-hover:opacity-100 transition-opacity" />
        </Button>

        {/* Carousel indicators */}
        <div className="flex gap-2">
          {artworks.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full border border-foreground transition-all duration-200 font-handwritten ${
                index === currentIndex 
                  ? 'bg-primary scale-125' 
                  : 'bg-muted hover:bg-accent'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          disabled={isTransitioning}
          className="group relative p-0 w-12 h-12 bg-paper-white dark:bg-muted border-2 border-foreground rounded-full shadow-[3px_3px_0px_0px] shadow-foreground hover:shadow-[5px_5px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 font-handwritten"
        >
          <ChevronRight className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
          {/* Handwritten style decoration */}
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-2 border-foreground rounded-full bg-crayon-pink opacity-80 group-hover:opacity-100 transition-opacity" />
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