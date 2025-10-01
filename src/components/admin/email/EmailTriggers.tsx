import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Zap, User } from 'lucide-react';

const triggers = [
  {
    category: 'Automatic (Database)',
    icon: Zap,
    items: [
      {
        name: 'New User Registration',
        template: 'Welcome Email',
        trigger: 'When user signs up',
        status: 'active',
      },
      {
        name: 'New Order Placed',
        template: 'Order Confirmation + Admin Notification',
        trigger: 'After successful order',
        status: 'active',
      },
      {
        name: 'New Commission Request',
        template: 'Commission Confirmation + Admin Notification',
        trigger: 'When commission form is submitted',
        status: 'active',
      },
      {
        name: 'New Consultation Booking',
        template: 'Consultation Booking Confirmation',
        trigger: 'When consultation is booked',
        status: 'active',
      },
    ],
  },
  {
    category: 'Manual (Admin Panel)',
    icon: User,
    items: [
      {
        name: 'Order Status Update',
        template: 'Order Status Update',
        trigger: 'Admin updates order status',
        status: 'active',
      },
      {
        name: 'Commission Status Update',
        template: 'Commission Status Update',
        trigger: 'Admin updates commission status',
        status: 'active',
      },
      {
        name: 'Commission Quote',
        template: 'Commission Quote',
        trigger: 'Admin sends pricing estimate',
        status: 'active',
      },
      {
        name: 'Consultation Reschedule',
        template: 'Consultation Reschedule',
        trigger: 'Admin reschedules consultation',
        status: 'active',
      },
    ],
  },
  {
    category: 'Scheduled (Future)',
    icon: Clock,
    items: [
      {
        name: 'Consultation Reminder',
        template: 'Consultation Reminder',
        trigger: '2 hours before scheduled time',
        status: 'planned',
      },
    ],
  },
];

export function EmailTriggers() {
  return (
    <div className="space-y-6">
      <div className="prose prose-sm max-w-none">
        <p className="text-muted-foreground">
          Email triggers automatically send emails based on system events or manual actions.
          Automatic triggers use database triggers and Edge Functions to send emails in real-time.
        </p>
      </div>

      {triggers.map((group) => {
        const Icon = group.icon;
        return (
          <div key={group.category} className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Icon className="h-5 w-5" />
              {group.category}
            </h3>

            <div className="grid gap-3">
              {group.items.map((item) => (
                <Card key={item.name} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{item.name}</h4>
                        {item.status === 'active' ? (
                          <Badge className="bg-green-500/10 text-green-500">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline">Planned</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Template:</strong> {item.template}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Trigger:</strong> {item.trigger}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      <Card className="p-6 bg-muted/50">
        <h4 className="font-semibold mb-3">How Email Triggers Work</h4>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Automatic Triggers:</strong> Database triggers detect events (new orders, users, etc.)
            and call the <code className="text-xs bg-background px-1 py-0.5 rounded">send_email_notification()</code> function
            which invokes the <code className="text-xs bg-background px-1 py-0.5 rounded">send-email</code> Edge Function.
          </p>
          <p>
            <strong>Manual Triggers:</strong> Admin actions directly call the email service to send customized emails.
          </p>
          <p>
            <strong>All emails are sent via:</strong> Gmail SMTP using your configured credentials.
          </p>
        </div>
      </Card>
    </div>
  );
}
