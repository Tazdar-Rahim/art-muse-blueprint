-- Fix remaining overly permissive policies for commission requests and consultation bookings

-- Drop overly permissive policies for commission_requests
DROP POLICY IF EXISTS "Authenticated users can delete commission requests" ON public.commission_requests;
DROP POLICY IF EXISTS "Authenticated users can update commission requests" ON public.commission_requests;

-- Create secure admin-only policies for commission_requests
CREATE POLICY "Admins can delete commission requests" 
ON public.commission_requests 
FOR DELETE 
USING (public.is_admin());

CREATE POLICY "Admins can update commission requests" 
ON public.commission_requests 
FOR UPDATE 
USING (public.is_admin());

-- Drop overly permissive policies for consultation_bookings
DROP POLICY IF EXISTS "Authenticated users can delete consultation bookings" ON public.consultation_bookings;
DROP POLICY IF EXISTS "Authenticated users can update consultation bookings" ON public.consultation_bookings;

-- Create secure admin-only policies for consultation_bookings
CREATE POLICY "Admins can delete consultation bookings" 
ON public.consultation_bookings 
FOR DELETE 
USING (public.is_admin());

CREATE POLICY "Admins can update consultation bookings" 
ON public.consultation_bookings 
FOR UPDATE 
USING (public.is_admin());