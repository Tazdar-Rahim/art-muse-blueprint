-- Fix security vulnerability in commission_requests table by recreating all policies
-- Drop all existing policies first to avoid conflicts

DROP POLICY IF EXISTS "Admins can view all commission requests" ON public.commission_requests;
DROP POLICY IF EXISTS "Customers can view their own commission requests" ON public.commission_requests;
DROP POLICY IF EXISTS "Anyone can create commission requests" ON public.commission_requests;
DROP POLICY IF EXISTS "Admins can delete commission requests" ON public.commission_requests;
DROP POLICY IF EXISTS "Admins can update commission requests" ON public.commission_requests;
DROP POLICY IF EXISTS "Customers can update their own commission requests" ON public.commission_requests;

-- Now create secure policies for commission_requests access

-- 1. INSERT: Anyone can create commission requests (public form submissions)
CREATE POLICY "Public can create commission requests" 
ON public.commission_requests 
FOR INSERT 
WITH CHECK (true);

-- 2. SELECT: Only admins and customers can view commission requests
-- Admins can view all commission requests
CREATE POLICY "Admins view all commission requests" 
ON public.commission_requests 
FOR SELECT 
USING (is_admin());

-- Authenticated customers can view their own commission requests by matching email
CREATE POLICY "Customers view own commission requests" 
ON public.commission_requests 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- 3. UPDATE: Only admins can update commission requests (for status management)
CREATE POLICY "Admins update commission requests" 
ON public.commission_requests 
FOR UPDATE 
USING (is_admin());

-- 4. DELETE: Only admins can delete commission requests
CREATE POLICY "Admins delete commission requests" 
ON public.commission_requests 
FOR DELETE 
USING (is_admin());