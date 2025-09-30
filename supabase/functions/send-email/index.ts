import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Email configuration using Gmail
const GMAIL_USER = Deno.env.get('GMAIL_USER');
const GMAIL_APP_PASSWORD = Deno.env.get('GMAIL_APP_PASSWORD');
const FROM_NAME = "Farhana's Art Studio";
const FROM_EMAIL = GMAIL_USER;

interface EmailRequest {
  emailType: string;
  to: string;
  data: any;
}

// Simple rate limiting (in-memory, resets on function restart)
const emailsSent = new Map<string, number>();
const RATE_LIMIT = 10; // Max emails per recipient per hour

function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const key = `${email}-${Math.floor(now / 3600000)}`; // Hour-based key
  const count = emailsSent.get(key) || 0;
  
  if (count >= RATE_LIMIT) {
    return false;
  }
  
  emailsSent.set(key, count + 1);
  return true;
}

// Email template functions
function getWelcomeEmailTemplate(data: { firstName: string; email: string }): { subject: string; html: string } {
  return {
    subject: "Welcome to Farhana's Art Studio! ✨",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
          Welcome to Farhana's Art Studio!
        </h1>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Dear ${data.firstName},
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Thank you for joining our artistic community! We're thrilled to have you with us.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          You can now explore our artwork gallery, request custom commissions, and book consultations with Farhana.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          If you have any questions, feel free to reach out to us anytime.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Best regards,<br>
          <strong>Farhana's Art Studio</strong>
        </p>
      </div>
    `
  };
}

function getEmailVerificationTemplate(data: { firstName: string; verificationLink: string }): { subject: string; html: string } {
  return {
    subject: "Verify Your Email Address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
          Verify Your Email
        </h1>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Dear ${data.firstName},
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Please verify your email address by clicking the link below:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.verificationLink}" 
             style="background-color: #4F46E5; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #777;">
          If you didn't create an account, you can safely ignore this email.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Best regards,<br>
          <strong>Farhana's Art Studio</strong>
        </p>
      </div>
    `
  };
}

function getPasswordResetTemplate(data: { firstName: string; resetLink: string }): { subject: string; html: string } {
  return {
    subject: "Reset Your Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
          Password Reset Request
        </h1>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Dear ${data.firstName},
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          We received a request to reset your password. Click the button below to create a new password:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetLink}" 
             style="background-color: #4F46E5; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #777;">
          This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Best regards,<br>
          <strong>Farhana's Art Studio</strong>
        </p>
      </div>
    `
  };
}

function getOrderConfirmationTemplate(data: { 
  firstName: string; 
  orderId: string; 
  totalAmount: number; 
  items: any[] 
}): { subject: string; html: string } {
  const itemsList = data.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.title}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price}</td>
    </tr>
  `).join('');

  return {
    subject: `Order Confirmation - #${data.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
          Order Confirmed! 🎨
        </h1>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Dear ${data.firstName},
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Thank you for your order! We've received your payment and are preparing your artwork.
        </p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Order ID:</strong> #${data.orderId}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
          <tfoot>
            <tr>
              <td style="padding: 15px 10px; font-weight: bold; border-top: 2px solid #333;">Total</td>
              <td style="padding: 15px 10px; font-weight: bold; text-align: right; border-top: 2px solid #333;">
                $${data.totalAmount.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          We'll send you another email when your order ships.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Best regards,<br>
          <strong>Farhana's Art Studio</strong>
        </p>
      </div>
    `
  };
}

