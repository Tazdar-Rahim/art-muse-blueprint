import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import CommissionPackageCard from "@/domains/commission/components/CommissionPackageCard";
import { useActiveCommissionPackages } from "@/domains/commission/hooks/useCommission";

interface CommissionServicesSectionProps {
  onPackageSelect: (packageId: string) => void;
  showAll?: boolean;
}

const CommissionServicesSection = ({
  onPackageSelect,
  showAll = false,
}: CommissionServicesSectionProps) => {
  const { data: packagesResponse, isLoading: packagesLoading } = useActiveCommissionPackages();
  const packages = packagesResponse?.data || [];
  const displayPackages = showAll ? packages : packages.slice(0, 4);

  if (packagesLoading) {
    if (showAll) {
      return (
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-80 min-w-80 animate-pulse bg-muted" />
          ))}
        </div>
      );
    }
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="h-80 animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  if (showAll) {
    return (
      <Carousel 
        className="w-full max-w-5xl mx-auto"
        opts={{
          align: "start",
          slidesToScroll: 1,
          dragFree: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4 p-2">
          {packages.map(pkg => (
            <CarouselItem key={pkg.id} className="pl-2 md:pl-4 basis-4/5 sm:basis-3/5 md:basis-1/2 lg:basis-1/3">
              <CommissionPackageCard 
                id={pkg.id} 
                name={pkg.name} 
                description={pkg.description} 
                basePrice={pkg.base_price} 
                category={pkg.category} 
                style={pkg.style || undefined} 
                includes={pkg.includes || undefined} 
                turnaroundDays={pkg.turnaround_days || undefined} 
                imageUrl={pkg.image_url || undefined} 
                onSelect={onPackageSelect} 
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden sm:block">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    );
  }

  return (
    <Carousel 
      className="w-full max-w-5xl mx-auto"
      opts={{
        align: "start",
        slidesToScroll: 1,
        dragFree: true,
      }}
    >
      <CarouselContent className="-ml-2 md:-ml-4 p-2">
        {displayPackages.map(pkg => (
          <CarouselItem key={pkg.id} className="pl-2 md:pl-4 basis-4/5 sm:basis-3/5 md:basis-1/2 lg:basis-1/4">
            <CommissionPackageCard 
              id={pkg.id} 
              name={pkg.name} 
              description={pkg.description} 
              basePrice={pkg.base_price} 
              category={pkg.category} 
              style={pkg.style || undefined} 
              includes={pkg.includes || undefined} 
              turnaroundDays={pkg.turnaround_days || undefined} 
              imageUrl={pkg.image_url || undefined} 
              onSelect={onPackageSelect} 
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="hidden sm:block">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  );
};

export default CommissionServicesSection;