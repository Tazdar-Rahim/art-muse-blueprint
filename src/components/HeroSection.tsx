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
      <BackgroundPaths title="Farhana Art" />
      
      {/* Overlay content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto px-6 text-center z-10">
          {/* Crayon-style decorative elements */}
          <div className="absolute top-16 left-8 opacity-40 animate-float">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-300 to-red-400 shadow-crayon transform rotate-12 flex items-center justify-center">
              <Palette className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="absolute top-32 right-12 opacity-40 animate-float" style={{
          animationDelay: '1s'
        }}>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-400 shadow-crayon transform rotate-45 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="absolute bottom-24 left-1/4 opacity-40 animate-float" style={{
          animationDelay: '2s'
        }}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-300 to-pink-400 shadow-crayon transform -rotate-12 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Portfolio header */}
            <div className="space-y-6 mb-16">
              {/* Artistic subtitle */}
              <p className="text-2xl md:text-3xl text-muted-foreground font-light mb-8">
                Visual Artist & Creative Soul
              </p>

              {/* Artist description */}
              <div className="max-w-3xl mx-auto">
                <p className="text-lg md:text-xl text-foreground leading-relaxed">
                  Bringing imagination to life through vibrant colors, delicate brushstrokes, and digital artistry. 
                  Each piece is a journey from concept to creation, crafted with love and attention to every detail.
                </p>
                
                {/* Signature-style line */}
                
              </div>
            </div>

            {/* Art mediums with crayon-style badges */}
            
            
            {/* Call to action buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button size="lg" onClick={onExploreGallery} className="bg-gradient-primary hover:shadow-elegant hover:scale-105 transition-all duration-300 text-lg rounded-2xl shadow-soft border-0 mx-0 my-0 px-[40px] py-[16px]">
                View My Gallery
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button size="lg" variant="outline" onClick={onStartCommission} className="border-2 border-primary/30 bg-white/90 text-primary hover:bg-primary hover:text-white hover:scale-105 transition-all duration-300 text-lg px-10 py-4 rounded-2xl shadow-soft backdrop-blur-sm">
                Commission Art
                <Palette className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Trust indicators with artistic touch */}
            <div className="text-center mt-16 space-y-6">
              <p className="text-muted-foreground font-medium">Creating joy through art worldwide</p>
              <div className="flex flex-wrap justify-center items-center gap-8 text-foreground/80">
                {[{
                count: "100+",
                label: "Happy Collectors",
                color: "bg-red-400"
              }, {
                count: "50+",
                label: "Custom Pieces",
                color: "bg-blue-400"
              }, {
                count: "Global",
                label: "Shipping",
                color: "bg-green-400"
              }].map(({
                count,
                label,
                color
              }) => <div key={label} className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-soft">
                    <div className={`w-3 h-3 ${color} rounded-full shadow-sm`}></div>
                    <span className="font-semibold text-sm">
                      {count} {label}
                    </span>
                  </div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default HeroSection;