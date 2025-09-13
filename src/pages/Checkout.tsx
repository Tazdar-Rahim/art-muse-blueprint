import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCartWishlist } from '@/contexts/CartWishlistContext';
import { ArrowLeft, CreditCard, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCartWishlist();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Shipping Address
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Payment Information
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    
    // Additional
    notes: ''
  });

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

    if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardName) {
      toast({
        title: "Missing Payment Info",
        description: "Please fill in all payment details",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      clearCart();
      setIsProcessing(false);
      toast({
        title: "Order Successful! 🎉",
        description: "Your artwork order has been placed successfully. You'll receive a confirmation email shortly.",
      });
      navigate('/order-success');
    }, 2000);
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
            <h1 className="text-3xl font-bold font-handwritten text-foreground">Checkout 🛒</h1>
            <p className="text-muted-foreground font-handwritten">Complete your purchase</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card className="border-2 border-foreground shadow-[2px_2px_0px_0px] shadow-foreground">
                <CardHeader>
                  <CardTitle className="font-handwritten">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="font-handwritten">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="font-handwritten"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="font-handwritten">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="font-handwritten"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email" className="font-handwritten">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="font-handwritten"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="font-handwritten">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="font-handwritten"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="border-2 border-foreground shadow-[2px_2px_0px_0px] shadow-foreground">
                <CardHeader>
                  <CardTitle className="font-handwritten">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address" className="font-handwritten">Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="font-handwritten"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="font-handwritten">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="font-handwritten"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="font-handwritten">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="font-handwritten"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="pincode" className="font-handwritten">Pincode *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="font-handwritten"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card className="border-2 border-foreground shadow-[2px_2px_0px_0px] shadow-foreground">
                <CardHeader>
                  <CardTitle className="font-handwritten flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Information
                    <Lock className="w-4 h-4 text-green-600" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardName" className="font-handwritten">Cardholder Name *</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className="font-handwritten"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardNumber" className="font-handwritten">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="font-handwritten"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate" className="font-handwritten">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        className="font-handwritten"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv" className="font-handwritten">CVV *</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className="font-handwritten"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Notes */}
              <Card className="border-2 border-foreground shadow-[2px_2px_0px_0px] shadow-foreground">
                <CardHeader>
                  <CardTitle className="font-handwritten">Additional Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    name="notes"
                    placeholder="Any special instructions or requests..."
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="font-handwritten"
                  />
                </CardContent>
              </Card>
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
                      <div key={item.id} className="flex items-center gap-3 pb-2 border-b border-muted">
                        <img
                          src={item.imageUrl || '/placeholder.svg'}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded border"
                        />
                        <div className="flex-1">
                          <p className="font-handwritten text-sm">{item.title}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-handwritten">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between">
                      <span className="font-handwritten">Subtotal</span>
                      <span className="font-handwritten">₹{getCartTotal()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-handwritten">Shipping</span>
                      <span className="font-handwritten">Free</span>
                    </div>
                    <hr className="border-foreground" />
                    <div className="flex justify-between text-lg font-bold">
                      <span className="font-handwritten">Total</span>
                      <span className="font-handwritten text-primary">₹{getCartTotal()}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full font-handwritten border-2 border-foreground shadow-[2px_2px_0px_0px] shadow-foreground hover:shadow-[4px_4px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                  >
                    {isProcessing ? 'Processing...' : 'Complete Order'}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center font-handwritten">
                    🔒 Your payment information is secure and encrypted
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