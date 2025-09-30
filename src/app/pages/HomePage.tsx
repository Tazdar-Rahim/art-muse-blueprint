import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturedArtworksSection from "./sections/FeaturedArtworksSection";
import CommissionServicesSection from "./sections/CommissionServicesSection";
import ArtworkGallerySection from "./sections/ArtworkGallerySection";
import ContactSection from "./sections/ContactSection";
import ArtworkDetailModal from "@/domains/artwork/components/ArtworkDetailModal";
import CommissionRequestForm from "@/domains/commission/components/CommissionRequestForm";
import ConsultationBooking from "@/domains/commission/components/ConsultationBooking";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useCartWishlist } from "@/contexts/CartWishlistContext";
import { useArtworkById } from "@/domains/artwork/hooks/useArtwork";

type SectionType = "home" | "gallery" | "commission" | "consultation" | "contact";

const HomePage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SectionType>("home");
  const [selectedPackageId, setSelectedPackageId] = useState<string | undefined>();
  const [isCommissionFormOpen, setIsCommissionFormOpen] = useState(false);
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(null);
  const [isArtworkModalOpen, setIsArtworkModalOpen] = useState(false);
  const { toast } = useToast();
  const { addToCart } = useCartWishlist();

  // Fetch selected artwork data
  const { data: artworkResponse } = useArtworkById(selectedArtworkId || "", {
    enabled: !!selectedArtworkId && isArtworkModalOpen,
  } as any);
  const selectedArtwork = artworkResponse?.data;

  const handleNavigation = (section: string) => {
    if (section === "cart") {
      navigate("/cart");
    } else if (section === "wishlist") {
      navigate("/wishlist");
    } else if (section === "my-orders") {
      navigate("/my-orders");
    } else {
      setActiveSection(section as SectionType);
    }
  };

  const handleArtworkView = (id: string) => {
    setSelectedArtworkId(id);
    setIsArtworkModalOpen(true);
  };

  const handleArtworkPurchase = (artworkData: {
    id: string;
    title: string;
    price: number;
    imageUrl?: string;
    category: string;
  }) => {
    addToCart({
      id: artworkData.id,
      title: artworkData.title,
      price: artworkData.price,
      imageUrl: artworkData.imageUrl,
      category: artworkData.category,
    });
    navigate("/checkout", { state: { from: '/' } });
  };

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackageId(packageId);
    setIsCommissionFormOpen(true);
    toast({
      title: "Package Selected",
      description: "Commission form opened with your selected package.",
    });
  };

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="space-y-16">
            <HeroSection 
              onExploreGallery={() => setActiveSection("gallery")} 
              onStartCommission={() => setActiveSection("commission")} 
            />
            
            <FeaturedArtworksSection
              onArtworkView={handleArtworkView}
              onArtworkPurchase={handleArtworkPurchase}
              onViewGallery={() => setActiveSection("gallery")}
            />

            <section className="bg-gradient-gallery py-16">
              <div className="container mx-auto px-4">
                <div className="text-center space-y-4 mb-12">
                  <h2 className="text-3xl font-bold text-foreground">Commission Services</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Bring your vision to life with custom artwork tailored specifically for you
                  </p>
                </div>
                
                <CommissionServicesSection 
                  onPackageSelect={handlePackageSelect}
                  showAll={false}
                />
              </div>
            </section>
          </div>
        );

      case "gallery":
        return (
          <ArtworkGallerySection
            onArtworkView={handleArtworkView}
            onArtworkPurchase={handleArtworkPurchase}
          />
        );

      case "commission":
        return (
          <div className="container mx-auto px-4 pt-24 pb-16 space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-foreground">Commission Artwork</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Let's create something unique together. Choose from our packages or request a custom commission.
              </p>
            </div>

            <section className="space-y-8">
              <h2 className="text-2xl font-bold text-center text-foreground">Choose a Package</h2>
              <CommissionServicesSection 
                onPackageSelect={handlePackageSelect}
                showAll={true}
              />
            </section>
          </div>
        );

      case "consultation":
        return (
          <div className="container mx-auto px-4 pt-24 pb-16">
            <ConsultationBooking />
          </div>
        );

      case "contact":
        return (
          <ContactSection
            onCommissionClick={() => setActiveSection("commission")}
            onConsultationClick={() => setActiveSection("consultation")}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onNavigate={handleNavigation} activeSection={activeSection} />
      {renderContent()}

      {/* Modals */}
      <Dialog open={isCommissionFormOpen} onOpenChange={setIsCommissionFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Commission Request</DialogTitle>
          </DialogHeader>
          <CommissionRequestForm
            selectedPackageId={selectedPackageId}
            onSuccess={() => {
              setIsCommissionFormOpen(false);
              setSelectedPackageId(undefined);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isArtworkModalOpen} onOpenChange={setIsArtworkModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedArtwork && (
            <ArtworkDetailModal
              isOpen={isArtworkModalOpen}
              artwork={selectedArtwork}
              onClose={() => {
                setIsArtworkModalOpen(false);
                setSelectedArtworkId(null);
              }}
              onPurchase={(artworkData) => {
                handleArtworkPurchase(artworkData);
                setIsArtworkModalOpen(false);
                setSelectedArtworkId(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomePage;