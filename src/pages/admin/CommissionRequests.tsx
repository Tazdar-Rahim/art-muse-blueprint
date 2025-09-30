import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Eye, Trash2, Mail, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { emailService } from '@/services/email.service';

interface CommissionRequest {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  package_id: string | null;
  custom_requirements: string | null;
  estimated_price: number | null;
  estimated_days: number | null;
  admin_message: string | null;
  status: string | null;
  notes: string | null;
  reference_images: string[] | null;
  voice_note_url: string | null;
  created_at: string;
  updated_at: string;
}

const CommissionRequests = () => {
  const [requests, setRequests] = useState<CommissionRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<CommissionRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteDays, setQuoteDays] = useState('');
  const [quoteMessage, setQuoteMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('commission_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch requests',
        variant: 'destructive',
      });
    } else {
      setRequests(data || []);
    }
  };

  const updateStatus = async (id: string, status: 'pending' | 'in_progress' | 'completed' | 'cancelled') => {
    const { error } = await supabase
      .from('commission_requests')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Status updated successfully',
      });
      fetchRequests();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('commission_requests')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete request',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Request deleted successfully',
      });
      fetchRequests();
    }
  };

  const getStatusBadge = (status: string | null) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {status || 'pending'}
      </Badge>
    );
  };

  const handleViewDetails = (request: CommissionRequest) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  const handleSendQuote = async () => {
    if (!selectedRequest) return;

    try {
      setSendingEmail(true);

      const price = parseFloat(quotePrice);
      const days = parseInt(quoteDays);

      // Update request with quote info
      const { error: updateError } = await supabase
        .from('commission_requests')
        .update({
          estimated_price: price,
          estimated_days: days,
          admin_message: quoteMessage
        })
        .eq('id', selectedRequest.id);

      if (updateError) throw updateError;

      // Send quote email
      await emailService.sendCommissionQuote({
        email: selectedRequest.customer_email,
        name: selectedRequest.customer_name,
        estimatedPrice: price,
        estimatedDays: days,
        message: quoteMessage
      });

      toast({
        title: 'Success',
        description: 'Quote sent successfully to customer'
      });

      setIsQuoteDialogOpen(false);
      fetchRequests();
    } catch (error) {
      console.error('Failed to send quote:', error);
      toast({
        title: 'Error',
        description: 'Failed to send quote',
        variant: 'destructive'
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const handleSendStatusUpdate = async () => {
    if (!selectedRequest) return;

    try {
      setSendingEmail(true);

      // Update status
      const { error: updateError } = await supabase
        .from('commission_requests')
        .update({
          status: newStatus as 'pending' | 'in_progress' | 'completed' | 'cancelled',
          admin_message: statusMessage || null
        })
        .eq('id', selectedRequest.id);

      if (updateError) throw updateError;

      // Send status update email
      await emailService.sendCommissionStatusUpdate({
        email: selectedRequest.customer_email,
        name: selectedRequest.customer_name,
        status: newStatus,
        message: statusMessage || undefined
      });

      toast({
        title: 'Success',
        description: 'Status updated and email sent to customer'
      });

      setIsStatusDialogOpen(false);
      fetchRequests();
    } catch (error) {
      console.error('Failed to send status update:', error);
      toast({
        title: 'Error',
        description: 'Failed to send status update',
        variant: 'destructive'
      });
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-handwritten font-bold">Commission Requests</h1>
        <p className="text-muted-foreground">Manage incoming commission requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-start">
                <span>{request.customer_name}</span>
                {getStatusBadge(request.status)}
              </CardTitle>
              <CardDescription>{request.customer_email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {request.estimated_price && (
                  <p className="text-lg font-bold text-amber-600">₹{request.estimated_price}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Submitted: {format(new Date(request.created_at), 'PPp')}
                </p>
                
                <div className="flex gap-2">
                  <Select 
                    value={request.status || 'pending'} 
                    onValueChange={(value: 'pending' | 'in_progress' | 'completed' | 'cancelled') => updateStatus(request.id, value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => handleViewDetails(request)}>
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedRequest(request);
                          setQuotePrice(request.estimated_price?.toString() || '');
                          setQuoteDays(request.estimated_days?.toString() || '');
                          setQuoteMessage(request.admin_message || '');
                        }}
                      >
                        <DollarSign className="w-3 h-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send Commission Quote</DialogTitle>
                        <DialogDescription>
                          Send a detailed quote to {request.customer_name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Estimated Price (₹)</Label>
                          <Input
                            type="number"
                            value={quotePrice}
                            onChange={(e) => setQuotePrice(e.target.value)}
                            placeholder="5000"
                          />
                        </div>
                        <div>
                          <Label>Estimated Days</Label>
                          <Input
                            type="number"
                            value={quoteDays}
                            onChange={(e) => setQuoteDays(e.target.value)}
                            placeholder="14"
                          />
                        </div>
                        <div>
                          <Label>Message to Customer</Label>
                          <Textarea
                            value={quoteMessage}
                            onChange={(e) => setQuoteMessage(e.target.value)}
                            placeholder="Additional details about the commission..."
                            rows={4}
                          />
                        </div>
                        <Button
                          onClick={handleSendQuote}
                          disabled={sendingEmail || !quotePrice || !quoteDays}
                          className="w-full"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          {sendingEmail ? 'Sending...' : 'Send Quote Email'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedRequest(request);
                          setNewStatus(request.status || 'pending');
                          setStatusMessage('');
                        }}
                      >
                        <Mail className="w-3 h-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Status & Notify Customer</DialogTitle>
                        <DialogDescription>
                          Update commission status and send notification to {request.customer_name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>New Status</Label>
                          <Select value={newStatus} onValueChange={setNewStatus}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Message (Optional)</Label>
                          <Textarea
                            value={statusMessage}
                            onChange={(e) => setStatusMessage(e.target.value)}
                            placeholder="Any additional information for the customer..."
                            rows={3}
                          />
                        </div>
                        <Button
                          onClick={handleSendStatusUpdate}
                          disabled={sendingEmail}
                          className="w-full"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          {sendingEmail ? 'Sending...' : 'Update & Send Email'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(request.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Commission Request Details</DialogTitle>
            <DialogDescription>
              Full details for {selectedRequest?.customer_name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Customer Information</h4>
                  <p className="text-sm">Name: {selectedRequest.customer_name}</p>
                  <p className="text-sm">Email: {selectedRequest.customer_email}</p>
                  {selectedRequest.customer_phone && (
                    <p className="text-sm">Phone: {selectedRequest.customer_phone}</p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium">Request Details</h4>
                  <p className="text-sm">Status: {selectedRequest.status || 'pending'}</p>
                  {selectedRequest.estimated_price && (
                    <p className="text-sm">Estimated Price: ₹{selectedRequest.estimated_price}</p>
                  )}
                  <p className="text-sm">Submitted: {format(new Date(selectedRequest.created_at), 'PPp')}</p>
                </div>
              </div>

              {selectedRequest.custom_requirements && (
                <div>
                  <h4 className="font-medium mb-2">Custom Requirements</h4>
                  <p className="text-sm bg-muted p-3 rounded">{selectedRequest.custom_requirements}</p>
                </div>
              )}

              {selectedRequest.notes && (
                <div>
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-sm bg-muted p-3 rounded">{selectedRequest.notes}</p>
                </div>
              )}

              {selectedRequest.reference_images && selectedRequest.reference_images.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Reference Images</h4>
                  <div className="space-y-2">
                    {selectedRequest.reference_images.map((url, index) => (
                      <a 
                        key={index} 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline block"
                      >
                        Reference Image {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {selectedRequest.voice_note_url && (
                <div>
                  <h4 className="font-medium mb-2">Voice Note</h4>
                  <audio controls className="w-full">
                    <source src={selectedRequest.voice_note_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommissionRequests;