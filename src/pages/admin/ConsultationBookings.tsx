import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Eye, Trash2, Mail, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { emailService } from '@/services/email.service';

interface ConsultationBooking {
  id: string;
  customer_name: string;
  customer_email: string;
  whatsapp_number: string;
  preferred_time: string | null;
  project_description: string | null;
  scheduled_datetime: string | null;
  status: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const ConsultationBookings = () => {
  const [bookings, setBookings] = useState<ConsultationBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<ConsultationBooking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('consultation_bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch bookings',
        variant: 'destructive',
      });
    } else {
      setBookings(data || []);
    }
  };

  const updateStatus = async (id: string, status: 'requested' | 'scheduled' | 'completed' | 'cancelled') => {
    const { error } = await supabase
      .from('consultation_bookings')
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
      fetchBookings();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('consultation_bookings')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete booking',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Booking deleted successfully',
      });
      fetchBookings();
    }
  };

  const getStatusBadge = (status: string | null) => {
    const statusColors = {
      requested: 'bg-yellow-100 text-yellow-800',
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {status || 'requested'}
      </Badge>
    );
  };

  const handleViewDetails = (booking: ConsultationBooking) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  const handleSendReschedule = async () => {
    if (!selectedBooking) return;

    try {
      setSendingEmail(true);

      const oldDate = selectedBooking.preferred_time || format(new Date(selectedBooking.created_at), 'PPp');

      // Update booking with new schedule
      const { error: updateError } = await supabase
        .from('consultation_bookings')
        .update({
          preferred_time: newTime,
          status: 'scheduled'
        })
        .eq('id', selectedBooking.id);

      if (updateError) throw updateError;

      // Send reschedule email
      await emailService.sendConsultationReschedule({
        email: selectedBooking.customer_email,
        name: selectedBooking.customer_name,
        oldDate,
        newDate,
        newTime
      });

      toast({
        title: 'Success',
        description: 'Consultation rescheduled and email sent to customer'
      });

      setIsRescheduleDialogOpen(false);
      fetchBookings();
    } catch (error) {
      console.error('Failed to reschedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to send reschedule email',
        variant: 'destructive'
      });
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-handwritten font-bold">Consultation Bookings</h1>
        <p className="text-muted-foreground">Manage consultation appointments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-start">
                <span>{booking.customer_name}</span>
                {getStatusBadge(booking.status)}
              </CardTitle>
              <CardDescription>{booking.customer_email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm">
                  <strong>WhatsApp:</strong> {booking.whatsapp_number}
                </p>
                {booking.preferred_time && (
                  <p className="text-sm">
                    <strong>Preferred Time:</strong> {booking.preferred_time}
                  </p>
                )}
                {booking.scheduled_datetime && (
                  <p className="text-sm">
                    <strong>Scheduled:</strong> {format(new Date(booking.scheduled_datetime), 'PPp')}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Requested: {format(new Date(booking.created_at), 'PPp')}
                </p>
                
                <div className="flex gap-2">
                  <Select 
                    value={booking.status || 'requested'} 
                    onValueChange={(value: 'requested' | 'scheduled' | 'completed' | 'cancelled') => updateStatus(booking.id, value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="requested">Requested</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => handleViewDetails(booking)}>
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setNewDate('');
                          setNewTime('');
                        }}
                      >
                        <Calendar className="w-3 h-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reschedule Consultation</DialogTitle>
                        <DialogDescription>
                          Send new schedule to {booking.customer_name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>New Date</Label>
                          <Input
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>New Time</Label>
                          <Input
                            type="time"
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                          />
                        </div>
                        <Button
                          onClick={handleSendReschedule}
                          disabled={sendingEmail || !newDate || !newTime}
                          className="w-full"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          {sendingEmail ? 'Sending...' : 'Reschedule & Send Email'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(booking.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Consultation Booking Details</DialogTitle>
            <DialogDescription>
              Full details for {selectedBooking?.customer_name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Customer Information</h4>
                  <p className="text-sm">Name: {selectedBooking.customer_name}</p>
                  <p className="text-sm">Email: {selectedBooking.customer_email}</p>
                  <p className="text-sm">WhatsApp: {selectedBooking.whatsapp_number}</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Booking Details</h4>
                  <p className="text-sm">Status: {selectedBooking.status || 'requested'}</p>
                  {selectedBooking.preferred_time && (
                    <p className="text-sm">Preferred Time: {selectedBooking.preferred_time}</p>
                  )}
                  {selectedBooking.scheduled_datetime && (
                    <p className="text-sm">Scheduled: {format(new Date(selectedBooking.scheduled_datetime), 'PPp')}</p>
                  )}
                  <p className="text-sm">Requested: {format(new Date(selectedBooking.created_at), 'PPp')}</p>
                </div>
              </div>

              {selectedBooking.project_description && (
                <div>
                  <h4 className="font-medium mb-2">Project Description</h4>
                  <p className="text-sm bg-muted p-3 rounded">{selectedBooking.project_description}</p>
                </div>
              )}

              {selectedBooking.notes && (
                <div>
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-sm bg-muted p-3 rounded">{selectedBooking.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConsultationBookings;