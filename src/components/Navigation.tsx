import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Menu, Home, Image, Palette, MessageSquare, ShoppingBag, Phone, ShoppingCart, Heart, LogIn, LogOut, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
interface NavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

// Fixed: Using Image instead of Gallery from lucide-react
const Navigation = ({
  activeSection,
  onNavigate
}: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const { isCustomer, user } = useCustomerAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [shouldScrollOnHomepage, setShouldScrollOnHomepage] = useState(false);

  // Handle scroll after navigation to homepage
  useEffect(() => {
    if (shouldScrollOnHomepage && location.pathname === '/') {
      console.log('Navigation complete, scrolling to top');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setShouldScrollOnHomepage(false);
    }
  }, [location.pathname, shouldScrollOnHomepage]);
const menuItems = [{
    id: "gallery",
    label: "Gallery",
    icon: Image
  }, {
    id: "commission",
    label: "Commission",
    icon: Palette
  }, {
    id: "consultation",
    label: "Consultation",
    icon: MessageSquare
  }, {
    id: "contact",
    label: "Contact",
    icon: Phone
  }];

  const navigationItems = [{
    id: "cart",
    label: "My Cart",
    icon: ShoppingCart,
    path: "/cart"
  }, {
    id: "wishlist",
    label: "Wishlist",
    icon: Heart,
    path: "/wishlist"
  }];
  const handleNavigation = (section: string) => {
    onNavigate(section);
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const handleRouteNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogoClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    console.log('Logo clicked, current pathname:', location.pathname);
    
    if (location.pathname === '/') {
      // Already on homepage, scroll to top
      console.log('Already on homepage, scrolling to top');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsOpen(false);
    } else {
      // Navigate to homepage from other pages
      console.log('Navigating to homepage');
      setShouldScrollOnHomepage(true);
      navigate('/');
      setIsOpen(false);
    }
  };
  return <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b-2 border-zinc-900 dark:border-white mobile-shadow shadow-zinc-900 dark:shadow-white">
      <div className="container mx-auto mobile-padding">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Creative Logo - Mobile Optimized */}
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group relative touch-target" onClick={handleLogoClick}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-400 border-2 border-zinc-900 dark:border-white rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 mobile-shadow shadow-zinc-900 dark:shadow-white">
              <Palette className="w-4 h-4 sm:w-6 sm:h-6 text-zinc-900" />
            </div>
            <div className="relative hidden xs:block">
              <h2 className="text-lg sm:text-xl font-bold font-handwritten text-zinc-900 dark:text-white rotate-[-1deg]">Farhana's</h2>
              <p className="text-xs font-handwritten text-zinc-600 dark:text-zinc-400 rotate-[1deg]">Art Studio ✨</p>
              {/* Decorative underline */}
              <div className="absolute -bottom-1 left-0 w-12 sm:w-16 h-1 bg-amber-400/50 rotate-[-1deg] rounded-full" />
            </div>
          </div>

          {/* Enhanced Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="font-handwritten border-2 border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-800 hover:bg-white dark:hover:bg-zinc-700 mobile-shadow shadow-zinc-900 dark:shadow-white mobile-hover-shadow transition-all duration-200 rounded-lg touch-target touch-interaction">
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80 bg-white/98 dark:bg-zinc-900/98 backdrop-blur-md border-l-2 border-zinc-900 dark:border-white">
              <div className="flex flex-col h-full">
                {/* Mobile Logo */}
                <div className="flex items-center gap-3 pb-6 sm:pb-8 pt-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-400 border-2 border-zinc-900 dark:border-white rounded-full flex items-center justify-center mobile-shadow shadow-zinc-900 dark:shadow-white rotate-[5deg]">
                    <Palette className="w-6 h-6 sm:w-7 sm:h-7 text-zinc-900" />
                  </div>
                  <div className="relative bg-amber-400/80 px-3 py-2 rounded-lg border-2 border-zinc-900 dark:border-white mobile-shadow shadow-zinc-900 dark:shadow-white">
                    <h2 className="text-xl sm:text-2xl font-bold font-handwritten text-zinc-900 rotate-[-1deg]">Farhana's</h2>
                    <p className="text-sm font-handwritten text-zinc-700 rotate-[1deg]">Art Studio ✨</p>
                  </div>
                </div>

                {/* Mobile Menu Items */}
                <div className="flex flex-col gap-3">
                  {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  const rotations = ['rotate-[-1deg]', 'rotate-[1deg]', 'rotate-[-0.5deg]'];
                  const rotation = rotations[index % rotations.length];
                  return <div key={item.id} className={`relative ${rotation}`}>
                        <Button variant="ghost" onClick={() => handleNavigation(item.id)} className={`
                            w-full justify-start h-12 sm:h-14 mobile-text font-handwritten
                            border-2 border-zinc-900 dark:border-white rounded-lg
                            mobile-shadow shadow-zinc-900 dark:shadow-white
                            mobile-hover-shadow
                            transition-all duration-200 touch-interaction
                            ${isActive ? "bg-amber-400 text-zinc-900 shadow-[3px_3px_0px_0px] sm:shadow-[4px_4px_0px_0px]" : "bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-white dark:hover:bg-zinc-700"}
                          `}>
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                          {item.label}
                        </Button>
                        {isActive && <div className="absolute -top-1 -right-1 text-lg rotate-12">⭐</div>}
                      </div>;
                })}

                  {/* Navigation Items */}
                  {navigationItems.map((item, index) => {
                    const Icon = item.icon;
                    const rotations = ['rotate-[-1deg]', 'rotate-[1deg]', 'rotate-[-0.5deg]'];
                    const rotation = rotations[(menuItems.length + index) % rotations.length];
                    return <div key={item.id} className={`relative ${rotation}`}>
                          <Button variant="ghost" onClick={() => handleRouteNavigation(item.path)} className={`
                              w-full justify-start h-12 sm:h-14 mobile-text font-handwritten
                              border-2 border-zinc-900 dark:border-white rounded-lg
                              mobile-shadow shadow-zinc-900 dark:shadow-white
                              mobile-hover-shadow
                              transition-all duration-200 touch-interaction
                              bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-white dark:hover:bg-zinc-700
                            `}>
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                            {item.label}
                          </Button>
                        </div>;
                  })}

                  {/* Authentication */}
                  {user ? (
                    <>
                      <div className="relative rotate-[0.5deg]">
                        <Button variant="ghost" onClick={() => handleRouteNavigation("/my-orders")} className={`
                            w-full justify-start h-12 sm:h-14 mobile-text font-handwritten
                            border-2 border-zinc-900 dark:border-white rounded-lg
                            mobile-shadow shadow-zinc-900 dark:shadow-white
                            mobile-hover-shadow
                            transition-all duration-200 touch-interaction
                            bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-white dark:hover:bg-zinc-700
                          `}>
                          <Package className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                          My Orders
                        </Button>
                      </div>
                      <div className="relative rotate-[-0.5deg]">
                        <Button variant="ghost" onClick={handleSignOut} className={`
                            w-full justify-start h-12 sm:h-14 mobile-text font-handwritten
                            border-2 border-zinc-900 dark:border-white rounded-lg
                            mobile-shadow shadow-zinc-900 dark:shadow-white
                            mobile-hover-shadow
                            transition-all duration-200 touch-interaction
                            bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30
                          `}>
                          <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                          Sign Out
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="relative rotate-[0.5deg]">
                      <Button variant="ghost" onClick={() => handleRouteNavigation("/customer-auth")} className={`
                          w-full justify-start h-12 sm:h-14 mobile-text font-handwritten
                          border-2 border-zinc-900 dark:border-white rounded-lg
                          mobile-shadow shadow-zinc-900 dark:shadow-white
                          mobile-hover-shadow
                          transition-all duration-200 touch-interaction
                          bg-green-50 dark:bg-green-900/20 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30
                        `}>
                        <LogIn className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                        Sign In
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>;
};
export default Navigation;