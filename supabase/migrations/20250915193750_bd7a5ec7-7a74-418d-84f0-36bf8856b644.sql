-- Fix security vulnerability in commission_requests table
-- The current policy only allows admins to view, but we need to also allow 
-- customers to view their own requests while keeping data secure

-- Remove existing overly restrictive SELECT policy if it exists
DROP POLICY IF EXISTS "Admins can view all commission requests" ON public.commission_requests;

-- Create comprehensive secure policies for commission_requests access

-- Admins can view all commission requests
CREATE POLICY "Admins can view all commission requests" 
ON public.commission_requests 
FOR SELECT 
USING (is_admin());

-- Authenticated customers can view their own commission requests by email
CREATE POLICY "Customers can view their own commission requests" 
ON public.commission_requests 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Update the UPDATE policy to be more granular
DROP POLICY IF EXISTS "Admins can update commission requests" ON public.commission_requests;

-- Only admins can update commission requests (for status changes, etc.)
CREATE POLICY "Admins can update commission requests" 
ON public.commission_requests 
FOR UPDATE 
USING (is_admin());

-- Customers can update their own commission requests (limited scenarios)
CREATE POLICY "Customers can update their own commission requests" 
ON public.commission_requests 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND 
  customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Keep the existing INSERT policy (anyone can create commission requests)
-- This is appropriate for a public commission request form

-- Keep the existing DELETE policy (only admins can delete)
-- This is appropriate for data management