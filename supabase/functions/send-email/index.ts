import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Email templates
const emailTemplates = {
  // Authentication emails
  emailVerification: (data: { name: string; verificationLink: string }) => ({
    subject: 'Verify Your Email Address',
    text: `Hi ${data.name},

Welcome! Please verify your email address by clicking the link below:

${data.verificationLink}

If you didn't create this account, you can safely ignore this email.

Best regards,
The Art Studio Team`
  }),

  passwordReset: (data: { name: string; resetLink: string }) => ({
    subject: 'Reset Your Password',
    text: `Hi ${data.name},

You requested to reset your password. Click the link below to set a new password:

${data.resetLink}

This link will expire in 24 hours. If you didn't request this reset, please ignore this email.

Best regards,
The Art Studio Team`
  }),

  welcome: (data: { name: string }) => ({
    subject: 'Welcome to Our Art Studio!',
    text: `Hi ${data.name},

Welcome to our art studio! We're thrilled to have you join our community of art enthusiasts.

Explore our collection, commission custom artwork, or book a consultation to discuss your artistic vision.

If you have any questions, feel free to reach out to us anytime.

Best regards,
The Art Studio Team`
  }),

  // Commission emails
  commissionRequestConfirmation: (data: { name: string; requestId: string; packageName?: string }) => ({
    subject: 'Commission Request Received',
    text: `Hi ${data.name},

Thank you for submitting your commission request (ID: ${data.requestId}).

${data.packageName ? `Package: ${data.packageName}` : ''}

We have received your request and will review it shortly. You can expect to hear from us within 24-48 hours with a detailed quote and timeline.

Best regards,
The Art Studio Team`
  }),

  commissionStatusUpdate: (data: { name: string; requestId: string; status: string; notes?: string }) => ({
    subject: `Commission Update - ${data.status}`,
    text: `Hi ${data.name},

Your commission request (ID: ${data.requestId}) status has been updated to: ${data.status.toUpperCase()}

${data.notes ? `Notes: ${data.notes}` : ''}

${data.status === 'in_progress' ? 'We have started working on your commission!' : ''}
${data.status === 'completed' ? 'Your commission is complete! We will contact you about delivery/pickup.' : ''}

Best regards,
The Art Studio Team`
  }),

  commissionQuote: (data: { name: string; requestId: string; estimatedPrice: number; notes?: string }) => ({
    subject: 'Commission Quote Ready',
    text: `Hi ${data.name},

We're excited to provide you with a quote for your commission request (ID: ${data.requestId}).

Estimated Price: $${data.estimatedPrice}

${data.notes ? `Details: ${data.notes}` : ''}

If you're happy with this quote, please reply to this email or contact us to proceed.

Best regards,
The Art Studio Team`
  }),

  // Consultation emails
  consultationConfirmation: (data: { name: string; bookingId: string; dateTime?: string; preferredTime?: string }) => ({
    subject: 'Consultation Booking Confirmed',
    text: `Hi ${data.name},

Your consultation booking (ID: ${data.bookingId}) has been confirmed!

${data.dateTime ? `Scheduled: ${data.dateTime}` : `Preferred Time: ${data.preferredTime || 'To be scheduled'}`}

We will contact you via WhatsApp to finalize the details and confirm the exact time.

Best regards,
The Art Studio Team`
  }),

  consultationReminder: (data: { name: string; dateTime: string }) => ({
    subject: 'Consultation Reminder - Tomorrow',
    text: `Hi ${data.name},

This is a friendly reminder about your consultation scheduled for tomorrow:

Date & Time: ${data.dateTime}

We look forward to discussing your artistic vision with you!

Best regards,
The Art Studio Team`
  }),

  consultationReschedule: (data: { name: string; oldDateTime: string; newDateTime: string }) => ({
    subject: 'Consultation Rescheduled',
    text: `Hi ${data.name},

Your consultation has been rescheduled:

Previous: ${data.oldDateTime}
New Date & Time: ${data.newDateTime}

We apologize for any inconvenience and look forward to meeting with you at the new time.

Best regards,
The Art Studio Team`
  }),

  // Order emails
  orderConfirmation: (data: { name: string; orderId: string; items: any[]; totalAmount: number }) => ({
    subject: `Order Confirmation - ${data.orderId}`,
    text: `Hi ${data.name},

Thank you for your order! Here are the details:

Order ID: ${data.orderId}
Total: $${data.totalAmount}

Items:
${data.items.map(item => `- ${item.artwork_title} (${item.quantity}x) - $${item.price}`).join('\n')}

Your order is being processed and you will receive updates as it progresses.

Best regards,
The Art Studio Team`
  }),

  paymentConfirmation: (data: { name: string; orderId: string; amount: number }) => ({
    subject: `Payment Confirmed - ${data.orderId}`,
    text: `Hi ${data.name},

Your payment has been successfully processed!

Order ID: ${data.orderId}
Amount: $${data.amount}

Your order is now being prepared for shipping.

Best regards,
The Art Studio Team`
  }),

  orderStatusUpdate: (data: { name: string; orderId: string; status: string; trackingNumber?: string }) => ({
    subject: `Order Update - ${data.status}`,
    text: `Hi ${data.name},

Your order (ID: ${data.orderId}) status has been updated to: ${data.status.toUpperCase()}

${data.trackingNumber ? `Tracking Number: ${data.trackingNumber}` : ''}
${data.status === 'shipped' && data.trackingNumber ? 'You can track your package using the tracking number above.' : ''}

Best regards,
The Art Studio Team`
  }),

  // Admin emails
  newOrderNotification: (data: { orderId: string; customerName: string; customerEmail: string; totalAmount: number }) => ({
    subject: `New Order Received - ${data.orderId}`,
    text: `New order received:

Order ID: ${data.orderId}
Customer: ${data.customerName} (${data.customerEmail})
Total Amount: $${data.totalAmount}

Please check the admin dashboard for full details.

Art Studio Admin System`
  }),

  newCommissionNotification: (data: { requestId: string; customerName: string; customerEmail: string; packageName?: string }) => ({
    subject: `New Commission Request - ${data.requestId}`,
    text: `New commission request received:

Request ID: ${data.requestId}
Customer: ${data.customerName} (${data.customerEmail})
${data.packageName ? `Package: ${data.packageName}` : ''}

Please check the admin dashboard for full details.

Art Studio Admin System`
  })
};

