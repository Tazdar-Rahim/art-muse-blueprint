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
  Phone,
  ShoppingCart,
  Heart
} from "lucide-react";

interface NavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

// Fixed: Using Image instead of Gallery from lucide-react
const Navigation = ({ activeSection, onNavigate }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: "gallery", label: "Gallery", icon: Image },
    { id: "commission", label: "Commission", icon: Palette },
    { id: "consultation", label: "Consultation", icon: MessageSquare },
    { id: "shop", label: "Shop", icon: ShoppingBag },
    { id: "contact", label: "Contact", icon: Phone },
    { id: "cart", label: "My Cart", icon: ShoppingCart },
    { id: "wishlist", label: "Wishlist", icon: Heart }
  ];

  const handleNavigation = (section: string) => {
    onNavigate(section);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b-2 border-zinc-900 dark:border-white shadow-[4px_4px_0px_0px] shadow-zinc-900 dark:shadow-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Creative Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group relative" 
            onClick={() => handleNavigation("home")}
          >
            <div className="w-10 h-10 bg-amber-400 border-2 border-zinc-900 dark:border-white rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-[2px_2px_0px_0px] shadow-zinc-900 dark:shadow-white">
              <Palette className="w-6 h-6 text-zinc-900" />
            </div>
            <div className="relative">
              <h2 className="text-xl font-bold font-handwritten text-zinc-900 dark:text-white rotate-[-1deg]">Farhana</h2>
              <p className="text-xs font-handwritten text-zinc-600 dark:text-zinc-400 rotate-[1deg]">Art Studio ✨</p>
              {/* Decorative underline */}
              <div className="absolute -bottom-1 left-0 w-16 h-1 bg-amber-400/50 rotate-[-1deg] rounded-full" />
            </div>
          </div>

          {/* Hamburger Menu for both mobile and desktop */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="font-handwritten border-2 border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-800 hover:bg-white dark:hover:bg-zinc-700 shadow-[2px_2px_0px_0px] shadow-zinc-900 dark:shadow-white hover:shadow-[4px_4px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300 rounded-lg">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-white/98 dark:bg-zinc-900/98 backdrop-blur-md border-l-2 border-zinc-900 dark:border-white">
              <div className="flex flex-col h-full">
                {/* Mobile Logo */}
                <div className="flex items-center gap-3 pb-8 pt-4">
                  <div className="w-12 h-12 bg-amber-400 border-2 border-zinc-900 dark:border-white rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px] shadow-zinc-900 dark:shadow-white rotate-[5deg]">
                    <Palette className="w-7 h-7 text-zinc-900" />
                  </div>
                  <div className="relative">
                    <h2 className="text-2xl font-bold font-handwritten text-zinc-900 dark:text-white rotate-[-1deg]">Farhana</h2>
                    <p className="text-sm font-handwritten text-zinc-600 dark:text-zinc-400 rotate-[1deg]">Art Studio ✨</p>
                  </div>
                </div>

                {/* Mobile Menu Items */}
                <div className="flex flex-col gap-3">
                  {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    const rotations = ['rotate-[-1deg]', 'rotate-[1deg]', 'rotate-[-0.5deg]'];
                    const rotation = rotations[index % rotations.length];
                    
                    return (
                      <div key={item.id} className={`relative ${rotation}`}>
                        <Button
                          variant="ghost"
                          onClick={() => handleNavigation(item.id)}
                          className={`
                            w-full justify-start h-14 text-base font-handwritten
                            border-2 border-zinc-900 dark:border-white rounded-lg
                            shadow-[2px_2px_0px_0px] shadow-zinc-900 dark:shadow-white
                            hover:shadow-[4px_4px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px]
                            transition-all duration-300
                            ${isActive 
                              ? "bg-amber-400 text-zinc-900 shadow-[4px_4px_0px_0px]" 
                              : "bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-white dark:hover:bg-zinc-700"
                            }
                          `}
                        >
                          <Icon className="w-5 h-5 mr-3" />
                          {item.label}
                        </Button>
                        {isActive && (
                          <div className="absolute -top-1 -right-1 text-lg rotate-12">⭐</div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Mobile Featured */}
                <div className="mt-auto pb-6 relative rotate-[1deg]">
                  <div className="w-full text-center py-3 bg-blue-500/20 text-blue-700 dark:text-blue-300 border-2 border-blue-500 rounded-lg font-handwritten shadow-[2px_2px_0px_0px] shadow-blue-500">
                    ✨ Custom Art Available
                  </div>
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