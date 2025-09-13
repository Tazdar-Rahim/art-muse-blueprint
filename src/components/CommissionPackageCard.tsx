import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Clock, Palette } from "lucide-react";

interface CommissionPackageCardProps {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: string;
  style?: string;
  includes?: string[];
  turnaroundDays?: number;
  imageUrl?: string;
  onSelect: (id: string) => void;
}

const CommissionPackageCard = ({
  id,
  name,
  description,
  basePrice,
  category,
  style,
  includes,
  turnaroundDays,
  imageUrl,
  onSelect
}: CommissionPackageCardProps) => {
  // Random rotation for creative effect
  const rotations = ['rotate-[-1deg]', 'rotate-[1deg]', 'rotate-[-2deg]'];
  const rotation = rotations[Math.floor(Math.random() * rotations.length)];
  
  return (
    <div className={`group relative h-full transition-all duration-300 ${rotation}`}>
      {/* Creative shadow card */}
      <div className="absolute inset-0 bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white rounded-lg shadow-[4px_4px_0px_0px] shadow-zinc-900 dark:shadow-white transition-all duration-300 group-hover:shadow-[8px_8px_0px_0px] group-hover:translate-x-[-4px] group-hover:translate-y-[-4px]" />
      
      <Card className="relative h-full bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white rounded-lg overflow-hidden">
        {imageUrl && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Creative decorative elements */}
            <div className="absolute top-2 right-2 text-2xl rotate-12">
              🎨
            </div>
          </div>
        )}
        
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-zinc-900 dark:border-white flex items-center justify-center">
                <Palette className="w-4 h-4 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold font-handwritten text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors">
                {name}
              </h3>
            </div>
            <p className="font-handwritten text-zinc-600 dark:text-zinc-400">{description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="px-2 py-1 bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30 rounded-full text-xs font-handwritten">
              {category.replace('_', ' ')}
            </div>
            {style && (
              <div className="px-2 py-1 bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 rounded-full text-xs font-handwritten">
                {style}
              </div>
            )}
          </div>

          {includes && includes.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold font-handwritten text-zinc-900 dark:text-white">What's included:</h4>
              <ul className="space-y-1">
                {includes.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm font-handwritten text-zinc-600 dark:text-zinc-400">
                    <div className="w-4 h-4 rounded-full border-2 border-zinc-900 dark:border-white flex items-center justify-center">
                      <Check className="w-2 h-2" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t-2 border-zinc-900 dark:border-white border-dashed">
            <div className="space-y-1">
              <div className="text-3xl font-bold font-handwritten text-amber-600 dark:text-amber-400">
                ₹{basePrice}
              </div>
              {turnaroundDays && (
                <div className="flex items-center gap-1 text-sm font-handwritten text-zinc-600 dark:text-zinc-400">
                  <Clock className="w-4 h-4" />
                  {turnaroundDays} days
                </div>
              )}
            </div>
            
            <Button 
              onClick={() => onSelect(id)}
              className="font-handwritten border-2 border-zinc-900 dark:border-white bg-amber-400 text-zinc-900 hover:bg-amber-300 shadow-[4px_4px_0px_0px] shadow-zinc-900 dark:shadow-white hover:shadow-[6px_6px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300"
            >
              Let's Create! ✨
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Decorative background elements */}
      <div className="absolute -bottom-2 -right-2 text-xl rotate-[-15deg] opacity-50">
        ✏️
      </div>
    </div>
  );
};

export default CommissionPackageCard;