function getOrderStatusUpdateTemplate(data: { 
  firstName: string; 
  orderId: string; 
  status: string;
  trackingNumber?: string;
  trackingUrl?: string;
}): { subject: string; html: string } {
  const statusMessages = {
    processing: "Your order is being processed",
    shipped: "Your order has been shipped",
    delivered: "Your order has been delivered"
  };

  const trackingSection = data.trackingNumber ? `
    <div style="background-color: #f0f9ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
      ${data.trackingUrl ? `
        <div style="text-align: center; margin-top: 15px;">
          <a href="${data.trackingUrl}" 
             style="background-color: #4F46E5; color: white; padding: 10px 25px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Track Your Order
          </a>
        </div>
      ` : ''}
    </div>
  ` : '';

  return {
    subject: `Order Update - #${data.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
          Order Status Update
        </h1>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Dear ${data.firstName},
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          ${statusMessages[data.status] || `Your order status has been updated to: ${data.status}`}
        </p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Order ID:</strong> #${data.orderId}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> ${data.status.toUpperCase()}</p>
        </div>
        ${trackingSection}
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Thank you for your purchase!
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Best regards,<br>
          <strong>Farhana's Art Studio</strong>
        </p>
      </div>
    `
  };
}

function getCommissionRequestConfirmationTemplate(data: { 
  name: string; 
  packageName: string;
  description: string;
}): { subject: string; html: string } {
  return {
    subject: "Commission Request Received",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
          Commission Request Received! 🎨
        </h1>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Dear ${data.name},
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Thank you for your commission request! We've received your details and will review them shortly.
        </p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Package:</strong> ${data.packageName}</p>
          <p style="margin: 5px 0;"><strong>Your Requirements:</strong></p>
          <p style="margin: 5px 0; color: #666;">${data.description}</p>
        </div>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Farhana will review your request and get back to you within 24-48 hours with a quote and timeline.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Best regards,<br>
          <strong>Farhana's Art Studio</strong>
        </p>
      </div>
    `
  };
}

function getCommissionStatusUpdateTemplate(data: { 
  name: string; 
  status: string;
  message?: string;
}): { subject: string; html: string } {
  const statusMessages = {
    pending: "Your commission request is being reviewed",
    in_progress: "Your commission work has started",
    completed: "Your commission has been completed",
    cancelled: "Your commission request has been cancelled"
  };

  return {
    subject: `Commission Status Update - ${status.toUpperCase()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
          Commission Update
        </h1>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Dear ${data.name},
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          ${statusMessages[data.status] || `Your commission status has been updated to: ${data.status}`}
        </p>
        ${data.message ? `
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Message from Farhana:</strong></p>
            <p style="margin: 10px 0; color: #666;">${data.message}</p>
          </div>
        ` : ''}
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Best regards,<br>
          <strong>Farhana's Art Studio</strong>
        </p>
      </div>
    `
  };
}

function getCommissionQuoteTemplate(data: { 
  name: string; 
  estimatedPrice: number;
  estimatedDays: number;
  message: string;
}): { subject: string; html: string } {
  return {
    subject: "Your Commission Quote",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
          Your Commission Quote
        </h1>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Dear ${data.name},
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Thank you for your patience! Here's your custom commission quote:
        </p>
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 10px 0; font-size: 18px;"><strong>Estimated Price:</strong> $${data.estimatedPrice.toFixed(2)}</p>
          <p style="margin: 10px 0; font-size: 18px;"><strong>Estimated Timeline:</strong> ${data.estimatedDays} days</p>
        </div>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Details:</strong></p>
          <p style="margin: 10px 0; color: #666;">${data.message}</p>
        </div>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          If you'd like to proceed, please reply to this email or contact us directly.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Best regards,<br>
          <strong>Farhana's Art Studio</strong>
        </p>
      </div>
    `
  };
}

function getConsultationBookingTemplate(data: { 
  name: string; 
  date: string;
  time: string;
  whatsapp: string;
}): { subject: string; html: string } {
  return {
    subject: "Consultation Booking Confirmed",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
          Consultation Confirmed! 📅
        </h1>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Dear ${data.name},
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Your consultation with Farhana has been confirmed!
        </p>
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 10px 0;"><strong>Date:</strong> ${data.date}</p>
          <p style="margin: 10px 0;"><strong>Time:</strong> ${data.time}</p>
          <p style="margin: 10px 0;"><strong>WhatsApp:</strong> ${data.whatsapp}</p>
        </div>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Farhana will reach out to you on WhatsApp at the scheduled time. Please ensure your phone is available.
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #777;">
          You'll receive a reminder 2 hours before your consultation.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Best regards,<br>
          <strong>Farhana's Art Studio</strong>
        </p>
      </div>
    `
  };
}

function getConsultationReminderTemplate(data: { 
  name: string; 
  time: string;
  whatsapp: string;
}): { subject: string; html: string } {
  return {
    subject: "Consultation Reminder - Starting in 2 Hours",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
          Consultation Reminder ⏰
        </h1>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Dear ${data.name},
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          This is a friendly reminder that your consultation with Farhana is starting in 2 hours!
        </p>
        <div style="background-color: #fff3cd; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 10px 0;"><strong>Time:</strong> ${data.time}</p>
          <p style="margin: 10px 0;"><strong>WhatsApp:</strong> ${data.whatsapp}</p>
        </div>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Please ensure your phone is available. Farhana will reach out to you on WhatsApp.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Best regards,<br>
          <strong>Farhana's Art Studio</strong>
        </p>
      </div>
    `
  };
}

function getConsultationRescheduleTemplate(data: { 
  name: string; 
  oldDate: string;
  newDate: string;
  newTime: string;
}): { subject: string; html: string } {
  return {
    subject: "Consultation Rescheduled",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
          Consultation Rescheduled
        </h1>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Dear ${data.name},
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Your consultation has been rescheduled to a new date and time:
        </p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0; text-decoration: line-through; color: #999;">
            <strong>Previous:</strong> ${data.oldDate}
          </p>
        </div>
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 10px 0;"><strong>New Date:</strong> ${data.newDate}</p>
          <p style="margin: 10px 0;"><strong>New Time:</strong> ${data.newTime}</p>
        </div>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          If this time doesn't work for you, please contact us to reschedule.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Best regards,<br>
          <strong>Farhana's Art Studio</strong>
        </p>
      </div>
    `
  };
}

function getAdminNewOrderTemplate(data: { 
  orderId: string; 
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  items: any[];
}): { subject: string; html: string } {
  const itemsList = data.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.title}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price}</td>
    </tr>
  `).join('');

  return {
    subject: `New Order Received - #${data.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
          New Order Alert! 🛒
        </h1>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          You have received a new order.
        </p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Order ID:</strong> #${data.orderId}</p>
          <p style="margin: 5px 0;"><strong>Customer:</strong> ${data.customerName}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${data.customerEmail}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
          <tfoot>
            <tr>
              <td style="padding: 15px 10px; font-weight: bold; border-top: 2px solid #333;">Total</td>
              <td style="padding: 15px 10px; font-weight: bold; text-align: right; border-top: 2px solid #333;">
                $${data.totalAmount.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Please process this order in your admin panel.
        </p>
      </div>
    `
  };
}

function getAdminNewCommissionTemplate(data: { 
  name: string; 
  email: string;
  phone: string;
  packageName: string;
  description: string;
}): { subject: string; html: string } {
  return {
    subject: `New Commission Request from ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
          New Commission Request! 🎨
        </h1>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          You have received a new commission request.
        </p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Name:</strong> ${data.name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${data.email}</p>
          <p style="margin: 5px 0;"><strong>Phone:</strong> ${data.phone}</p>
          <p style="margin: 5px 0;"><strong>Package:</strong> ${data.packageName}</p>
        </div>
        <div style="background-color: #f0f9ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Customer Requirements:</strong></p>
          <p style="margin: 10px 0; color: #666;">${data.description}</p>
        </div>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Please review and respond to this request in your admin panel.
        </p>
      </div>
    `
  };
}

// Send email using Gmail SMTP
async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  console.log(`Attempting to send email to: ${to}`);
  
  const boundary = "----=_Part_0_" + Date.now();
  
  const emailContent = [
    `From: ${FROM_NAME} <${FROM_EMAIL}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=utf-8`,
    ``,
    html
  ].join('\r\n');

  const base64Email = btoa(unescape(encodeURIComponent(emailContent)));

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${await getGmailAccessToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: base64Email.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Gmail API error:', error);
    throw new Error(`Failed to send email: ${error}`);
  }

  console.log(`Email sent successfully to: ${to}`);
}

