import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, QrCode, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  payment_status: string;
  order_items: OrderItem[];
}

interface OrderItem {
  id: string;
  artwork_title: string;
  artwork_image_url: string;
  artwork_category: string;
  price: number;
  quantity: number;
}

export default function Payment() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrBlurred, setQrBlurred] = useState(true);
  const [upiId, setUpiId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'upi'>('qr');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    if (!orderId) return;

    try {
      // Fetch order details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;

      // Fetch order items
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (itemsError) throw itemsError;

      setOrder({
        ...orderData,
        order_items: itemsData || []
      });
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentComplete = async () => {
    if (!order) return;
    
    setProcessing(true);
    
    try {
      // Update order payment status
      const { error } = await supabase
        .from('orders')
        .update({ 
          payment_status: 'paid',
          order_status: 'processing'
        })
        .eq('id', order.id);

      if (error) throw error;

      toast.success('Payment completed successfully!');
      navigate(`/order-success?orderId=${order.id}`);
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to process payment');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Order not found</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Payment - Complete Your Order | Art Gallery</title>
        <meta name="description" content="Complete your payment to finalize your art purchase" />
      </Helmet>
      
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/checkout')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Checkout
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Complete Payment</h1>
              <p className="text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Section */}
            <div className="space-y-6">
              {/* Payment Method Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Choose Payment Method</CardTitle>
                  <CardDescription>Select how you'd like to pay for your order</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant={paymentMethod === 'qr' ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod('qr')}
                      className="h-12"
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      QR Code
                    </Button>
                    <Button
                      variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod('upi')}
                      className="h-12"
                    >
                      UPI ID
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* QR Code Payment */}
              {paymentMethod === 'qr' && (
                <Card>
                  <CardHeader>
                    <CardTitle>QR Code Payment</CardTitle>
                    <CardDescription>
                      Scan the QR code with your UPI app to pay ₹{order.total_amount}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative mx-auto w-64 h-64 bg-muted rounded-lg flex items-center justify-center">
                      {qrBlurred ? (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg">
                          <QrCode className="h-12 w-12 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-4">Click to reveal QR code</p>
                          <Button 
                            onClick={() => setQrBlurred(false)}
                            variant="outline"
                            size="sm"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Show QR Code
                          </Button>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-white p-4 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <QrCode className="h-32 w-32 mx-auto mb-2" />
                            <p className="text-xs text-muted-foreground">QR Code for ₹{order.total_amount}</p>
                            <Button 
                              onClick={() => setQrBlurred(true)}
                              variant="ghost"
                              size="sm"
                              className="mt-2"
                            >
                              <EyeOff className="h-4 w-4 mr-2" />
                              Hide
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        After completing the payment, click the button below to confirm your order.
                      </p>
                      <Button 
                        onClick={handlePaymentComplete}
                        disabled={processing}
                        className="w-full"
                        size="lg"
                      >
                        {processing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            I've Completed the Payment
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* UPI ID Payment */}
              {paymentMethod === 'upi' && (
                <Card>
                  <CardHeader>
                    <CardTitle>UPI ID Payment</CardTitle>
                    <CardDescription>
                      Enter your UPI ID to receive a payment request for ₹{order.total_amount}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="upiId">Your UPI ID</Label>
                      <Input
                        id="upiId"
                        type="text"
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Example: yourname@paytm, yourname@phonepe, yourname@gpay
                      </p>
                    </div>
                    <Button 
                      onClick={handlePaymentComplete}
                      disabled={processing || !upiId.trim()}
                      className="w-full"
                      size="lg"
                    >
                      {processing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Send Payment Request
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>Review your purchase details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Items */}
                  <div className="space-y-4">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-16 bg-muted rounded-md overflow-hidden">
                          <img
                            src={item.artwork_image_url || '/placeholder.svg'}
                            alt={item.artwork_title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.artwork_title}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {item.artwork_category}
                          </Badge>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm text-muted-foreground">
                              Qty: {item.quantity}
                            </span>
                            <span className="font-semibold">₹{item.price}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Order Total */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>₹{order.total_amount}</span>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-medium">Customer Information</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{order.customer_name}</p>
                      <p>{order.customer_email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}