import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { Eye, Package, Calendar, DollarSign, Mail, Truck } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { emailService } from '@/services/email.service';
import { useToast } from '@/hooks/use-toast';

type Order = Tables<'orders'>;
type OrderItem = Tables<'order_items'>;

interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

const Orders = () => {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [orderStatus, setOrderStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string | null) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'paid':
        return 'secondary';
      case 'processing':
        return 'outline';
      default:
        return 'destructive';
    }
  };

  const getPaymentStatusBadgeVariant = (status: string | null) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'paid':
        return 'secondary';
      default:
        return 'destructive';
    }
  };

  const handleSendStatusEmail = async () => {
    if (!selectedOrder) return;

    try {
      setSendingEmail(true);

      // Update order with tracking info
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          order_status: orderStatus,
          tracking_number: trackingNumber || null,
          tracking_url: trackingUrl || null
        })
        .eq('id', selectedOrder.id);

      if (updateError) throw updateError;

      // Send email
      await emailService.sendOrderStatusUpdate({
        customerEmail: selectedOrder.customer_email,
        firstName: selectedOrder.customer_name.split(' ')[0],
        orderId: selectedOrder.id.substring(0, 8),
        status: orderStatus,
        trackingNumber: trackingNumber || undefined,
        trackingUrl: trackingUrl || undefined
      });

      toast({
        title: 'Success',
        description: 'Order updated and email sent to customer'
      });

      setSelectedOrder(null);
      fetchOrders();
    } catch (error) {
      console.error('Failed to update order:', error);
      toast({
        title: 'Error',
        description: 'Failed to send email',
        variant: 'destructive'
      });
    } finally {
      setSendingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-handwritten font-bold">Orders</h1>
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-handwritten font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders and payments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Orders</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(order => order.payment_status === 'paid' || order.payment_status === 'completed').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{orders
                .filter(order => order.payment_status === 'paid' || order.payment_status === 'completed')
                .reduce((sum, order) => sum + order.total_amount, 0)
                .toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No orders yet</h3>
                <p className="text-muted-foreground">Orders will appear here once customers make purchases.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id.substring(0, 8)}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3" />
                        {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getStatusBadgeVariant(order.order_status)}>
                      {order.order_status || 'pending'}
                    </Badge>
                    <Badge variant={getPaymentStatusBadgeVariant(order.payment_status)}>
                      Payment: {order.payment_status || 'pending'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Customer Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Name:</strong> {order.customer_name}</p>
                      <p><strong>Email:</strong> {order.customer_email}</p>
                      {order.customer_phone && (
                        <p><strong>Phone:</strong> {order.customer_phone}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Order Details</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Total Amount:</strong> ₹{order.total_amount}</p>
                      <p><strong>Items:</strong> {order.order_items.length}</p>
                      {order.notes && (
                        <p><strong>Notes:</strong> {order.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                 {order.order_items.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Order Items</h4>
                    <div className="space-y-2">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            {item.artwork_image_url && (
                              <img 
                                src={item.artwork_image_url} 
                                alt={item.artwork_title}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium">{item.artwork_title}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.artwork_category} • Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="font-medium">₹{item.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setOrderStatus(order.order_status || 'processing');
                          setTrackingNumber(order.tracking_number || '');
                          setTrackingUrl(order.tracking_url || '');
                        }}
                      >
                        <Truck className="w-4 h-4 mr-2" />
                        Update & Email Customer
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Order Status</DialogTitle>
                        <DialogDescription>
                          Update order status and send notification email to customer
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Order Status</Label>
                          <Select value={orderStatus} onValueChange={setOrderStatus}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Tracking Number (Optional)</Label>
                          <Input
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            placeholder="Enter tracking number"
                          />
                        </div>
                        <div>
                          <Label>Tracking URL (Optional)</Label>
                          <Input
                            value={trackingUrl}
                            onChange={(e) => setTrackingUrl(e.target.value)}
                            placeholder="https://tracking.example.com/..."
                          />
                        </div>
                        <Button
                          onClick={handleSendStatusEmail}
                          disabled={sendingEmail}
                          className="w-full"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          {sendingEmail ? 'Sending...' : 'Update Order & Send Email'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;