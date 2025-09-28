import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCartWishlist } from '@/contexts/CartWishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { resolveArtworkImages } from '@/lib/artwork-images';
import CheckoutAuth from '@/components/CheckoutAuth';
import Navigation from '@/components/Navigation';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCartWishlist();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(!user);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    
    // Shipping Address
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Additional
    notes: ''
  });

  // Update form data when user changes
  React.useEffect(() => {
    if (user?.email && !formData.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [user, formData.email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required personal information",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.address || !formData.city || !formData.state || !formData.pincode) {
      toast({
        title: "Missing Address",
        description: "Please fill in complete shipping address",
        variant: "destructive"
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checkout",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create order in database
      const shippingAddress = {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: `${formData.firstName} ${formData.lastName}`,
          customer_email: formData.email,
          customer_phone: formData.phone,
          user_id: user?.id || null,
          shipping_address: shippingAddress,
          total_amount: getCartTotal(),
          payment_status: 'pending',
          order_status: 'pending',
          notes: formData.notes || null
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => {
        const resolvedImages = resolveArtworkImages([item.imageUrl || '']);
        return {
          order_id: order.id,
          artwork_id: item.id,
          artwork_title: item.title,
          artwork_image_url: resolvedImages[0],
          artwork_category: item.category,
          price: item.price,
          quantity: item.quantity
        };
      });

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Navigate to payment page
      navigate(`/payment/${order.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Order Failed",
        description: "Failed to create order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="text-center p-8 border-2 border-foreground shadow-[4px_4px_0px_0px] shadow-foreground">
          <CardContent>
            <h2 className="text-xl font-handwritten mb-4">No items in cart</h2>
            <Button onClick={() => navigate('/')} className="font-handwritten">
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeSection="" onNavigate={(section) => {
        if (section === "cart") navigate("/cart");
        else if (section === "wishlist") navigate("/wishlist");
        else if (section === "my-orders") navigate("/my-orders");
        else navigate("/");
      }} />
      
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
            <h1 className="mobile-heading font-bold font-handwritten text-foreground">Checkout 🛒</h1>
            <p className="text-muted-foreground font-handwritten mobile-text">Complete your purchase</p>
          </div>
        </div>

        {/* Authentication Section for Guest Users */}
        {!user && (
          <div className="max-w-2xl mx-auto mb-8">
            <CheckoutAuth onAuthSuccess={() => {
              // User authenticated, form will pre-fill with user data
              if (user?.email) {
                setFormData(prev => ({ ...prev, email: user.email }));
              }
            }} />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Mobile-Enhanced Checkout Form */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Personal Information */}
              <Card className="border-2 border-foreground mobile-shadow shadow-foreground">
                <CardHeader>
                  <CardTitle className="font-handwritten mobile-text">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="firstName" className="font-handwritten mobile-text">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="font-handwritten touch-target"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="font-handwritten mobile-text">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="font-handwritten touch-target"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email" className="font-handwritten mobile-text">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="font-handwritten touch-target"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="font-handwritten mobile-text">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="font-handwritten touch-target"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="border-2 border-foreground mobile-shadow shadow-foreground">
                <CardHeader>
                  <CardTitle className="font-handwritten mobile-text">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div>
                    <Label htmlFor="address" className="font-handwritten mobile-text">Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="font-handwritten touch-target"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="city" className="font-handwritten mobile-text">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="font-handwritten touch-target"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="font-handwritten mobile-text">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="font-handwritten touch-target"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="pincode" className="font-handwritten mobile-text">Pincode *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="font-handwritten touch-target"
                      required
                    />
                  </div>
                </CardContent>
              </Card>


              {/* Additional Notes */}
              <Card className="border-2 border-foreground mobile-shadow shadow-foreground">
                <CardHeader>
                  <CardTitle className="font-handwritten mobile-text">Additional Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    name="notes"
                    placeholder="Any special instructions or requests..."
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="font-handwritten touch-target"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Mobile-Enhanced Order Summary */}
            <div>
              <Card className="border-2 border-foreground mobile-shadow shadow-foreground sticky top-20 sm:top-24">
                <CardHeader>
                  <CardTitle className="font-handwritten mobile-text">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    {cartItems.map((item) => {
                      const resolvedImages = resolveArtworkImages([item.imageUrl || '']);
                      return (
                        <div key={item.id} className="flex items-center gap-2 sm:gap-3 pb-2 border-b border-muted">
                          <img
                            src={resolvedImages[0]}
                            alt={item.title}
                            className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded border"
                          />
                         <div className="flex-1 min-w-0">
                           <p className="font-handwritten text-xs sm:text-sm truncate">{item.title}</p>
                           <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                         </div>
                         <p className="font-handwritten text-sm sm:text-base">₹{item.price * item.quantity}</p>
                       </div>
                     );
                   })}
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between">
                      <span className="font-handwritten mobile-text">Subtotal</span>
                      <span className="font-handwritten mobile-text">₹{getCartTotal()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-handwritten mobile-text">Shipping</span>
                      <span className="font-handwritten mobile-text">Free</span>
                    </div>
                    <hr className="border-foreground" />
                    <div className="flex justify-between text-base sm:text-lg font-bold">
                      <span className="font-handwritten">Total</span>
                      <span className="font-handwritten text-primary">₹{getCartTotal()}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full font-handwritten border-2 border-foreground mobile-shadow shadow-foreground mobile-hover-shadow touch-target touch-interaction"
                  >
                    {isProcessing ? 'Creating Order...' : 'Continue to Payment'}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center font-handwritten">
                    🔒 Secure checkout process
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;