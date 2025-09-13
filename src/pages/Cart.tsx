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
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
            className="font-handwritten border-2 border-foreground shadow-[2px_2px_0px_0px] shadow-foreground hover:shadow-[4px_4px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold font-handwritten text-foreground">My Cart 🛒</h1>
            <p className="text-muted-foreground font-handwritten">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <Card className="text-center py-12 border-2 border-foreground shadow-[4px_4px_0px_0px] shadow-foreground">
            <CardContent>
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-handwritten mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground font-handwritten mb-4">
                Add some beautiful artworks to get started!
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
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="border-2 border-foreground shadow-[2px_2px_0px_0px] shadow-foreground">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={item.imageUrl || '/placeholder.svg'}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-lg border border-foreground"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold font-handwritten text-foreground">{item.title}</h3>
                        <Badge variant="outline" className="font-handwritten mb-2">
                          {item.category.replace('_', ' ')}
                        </Badge>
                        <p className="text-lg font-bold text-primary">₹{item.price}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="font-handwritten w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8"
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
                className="w-full font-handwritten border-2 border-red-500 text-red-500 hover:bg-red-50"
              >
                Clear Cart
              </Button>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="border-2 border-foreground shadow-[4px_4px_0px_0px] shadow-foreground sticky top-24">
                <CardHeader>
                  <CardTitle className="font-handwritten">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="font-handwritten">
                          {item.title} × {item.quantity}
                        </span>
                        <span className="font-handwritten">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  
                  <hr className="border-foreground" />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span className="font-handwritten">Total</span>
                    <span className="font-handwritten text-primary">₹{getCartTotal()}</span>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full font-handwritten border-2 border-foreground shadow-[2px_2px_0px_0px] shadow-foreground hover:shadow-[4px_4px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px]"
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