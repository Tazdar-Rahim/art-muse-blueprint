-- Create email templates table
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  default_subject TEXT NOT NULL,
  default_html_content TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  description TEXT,
  variables JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create email logs table for tracking
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key TEXT,
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email_templates
CREATE POLICY "Admins can view email templates"
  ON public.email_templates FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can insert email templates"
  ON public.email_templates FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update email templates"
  ON public.email_templates FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete email templates"
  ON public.email_templates FOR DELETE
  USING (is_admin());

-- RLS Policies for email_logs
CREATE POLICY "Admins can view email logs"
  ON public.email_logs FOR SELECT
  USING (is_admin());

CREATE POLICY "System can insert email logs"
  ON public.email_logs FOR INSERT
  WITH CHECK (true);

-- Create updated_at trigger
CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON public.email_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default email templates
INSERT INTO public.email_templates (template_key, name, category, subject, html_content, default_subject, default_html_content, description, variables) VALUES
('welcome', 'Welcome Email', 'Authentication', 'Welcome to Farhana Shaheen Art!', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1 style="color: #333;">Welcome, {{firstName}}!</h1><p>Thank you for joining Farhana Shaheen Art. We''re excited to have you as part of our community.</p><p>Explore our collection and discover unique artworks created with passion.</p><p>Best regards,<br>Farhana Shaheen</p></div>', 'Welcome to Farhana Shaheen Art!', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1 style="color: #333;">Welcome, {{firstName}}!</h1><p>Thank you for joining Farhana Shaheen Art. We''re excited to have you as part of our community.</p><p>Explore our collection and discover unique artworks created with passion.</p><p>Best regards,<br>Farhana Shaheen</p></div>', 'Sent when new users register', '{"firstName": "string", "email": "string"}'),

