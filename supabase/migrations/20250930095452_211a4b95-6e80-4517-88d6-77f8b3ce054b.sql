-- Function to send emails via Edge Function
CREATE OR REPLACE FUNCTION public.send_email_notification(
  p_email_type text,
  p_to text,
  p_data jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_request_id bigint;
BEGIN
  -- Call the send-email edge function using pg_net
  SELECT net.http_post(
    url := 'https://mnsdoctypclwfflpzwfz.supabase.co/functions/v1/send-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uc2RvY3R5cGNsd2ZmbHB6d2Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2ODc3MDYsImV4cCI6MjA3MzI2MzcwNn0._QXKK5Y8xm9nGhsEOg___8v18tnfxk5WrFOGvQ4q37w'
    ),
    body := jsonb_build_object(
      'emailType', p_email_type,
      'to', p_to,
      'data', p_data
    )
  ) INTO v_request_id;
  
  -- Log for debugging
  RAISE LOG 'Email notification sent: type=%, to=%, request_id=%', p_email_type, p_to, v_request_id;
  
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the transaction
  RAISE WARNING 'Failed to send email notification: %', SQLERRM;
END;
$$;

-- Trigger function for new user registration (welcome email)
CREATE OR REPLACE FUNCTION public.handle_new_user_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text;
  v_first_name text;
BEGIN
  -- Get user email from auth.users
  SELECT email INTO v_email FROM auth.users WHERE id = NEW.id;
  
  -- Send welcome email
  PERFORM public.send_email_notification(
    'welcome',
    v_email,
    jsonb_build_object(
      'firstName', COALESCE(NEW.first_name, 'Valued Customer'),
      'email', v_email
    )
  );
  
  RETURN NEW;
END;
$$;

-- Trigger for welcome emails on new profile creation
DROP TRIGGER IF EXISTS on_profile_created_send_welcome ON public.profiles;
CREATE TRIGGER on_profile_created_send_welcome
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_email();

-- Trigger function for new orders (customer confirmation + admin notification)
CREATE OR REPLACE FUNCTION public.handle_new_order_emails()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_customer_email text;
  v_customer_name text;
  v_order_items jsonb;
BEGIN
  -- Get customer details
  SELECT 
    au.email,
    CONCAT(p.first_name, ' ', p.last_name)
  INTO v_customer_email, v_customer_name
  FROM auth.users au
  LEFT JOIN public.profiles p ON p.id = au.id
  WHERE au.id = NEW.user_id;
  
  -- Get order items (you'll need to query order_items table if you have one)
  -- For now, using a placeholder
  v_order_items := jsonb_build_array(
    jsonb_build_object(
      'title', 'Order Item',
      'price', NEW.total_amount
    )
  );
  
  -- Send order confirmation to customer
  PERFORM public.send_email_notification(
    'order_confirmation',
    v_customer_email,
    jsonb_build_object(
      'firstName', COALESCE(SPLIT_PART(v_customer_name, ' ', 1), 'Valued Customer'),
      'orderId', NEW.id::text,
      'totalAmount', NEW.total_amount,
      'items', v_order_items
    )
  );
  
  -- Send admin notification
  PERFORM public.send_email_notification(
    'admin_new_order',
    'farhanashaheenart@gmail.com',
    jsonb_build_object(
      'orderId', NEW.id::text,
      'customerName', COALESCE(v_customer_name, 'Unknown Customer'),
      'customerEmail', v_customer_email,
      'totalAmount', NEW.total_amount,
      'items', v_order_items
    )
  );
  
  RETURN NEW;
END;
$$;

-- Trigger for new orders
DROP TRIGGER IF EXISTS on_order_created_send_emails ON public.orders;
CREATE TRIGGER on_order_created_send_emails
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_order_emails();

-- Trigger function for commission requests
CREATE OR REPLACE FUNCTION public.handle_new_commission_emails()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_package_name text;
BEGIN
  -- Get package name
  SELECT title INTO v_package_name
  FROM public.commission_packages
  WHERE id = NEW.package_id;
  
  -- Send confirmation to customer
  PERFORM public.send_email_notification(
    'commission_request_confirmation',
    NEW.email,
    jsonb_build_object(
      'name', NEW.name,
      'packageName', COALESCE(v_package_name, 'Custom Commission'),
      'description', NEW.custom_requirements
    )
  );
  
  -- Send admin notification
  PERFORM public.send_email_notification(
    'admin_new_commission',
    'farhanashaheenart@gmail.com',
    jsonb_build_object(
      'name', NEW.name,
      'email', NEW.email,
      'phone', NEW.phone,
      'packageName', COALESCE(v_package_name, 'Custom Commission'),
      'description', NEW.custom_requirements
    )
  );
  
  RETURN NEW;
END;
$$;

-- Trigger for new commission requests
DROP TRIGGER IF EXISTS on_commission_request_created_send_emails ON public.commission_requests;
CREATE TRIGGER on_commission_request_created_send_emails
  AFTER INSERT ON public.commission_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_commission_emails();

-- Trigger function for consultation bookings
CREATE OR REPLACE FUNCTION public.handle_new_consultation_emails()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Send booking confirmation to customer
  PERFORM public.send_email_notification(
    'consultation_booking',
    NEW.email,
    jsonb_build_object(
      'name', NEW.name,
      'date', TO_CHAR(NEW.preferred_date, 'Day, Month DD, YYYY'),
      'time', NEW.preferred_time,
      'whatsapp', NEW.whatsapp_number
    )
  );
  
  RETURN NEW;
END;
$$;

-- Trigger for new consultation bookings
DROP TRIGGER IF EXISTS on_consultation_booking_created_send_email ON public.consultation_bookings;
CREATE TRIGGER on_consultation_booking_created_send_email
  AFTER INSERT ON public.consultation_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_consultation_emails();

-- Add columns to tables for tracking email-related data
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_number text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_url text;

ALTER TABLE public.commission_requests ADD COLUMN IF NOT EXISTS estimated_price decimal;
ALTER TABLE public.commission_requests ADD COLUMN IF NOT EXISTS estimated_days integer;
ALTER TABLE public.commission_requests ADD COLUMN IF NOT EXISTS admin_message text;

ALTER TABLE public.consultation_bookings ADD COLUMN IF NOT EXISTS reminder_sent boolean DEFAULT false;
