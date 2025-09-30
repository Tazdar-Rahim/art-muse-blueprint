import { supabase } from '@/integrations/supabase/client';

export interface SendEmailRequest {
  emailType: string;
  to: string;
  data: any;
}

export const emailService = {
  async sendEmail(request: SendEmailRequest) {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: request
    });

    if (error) {
      console.error('Failed to send email:', error);
      throw error;
    }

    return data;
  },

  // Order emails
  async sendOrderStatusUpdate(params: {
    customerEmail: string;
    firstName: string;
    orderId: string;
    status: string;
    trackingNumber?: string;
    trackingUrl?: string;
  }) {
    return this.sendEmail({
      emailType: 'order_status_update',
      to: params.customerEmail,
      data: params
    });
  },

  // Commission emails
  async sendCommissionStatusUpdate(params: {
    email: string;
    name: string;
    status: string;
    message?: string;
  }) {
    return this.sendEmail({
      emailType: 'commission_status_update',
      to: params.email,
      data: params
    });
  },

  async sendCommissionQuote(params: {
    email: string;
    name: string;
    estimatedPrice: number;
    estimatedDays: number;
    message: string;
  }) {
    return this.sendEmail({
      emailType: 'commission_quote',
      to: params.email,
      data: params
    });
  },

  // Consultation emails
  async sendConsultationReschedule(params: {
    email: string;
    name: string;
    oldDate: string;
    newDate: string;
    newTime: string;
  }) {
    return this.sendEmail({
      emailType: 'consultation_reschedule',
      to: params.email,
      data: params
    });
  }
};
