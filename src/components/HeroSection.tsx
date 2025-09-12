import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Palette, Heart, Sparkles } from "lucide-react";

interface HeroSectionProps {
  onExploreGallery: () => void;
  onStartCommission: () => void;
}

const HeroSection = ({ onExploreGallery, onStartCommission }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-gallery overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 opacity-20">
        <Palette className="w-16 h-16 text-primary rotate-12" />
      </div>
      <div className="absolute top-40 right-20 opacity-20">
        <Sparkles className="w-12 h-12 text-accent rotate-45" />
      </div>
      <div className="absolute bottom-32 left-1/4 opacity-20">
        <Heart className="w-10 h-10 text-primary/60 -rotate-12" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Artist intro badge */}
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm font-medium">
            ✨ Welcome to Farhana's Art Studio
          </Badge>
          
          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
            Where
            <span className="text-transparent bg-gradient-primary bg-clip-text mx-4">
              Creativity
            </span>
            Meets Canvas
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Original paintings, digital artwork, and custom commissions crafted with passion. 
            Discover unique pieces that tell your story.
          </p>

          {/* Art mediums showcase */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {[
              "Oil Paintings",
              "Watercolor",
              "Digital Art", 
              "Portraits",
              "Landscapes",
              "Custom Commissions"
            ].map((medium) => (
              <Badge key={medium} variant="outline" className="px-3 py-1">
                {medium}
              </Badge>
            ))}
          </div>
          
          {/* Call to action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              size="lg"
              onClick={onExploreGallery}
              className="bg-gradient-primary hover:shadow-elegant transition-all duration-300 text-lg px-8 py-6"
            >
              Explore Gallery
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={onStartCommission}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-lg px-8 py-6"
            >
              Commission Artwork
              <Palette className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="pt-12 space-y-4">
            <p className="text-sm text-muted-foreground">Trusted by art collectors worldwide</p>
            <div className="flex justify-center items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                100+ Happy Customers
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                Custom Commissions
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                Worldwide Shipping
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20 pointer-events-none" />
    </section>
  );
};

export default HeroSection;