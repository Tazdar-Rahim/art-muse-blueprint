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
  
  // Random rotation for creative effect
  const rotations = ['rotate-[-1deg]', 'rotate-[1deg]', 'rotate-[-2deg]'];
  const rotation = rotations[Math.floor(Math.random() * rotations.length)];
  
  return (
    <div className={`group relative transition-all duration-300 ${rotation}`}>
      {/* Creative shadow card */}
      <div className="absolute inset-0 bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white rounded-lg shadow-[4px_4px_0px_0px] shadow-zinc-900 dark:shadow-white transition-all duration-300 group-hover:shadow-[8px_8px_0px_0px] group-hover:translate-x-[-4px] group-hover:translate-y-[-4px]" />
      
      <Card className="relative bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white rounded-lg overflow-hidden">
        {isFeatured && (
          <div className="absolute -top-2 -right-2 bg-amber-400 text-zinc-900 font-handwritten px-3 py-1 rounded-full rotate-12 text-sm border-2 border-zinc-900 z-10">
            Featured! ⭐
          </div>
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
                className="flex-1 font-handwritten border-2 border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-white dark:hover:bg-zinc-700 shadow-[2px_2px_0px_0px] shadow-zinc-900 dark:shadow-white hover:shadow-[4px_4px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                onClick={() => onView(id)}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Art
              </Button>
              {price && (
                <Button
                  size="sm"
                  className="flex-1 font-handwritten border-2 border-zinc-900 dark:border-white bg-amber-400 text-zinc-900 hover:bg-amber-300 shadow-[2px_2px_0px_0px] shadow-zinc-900 dark:shadow-white hover:shadow-[4px_4px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                  onClick={() => onPurchase(id)}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  ₹{price}
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          <div>
            <h3 className="text-lg font-bold font-handwritten text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors">
              {title}
            </h3>
            {description && (
              <p className="text-sm font-handwritten text-zinc-600 dark:text-zinc-400 line-clamp-2 mt-1">
                {description}
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {category && (
              <div className="px-2 py-1 bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30 rounded-full text-xs font-handwritten">
                {category.replace('_', ' ')}
              </div>
            )}
            {medium && (
              <div className="px-2 py-1 bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 rounded-full text-xs font-handwritten">
                {medium}
              </div>
            )}
            {style && (
              <div className="px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30 rounded-full text-xs font-handwritten">
                {style}
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center pt-2">
            {dimensions && (
              <span className="text-sm font-handwritten text-zinc-600 dark:text-zinc-400">{dimensions}</span>
            )}
            {price && (
              <span className="text-xl font-bold font-handwritten text-amber-600 dark:text-amber-400">₹{price}</span>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ArtworkCard;