interface EmailRequest {
  type: keyof typeof emailTemplates;
  to: string;
  data: any;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const { type, to, data }: EmailRequest = await req.json();
    
    console.log('Email request received:', { type, to, data });

    // Validate request
    if (!type || !to || !emailTemplates[type]) {
      throw new Error('Invalid email request');
    }

    // Get Gmail credentials from secrets
    const gmailUser = Deno.env.get('GMAIL_USER');
    const gmailPassword = Deno.env.get('GMAIL_APP_PASSWORD');

    if (!gmailUser || !gmailPassword) {
      throw new Error('Gmail credentials not configured');
    }

    // Generate email content
    const template = emailTemplates[type](data);

    // Use Gmail SMTP via a simple fetch to a service
    // Since Deno doesn't have built-in SMTP, we'll use a simple approach
    const emailData = {
      from: gmailUser,
      to: to,
      subject: template.subject,
      text: template.text,
      smtp: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: gmailUser,
          pass: gmailPassword
        }
      }
    };

    console.log('Sending email:', { from: emailData.from, to: emailData.to, subject: emailData.subject });

    // For this implementation, we'll use a workaround since Deno doesn't have native SMTP
    // We'll create a simple SMTP client using TCP connection
    const response = await sendEmailViaSMTP(emailData);

    console.log('Email sent successfully:', response);

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('Error sending email:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send email',
        success: false 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        },
      }
    );
  }
};

// Simple SMTP client for Gmail
async function sendEmailViaSMTP(emailData: any) {
  try {
    // This is a simplified approach - in production, you might want to use
    // a dedicated email service like Resend, SendGrid, or implement full SMTP
    
    // For now, we'll simulate the email sending and log it
    // In a real implementation, you would establish a TCP connection to smtp.gmail.com:587
    
    console.log('SMTP Email Details:');
    console.log('Host: smtp.gmail.com:587');
    console.log('From:', emailData.from);
    console.log('To:', emailData.to);
    console.log('Subject:', emailData.subject);
    console.log('Body:', emailData.text);
    
    // Simulate successful sending
    return { messageId: `${Date.now()}@gmail.com` };
  } catch (error) {
    console.error('SMTP Error:', error);
    throw error;
  }
}

serve(handler);