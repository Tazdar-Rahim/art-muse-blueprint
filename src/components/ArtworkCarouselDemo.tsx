"use client";

import { ArtworkCarousel } from "@/components/ui/artwork-carousel";

export function ArtworkCarouselDemo() {
  const slideData = [
    {
      id: "1",
      title: "Winter Serenity",
      price: 2500,
      imageUrl: "https://images.unsplash.com/photo-1494806812796-244fe51b774d?q=80&w=3534&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "landscape"
    },
    {
      id: "2", 
      title: "Urban Dreams",
      price: 3200,
      imageUrl: "https://images.unsplash.com/photo-1518710843675-2540dd79065c?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "urban"
    },
    {
      id: "3",
      title: "Neon Nights", 
      price: 2800,
      imageUrl: "https://images.unsplash.com/photo-1590041794748-2d8eb73a571c?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "abstract"
    },
    {
      id: "4",
      title: "Desert Whispers",
      price: 3500,
      imageUrl: "https://images.unsplash.com/photo-1679420437432-80cfbf88986c?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "nature"
    },
  ];

  const handleView = (id: string) => {
    console.log('View artwork:', id);
  };

  const handlePurchase = (id: string) => {
    console.log('Purchase artwork:', id);
  };

  return (
    <div className="relative overflow-hidden w-full py-16">
      <ArtworkCarousel 
        slides={slideData} 
        onView={handleView}
        onPurchase={handlePurchase}
      />
    </div>
  );
}