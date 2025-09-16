import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CartItem {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
  category: string;
  quantity: number;
}

interface WishlistItem {
  id: string;
  title: string;
  price?: number;
  imageUrl?: string;
  category: string;
}

interface CartWishlistContextType {
  // Cart
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  
  // Wishlist
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

const CartWishlistContext = createContext<CartWishlistContextType | undefined>(undefined);

export const useCartWishlist = () => {
  const context = useContext(CartWishlistContext);
  if (!context) {
    throw new Error('useCartWishlist must be used within CartWishlistProvider');
  }
  return context;
};

interface CartWishlistProviderProps {
  children: ReactNode;
}

export const CartWishlistProvider = ({ children }: CartWishlistProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { user, loading } = useAuth();

  // Load wishlist from database when user is authenticated
  useEffect(() => {
    const loadWishlist = async () => {
      if (loading) return; // Wait for auth to load
      
      if (!user) {
        setWishlistItems([]);
        return;
      }

      const { data, error } = await supabase
        .from('wishlists')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading wishlist:', error);
        return;
      }

      const wishlistItems: WishlistItem[] = data.map(item => ({
        id: item.artwork_id,
        title: item.artwork_title,
        price: item.artwork_price,
        imageUrl: item.artwork_image_url,
        category: item.artwork_category,
      }));

      setWishlistItems(wishlistItems);
    };

    loadWishlist();
  }, [user, loading]);

  // Cart functions
  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        toast({
          title: "Updated cart",
          description: `Increased quantity of ${item.title}`,
        });
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        toast({
          title: "Added to cart",
          description: `${item.title} added to your cart`,
        });
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    const item = cartItems.find(item => item.id === id);
    setCartItems(prev => prev.filter(item => item.id !== id));
    if (item) {
      toast({
        title: "Removed from cart",
        description: `${item.title} removed from your cart`,
      });
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart cleared",
      description: "All items removed from your cart",
    });
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Wishlist functions with database integration
  const addToWishlist = async (item: WishlistItem) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save items to your wishlist",
      });
      return;
    }

    if (wishlistItems.find(wishlistItem => wishlistItem.id === item.id)) {
      toast({
        title: "Already in wishlist",
        description: `${item.title} is already in your wishlist`,
      });
      return;
    }

    // Add to database
    const { error } = await supabase
      .from('wishlists')
      .insert({
        user_id: user.id,
        artwork_id: item.id,
        artwork_title: item.title,
        artwork_price: item.price,
        artwork_image_url: item.imageUrl,
        artwork_category: item.category,
      });

    if (error) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to add item to wishlist",
      });
      return;
    }

    setWishlistItems(prev => [...prev, item]);
    toast({
      title: "Added to wishlist",
      description: `${item.title} saved to your wishlist`,
    });
  };

  const removeFromWishlist = async (id: string) => {
    const item = wishlistItems.find(item => item.id === id);
    
    if (!user) {
      return;
    }

    // Remove from database
    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('user_id', user.id)
      .eq('artwork_id', id);

    if (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
      });
      return;
    }

    setWishlistItems(prev => prev.filter(item => item.id !== id));
    if (item) {
      toast({
        title: "Removed from wishlist",
        description: `${item.title} removed from your wishlist`,
      });
    }
  };

  const isInWishlist = (id: string) => {
    return wishlistItems.some(item => item.id === id);
  };

  return (
    <CartWishlistContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
};