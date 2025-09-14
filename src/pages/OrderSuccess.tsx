import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrder = async () => {
    if (!orderId) return;
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayOrderId = order?.id ? `#ART${order.id.slice(0, 8).toUpperCase()}` : `#ART${Date.now().toString().slice(-6)}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center border-2 border-foreground shadow-[4px_4px_0px_0px] shadow-foreground">
        <CardContent className="p-8 space-y-6">
          <div className="relative">
            <CheckCircle className="w-20 h-20 mx-auto text-green-500" />
            <div className="absolute -top-2 -right-2 text-2xl">🎉</div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold font-handwritten text-foreground">
              Payment Successful!
            </h1>
            <p className="text-muted-foreground font-handwritten">
              Thank you for your purchase! Your payment has been confirmed and your order is being processed.
            </p>
          </div>
          
          {order && (
            <div className="bg-muted/50 p-4 rounded-lg border border-muted-foreground/20">
              <div className="space-y-1 text-sm">
                <p className="font-handwritten"><strong>Total Amount:</strong> ₹{order.total_amount}</p>
                <p className="font-handwritten"><strong>Customer:</strong> {order.customer_name}</p>
                <p className="font-handwritten"><strong>Email:</strong> {order.customer_email}</p>
              </div>
            </div>
          )}
          
          <div className="bg-muted/50 p-4 rounded-lg border border-muted-foreground/20">
            <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground font-handwritten">
              <Mail className="w-4 h-4" />
              <span>Confirmation email will be sent</span>
            </div>
            <p className="text-xs text-muted-foreground font-handwritten mt-1">
              We'll keep you updated on your order status
            </p>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/')}
              className="w-full font-handwritten border-2 border-foreground shadow-[2px_2px_0px_0px] shadow-foreground hover:shadow-[4px_4px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px]"
            >
              <Home className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
            
            <p className="text-sm text-muted-foreground font-handwritten">
              Order ID: {displayOrderId}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccess;