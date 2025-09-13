import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, ShoppingCart } from "lucide-react";

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

interface CarouselSlideProps {
  artwork: ArtworkData;
  index: number;
  current: number;
  onView: (id: string) => void;
  onPurchase: (id: string) => void;
}

const CarouselSlide = ({ artwork, index, current, onView, onPurchase }: CarouselSlideProps) => {
  const slideRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;

      const x = xRef.current;
      const y = yRef.current;

      slideRef.current.style.setProperty("--x", `${x}px`);
      slideRef.current.style.setProperty("--y", `${y}px`);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  const imageUrl = artwork.image_urls?.[0] || '/placeholder.svg';
  const isActive = current === index;
  const offset = index - current;

  return (
    <div 
      ref={slideRef}
      className="absolute transition-all duration-700 ease-out"
      style={{
        left: '50%',
        top: '50%',
        transform: `
          translate(-50%, -50%) 
          translateX(${offset * 280}px) 
          translateZ(${isActive ? 0 : -100}px)
          rotateY(${offset * 25}deg)
          scale(${isActive ? 1 : 0.8})
        `,
        transformOrigin: 'center center',
        zIndex: isActive ? 10 : 5 - Math.abs(offset),
        opacity: Math.abs(offset) > 2 ? 0 : isActive ? 1 : 0.6,
        pointerEvents: Math.abs(offset) > 1 ? 'none' : 'auto',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Card className="w-72 h-80 bg-card border-2 border-border rounded-lg overflow-hidden shadow-lg">
        {artwork.is_featured && (
          <div className="absolute -top-2 -right-2 bg-amber-400 text-foreground font-bold px-2 py-1 rounded-full rotate-12 text-xs border-2 border-border z-20">
            ⭐ Featured
          </div>
        )}
        
        <div 
          className="relative overflow-hidden transition-all duration-150 ease-out"
          style={{
            transform: isActive 
              ? `translate3d(calc(var(--x) / 40), calc(var(--y) / 40), 0) rotateX(calc(var(--y) / -40)) rotateY(calc(var(--x) / 40))`
              : 'none',
          }}
        >
          <img
            src={imageUrl}
            alt={artwork.title}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
          
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-2 left-2 right-2 flex gap-1">
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1 text-xs"
                  onClick={() => onView(artwork.id)}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>
                {artwork.price && (
                  <Button
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => onPurchase(artwork.id)}
                  >
                    <ShoppingCart className="w-3 h-3 mr-1" />
                    ₹{artwork.price}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-3 space-y-2">
          <div>
            <h3 className="text-base font-bold text-card-foreground line-clamp-1">
              {artwork.title}
            </h3>
            {artwork.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {artwork.description}
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1">
            {artwork.category && (
              <Badge variant="secondary" className="text-xs px-1 py-0">
                {artwork.category.replace('_', ' ')}
              </Badge>
            )}
            {artwork.medium && (
              <Badge variant="outline" className="text-xs px-1 py-0">
                {artwork.medium}
              </Badge>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            {artwork.dimensions && (
              <span className="text-xs text-muted-foreground">{artwork.dimensions}</span>
            )}
            {artwork.price && (
              <span className="text-sm font-bold text-primary">₹{artwork.price}</span>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export function ArtworkCarousel3D({ artworks, onView, onPurchase }: ArtworkCarousel3DProps) {
  const [current, setCurrent] = useState(0);
  
  const handlePrevious = () => {
    setCurrent((prev) => (prev === 0 ? artworks.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === artworks.length - 1 ? 0 : prev + 1));
  };

  if (artworks.length === 0) return null;

  return (
    <div className="relative h-96 mx-auto" style={{ perspective: '1200px', maxWidth: '900px' }}>
      <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
        {artworks.map((artwork, index) => (
          <CarouselSlide
            key={artwork.id}
            artwork={artwork}
            index={index}
            current={current}
            onView={onView}
            onPurchase={onPurchase}
          />
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20">
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border-2"
          onClick={handlePrevious}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20">
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border-2"
          onClick={handleNext}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {artworks.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === current 
                ? 'bg-primary scale-125' 
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  );
}