('email_verification', 'Email Verification', 'Authentication', 'Verify Your Email Address', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Verify Your Email</h1><p>Please click the link below to verify your email address:</p><p><a href="{{verificationLink}}" style="background: #333; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a></p></div>', 'Verify Your Email Address', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Verify Your Email</h1><p>Please click the link below to verify your email address:</p><p><a href="{{verificationLink}}" style="background: #333; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a></p></div>', 'For account verification', '{"verificationLink": "string"}'),

('password_reset', 'Password Reset', 'Authentication', 'Reset Your Password', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Reset Your Password</h1><p>Click the link below to reset your password:</p><p><a href="{{resetLink}}" style="background: #333; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a></p><p>If you didn''t request this, please ignore this email.</p></div>', 'Reset Your Password', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Reset Your Password</h1><p>Click the link below to reset your password:</p><p><a href="{{resetLink}}" style="background: #333; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a></p><p>If you didn''t request this, please ignore this email.</p></div>', 'Password reset links', '{"resetLink": "string"}'),

('order_confirmation', 'Order Confirmation', 'Orders', 'Order Confirmation #{{orderId}}', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Thank You for Your Order!</h1><p>Hi {{firstName}},</p><p>Your order #{{orderId}} has been confirmed.</p><p><strong>Total:</strong> ${{totalAmount}}</p><p>We''ll send you another email when your order ships.</p></div>', 'Order Confirmation #{{orderId}}', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Thank You for Your Order!</h1><p>Hi {{firstName}},</p><p>Your order #{{orderId}} has been confirmed.</p><p><strong>Total:</strong> ${{totalAmount}}</p><p>We''ll send you another email when your order ships.</p></div>', 'When orders are placed', '{"firstName": "string", "orderId": "string", "totalAmount": "number", "items": "array"}'),

('order_status_update', 'Order Status Update', 'Orders', 'Your Order #{{orderId}} Status Update', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Order Status Update</h1><p>Hi {{firstName}},</p><p>Your order #{{orderId}} status: <strong>{{status}}</strong></p><p>Tracking: <a href="{{trackingUrl}}">{{trackingNumber}}</a></p></div>', 'Your Order #{{orderId}} Status Update', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Order Status Update</h1><p>Hi {{firstName}},</p><p>Your order #{{orderId}} status: <strong>{{status}}</strong></p><p>Tracking: <a href="{{trackingUrl}}">{{trackingNumber}}</a></p></div>', 'When order status changes', '{"firstName": "string", "orderId": "string", "status": "string", "trackingNumber": "string", "trackingUrl": "string"}'),

('commission_request_confirmation', 'Commission Request Confirmation', 'Commissions', 'Commission Request Received', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Commission Request Received</h1><p>Hi {{name}},</p><p>Thank you for your commission request for: {{packageName}}</p><p>I''ll review your requirements and get back to you within 24-48 hours.</p></div>', 'Commission Request Received', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Commission Request Received</h1><p>Hi {{name}},</p><p>Thank you for your commission request for: {{packageName}}</p><p>I''ll review your requirements and get back to you within 24-48 hours.</p></div>', 'When commission requests are submitted', '{"name": "string", "packageName": "string", "description": "string"}'),

('commission_status_update', 'Commission Status Update', 'Commissions', 'Your Commission Status: {{status}}', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Commission Update</h1><p>Hi {{name}},</p><p>Your commission status: <strong>{{status}}</strong></p><p>{{message}}</p></div>', 'Your Commission Status: {{status}}', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Commission Update</h1><p>Hi {{name}},</p><p>Your commission status: <strong>{{status}}</strong></p><p>{{message}}</p></div>', 'When commission status changes', '{"name": "string", "status": "string", "message": "string"}'),

('commission_quote', 'Commission Quote', 'Commissions', 'Your Commission Quote', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Commission Quote</h1><p>Hi {{name}},</p><p><strong>Estimated Price:</strong> ${{estimatedPrice}}</p><p><strong>Turnaround:</strong> {{estimatedDays}} days</p><p>{{message}}</p></div>', 'Your Commission Quote', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Commission Quote</h1><p>Hi {{name}},</p><p><strong>Estimated Price:</strong> ${{estimatedPrice}}</p><p><strong>Turnaround:</strong> {{estimatedDays}} days</p><p>{{message}}</p></div>', 'When you send pricing estimates', '{"name": "string", "estimatedPrice": "number", "estimatedDays": "number", "message": "string"}'),

('consultation_booking', 'Consultation Booking', 'Consultations', 'Consultation Booking Confirmed', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Consultation Confirmed</h1><p>Hi {{name}},</p><p>Your consultation is booked for {{date}} at {{time}}.</p><p>WhatsApp: {{whatsapp}}</p></div>', 'Consultation Booking Confirmed', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Consultation Confirmed</h1><p>Hi {{name}},</p><p>Your consultation is booked for {{date}} at {{time}}.</p><p>WhatsApp: {{whatsapp}}</p></div>', 'When consultations are booked', '{"name": "string", "date": "string", "time": "string", "whatsapp": "string"}'),

('consultation_reminder', 'Consultation Reminder', 'Consultations', 'Reminder: Consultation in 2 Hours', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Consultation Reminder</h1><p>Hi {{name}},</p><p>This is a reminder that your consultation is in 2 hours at {{time}}.</p></div>', 'Reminder: Consultation in 2 Hours', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Consultation Reminder</h1><p>Hi {{name}},</p><p>This is a reminder that your consultation is in 2 hours at {{time}}.</p></div>', '2 hours before consultations', '{"name": "string", "time": "string"}'),

('consultation_reschedule', 'Consultation Reschedule', 'Consultations', 'Consultation Rescheduled', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Consultation Rescheduled</h1><p>Hi {{name}},</p><p>Your consultation has been rescheduled from {{oldDate}} to {{newDate}} at {{newTime}}.</p></div>', 'Consultation Rescheduled', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>Consultation Rescheduled</h1><p>Hi {{name}},</p><p>Your consultation has been rescheduled from {{oldDate}} to {{newDate}} at {{newTime}}.</p></div>', 'When consultations are rescheduled', '{"name": "string", "oldDate": "string", "newDate": "string", "newTime": "string"}'),

('admin_new_order', 'Admin New Order Notification', 'Admin', 'New Order #{{orderId}}', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>New Order Received</h1><p><strong>Order ID:</strong> {{orderId}}</p><p><strong>Customer:</strong> {{customerName}} ({{customerEmail}})</p><p><strong>Total:</strong> ${{totalAmount}}</p></div>', 'New Order #{{orderId}}', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>New Order Received</h1><p><strong>Order ID:</strong> {{orderId}}</p><p><strong>Customer:</strong> {{customerName}} ({{customerEmail}})</p><p><strong>Total:</strong> ${{totalAmount}}</p></div>', 'Alerts you about new orders', '{"orderId": "string", "customerName": "string", "customerEmail": "string", "totalAmount": "number", "items": "array"}'),

('admin_new_commission', 'Admin New Commission Notification', 'Admin', 'New Commission Request', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>New Commission Request</h1><p><strong>Name:</strong> {{name}}</p><p><strong>Email:</strong> {{email}}</p><p><strong>Phone:</strong> {{phone}}</p><p><strong>Package:</strong> {{packageName}}</p></div>', 'New Commission Request', '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1>New Commission Request</h1><p><strong>Name:</strong> {{name}}</p><p><strong>Email:</strong> {{email}}</p><p><strong>Phone:</strong> {{phone}}</p><p><strong>Package:</strong> {{packageName}}</p></div>', 'Alerts you about new commission requests', '{"name": "string", "email": "string", "phone": "string", "packageName": "string", "description": "string"}');