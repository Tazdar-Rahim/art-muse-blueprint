import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, Mail } from 'lucide-react';

const OrderSuccess = () => {
  const navigate = useNavigate();

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
              Order Successful!
            </h1>
            <p className="text-muted-foreground font-handwritten">
              Thank you for your purchase! Your artwork order has been placed successfully.
            </p>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg border border-muted-foreground/20">
            <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground font-handwritten">
              <Mail className="w-4 h-4" />
              <span>Confirmation email sent</span>
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
              Order ID: #ART{Date.now().toString().slice(-6)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccess;