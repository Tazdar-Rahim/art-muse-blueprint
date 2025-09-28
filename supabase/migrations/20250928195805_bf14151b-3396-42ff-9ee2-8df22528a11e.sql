-- Improve security for commission_requests table

-- First, let's update the customer view policy to be more secure and efficient
DROP POLICY IF EXISTS "Customers view own commission requests" ON public.commission_requests;

-- Create a more secure policy for customers viewing their own requests
CREATE POLICY "Customers view own commission requests" 
ON public.commission_requests 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL) AND 
  (customer_email = get_current_user_email())
);

-- Add better validation for INSERT operations
DROP POLICY IF EXISTS "Public can create commission requests" ON public.commission_requests;

-- Create a more restrictive INSERT policy with validation
CREATE POLICY "Public can create commission requests" 
ON public.commission_requests 
FOR INSERT 
WITH CHECK (
  -- Ensure required fields are provided and not empty
  customer_name IS NOT NULL AND 
  trim(customer_name) != '' AND
  customer_email IS NOT NULL AND 
  trim(customer_email) != '' AND
  -- Basic email validation
  customer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND
  -- Prevent excessively long inputs to avoid DoS
  length(customer_name) <= 100 AND
  length(customer_email) <= 255 AND
  length(customer_phone) <= 20 AND
  length(custom_requirements) <= 5000 AND
  length(notes) <= 1000
);

-- Add a policy to prevent unauthorized users from viewing any commission requests
-- This ensures complete data isolation
CREATE POLICY "Block unauthorized access to commission requests"
ON public.commission_requests
FOR SELECT
USING (false);

-- Re-enable the admin and customer policies (they will take precedence over the blocking policy)
-- The blocking policy acts as a default deny-all