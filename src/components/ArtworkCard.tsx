import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart } from "lucide-react";

interface ArtworkCardProps {
  id: string;
  title: string;
  description?: string;
  category: string;
  medium?: string;
  style?: string;
  dimensions?: string;
  price?: number;
  imageUrls?: string[];
  isFeatured?: boolean;
  onView: (id: string) => void;
  onPurchase: (id: string) => void;
}

const ArtworkCard = ({
  title,
  description,
  category,
  medium,
  style,
  dimensions,
  price,
  imageUrls,
  isFeatured,
  onView,
  onPurchase,
  id
}: ArtworkCardProps) => {
  const imageUrl = imageUrls?.[0] || '/placeholder.svg';
  
  return (
    <Card className="group relative overflow-hidden bg-card shadow-soft hover:shadow-elegant transition-all duration-500 hover:scale-[1.02]">
      {isFeatured && (
        <Badge className="absolute top-3 left-3 z-10 bg-gradient-primary text-primary-foreground">
          Featured
        </Badge>
      )}
      
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="flex-1 bg-card/90 hover:bg-card"
              onClick={() => onView(id)}
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
            {price && (
              <Button
                size="sm"
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={() => onPurchase(id)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                ${price}
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {description}
            </p>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {category && (
            <Badge variant="outline" className="text-xs">
              {category.replace('_', ' ')}
            </Badge>
          )}
          {medium && (
            <Badge variant="outline" className="text-xs">
              {medium}
            </Badge>
          )}
          {style && (
            <Badge variant="outline" className="text-xs">
              {style}
            </Badge>
          )}
        </div>
        
        <div className="flex justify-between items-center pt-2">
          {dimensions && (
            <span className="text-sm text-muted-foreground">{dimensions}</span>
          )}
          {price && (
            <span className="text-lg font-bold text-primary">${price}</span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ArtworkCard;