import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartWishlist } from '@/contexts/CartWishlistContext';
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from 'lucide-react';

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, addToCart } = useCartWishlist();

  const handleAddToCart = (item: any) => {
    if (item.price) {
      addToCart({
        id: item.id,
        title: item.title,
        price: item.price,
        imageUrl: item.imageUrl,
        category: item.category,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/')}
            className="font-handwritten border-2 border-foreground shadow-[2px_2px_0px_0px] shadow-foreground hover:shadow-[4px_4px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold font-handwritten text-foreground">My Wishlist 💝</h1>
            <p className="text-muted-foreground font-handwritten">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'artwork' : 'artworks'} saved
            </p>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <Card className="text-center py-12 border-2 border-foreground shadow-[4px_4px_0px_0px] shadow-foreground">
            <CardContent>
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-handwritten mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground font-handwritten mb-4">
                Save artworks you love to view them later!
              </p>
              <Button 
                onClick={() => navigate('/')}
                className="font-handwritten border-2 border-foreground shadow-[2px_2px_0px_0px] shadow-foreground hover:shadow-[4px_4px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px]"
              >
                Browse Artworks
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="border-2 border-foreground shadow-[2px_2px_0px_0px] shadow-foreground group">
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <img
                      src={item.imageUrl || '/placeholder.svg'}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-lg border border-foreground"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-2 right-2 text-red-500 bg-white/90 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-bold font-handwritten text-foreground">{item.title}</h3>
                    <Badge variant="outline" className="font-handwritten">
                      {item.category.replace('_', ' ')}
                    </Badge>
                    {item.price && (
                      <p className="text-lg font-bold text-primary">₹{item.price}</p>
                    )}
                  </div>
                  
                  {item.price && (
                    <Button
                      onClick={() => handleAddToCart(item)}
                      className="w-full mt-4 font-handwritten border-2 border-foreground shadow-[2px_2px_0px_0px] shadow-foreground hover:shadow-[4px_4px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;