// Get Gmail OAuth access token using app password
async function getGmailAccessToken(): Promise<string> {
  // For Gmail SMTP with app password, we'll use a direct SMTP approach instead
  // This is a simplified version - in production, consider using a proper email service
  throw new Error("Gmail OAuth not implemented. Please use SMTP directly or switch to Resend.");
}

// Alternative: Direct SMTP sending function (simpler for Gmail app passwords)
async function sendEmailSMTP(to: string, subject: string, html: string): Promise<void> {
  console.log(`Sending email via SMTP to: ${to}`);
  
  // Create email message
  const message = [
    `From: ${FROM_NAME} <${FROM_EMAIL}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=utf-8`,
    ``,
    html
  ].join('\r\n');

  // Use a simple SMTP library for Deno
  // Note: You'll need to install this or use fetch with an SMTP service
  const smtpResponse = await fetch('https://api.smtp2go.com/v3/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: GMAIL_APP_PASSWORD,
      to: [to],
      sender: FROM_EMAIL,
      subject: subject,
      html_body: html,
    })
  });

  if (!smtpResponse.ok) {
    throw new Error(`SMTP send failed: ${await smtpResponse.text()}`);
  }

  console.log(`Email sent successfully to: ${to}`);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { emailType, to, data }: EmailRequest = await req.json();

    console.log(`Processing email request: ${emailType} to ${to}`);

    // Validate inputs
    if (!emailType || !to || !data) {
      throw new Error('Missing required fields: emailType, to, or data');
    }

    // Check rate limit
    if (!checkRateLimit(to)) {
      console.error(`Rate limit exceeded for: ${to}`);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get email template based on type
    let emailContent: { subject: string; html: string };

    switch (emailType) {
      case 'welcome':
        emailContent = getWelcomeEmailTemplate(data);
        break;
      case 'email_verification':
        emailContent = getEmailVerificationTemplate(data);
        break;
      case 'password_reset':
        emailContent = getPasswordResetTemplate(data);
        break;
      case 'order_confirmation':
        emailContent = getOrderConfirmationTemplate(data);
        break;
      case 'order_status_update':
        emailContent = getOrderStatusUpdateTemplate(data);
        break;
      case 'commission_request_confirmation':
        emailContent = getCommissionRequestConfirmationTemplate(data);
        break;
      case 'commission_status_update':
        emailContent = getCommissionStatusUpdateTemplate(data);
        break;
      case 'commission_quote':
        emailContent = getCommissionQuoteTemplate(data);
        break;
      case 'consultation_booking':
        emailContent = getConsultationBookingTemplate(data);
        break;
      case 'consultation_reminder':
        emailContent = getConsultationReminderTemplate(data);
        break;
      case 'consultation_reschedule':
        emailContent = getConsultationRescheduleTemplate(data);
        break;
      case 'admin_new_order':
        emailContent = getAdminNewOrderTemplate(data);
        break;
      case 'admin_new_commission':
        emailContent = getAdminNewCommissionTemplate(data);
        break;
      default:
        throw new Error(`Unknown email type: ${emailType}`);
    }

    // Send email using SMTP (simplified approach for Gmail with app password)
    // Note: For production, consider using Resend or SendGrid for better deliverability
    await sendEmailSMTP(to, emailContent.subject, emailContent.html);

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
