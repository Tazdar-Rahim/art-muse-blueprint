import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartWishlist } from '@/contexts/CartWishlistContext';
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCartWishlist();

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate('/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto mobile-padding py-6 sm:py-8 pt-20 sm:pt-24">
        {/* Mobile-Enhanced Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
            className="font-handwritten border-2 border-foreground mobile-shadow shadow-foreground mobile-hover-shadow touch-target touch-interaction"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="mobile-heading font-bold font-handwritten text-foreground">My Cart 🛒</h1>
            <p className="text-muted-foreground font-handwritten mobile-text">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <Card className="text-center py-8 sm:py-12 border-2 border-foreground mobile-shadow shadow-foreground">
            <CardContent>
              <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="mobile-text font-handwritten mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground font-handwritten mb-4 mobile-text">
                Add some beautiful artworks to get started!
              </p>
              <Button 
                onClick={() => navigate('/')}
                className="font-handwritten border-2 border-foreground mobile-shadow shadow-foreground mobile-hover-shadow touch-target touch-interaction"
              >
                Browse Artworks
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Mobile-Enhanced Cart Items */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="border-2 border-foreground mobile-shadow shadow-foreground">
                  <CardContent className="mobile-card-padding">
                    <div className="flex gap-3 sm:gap-4">
                      <img
                        src={item.imageUrl || '/placeholder.svg'}
                        alt={item.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-foreground"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold font-handwritten text-foreground mobile-text truncate">{item.title}</h3>
                        <Badge variant="outline" className="font-handwritten mb-2 text-xs">
                          {item.category.replace('_', ' ')}
                        </Badge>
                        <p className="mobile-text font-bold text-primary">₹{item.price}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 touch-target"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 touch-target"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="font-handwritten w-8 text-center mobile-text">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 touch-target"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button
                variant="outline"
                onClick={clearCart}
                className="w-full font-handwritten border-2 border-red-500 text-red-500 hover:bg-red-50 touch-target touch-interaction"
              >
                Clear Cart
              </Button>
            </div>

            {/* Mobile-Enhanced Order Summary */}
            <div>
              <Card className="border-2 border-foreground mobile-shadow shadow-foreground sticky top-20 sm:top-24">
                <CardHeader>
                  <CardTitle className="font-handwritten mobile-text">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-xs sm:text-sm">
                        <span className="font-handwritten truncate mr-2">
                          {item.title} × {item.quantity}
                        </span>
                        <span className="font-handwritten flex-shrink-0">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  
                  <hr className="border-foreground" />
                  
                  <div className="flex justify-between text-base sm:text-lg font-bold">
                    <span className="font-handwritten">Total</span>
                    <span className="font-handwritten text-primary">₹{getCartTotal()}</span>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full font-handwritten border-2 border-foreground mobile-shadow shadow-foreground mobile-hover-shadow touch-target touch-interaction"
                  >
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;