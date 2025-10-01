-- Enable pg_net extension for HTTP requests from database functions
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Drop any duplicate/old triggers if they exist
DROP TRIGGER IF EXISTS on_order_created_send_emails ON public.orders;
DROP TRIGGER IF EXISTS on_commission_request_created_send_emails ON public.commission_requests;
DROP TRIGGER IF EXISTS on_consultation_booking_created_send_emails ON public.consultation_bookings;
DROP TRIGGER IF EXISTS on_new_user_send_welcome_email ON public.profiles;

-- Ensure our current triggers are in place (idempotent)
DROP TRIGGER IF EXISTS trigger_new_user_email ON public.profiles;
CREATE TRIGGER trigger_new_user_email
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_email();

DROP TRIGGER IF EXISTS trigger_new_order_emails ON public.orders;
CREATE TRIGGER trigger_new_order_emails
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_order_emails();

DROP TRIGGER IF EXISTS trigger_new_commission_emails ON public.commission_requests;
CREATE TRIGGER trigger_new_commission_emails
  AFTER INSERT ON public.commission_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_commission_emails();

DROP TRIGGER IF EXISTS trigger_new_consultation_emails ON public.consultation_bookings;
CREATE TRIGGER trigger_new_consultation_emails
  AFTER INSERT ON public.consultation_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_consultation_emails();