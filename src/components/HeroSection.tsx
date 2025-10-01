import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { ArrowRight, Palette, Heart, Sparkles } from "lucide-react";
interface HeroSectionProps {
  onExploreGallery: () => void;
  onStartCommission: () => void;
}
const HeroSection = ({
  onExploreGallery,
  onStartCommission
}: HeroSectionProps) => {
  return <div className="relative">
      <BackgroundPaths title="Farhana's Art studio" />
      
      {/* Mobile-Enhanced Main content */}
      <div className="absolute inset-0 flex items-center justify-center pt-28 sm:pt-40">
        <div className="container mx-auto mobile-padding text-center z-10 max-w-5xl">
          
          {/* Mobile-Optimized Floating decorative elements */}
          <div className="absolute top-4 sm:top-8 left-4 sm:left-8 opacity-40 animate-float hidden sm:block">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-red-300 to-red-400 mobile-shadow shadow-red-600 transform rotate-12 flex items-center justify-center border-2 border-red-600">
              <Palette className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>
          <div className="absolute top-8 sm:top-16 right-6 sm:right-12 opacity-40 animate-float hidden sm:block" style={{animationDelay: '1s'}}>
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-400 mobile-shadow shadow-yellow-600 transform rotate-45 flex items-center justify-center border-2 border-yellow-600">
              <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
          </div>
          <div className="absolute bottom-20 sm:bottom-32 left-1/4 opacity-40 animate-float hidden sm:block" style={{animationDelay: '2s'}}>
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-pink-300 to-pink-400 mobile-shadow shadow-pink-600 transform -rotate-12 flex items-center justify-center border-2 border-pink-600">
              <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>


          {/* Mobile-Enhanced Artist description */}
          <div className="mb-8 sm:mb-12 transform rotate-[-0.5deg]">
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm mobile-card-padding rounded-2xl border-2 border-foreground mobile-shadow shadow-foreground/20 max-w-3xl mx-auto">
              <p className="font-handwritten mobile-heading text-foreground leading-relaxed">
                Bringing imagination to life through vibrant colors, delicate brushstrokes, and digital artistry. 
                Each piece is a journey from concept to creation, crafted with love and attention to every detail.
              </p>
            </div>
          </div>

          {/* Mobile-Enhanced Call to action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16">
            <div className="transform rotate-[2deg]">
              <Button 
                size="lg" 
                onClick={onExploreGallery} 
                className="font-handwritten mobile-text bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl mobile-shadow shadow-foreground mobile-hover-shadow transition-all duration-200 border-2 border-foreground px-6 sm:px-8 py-3 sm:py-4 touch-target touch-interaction"
              >
                View My Gallery
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
            </div>
            
            <div className="transform rotate-[-1deg]">
              <Button 
                size="lg" 
                variant="outline" 
                onClick={onStartCommission} 
                className="font-handwritten mobile-text border-2 border-foreground bg-background text-foreground hover:bg-foreground hover:text-background rounded-2xl mobile-shadow shadow-foreground mobile-hover-shadow transition-all duration-200 px-6 sm:px-8 py-3 sm:py-4 touch-target touch-interaction"
              >
                Commission Art
                <Palette className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
            </div>
          </div>

          {/* Mobile-Enhanced Trust indicators */}
          <div className="text-center transform rotate-[0.5deg]">
            <p className="font-handwritten mobile-text text-muted-foreground font-medium mb-4 sm:mb-6">Creating joy through art worldwide ✨</p>
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6">
              {[{
                count: "100+",
                label: "Happy Collectors",
                color: "bg-red-400",
                borderColor: "border-red-600"
              }, {
                count: "50+",
                label: "Custom Pieces", 
                color: "bg-blue-400",
                borderColor: "border-blue-600"
              }, {
                count: "Global",
                label: "Shipping",
                color: "bg-green-400",
                borderColor: "border-green-600"
              }].map(({count, label, color, borderColor}, index) => 
                <div 
                  key={label} 
                  className={`flex items-center gap-2 sm:gap-3 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-full px-3 sm:px-6 py-2 sm:py-3 mobile-shadow shadow-foreground/30 border-2 ${borderColor} transform ${index % 2 === 0 ? 'rotate-1' : 'rotate-[-1deg]'}`}
                >
                  <div className={`w-3 h-3 sm:w-4 sm:h-4 ${color} rounded-full shadow-sm border border-foreground/20`}></div>
                  <span className="font-handwritten font-bold mobile-text text-foreground">
                    {count} {label}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default HeroSection;