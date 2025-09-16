import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Eye, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface OrderItem {
  id: string;
  artwork_title: string;
  artwork_category: string;
  artwork_image_url?: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  order_status: string;
  payment_status: string;
  customer_name: string;
  customer_email: string;
  shipping_address: any;
  order_items: OrderItem[];
}

const MyOrders = () => {
  const navigate = useNavigate();
  const { user, isCustomer, loading: authLoading } = useCustomerAuth();
  const { signOut } = useAuth();
  const { toast } = useToast();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated or not a customer
  useEffect(() => {
    if (!authLoading && (!user || !isCustomer)) {
      navigate("/customer-auth");
    }
  }, [user, isCustomer, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      if (!user?.id || !user?.email) {
        console.error('User data incomplete:', { userId: user?.id, userEmail: user?.email });
        toast({
          title: "Error",
          description: "Unable to load your profile. Please sign in again.",
          variant: "destructive",
        });
        return;
      }
      
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .or(`user_id.eq.${user.id},customer_email.eq.${user.email}`)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        toast({
          title: "Error",
          description: "Failed to load your orders. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setOrders(ordersData || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'processing':
        return 'secondary';
      case 'shipped':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getPaymentStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default';
      case 'pending':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
        return <Clock className="w-4 h-4" />;
      case 'shipped':
        return <Package className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate("/");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <Card className="w-96 h-32 bg-muted" />
          <Card className="w-96 h-32 bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Gallery
            </Button>
            <div>
              <h1 className="text-3xl font-bold">My Orders</h1>
              <p className="text-muted-foreground">Track your artwork purchases</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card className="text-center py-16">
            <CardHeader>
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <CardTitle>No Orders Yet</CardTitle>
              <CardDescription>
                You haven't placed any orders yet. Start exploring our gallery to find artwork you love.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/")}>
                Browse Gallery
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </CardTitle>
                      <CardDescription>
                        Placed on {new Date(order.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getStatusBadgeVariant(order.order_status)} className="flex items-center gap-1">
                        {getStatusIcon(order.order_status)}
                        {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                      </Badge>
                      <Badge variant={getPaymentStatusBadgeVariant(order.payment_status)}>
                        {order.payment_status === 'paid' ? 'Paid' : 'Payment Pending'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                        {item.artwork_image_url && (
                          <img 
                            src={item.artwork_image_url} 
                            alt={item.artwork_title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium">{item.artwork_title}</h4>
                          <p className="text-sm text-muted-foreground">{item.artwork_category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{item.price.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Order Summary */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-xl font-bold">₹{order.total_amount.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/order/${order.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {order.shipping_address && (
                    <div className="text-sm text-muted-foreground">
                      <p><strong>Shipping to:</strong></p>
                      <p>{order.shipping_address.fullName}</p>
                      <p>{order.shipping_address.address}</p>
                      <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postalCode}</p>
                    </div>
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

export default MyOrders;