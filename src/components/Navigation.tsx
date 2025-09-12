import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  Home, 
  Image, 
  Palette, 
  MessageSquare, 
  ShoppingBag,
  Phone
} from "lucide-react";

interface NavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

// Fixed: Using Image instead of Gallery from lucide-react
const Navigation = ({ activeSection, onNavigate }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "gallery", label: "Gallery", icon: Image },
    { id: "commission", label: "Commission", icon: Palette },
    { id: "consultation", label: "Consultation", icon: MessageSquare },
    { id: "shop", label: "Shop", icon: ShoppingBag },
    { id: "contact", label: "Contact", icon: Phone }
  ];

  const handleNavigation = (section: string) => {
    onNavigate(section);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-sketch-gray/30 shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => handleNavigation("home")}
          >
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-crayon">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Farhana</h2>
              <p className="text-xs text-muted-foreground">Art Studio</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleNavigation(item.id)}
                  className={`
                    transition-all duration-300 relative rounded-xl
                    ${isActive 
                      ? "bg-gradient-primary text-white shadow-crayon hover:scale-105" 
                      : "hover:bg-paper-white hover:text-foreground hover:shadow-soft"
                    }
                  `}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-sm" />
                  )}
                </Button>
              );
            })}
          </div>

          {/* Featured badge */}
          <div className="hidden md:block">
            <Badge className="bg-gradient-to-r from-crayon-yellow/20 to-crayon-orange/20 text-foreground border border-crayon-yellow/30 shadow-soft hover:scale-105 transition-transform duration-300">
              ✨ Custom Art Available
            </Badge>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm" className="hover:bg-paper-white rounded-xl">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-white/98 backdrop-blur-md border-l border-sketch-gray/30">
              <div className="flex flex-col h-full">
                {/* Mobile Logo */}
                <div className="flex items-center gap-3 pb-8 pt-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-crayon">
                    <Palette className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Farhana</h2>
                    <p className="text-sm text-muted-foreground">Art Studio</p>
                  </div>
                </div>

                {/* Mobile Menu Items */}
                <div className="flex flex-col gap-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    
                    return (
                      <Button
                        key={item.id}
                        variant={isActive ? "default" : "ghost"}
                        onClick={() => handleNavigation(item.id)}
                        className={`
                          justify-start h-14 text-base rounded-xl
                          ${isActive 
                            ? "bg-gradient-primary text-white shadow-crayon" 
                            : "hover:bg-paper-white hover:shadow-soft"
                          }
                        `}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {item.label}
                      </Button>
                    );
                  })}
                </div>

                {/* Mobile Featured */}
                <div className="mt-auto pb-6">
                  <Badge className="w-full justify-center py-3 bg-gradient-to-r from-crayon-yellow/20 to-crayon-orange/20 text-foreground border border-crayon-yellow/30 rounded-xl shadow-soft">
                    ✨ Custom Art Available
                  </Badge>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;