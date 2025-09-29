-- Add a blocking policy to prevent unauthorized access to consultation bookings
-- This ensures that only admins can view consultation booking data
CREATE POLICY "Block unauthorized access to consultation bookings" 
ON public.consultation_bookings 
FOR SELECT 
USING (false);

-- Reorder policies by recreating the admin policy to ensure it takes precedence
DROP POLICY IF EXISTS "Admins can view all consultation bookings" ON public.consultation_bookings;

CREATE POLICY "Admins can view all consultation bookings" 
ON public.consultation_bookings 
FOR SELECT 
USING (is_admin());

-- Add input validation constraints to the consultation_bookings table
-- Ensure customer data meets security standards
CREATE POLICY "Validate consultation booking data on insert" 
ON public.consultation_bookings 
FOR INSERT 
WITH CHECK (
  -- Customer name validation
  customer_name IS NOT NULL 
  AND TRIM(customer_name) <> '' 
  AND LENGTH(customer_name) <= 100
  
  -- Email validation
  AND customer_email IS NOT NULL 
  AND TRIM(customer_email) <> ''
  AND customer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND LENGTH(customer_email) <= 255
  
  -- WhatsApp number validation
  AND whatsapp_number IS NOT NULL 
  AND TRIM(whatsapp_number) <> ''
  AND LENGTH(whatsapp_number) <= 20
  
  -- Optional field length limits
  AND (preferred_time IS NULL OR LENGTH(preferred_time) <= 200)
  AND (project_description IS NULL OR LENGTH(project_description) <= 1000)
  AND (notes IS NULL OR LENGTH(notes) <= 1000)
);

-- Drop the old generic insert policy
DROP POLICY IF EXISTS "Anyone can create consultation bookings" ON public.consultation_bookings;