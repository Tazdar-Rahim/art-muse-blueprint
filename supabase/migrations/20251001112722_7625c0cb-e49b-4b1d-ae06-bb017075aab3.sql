-- Create triggers to automatically send email notifications

-- Trigger for new user welcome emails
CREATE TRIGGER trigger_new_user_email
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_email();

-- Trigger for new order emails (customer confirmation + admin notification)
CREATE TRIGGER trigger_new_order_emails
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_order_emails();

-- Trigger for new commission request emails (customer confirmation + admin notification)
CREATE TRIGGER trigger_new_commission_emails
  AFTER INSERT ON public.commission_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_commission_emails();

-- Trigger for new consultation booking emails
CREATE TRIGGER trigger_new_consultation_emails
  AFTER INSERT ON public.consultation_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_consultation_emails();