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
      
      {/* Main content with proper hierarchy */}
      <div className="absolute inset-0 flex items-center justify-center pt-40">
        <div className="container mx-auto px-6 text-center z-10 max-w-5xl">
          
          {/* Floating decorative elements */}
          <div className="absolute top-8 left-8 opacity-40 animate-float">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-300 to-red-400 shadow-[4px_4px_0px_0px] shadow-red-600 transform rotate-12 flex items-center justify-center border-2 border-red-600">
              <Palette className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="absolute top-16 right-12 opacity-40 animate-float" style={{animationDelay: '1s'}}>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-400 shadow-[4px_4px_0px_0px] shadow-yellow-600 transform rotate-45 flex items-center justify-center border-2 border-yellow-600">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="absolute bottom-32 left-1/4 opacity-40 animate-float" style={{animationDelay: '2s'}}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-300 to-pink-400 shadow-[4px_4px_0px_0px] shadow-pink-600 transform -rotate-12 flex items-center justify-center border-2 border-pink-600">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>


          {/* Artist description */}
          <div className="mb-12 transform rotate-[-0.5deg]">
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm p-8 rounded-2xl border-2 border-foreground shadow-[6px_6px_0px_0px] shadow-foreground/20 max-w-3xl mx-auto">
              <p className="font-handwritten text-xl md:text-2xl text-foreground leading-relaxed">
                Bringing imagination to life through vibrant colors, delicate brushstrokes, and digital artistry. 
                Each piece is a journey from concept to creation, crafted with love and attention to every detail.
              </p>
            </div>
          </div>

          {/* Call to action buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <div className="transform rotate-[2deg]">
              <Button 
                size="lg" 
                onClick={onExploreGallery} 
                className="font-handwritten text-xl bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl shadow-[4px_4px_0px_0px] shadow-foreground hover:shadow-[6px_6px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300 border-2 border-foreground px-8 py-4"
              >
                View My Gallery
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            
            <div className="transform rotate-[-1deg]">
              <Button 
                size="lg" 
                variant="outline" 
                onClick={onStartCommission} 
                className="font-handwritten text-xl border-2 border-foreground bg-background text-foreground hover:bg-foreground hover:text-background rounded-2xl shadow-[4px_4px_0px_0px] shadow-foreground hover:shadow-[6px_6px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300 px-8 py-4"
              >
                Commission Art
                <Palette className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="text-center transform rotate-[0.5deg]">
            <p className="font-handwritten text-xl text-muted-foreground font-medium mb-6">Creating joy through art worldwide ✨</p>
            <div className="flex flex-wrap justify-center items-center gap-6">
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
                  className={`flex items-center gap-3 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-[3px_3px_0px_0px] shadow-foreground/30 border-2 ${borderColor} transform ${index % 2 === 0 ? 'rotate-1' : 'rotate-[-1deg]'}`}
                >
                  <div className={`w-4 h-4 ${color} rounded-full shadow-sm border border-foreground/20`}></div>
                  <span className="font-handwritten font-bold text-lg text-foreground">
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