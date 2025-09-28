import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ArtworkCarousel3D from "@/domains/artwork/components/ArtworkCarousel3D";
import { useFeaturedArtwork } from "@/domains/artwork/hooks/useArtwork";

interface FeaturedArtworksSectionProps {
  onArtworkView: (id: string) => void;
  onArtworkPurchase: (artworkData: {
    id: string;
    title: string;
    price: number;
    imageUrl?: string;
    category: string;
  }) => void;
  onViewGallery: () => void;
}

const FeaturedArtworksSection = ({
  onArtworkView,
  onArtworkPurchase,
  onViewGallery,
}: FeaturedArtworksSectionProps) => {
  const { data: artworkResponse, isLoading: artworkLoading } = useFeaturedArtwork(6);
  const artwork = artworkResponse?.data || [];

  return (
    <section className="container mx-auto px-4">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl font-bold text-foreground">Featured Artworks</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our most beloved pieces, each crafted with passion and attention to detail
        </p>
      </div>

      {artworkLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-pulse space-y-4">
            <Card className="w-72 h-80 bg-muted" />
            <div className="flex gap-4 justify-center">
              <div className="w-12 h-12 bg-muted rounded-full" />
              <div className="w-12 h-12 bg-muted rounded-full" />
            </div>
          </div>
        </div>
      ) : (
        <ArtworkCarousel3D 
          artworks={artwork}
          onView={onArtworkView}
          onPurchase={onArtworkPurchase}
        />
      )}

      <div className="text-center mt-8">
        <Button 
          variant="outline" 
          size="lg" 
          onClick={onViewGallery}
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          View Full Gallery
        </Button>
      </div>
    </section>
  );
};

export default FeaturedArtworksSection;