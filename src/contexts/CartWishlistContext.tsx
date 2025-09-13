import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

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

  // Wishlist functions
  const addToWishlist = (item: WishlistItem) => {
    setWishlistItems(prev => {
      if (prev.find(wishlistItem => wishlistItem.id === item.id)) {
        toast({
          title: "Already in wishlist",
          description: `${item.title} is already in your wishlist`,
        });
        return prev;
      }
      toast({
        title: "Added to wishlist",
        description: `${item.title} saved to your wishlist`,
      });
      return [...prev, item];
    });
  };

  const removeFromWishlist = (id: string) => {
    const item = wishlistItems.find(item => item.id === id);
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