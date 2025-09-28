import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ArtworkCard from "@/domains/artwork/components/ArtworkCard";
import { useArtwork } from "@/domains/artwork/hooks/useArtwork";
import { Search, Filter, Palette } from "lucide-react";

interface ArtworkGallerySectionProps {
  onArtworkView: (id: string) => void;
  onArtworkPurchase: (artworkData: {
    id: string;
    title: string;
    price: number;
    imageUrl?: string;
    category: string;
  }) => void;
}

const ArtworkGallerySection = ({
  onArtworkView,
  onArtworkPurchase,
}: ArtworkGallerySectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: artworkResponse, isLoading: artworkLoading } = useArtwork({
    search: searchQuery || undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
    isAvailable: true,
  });

  const artwork = artworkResponse?.data || [];

  return (
    <div className="container mx-auto px-4 pt-24 pb-16 space-y-8">
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
            <Input 
              placeholder="Search artworks..." 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              className="pl-10" 
            />
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
      {artworkLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="h-80 animate-pulse bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artwork.map(item => (
            <ArtworkCard 
              key={item.id} 
              id={item.id} 
              title={item.title} 
              description={item.description} 
              category={item.category} 
              medium={item.medium || undefined} 
              style={item.style || undefined} 
              dimensions={item.dimensions || undefined} 
              price={item.price || undefined} 
              imageUrls={item.image_urls} 
              isFeatured={item.is_featured || undefined} 
              onView={onArtworkView} 
              onPurchase={(artworkData) => onArtworkPurchase(artworkData)} 
            />
          ))}
        </div>
      )}

      {artwork.length === 0 && !artworkLoading && (
        <div className="text-center py-16">
          <Palette className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No artwork found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default ArtworkGallerySection;