import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ArtworkCard from "@/components/ArtworkCard";
import ArtworkCarousel3D from "@/components/ArtworkCarousel3D";
import ArtworkDetailModal from "@/components/ArtworkDetailModal";
import CommissionPackageCard from "@/components/CommissionPackageCard";
import CommissionRequestForm from "@/components/CommissionRequestForm";
import ConsultationBooking from "@/components/ConsultationBooking";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useCartWishlist } from "@/contexts/CartWishlistContext";
import { Search, Filter, Palette, Mail, Phone, MapPin, Instagram, Facebook, Twitter, ShoppingBag } from "lucide-react";
const Index = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedPackageId, setSelectedPackageId] = useState<string | undefined>();
  const [isCommissionFormOpen, setIsCommissionFormOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<any>(null);
  const [isArtworkModalOpen, setIsArtworkModalOpen] = useState(false);
  const { toast } = useToast();
  const { addToCart } = useCartWishlist();

  const handleNavigation = (section: string) => {
    if (section === "cart") {
      navigate("/cart");
    } else if (section === "wishlist") {
      navigate("/wishlist");
    } else if (section === "my-orders") {
      navigate("/my-orders");
    } else {
      setActiveSection(section);
    }
  };

  // Fetch artwork
  const {
    data: artwork,
    isLoading: artworkLoading
  } = useQuery({
    queryKey: ["artwork"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("artwork").select("*").eq("is_available", true).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });

  // Fetch commission packages
  const {
    data: packages,
    isLoading: packagesLoading
  } = useQuery({
    queryKey: ["commission_packages"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("commission_packages").select("*").eq("is_active", true).order("base_price", {
        ascending: true
      });
      if (error) throw error;
      return data;
    }
  });

  // Filter artwork based on search and category
  const filteredArtwork = artwork?.filter(item => {
    const matchesSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  const handleArtworkView = (id: string) => {
    const artworkToView = artwork?.find(item => item.id === id);
    if (artworkToView) {
      setSelectedArtwork(artworkToView);
      setIsArtworkModalOpen(true);
    }
  };
  
  const handleArtworkPurchase = (id: string) => {
    const artworkToPurchase = artwork?.find(item => item.id === id);
    if (artworkToPurchase && artworkToPurchase.price) {
      // Add to cart first, then navigate to checkout
      addToCart({
        id: artworkToPurchase.id,
        title: artworkToPurchase.title,
        price: artworkToPurchase.price,
        imageUrl: artworkToPurchase.image_urls?.[0],
        category: artworkToPurchase.category,
      });
      navigate("/checkout");
    }
  };
  const handlePackageSelect = (packageId: string) => {
    setSelectedPackageId(packageId);
    setIsCommissionFormOpen(true);
    toast({
      title: "Package Selected",
      description: "Commission form opened with your selected package."
    });
  };
  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <div className="space-y-16">
            <HeroSection onExploreGallery={() => setActiveSection("gallery")} onStartCommission={() => setActiveSection("commission")} />

            {/* Featured Artworks */}
            <section className="container mx-auto px-4">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl font-bold text-foreground">Featured Artworks</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Discover our most beloved pieces, each crafted with passion and attention to detail
                </p>
              </div>

              {artworkLoading ? <div className="flex justify-center items-center h-96">
                  <div className="animate-pulse space-y-4">
                    <Card className="w-72 h-80 bg-muted" />
                    <div className="flex gap-4 justify-center">
                      <div className="w-12 h-12 bg-muted rounded-full" />
                      <div className="w-12 h-12 bg-muted rounded-full" />
                    </div>
                  </div>
                </div> : <ArtworkCarousel3D artworks={artwork?.filter(item => item.is_featured).slice(0, 6) || []} onView={handleArtworkView} onPurchase={handleArtworkPurchase} />}

              <div className="text-center mt-8">
                <Button variant="outline" size="lg" onClick={() => setActiveSection("gallery")} className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  View Full Gallery
                </Button>
              </div>
            </section>

            {/* Commission Packages Preview */}
            <section className="bg-gradient-gallery py-16">
              <div className="container mx-auto px-4">
                <div className="text-center space-y-4 mb-12">
                  <h2 className="text-3xl font-bold text-foreground">Commission Services</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Bring your vision to life with custom artwork tailored specifically for you
                  </p>
                </div>

                {packagesLoading ? <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <Card key={i} className="h-80 animate-pulse bg-muted" />)}
                  </div> : <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {packages?.slice(0, 4).map(pkg => <CommissionPackageCard key={pkg.id} id={pkg.id} name={pkg.name} description={pkg.description} basePrice={pkg.base_price} category={pkg.category} style={pkg.style} includes={pkg.includes} turnaroundDays={pkg.turnaround_days} imageUrl={pkg.image_url} onSelect={handlePackageSelect} />)}
                  </div>}
              </div>
            </section>
          </div>;
      case "gallery":
        return <div className="container mx-auto px-4 pt-24 pb-16 space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-foreground">Art Gallery</h1>
              <p className="text-lg text-muted-foreground">
                Explore our complete collection of original artworks
              </p>
            </div>

            {/* Search and Filter */}
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search artworks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
                <div className="flex gap-2">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="original_painting">Original Paintings</SelectItem>
                      <SelectItem value="digital_art">Digital Art</SelectItem>
                      <SelectItem value="print">Prints</SelectItem>
                      <SelectItem value="illustration">Illustrations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Artwork Grid */}
            {artworkLoading ? <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({
              length: 8
            }).map((_, i) => <Card key={i} className="h-80 animate-pulse bg-muted" />)}
              </div> : <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredArtwork?.map(item => <ArtworkCard key={item.id} id={item.id} title={item.title} description={item.description} category={item.category} medium={item.medium} style={item.style} dimensions={item.dimensions} price={item.price} imageUrls={item.image_urls} isFeatured={item.is_featured} onView={handleArtworkView} onPurchase={handleArtworkPurchase} />)}
              </div>}

            {filteredArtwork?.length === 0 && <div className="text-center py-16">
                <Palette className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No artwork found</h3>
                
              </div>}
          </div>;
      case "commission":
        return <div className="container mx-auto px-4 pt-24 pb-16 space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-foreground">Commission Artwork</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Let's create something unique together. Choose from our packages or request a custom commission.
              </p>
            </div>

            {/* Commission Packages */}
            <section className="space-y-8">
              <h2 className="text-2xl font-bold text-center text-foreground">Choose a Package</h2>
              
              {packagesLoading ? (
                <div className="flex gap-6 overflow-hidden">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="h-80 min-w-80 animate-pulse bg-muted" />
                  ))}
                </div>
              ) : (
                <Carousel className="w-full max-w-5xl mx-auto">
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {packages?.map(pkg => (
                      <CarouselItem key={pkg.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                        <CommissionPackageCard 
                          id={pkg.id} 
                          name={pkg.name} 
                          description={pkg.description} 
                          basePrice={pkg.base_price} 
                          category={pkg.category} 
                          style={pkg.style} 
                          includes={pkg.includes} 
                          turnaroundDays={pkg.turnaround_days} 
                          imageUrl={pkg.image_url} 
                          onSelect={handlePackageSelect} 
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              )}
            </section>
          </div>;
      case "consultation":
        return <div className="container mx-auto px-4 pt-24 pb-16">
            <ConsultationBooking />
          </div>;
      case "contact":
        return <div className="container mx-auto px-4 pt-24 pb-16 space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-foreground">Get in Touch</h1>
              <p className="text-lg text-muted-foreground">
                Let's discuss your next art project or answer any questions you might have
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              <Card className="p-8 space-y-6 bg-gradient-gallery shadow-elegant">
                <h2 className="text-2xl font-bold text-card-foreground">Contact Information</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-muted-foreground">farhanashaheenart@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <p className="text-muted-foreground">+91 9401244877</p>
                    </div>
                  </div>

                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="font-semibold mb-4">Follow My Art Journey</h3>
                  <div className="flex gap-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-12 h-12 p-0"
                      onClick={() => window.open('https://www.instagram.com/farhana_shaheen_art/', '_blank')}
                    >
                      <Instagram className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-12 h-12 p-0"
                      onClick={() => window.open('https://www.facebook.com/farhana.shaheen.12', '_blank')}
                    >
                      <Facebook className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-12 h-12 p-0"
                      onClick={() => window.open('https://x.com/artfarhana?s=21&t=djUD1U48Upbdby2Db2YY-w', '_blank')}
                    >
                      <Twitter className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-8 bg-card shadow-elegant">
                <h2 className="text-2xl font-bold text-card-foreground mb-6">Quick Actions</h2>
                
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start h-16 text-left" onClick={() => setActiveSection("commission")}>
                    <Palette className="w-6 h-6 mr-4 text-primary" />
                    <div>
                      <div className="font-semibold">Request Commission</div>
                      <div className="text-sm text-muted-foreground">Start a custom artwork project</div>
                    </div>
                  </Button>

                  <Button variant="outline" className="w-full justify-start h-16 text-left" onClick={() => setActiveSection("consultation")}>
                    <Phone className="w-6 h-6 mr-4 text-accent" />
                    <div>
                      <div className="font-semibold">Book Consultation</div>
                      <div className="text-sm text-muted-foreground">Discuss your project via WhatsApp</div>
                    </div>
                  </Button>

                  <Button variant="outline" className="w-full justify-start h-16 text-left" onClick={() => window.open('/login', '_blank')}>
                    <Search className="w-6 h-6 mr-4 text-gallery-gold" />
                    <div>
                      <div className="font-semibold">Admin Portal</div>
                      <div className="text-sm text-muted-foreground">Manage content and orders</div>
                    </div>
                  </Button>

                  <Button variant="outline" className="w-full justify-start h-16 text-left" onClick={() => navigate("/customer-auth")}>
                    <ShoppingBag className="w-6 h-6 mr-4 text-primary" />
                    <div>
                      <div className="font-semibold">My Orders</div>
                      <div className="text-sm text-muted-foreground">Track your purchases & orders</div>
                    </div>
                  </Button>

                  <Button variant="outline" className="w-full justify-start h-16 text-left" onClick={() => setActiveSection("gallery")}>
                    <Search className="w-6 h-6 mr-4 text-gallery-gold" />
                    <div>
                      <div className="font-semibold">Browse Gallery</div>
                      <div className="text-sm text-muted-foreground">View all available artworks</div>
                    </div>
                  </Button>
                </div>
              </Card>
            </div>
          </div>;
      default:
        return null;
    }
  };
  return <div className="min-h-screen bg-background">
      <Navigation activeSection={activeSection} onNavigate={handleNavigation} />
      
      {renderContent()}
      
      {/* Commission Form Dialog */}
      <Dialog open={isCommissionFormOpen} onOpenChange={setIsCommissionFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Commission Request</DialogTitle>
          </DialogHeader>
          <CommissionRequestForm 
            selectedPackageId={selectedPackageId} 
            onSuccess={() => {
              setIsCommissionFormOpen(false);
              toast({
                title: "Success!",
                description: "Your commission request has been submitted."
              });
            }} 
          />
        </DialogContent>
      </Dialog>

      {/* Artwork Detail Modal */}
      <ArtworkDetailModal
        isOpen={isArtworkModalOpen}
        onClose={() => setIsArtworkModalOpen(false)}
        artwork={selectedArtwork}
        onPurchase={handleArtworkPurchase}
      />
    </div>;
};
export default Index;