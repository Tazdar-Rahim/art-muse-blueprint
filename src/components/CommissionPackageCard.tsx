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
  return (
    <Card className="group relative h-full bg-card shadow-soft hover:shadow-elegant transition-all duration-500 hover:scale-[1.02] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-sunset opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
      
      {imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
      )}
      
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
          </div>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge className="bg-primary/10 text-primary border-primary/20">
            {category.replace('_', ' ')}
          </Badge>
          {style && (
            <Badge variant="outline">
              {style}
            </Badge>
          )}
        </div>

        {includes && includes.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-card-foreground">What's included:</h4>
            <ul className="space-y-1">
              {includes.map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">
              ${basePrice}
            </div>
            {turnaroundDays && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {turnaroundDays} days
              </div>
            )}
          </div>
          
          <Button 
            onClick={() => onSelect(id)}
            className="bg-gradient-primary hover:shadow-elegant transition-all duration-300"
          >
            Select Package
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CommissionPackageCard;