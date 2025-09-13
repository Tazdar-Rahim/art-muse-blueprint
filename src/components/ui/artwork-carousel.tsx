"use client";
import { ArrowRight } from "lucide-react";
import { useState, useRef, useId, useEffect } from "react";

interface ArtworkSlide {
  id: string;
  title: string;
  price?: number;
  imageUrl: string;
  category: string;
}

interface SlideProps {
  slide: ArtworkSlide;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
  onView: (id: string) => void;
  onPurchase: (id: string) => void;
}

const Slide = ({ slide, index, current, handleSlideClick, onView, onPurchase }: SlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null);

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

  const imageLoaded = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.opacity = "1";
  };

  const { imageUrl, title, price, category, id } = slide;

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        className="flex flex-1 flex-col items-center justify-center relative text-center text-white opacity-100 transition-all duration-300 ease-in-out w-[50vmin] h-[50vmin] mx-[2vmin] z-10 cursor-pointer"
        onClick={() => handleSlideClick(index)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform:
            current !== index
              ? "scale(0.85) rotateX(8deg)"
              : "scale(1) rotateX(0deg)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "bottom",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full bg-card border-2 border-border rounded-lg overflow-hidden transition-all duration-150 ease-out shadow-lg"
          style={{
            transform:
              current === index
                ? "translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)"
                : "none",
          }}
        >
          <img
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-600 ease-in-out"
            style={{
              opacity: current === index ? 1 : 0.7,
            }}
            alt={title}
            src={imageUrl}
            onLoad={imageLoaded}
            loading="eager"
            decoding="sync"
          />
          {current === index && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all duration-1000" />
          )}
        </div>

        <article
          className={`relative p-4 transition-opacity duration-1000 ease-in-out ${
            current === index ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className="space-y-3">
            <div className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium inline-block">
              {category.replace('_', ' ')}
            </div>
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white">
              {title}
            </h2>
            {price && (
              <p className="text-amber-400 font-bold text-lg">₹{price}</p>
            )}
          </div>
          
          <div className="flex gap-2 justify-center mt-4">
            <button 
              className="px-4 py-2 bg-white/90 hover:bg-white text-black text-sm font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
              onClick={(e) => {
                e.stopPropagation();
                onView(id);
              }}
            >
              View Details
            </button>
            {price && (
              <button 
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                onClick={(e) => {
                  e.stopPropagation();
                  onPurchase(id);
                }}
              >
                Purchase
              </button>
            )}
          </div>
        </article>
      </li>
    </div>
  );
};

interface CarouselControlProps {
  type: string;
  title: string;
  handleClick: () => void;
}

const CarouselControl = ({
  type,
  title,
  handleClick,
}: CarouselControlProps) => {
  return (
    <button
      className={`w-12 h-12 flex items-center mx-3 justify-center bg-card border-2 border-border rounded-full focus:ring-2 focus:ring-primary focus:outline-none hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl ${
        type === "previous" ? "rotate-180" : ""
      }`}
      title={title}
      onClick={handleClick}
    >
      <ArrowRight className="text-foreground w-5 h-5" />
    </button>
  );
};

interface ArtworkCarouselProps {
  slides: ArtworkSlide[];
  onView: (id: string) => void;
  onPurchase: (id: string) => void;
}

export function ArtworkCarousel({ slides, onView, onPurchase }: ArtworkCarouselProps) {
  const [current, setCurrent] = useState(0);

  const handlePreviousClick = () => {
    const previous = current - 1;
    setCurrent(previous < 0 ? slides.length - 1 : previous);
  };

  const handleNextClick = () => {
    const next = current + 1;
    setCurrent(next === slides.length ? 0 : next);
  };

  const handleSlideClick = (index: number) => {
    if (current !== index) {
      setCurrent(index);
    }
  };

  const id = useId();

  return (
    <div
      className="relative w-full max-w-6xl mx-auto"
      aria-labelledby={`carousel-heading-${id}`}
    >
      <div className="relative overflow-hidden">
        <ul
          className="flex transition-transform duration-1000 ease-in-out justify-center"
          style={{
            transform: `translateX(-${current * (100 / Math.min(slides.length, 3))}%)`,
            width: `${(slides.length / 3) * 100}%`,
          }}
        >
          {slides.map((slide, index) => (
            <Slide
              key={slide.id}
              slide={slide}
              index={index}
              current={current}
              handleSlideClick={handleSlideClick}
              onView={onView}
              onPurchase={onPurchase}
            />
          ))}
        </ul>
      </div>

      <div className="flex justify-center w-full mt-8">
        <CarouselControl
          type="previous"
          title="Go to previous slide"
          handleClick={handlePreviousClick}
        />

        <CarouselControl
          type="next"
          title="Go to next slide"
          handleClick={handleNextClick}
        />
      </div>
    </div>
  );
}