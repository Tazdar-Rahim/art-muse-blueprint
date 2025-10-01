import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Mail, Server } from 'lucide-react';

export function EmailSettings() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-500/10 rounded-lg">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Email Service Status</h3>
            <Badge className="bg-green-500/10 text-green-500 mb-4">Active</Badge>
            <p className="text-sm text-muted-foreground">
              Your email service is configured and operational. Emails are being sent via Gmail SMTP.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Server className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <h3 className="font-semibold mb-1">SMTP Configuration</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Email delivery is configured through Gmail SMTP using Denomailer.
            </p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">SMTP Server</span>
            <span className="font-medium">smtp.gmail.com</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Port</span>
            <span className="font-medium">465 (TLS)</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Authentication</span>
            <Badge variant="outline" className="bg-green-500/10 text-green-500">Configured</Badge>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Credentials</span>
            <span className="font-medium">GMAIL_USER & GMAIL_APP_PASSWORD</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Mail className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Sender Information</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Default sender information for all outgoing emails.
            </p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">From Name</span>
            <span className="font-medium">Farhana Shaheen Art</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">From Email</span>
            <span className="font-medium">(Your Gmail address)</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Reply-To</span>
            <span className="font-medium">farhanashaheenart@gmail.com</span>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-muted/50">
        <h4 className="font-semibold mb-3">Important Notes</h4>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            • Gmail SMTP credentials are stored securely in Supabase secrets
          </p>
          <p>
            • Make sure your Gmail account has "App Passwords" enabled for this to work
          </p>
          <p>
            • Daily sending limits apply based on your Gmail account type
          </p>
          <p>
            • All email templates support HTML formatting and variable interpolation
          </p>
          <p>
            • Email logs are automatically created for tracking delivery status
          </p>
        </div>
      </Card>
    </div>
  );
}
